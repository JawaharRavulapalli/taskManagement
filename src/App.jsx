import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './components/Home/Home'
import AllTasksPage from './components/AllTasksPage/AllTasksPage';
import CreateTaskPage from './components/CreateTaskPage/CreateTaskPage';
import EditTaskPage from './components/EditTaskPage/EditTaskPage';
import KanbanBoard from './components/KanbanBoard/KanBanBoard';
import Statistics from './components/Statistics/Statistics'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

          <Route path="tasks" element={<AllTasksPage />} />
          <Route path="tasks/create" element={<CreateTaskPage />} />
          <Route path="tasks/edit/:id" element={<EditTaskPage />} />
          <Route path="kanban" element={<KanbanBoard />} />
          <Route path="statistics" element={<Statistics />} />
      </Routes>
    </Router>
  )};

  export default App;
