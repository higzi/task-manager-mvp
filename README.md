# 🚀 Smart Task Manager (MVP)

> **Fullstack-система управления задачами с интеллектуальной приоритизацией.**
> Архитектура: **React (Vite) + FastAPI (PostgreSQL)**.
> Концепция: **Security-First & Resilient UI**.

---

## 🧠 О проекте

Smart Task Manager — это приложение, которое автоматически вычисляет приоритет задач на основе их важности, сложности и близости дедлайна. Система построена на принципах безопасности: данные каждого пользователя изолированы и защищены JWT-авторизацией.

**Ключевые фичи:**
* **JWT Auth:** Безопасный вход и хранение сессии. Каждый пользователь работает в своем личном пространстве.
* **Smart Scoring:** Динамический расчет веса задачи на стороне сервера.
* **Resilient UI:** Автоматическое переключение в Demo-режим при недоступности API.

---

## 🗂️ Архитектура данных (ER-модель)

![ER Model](materials/erm.png)



---

## 🛠 Стек технологий

### Frontend
- **Framework:** React 18 (Vite)
- **State:** Context API + Custom Hooks
- **Security:** JWT Authentication
- **Deploy:** [https://task-manager-app-higzi.netlify.app/](https://task-manager-app-higzi.netlify.app/)

### Backend
- **Framework:** FastAPI (Python 3.11+)
- **Database:** PostgreSQL (SQLAlchemy ORM)
- **Security:** Bcrypt (password hashing) + PyJWT
- **Deploy:** [https://task-manager-mvp.onrender.com](https://task-manager-mvp.onrender.com)

---

## 🧮 Алгоритм приоритизации

Приоритет (`score`) рассчитывается по формуле:
`score = (importance * urgency_coefficient) / complexity`

**Коэффициенты срочности:**
- 🔥 **3.0** — осталось менее 1 дня
- ⚡ **1.5** — осталось менее 7 дней
- 🗓 **1.0** — плановая задача (> 7 дней)

---

## 🧪 Локальный запуск

Для запуска требуется установленный Python 3.11+ и Node.js. Конфигурация окружения (Environment Variables) настраивается согласно внутренним регламентам безопасности проекта.

### 1. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```
### 2. Frontend 
```bash
cd frontend
npm install
npm run dev
```
---
## 👨‍💻 Команда
*Команда разработки:*

| *Никнейм*  | *Должность* |
| ------------- |:-------------:|
| artemkill0 (Артём)     | Тим лид/архитектор     |
| ExS1Te9780 (Даниил)      | Backend    |
| higzi (Андрей)     | Frontend + Integration + DevOps    |

*Команда развития:*

| *Никнейм*  | *Должность* |
| ------------- |:-------------:|
| motofuga (Никита)     | QA     |
| Tusnane (Анатолий)      | Product / Analyst / Documentation    |
| (Кристина)    | ux/ui (поддержка идеи дизайнов)    |

2026

