import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8080/api/tasks';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'API error');
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return response.text();
  }
};

  const fetchTasks = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `${API_BASE_URL}?${queryParams}` : API_BASE_URL;

      const response = await fetch(url);
      const data = await handleResponse(response);
      setTasks(data.content ?? []);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    setError(null);
    setLoading(true);

    try {
      const tempId = `temp-${Date.now()}`;
      const optimisticTask = { id: tempId, ...taskData };
      setTasks(prev => [...prev, optimisticTask]);

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      const createdTask = await handleResponse(response);

      setTasks(prev =>
        prev.map(t => (t.id === tempId ? createdTask : t))
      );
    } catch (err) {
      setError(err.message || 'Failed to create task');
      setTasks(prev => prev.filter(t => !(`${t.id}`.startsWith('temp-'))));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (taskId, updatedData) => {
    setError(null);
    setLoading(true);

    try {
      setTasks(prev =>
        prev.map(t => (t.id === taskId ? { ...t, ...updatedData } : t))
      );

      const response = await fetch(`${API_BASE_URL}/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      const updatedTask = await handleResponse(response);

      setTasks(prev =>
        prev.map(t => (t.id === taskId ? updatedTask : t))
      );
    } catch (err) {
      setError(err.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/${taskId}`, {
        method: 'DELETE',
      });
      await handleResponse(response);

      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (err) {
      setError(err.message || 'Failed to delete task');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTaskStatus = async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/${id}/${status}`, {
      method: 'PATCH',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Status update failed: ${errorText}`);
    }
    return response.text(); 
  };

  const searchTasks = useCallback(async (keyword) => {
    setError(null);
    setLoading(true);

    try {
      const url = `${API_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`;
      const response = await fetch(url);
      const data = await handleResponse(response);
      setTasks(data.content);
    } catch (err) {
      setError(err.message || 'Failed to search tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    searchTasks,
  };
};

export default useTasks;