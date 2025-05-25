from datetime import datetime
from flask import Flask, jsonify, request
from flask_migrate import Migrate
from .models import db, Product
from .config import Config

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)

@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.filter_by(is_active=True).all()
    return jsonify([product.to_dict() for product in products])

@app.route('/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify(product.to_dict())

@app.route('/')
def index():
    return jsonify({"message": "Products Service API"})


@app.route('/products', methods=['POST'])
def create_product():
    data = request.get_json()
    if not data.get('name') or not data.get('price'):
        return jsonify({"error": "Missing required fields"}), 400

    product = Product(
        name=data['name'],
        description=data.get('description'),
        price=data['price'],
        power=data.get('power'),
        image_url=data.get('image_url'),
        is_active=data.get('is_active', True)
    )

    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201

@app.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()

    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)
    product.power = data.get('power', product.power)
    product.image_url = data.get('image_url', product.image_url)
    product.is_active = data.get('is_active', product.is_active)
    product.updated_at = datetime.utcnow()

    db.session.commit()
    return jsonify(product.to_dict())

@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = Product.query.get_or_404(id)
    product.is_active = False
    db.session.commit()
    return jsonify({"message": "Product deleted"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
