import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AuthForm from './pages/AuthForm';
import MainLayout from './layouts/MainLayout';
import Condidates from './pages/Condidates';
import Attendance from './pages/Attendance';  
import Employes from './pages/Employes';
import Leaves from './pages/Leaves';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/dashboard" element={<MainLayout />}>
        <Route index element={<Condidates />} />
         <Route path="candidates" element={<Condidates />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="employees" element={<Employes />} />
          <Route path="leaves" element={<Leaves />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
