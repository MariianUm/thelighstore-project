import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "SQLALCHEMY_DATABASE_URI",
        "postgresql+psycopg2://postgres:postgres@products_db:5432/products_db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
