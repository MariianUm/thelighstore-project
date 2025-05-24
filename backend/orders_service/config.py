class Config:
    SQLALCHEMY_DATABASE_URI = "postgresql+psycopg2://postgres:password@localhost/orders_db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PRODUCTS_SERVICE_URL = "http://localhost:5000"
    SQLALCHEMY_ECHO = True