import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.homeContainer}>
    <h1>Welcome to Task Management System</h1>
    <button className={styles.homeButton} onClick={() => navigate('/tasks')}>Tasks</button>
    <button className={styles.homeButton} onClick={() => navigate('/kanban')}>Kanban Board</button>
    <button className={styles.homeButton} onClick={() => navigate('/statistics')}>Statistics</button>
  </div>
  );
};

export default Home;