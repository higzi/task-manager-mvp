from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import List
import math

app = FastAPI()

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # для MVP можно так, потом лучше указать конкретный origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- In-memory storage ---
tasks = []

# --- Модель данных ---
class Task(BaseModel):
    id: int
    title: str
    deadline: date
    importance: int = Field(ge=1, le=10)
    complexity: int = Field(gt=0)

# --- Функция коэффициента срочности ---
def urgency_coefficient(deadline: date) -> float:
    today = date.today()
    days_left = (deadline - today).days

    if days_left <= 1:
        return 3.0
    elif days_left <= 7:
        return 1.5
    else:
        return 1.0

# --- Расчет приоритета ---
def calculate_priority(task: Task) -> float:
    coef = urgency_coefficient(task.deadline)
    return (task.importance * coef) / task.complexity

# --- POST /tasks ---
@app.post("/tasks")
def create_task(task: Task):
    priority = calculate_priority(task)
    
    task_dict = task.dict()
    task_dict["priority"] = round(priority, 3)

    tasks.append(task_dict)
    return task_dict

# --- GET /tasks ---
@app.get("/tasks")
def get_tasks():
    sorted_tasks = sorted(
        tasks,
        key=lambda t: t["priority"],
        reverse=True
    )
    return sorted_tasks