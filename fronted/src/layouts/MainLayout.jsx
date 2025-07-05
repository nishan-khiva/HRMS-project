import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => (
  <div class="main-layout">
    <Sidebar />
    <div className="main-content">
     <Outlet />
    </div>
  </div>
);

export default MainLayout;


