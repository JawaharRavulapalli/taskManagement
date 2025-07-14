import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useTasks from '../../hooks/useTasks';
import styles from './AllTasksPage.module.css';

const STATUS_OPTIONS = ['ALL', 'TODO', 'IN_PROGRESS', 'DONE'];
const PRIORITY_OPTIONS = ['ALL', 'LOW', 'MEDIUM', 'HIGH', 'URGENT'];

const AllTasksPage = () => {
  const navigate = useNavigate();
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    deleteTask,
  } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>All Tasks</h2>
        <button className={styles.homeButton} onClick={() => navigate('/')}>
          Home
        </button>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <table className={styles.taskTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleString() : 'N/A'}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
                <td>
                  <button
                    onClick={() => navigate(`/tasks/edit/${task.id}`)}
                    className={styles.actionButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
                        deleteTask(task.id);
                      }
                    }}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllTasksPage;