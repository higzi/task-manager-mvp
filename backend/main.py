from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date
import uuid

from database import engine, Base, get_db
from models import User, Task
from schemas import UserAuth, Token, TaskCreate, TaskResponse


app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def calculate_score(importance: int, complexity: int, deadline: date) -> float:
    today = date.today()
    days_left = (deadline - today).days
    coef = 3.0 if days_left <= 1 else 1.5 if days_left <= 7 else 1.0
    return round((importance * coef) / complexity, 3)

# TODO: реализовать JWT
def get_password_hash(password: str) -> str:
    return password + "hashed"
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return plain_password + "hashed" == hashed_password

# TODO: Написать нормальную проверку токена
def get_current_user(db: Session = Depends(get_db)):
    # ВРЕМЕННЫЙ ХАК: берем первого юзера из базы, пока нет JWT-токенов
    user = db.query(User).first()
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
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
    
    # TODO: Сгенерировать настоящий JWT токен
    return {"access_token": f"fake-token-for-{db_user.id}", "token_type": "bearer"}


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
        raise HTTPException(status_code=404, detail="Task not found or forbidden")
    
    db.delete(task)
    db.commit()
    return {"message": "Task deleted"}