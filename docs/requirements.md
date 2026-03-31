# Task Manager MVP — Requirements

## 1. Overview
Task Manager MVP — это веб-приложение для управления задачами (todo/tasks) с базовым функционалом создания, редактирования и отслеживания статусов задач.

Цель: предоставить простой инструмент для управления задачами команды/пользователя с возможностью дальнейшего масштабирования.

---

## 2. Stakeholders

### Core Team
- artemkill0 (Артём) — Team Lead / Architect  
- ExS1Te9780 (Даниил) — Backend  
- higzi (Андрей) — Frontend / Integration / DevOps  

### Development Team
- motofuga (Никита) — QA  
- Tusnane (Анатолий) — Product / Analyst / Documentation  
- Кристина — UX/UI  

---

## 3. Scope

### In Scope (MVP)
- CRUD операции над задачами
- Отображение списка задач
- Управление статусами задач
- Базовая UI для взаимодействия
- API взаимодействие frontend ↔ backend

### Out of Scope (MVP)
- сложные workflow (kanban, gantt)
- роли и права доступа
- уведомления
- интеграции (Slack, email и т.д.)

---

## 4. Functional Requirements

### 4.1 Task Management
- Пользователь может создать задачу
- Пользователь может редактировать задачу
- Пользователь может удалить задачу
- Пользователь может просматривать список задач

### 4.2 Task Attributes
Каждая задача содержит:
- title (название)
- description (описание)
- status (например: todo / in-progress / done)
- createdAt / updatedAt

(типичный lifecycle задач — todo → in-progress → done :contentReference[oaicite:0]{index=0})

---

### 4.3 Task Status Flow
- Смена статуса задачи вручную
- Отображение текущего статуса
- Фильтрация по статусу (опционально)

---

### 4.4 API (Backend)
- REST API для работы с задачами:
  - GET /tasks
  - POST /tasks
  - PUT /tasks/:id
  - DELETE /tasks/:id

---

### 4.5 UI (Frontend)
- Список задач
- Форма создания/редактирования
- Кнопки действий (edit/delete)
- Отображение статуса

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Время ответа API < 500ms (для MVP допустимо до 1s)

### 5.2 Usability
- Минимальный onboarding (интуитивный UI)
- Простая структура интерфейса

### 5.3 Reliability
- Базовая обработка ошибок API
- Валидация данных

### 5.4 Scalability (Future)
- Возможность добавления:
  - пользователей
  - ролей
  - командной работы
  - интеграций

---

## 6. Architecture (High-level)

Frontend:
- SPA (React/Vue или аналог)

Backend:
- REST API (Node.js / Python / etc.)

Database:
- Хранение задач (SQL или NoSQL)

Общий паттерн:
Client → API → DB

---

## 7. Use Cases

### UC-1: Создание задачи
1. Пользователь вводит данные
2. Отправка запроса на backend
3. Сохранение в БД
4. Обновление списка задач

### UC-2: Обновление статуса
1. Пользователь меняет статус
2. PATCH/PUT запрос
3. Обновление в БД
4. UI обновляется

### UC-3: Удаление задачи
1. Пользователь нажимает delete
2. DELETE запрос
3. Удаление из БД
4. Обновление UI

---

## 8. Future Improvements
- Авторизация / аутентификация
- Kanban-доска
- drag-and-drop
- комментарии
- уведомления
- аналитика задач

---
