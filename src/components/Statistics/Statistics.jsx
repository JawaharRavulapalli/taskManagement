import useTasks from '../../hooks/useTasks';
import { useEffect, useState } from 'react';
import styles from './Statistics.module.css';

const Statistics = () => {
  const { fetchTaskStats, loading, error } = useTasks();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      const data = await fetchTaskStats();
      if (data) setStats(data);
    };
    loadStats();
  }, [fetchTaskStats]);

  if (loading) return <p>Loading statistics...</p>;
  if (error) return <p>Error: {error}</p>;

   return (
    <div className={styles.pageWrapper}>
      <h1>Task Statistics</h1>
      <button onClick={() => navigate('/')}>Home</button>

      {loading && <p>Loading statistics...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {stats && (
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <h3>Total Tasks</h3>
            <p>{stats.total}</p>
          </div>
          <div className={styles.statCard}>
            <h3>TO Do</h3>
            <p>{stats.pending}</p>
          </div>
          <div className={styles.statCard}>
            <h3>In Progress</h3>
            <p>{stats.inProgress}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Completed</h3>
            <p>{stats.completed}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;