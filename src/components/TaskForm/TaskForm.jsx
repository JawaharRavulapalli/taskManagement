import React, { useEffect, useState } from 'react';
import styles from './TaskForm.module.css';

const defaultTask = {
  title: '',
  description: '',
  status: 'TODO',
  priority: 'MEDIUM',
  dueDate: '',
  tags: '',
  estimatedHours: '',
  actualHours: '',
};

const TaskForm = ({ initialData = null, onSubmit, isEdit = false, loading = false, error = null }) => {
  const [formData, setFormData] = useState(defaultTask);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'TODO',
        priority: initialData.priority || 'MEDIUM',
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().slice(0, 16)
          : '',
        tags: initialData.tags ? initialData.tags.join(', ') : '',
        estimatedHours: initialData.estimatedHours ?? '',
        actualHours: initialData.actualHours ?? '',
      });
    }
  }, [initialData]);

  const validate = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (formData.title.length > 100) errors.title = 'Title can’t exceed 100 characters';
    if (formData.description.length > 500) errors.description = 'Description can’t exceed 500 characters';
    if (!formData.status) errors.status = 'Status is required';
    if (!formData.priority) errors.priority = 'Priority is required';
    if (formData.dueDate && new Date(formData.dueDate) < new Date()) errors.dueDate = 'Due date must be in the future';
    if (formData.estimatedHours < 0) errors.estimatedHours = 'Estimated hours must be ≥ 0';
    if (formData.actualHours < 0) errors.actualHours = 'Actual hours must be ≥ 0';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const preparedData = {
      ...formData,
      estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : null,
      actualHours: formData.actualHours ? parseInt(formData.actualHours) : null,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
    };

    if (onSubmit) {
      await onSubmit(preparedData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formWrapper}>
      <h2>{isEdit ? 'Edit Task' : 'Create New Task'}</h2>

      <div className={styles.formGroup}>
        <label>Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          maxLength={100}
          onChange={handleChange}
        />
        {formErrors.title && <p className={styles.errorText}>{formErrors.title}</p>}
      </div>

      <div className={styles.formGroup}>
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          maxLength={500}
          onChange={handleChange}
        />
        {formErrors.description && <p className={styles.errorText}>{formErrors.description}</p>}
      </div>

      <div className={styles.formGroup}>
        <label>Status *</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
        </select>
        {formErrors.status && <p className={styles.errorText}>{formErrors.status}</p>}
      </div>

      <div className={styles.formGroup}>
        <label>Priority *</label>
        <select name="priority" value={formData.priority} onChange={handleChange}>
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
          <option value="URGENT">URGENT</option>
        </select>
        {formErrors.priority && <p className={styles.errorText}>{formErrors.priority}</p>}
      </div>

      <div className={styles.formGroup}>
        <label>Due Date</label>
        <input
          type="datetime-local"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
        />
        {formErrors.dueDate && <p className={styles.errorText}>{formErrors.dueDate}</p>}
      </div>

      <div className={styles.formGroup}>
        <label>Tags (comma separated)</label>
        <input
          type="text"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
        />
      </div>

      <div className={styles.formGroup}>
        <label>Estimated Hours</label>
        <input
          type="number"
          name="estimatedHours"
          min="0"
          value={formData.estimatedHours}
          onChange={handleChange}
        />
        {formErrors.estimatedHours && <p className={styles.errorText}>{formErrors.estimatedHours}</p>}
      </div>

      <div className={styles.formGroup}>
        <label>Actual Hours</label>
        <input
          type="number"
          name="actualHours"
          min="0"
          value={formData.actualHours}
          onChange={handleChange}
        />
        {formErrors.actualHours && <p className={styles.errorText}>{formErrors.actualHours}</p>}
      </div>

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update Task' : 'Create Task')}
      </button>

      {error && <p className={styles.errorText}>Error: {error}</p>}
    </form>
  );
};

export default TaskForm;