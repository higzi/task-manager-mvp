# Smart Task Manager (MVP)

Проект разработан командой из 2 человек.
Роль: Frontend Developer (React + Vite).

## Архитектура
Приложение реализует паттерн "Resilient UI" (Устойчивый интерфейс).
- **Frontend:** React, CSS Modules (Mobile First).
- **Backend:** Python FastAPI (интеграция по REST API).

## Особенности реализации
В связи с задержкой поставки Бэкенд-части, на Фронтенде реализован **Mock Service Layer**:
1. Если API недоступен, приложение автоматически переключается в **Demo Mode**.
2. Логика "сложной сортировки" (Urgency/Importance Matrix) продублирована на клиенте для автономной работы.
3. Пользователь не теряет функциональность при сбоях сервера.

## Запуск
1. `npm install`
2. `npm run dev`
