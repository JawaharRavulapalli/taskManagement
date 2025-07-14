import React, { useEffect, useState } from 'react';
import useTasks from '../../hooks/useTasks';
import styles from './KanbanBoard.module.css';
import { useNavigate } from 'react-router-dom';



const STATUS_COLUMNS = ['TODO', 'IN_PROGRESS', 'DONE'];

const PRIORITY_COLORS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

const KanbanBoard = () => {



  const { tasks, fetchTasks, updateTask, deleteTask, updateTaskStatus, loading, error } = useTasks();
  const [columns, setColumns] = useState({ TODO: [], IN_PROGRESS: [], DONE: [] });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    const grouped = { TODO: [], IN_PROGRESS: [], DONE: [] };
    tasks.forEach(task => {
      grouped[task.status]?.push(task);
    });
    setColumns(grouped);
  }, [tasks]);

  const isOverdue = (task) => {
    return task.dueDate && new Date(task.dueDate) < new Date();
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        fetchTasks();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMarkComplete = async (task) => {
    try {
        await updateTaskStatus(task.id, 'DONE');
        fetchTasks();
    } catch (err) {
        console.error(err);
    }
    };

  const handleEdit = (taskId) => {
    navigate(`/tasks/edit/${taskId}`);
  };

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
    <div className={styles.header}>
    <h1>Kanban Board</h1>
    </div>

    <div className={styles.headerButtons}>
    <button onClick={() => navigate('/')}>Home</button>
    <button onClick={() => navigate('/tasks/create')}>Create Task</button>
    </div>
    <div className={styles.board}>
      {STATUS_COLUMNS.map(status => (
        <div key={status} className={styles.column}>
          <h3>{status.replace('_', ' ')}</h3>
          {columns[status].map(task => {
            const overdue = isOverdue(task);
            const priorityClass = PRIORITY_COLORS[task.priority] || 'default';

            return (
              <div
                key={task.id}
                className={`${styles.card} ${styles[priorityClass]} ${overdue ? styles.overdue : ''}`}
              >
                <strong>{task.title}</strong>
                <p>{task.description}</p>
                <small>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</small>
                <div className={styles.actions}>
                  {status !== 'DONE' && (
                    <button onClick={() => handleMarkComplete(task)}>Mark Complete</button>
                  )}

                  <button onClick={() => handleEdit(task.id)}>Edit</button>
                  <button onClick={() => handleDelete(task.id)}>Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
    </>
  );
};

export default KanbanBoard;