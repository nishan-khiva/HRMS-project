import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserFriends, FaUsers, FaCalendarAlt, FaClipboardList } from 'react-icons/fa';
import { MdOutlineLogout } from 'react-icons/md';
import './Sidebar.css';

const Sidebar = () => (
  <div className="sidebar">
    <div className="sidebar-logo">
      <span className="logo-box"></span>
      <span className="logo-text">LOGO</span>
    </div>
    <input className="sidebar-search" placeholder="Search" />
    <div className="sidebar-section">
      <div className="sidebar-section-title">Recruitment</div>
      <NavLink to="candidates" className="sidebar-link">
        <FaUserFriends /> Candidates
      </NavLink>
    </div>
    <div className="sidebar-section">
      <div className="sidebar-section-title">Organization</div>
      <NavLink to="employees" className="sidebar-link">
        <FaUsers /> Employees
      </NavLink>
      <NavLink to="attendance" className="sidebar-link">
        <FaCalendarAlt /> Attendance
      </NavLink>
      <NavLink to="leaves" className="sidebar-link">
        <FaClipboardList /> Leaves
      </NavLink>
    </div>
    <div className="sidebar-section">
      <div className="sidebar-section-title">Others</div>
      <NavLink to="/logout" className="sidebar-link">
        <MdOutlineLogout /> Logout
      </NavLink>
    </div>
  </div>
);

export default Sidebar;