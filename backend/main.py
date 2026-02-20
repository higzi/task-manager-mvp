from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from datetime import date
from typing import List

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # для MVP
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- In-memory storage ----------------
tasks: List[dict] = []
current_id = 1


# ---------------- Models ----------------

# Модель для авторизации и регистрации
class UserAuth(BaseModel):
    username: str
    password: str

# Модель входящих данных (БЕЗ id и score)
class TaskCreate(BaseModel):
    title: str
    deadline: date
    importance: int = Field(ge=1, le=10)
    complexity: int = Field(gt=0)


# Модель ответа (с id и score)
class TaskResponse(TaskCreate):
    id: int
    score: float


# ---------------- Business Logic ----------------

def urgency_coefficient(deadline: date) -> float:
    today = date.today()
    days_left = (deadline - today).days

    if days_left <= 1:
        return 3.0
    elif days_left <= 7:
        return 1.5
    else:
        return 1.0


def calculate_score(task: TaskCreate) -> float:
    coef = urgency_coefficient(task.deadline)
    return (task.importance * coef) / task.complexity


# ---------------- Auth Endpoints (Stubs) ----------------

@app.post("/register")
def register(user: UserAuth):
    # Пока это заглушка, возвращаем успешный статус
    return {"message": f"User {user.username} created successfully"}

@app.post("/login")
def login(user: UserAuth):
    # Фейковая проверка и выдача токена
    if user.username and user.password:
        return {"access_token": "fake-jwt-token-12345", "token_type": "bearer"}
    
    raise HTTPException(status_code=400, detail="Неверный логин или пароль")


# ---------------- Task Endpoints ----------------

@app.post("/tasks", response_model=TaskResponse)
def create_task(task: TaskCreate):
    global current_id

    score = round(calculate_score(task), 3)

    task_dict = task.dict()
    task_dict["id"] = current_id
    task_dict["score"] = score

    tasks.append(task_dict)
    current_id += 1

    return task_dict


@app.get("/tasks", response_model=List[TaskResponse])
def get_tasks():
    return sorted(
        tasks,
        key=lambda t: t["score"],
        reverse=True
    )


@app.get("/health")
def health():
    return {"status": "ok"}

# ----------------- Delete Endpoint -------------------------

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    global tasks
    # Оставляем в списке только те задачи, ID которых не совпадает с удаляемым
    tasks = [t for t in tasks if t["id"] != task_id]
    return {"message": "Task deleted successfully"}

