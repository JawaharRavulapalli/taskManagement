import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useTasks from '../../hooks/useTasks';
import TaskForm from '../TaskForm/TaskForm';

const EditTaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, updateTask, fetchTasks, loading, error } = useTasks();

  const [taskToEdit, setTaskToEdit] = useState(null);

  useEffect(() => {
    if (!tasks.length) fetchTasks();
  }, [tasks, fetchTasks]);

  useEffect(() => {
    const task = tasks.find(t => `${t.id}` === id);
    if (task) setTaskToEdit(task);
  }, [tasks, id]);

  const handleUpdate = async (data) => {
    await updateTask(id, data);
    navigate('/');
  };

  if (loading) return <p>Loading task...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!taskToEdit) return <p>Task not found</p>;

  return (
    <div>
      <h2>Edit Task</h2>
      <TaskForm initialData={taskToEdit} onSubmit={handleUpdate} isEdit />
      <button onClick={() => navigate('/')}>Cancel</button>
    </div>
  );
};

export default EditTaskPage;