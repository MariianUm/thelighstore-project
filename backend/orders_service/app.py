from flask import Flask, jsonify, request
from flask_migrate import Migrate
from flask_cors import CORS
from .models import db, Order, OrderItem
from .config import Config
import requests
import logging
import re
from sqlalchemy.exc import SQLAlchemyError

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={r"/orders*": {"origins": "*", "methods": ["GET", "POST", "PATCH"]}})

db.init_app(app)
migrate = Migrate(app, db)

logging.basicConfig(level=logging.DEBUG)

@app.before_request
def log_request():
    app.logger.debug(f"Request: {request.method} {request.url}")
    app.logger.debug(f"Headers: {request.headers}")
    app.logger.debug(f"Body: {request.get_data()}")

@app.after_request
def log_response(response):
    app.logger.debug(f"Response: {response.status} {response.data}")
    return response

@app.route('/')
def home():
    return jsonify({"message": "Orders Service API"})

@app.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json()

    required_fields = ['customer_name', 'phone', 'address', 'items']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Missing required field: {field}"}), 400

    items = data['items']
    if not items:
        return jsonify({"error": "Order must contain at least one item"}), 400

    order_items = []
    total = 0.0

    for item in items:
        product_id = item.get('product_id')
        quantity = item.get('quantity')

        if not product_id or not quantity or quantity <= 0:
            return jsonify({"error": "Invalid item data"}), 400

        try:
            product_service_url = app.config.get("PRODUCTS_SERVICE_URL")
            if not product_service_url:
                raise ValueError("PRODUCTS_SERVICE_URL не настроен в конфиге")

            response = requests.get(f"{product_service_url}/products/{product_id}")
            if response.status_code != 200:
                return jsonify({"error": f"Товар {product_id} не найден"}), 400

            product = response.json()
            if not product.get('is_active'):
                return jsonify({"error": f"Товар {product_id} неактивен"}), 400

            price = product['price']
            total += price * quantity

            order_items.append({
                "product_id": product_id,
                "product_name": product['name'],
                "quantity": quantity,
                "price": price
            })

        except requests.exceptions.RequestException:
            return jsonify({"error": "Сервис товаров недоступен"}), 500
        except ValueError as e:
            return jsonify({"error": str(e)}), 500

    email = data.get('email')
    if email and not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        return jsonify({"error": "Неверный формат email"}), 400

    try:
        order = Order(
            customer_name=data['customer_name'],
            phone=data['phone'],
            email=email,
            address=data['address'],
            status='created',
            total=total,
            comment=data.get('comment')
        )
        db.session.add(order)
        db.session.commit()

        for item in order_items:
            order_item = OrderItem(
                order_id=order.id,
                product_id=item['product_id'],
                product_name=item['product_name'],
                quantity=item['quantity'],
                price=item['price']
            )
            db.session.add(order_item)

        db.session.commit()
        return jsonify(order.to_dict()), 201

    except SQLAlchemyError:
        db.session.rollback()
        return jsonify({"error": "Ошибка базы данных"}), 500

@app.route('/orders', methods=['GET'])
def get_orders():
    orders = Order.query.all()
    return jsonify([order.to_dict() for order in orders])

@app.route('/orders/<int:id>', methods=['GET'])
def get_order(id):
    order = Order.query.get_or_404(id)
    return jsonify(order.to_dict())

@app.route('/orders/<int:id>/status', methods=['PATCH'])
def update_order_status(id):
    order = Order.query.get_or_404(id)
    data = request.get_json()

    valid_statuses = ['created', 'paid', 'shipped', 'delivered', 'cancelled']
    new_status = data.get('status')

    if not new_status or new_status not in valid_statuses:
        return jsonify({"error": "Неверный статус"}), 400

    try:
        order.status = new_status
        db.session.commit()
        return jsonify(order.to_dict())
    except SQLAlchemyError:
        db.session.rollback()
        return jsonify({"error": "Ошибка базы данных"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=True)
