from sqlalchemy import create_engine

engine = create_engine("postgresql+psycopg2://postgres:password@localhost/orders_db")
conn = engine.connect()
print("Подключение успешно!")
conn.close()