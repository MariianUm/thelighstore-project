from app import app
from models import db, Product

with app.app_context():
    db.create_all()
    print("Таблицы успешно созданы!")