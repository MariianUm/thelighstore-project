import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "SQLALCHEMY_DATABASE_URI",
        "postgresql+psycopg2://postgres:postgres@db:5432/orders_db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PRODUCTS_SERVICE_URL = os.getenv("PRODUCTS_SERVICE_URL", "http://localhost:5000")
    SQLALCHEMY_ECHO = True


