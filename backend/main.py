import os
print(os.listdir('.'))
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import date, datetime, timedelta, timezone
import uuid
import jwt
from passlib.context import CryptContext
from dotenv import load_dotenv

from database import engine, Base, get_db
from models import User, Task
from schemas import UserAuth, Token, TaskCreate, TaskResponse

load_dotenv()

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = os.getenv("SECRET_KEY")

if not SECRET_KEY:
    raise ValueError(
        "🚨 КРИТИЧЕСКАЯ ОШИБКА: SECRET_KEY не задан! "
        "Добавь его в файл .env (SECRET_KEY=твой_ключ) для локальной разработки "
        "или в Environment Variables на сервере Render."
    )

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def calculate_score(importance: int, complexity: int, deadline: date) -> float:
    today = date.today()
    days_left = (deadline - today).days
    coef = 3.0 if days_left <= 1 else 1.5 if days_left <= 7 else 1.0
    return round((importance * coef) / complexity, 3)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Недействительный токен или срок его действия истек",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user

@app.post("/register", response_model=dict)
def register(user: UserAuth, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")
    
    new_user = User(
        email=user.username, 
        password_hash=get_password_hash(user.password)
    )
    db.add(new_user)
    db.commit()
    return {"message": "Успешная регистрация"}

@app.post("/login", response_model=Token)
def login(user: UserAuth, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Неверный логин или пароль")
    
    access_token = create_access_token(data={"sub": str(db_user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/tasks", response_model=TaskResponse)
def create_task(task: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    score = calculate_score(task.importance, task.complexity, task.deadline)
    
    new_task = Task(
        user_id=current_user.id,
        title=task.title,
        deadline=task.deadline,
        importance=task.importance,
        complexity=task.complexity,
        score=score,
        status_id=1
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.get("/tasks", response_model=list[TaskResponse])
def get_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tasks = db.query(Task).filter(Task.user_id == current_user.id).order_by(Task.score.desc()).all()
    return tasks

@app.delete("/tasks/{task_id}")
def delete_task(task_id: uuid.UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == current_user.id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Задача не найдена или нет прав")
    
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}
