# Test Plan: Smart Task Manager

## 1. Unit Testing (Validation Logic)
- [x] CASE 1.1: Ввод корректных данных.
  - Input: Title="Test", Date=[Future], Imp=5, SP=1.
  - Expected: Задача добавляется, Score рассчитывается.
  
- [x] CASE 1.2: Ввод даты в прошлом.
  - Input: Date=[Yesterday].
  - Expected: Ошибка "Дедлайн не может быть в прошлом", задача не создается.

- [x] CASE 1.3: Граничные значения.
  - Input: Imp=1, Imp=10.
  - Expected: Корректная обработка, цвета Score меняются (Green/Red).

## 2. Integration Testing (System Behavior)
- [x] CASE 2.1: API доступен (Happy Path).
  - Action: Запуск с включенным бэкендом.
  - Expected: Данные сохраняются на сервере, список обновляется.

- [x] CASE 2.2: API недоступен (Failover).
  - Action: Бэкенд выключен (500/Connection Refused).
  - Expected: Приложение не падает. Появляется плашка "Demo Mode". Включается локальная сортировка.

## 3. UI/UX Testing
- [x] CASE 3.1: Mobile Responsiveness.
  - Action: Сузить экран < 768px.
  - Expected: Форма перестраивается в колонку, у таблицы появляется скролл.
