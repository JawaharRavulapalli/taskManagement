import React from 'react';
import { useNavigate } from 'react-router-dom';
import useTasks from '../../hooks/useTasks';
import TaskForm from '../TaskForm/TaskForm';
import styles from './CreateTaskPage.module.css';

const CreateTaskPage = () => {
  const { createTask } = useTasks();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    await createTask(formData);
    navigate('/');
  };

  return (
    <div className={styles.pageWrapper}>
      <h2>Create New Task</h2>
      <TaskForm onSubmit={handleSubmit} isEdit={false}  />
      <button onClick={() => navigate('/')}>Cancel</button>
    </div>
  );
};

export default CreateTaskPage;