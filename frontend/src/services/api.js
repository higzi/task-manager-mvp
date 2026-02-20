// ЖЕСТКО ЗАДАЕМ IP-АДРЕС БЭКЕНДА
const API_URL = 'http://127.0.0.1:8000'; 

// Вспомогательная функция для заголовков
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getTasks = async () => {
  const res = await fetch(`${API_URL}/tasks`, {
    headers: getHeaders(),
  });
  
  if (res.status === 401) throw new Error("Unauthorized"); 
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
};

export const createTask = async (task) => {
  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(task),
  });

  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
};

export const deleteTask = async (taskId) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error('Ошибка при удалении задачи');
  }
  
  return response.json();
};
