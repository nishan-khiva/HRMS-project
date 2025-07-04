import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AuthForm from './pages/AuthForm';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<MainLayout />}>
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/leaves" element={<Leaves />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
