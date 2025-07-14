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

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
      const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

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

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.dropdown}
        >
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>
              {status === 'ALL' ? 'All Statuses' : status.replace('_', ' ')}
            </option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className={styles.dropdown}
        >
          {PRIORITY_OPTIONS.map(priority => (
            <option key={priority} value={priority}>
              {priority === 'ALL' ? 'All Priorities' : priority}
            </option>
          ))}
        </select>
      </div>

      {filteredTasks.length === 0 ? (
        <p>No tasks found.</p>
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
              <th>Estimated Hours</th>
              <th>Actual Hours</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleString() : 'N/A'}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
                <td>{task.estimatedHours}</td>
                <td>{task.actualHours}</td>

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