from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.exc import OperationalError
from passlib.hash import bcrypt
from jose import jwt
import os
import time

import models
from database import engine, SessionLocal
from models import User

# Ждём доступность базы данных
def wait_for_db(engine, retries=10, delay=2):
    for i in range(retries):
        try:
            with engine.connect() as conn:
                print("✅ DB is ready")
                break
        except OperationalError:
            print(f"⏳ Waiting for DB... ({i+1}/{retries})")
            time.sleep(delay)
    else:
        raise Exception("❌ Failed to connect to the database")

wait_for_db(engine)

# Создание таблиц
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# JWT
SECRET_KEY = os.getenv("SECRET_KEY", "secret")
ALGORITHM = "HS256"

# Pydantic схемы
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Получение сессии
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Регистрация
@app.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter_by(username=user.username).first():
        raise HTTPException(status_code=400, detail="Пользователь уже существует")
    hashed_password = bcrypt.hash(user.password)
    new_user = User(username=user.username, email=user.email, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    token = jwt.encode({"sub": new_user.username}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token}

# Логин
@app.post("/login", response_model=Token)
def login(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter_by(username=user.username).first()
    if not db_user or not bcrypt.verify(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Неверные учетные данные")
    token = jwt.encode({"sub": db_user.username}, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token}

# Запуск
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=False)

