const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const loginAPI = async (username, password) => {
  // В зависимости от того, как настроен твой FastAPI бэкенд, 
  // здесь может потребоваться отправлять данные в формате FormData (application/x-www-form-urlencoded)
  // Но для классического REST API мы используем JSON:
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Ошибка авторизации');
  }

  return response.json(); // Ожидаем, что бэкенд вернет { "access_token": "...", "token_type": "bearer" }
};
