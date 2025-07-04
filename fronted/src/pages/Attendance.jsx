import React, { useState } from 'react';
import { FiMoreVertical, FiEdit, FiTrash2, FiChevronDown } from 'react-icons/fi';
import '../components/Attendance/Attendance.css';

const initialAttendance = [
  {
    id: 1,
    name: 'Jane Copper',
    email: 'jane.copper@example.com',
    phone: '(704) 555-0127',
    position: 'Full Time',
    department: 'Designer',
    profile: 'https://randomuser.me/api/portraits/women/1.jpg',
    task: 'Dashboard Home page Alignment',
    status: 'Present',
  },
  {
    id: 2,
    name: 'Arlene McCoy',
    email: 'arlene.mccoy@example.com',
    phone: '(302) 555-0107',
    position: 'Full Time',
    department: 'Designer',
    profile: 'https://randomuser.me/api/portraits/women/2.jpg',
    task: 'Dashboard Login page design, Dashboard Home page design',
    status: 'Present',
  },
  {
    id: 3,
    name: 'Cody Fisher',
    email: 'deanna.curtis@example.com',
    phone: '(252) 555-0126',
    position: 'Senior',
    department: 'Backend Development',
    profile: 'https://randomuser.me/api/portraits/men/3.jpg',
    task: '--',
    status: 'Absent',
  },
  {
    id: 4,
    name: 'Janney Wilson',
    email: 'janney.wilson@example.com',
    phone: '(252) 555-0126',
    position: 'Junior',
    department: 'Backend Development',
    profile: 'https://randomuser.me/api/portraits/men/4.jpg',
    task: 'Dashboard login page integration',
    status: 'Present',
  },
  {
    id: 5,
    name: 'Leslie Alexander',
    email: 'willie.jennings@example.com',
    phone: '(207) 555-0119',
    position: 'Team Lead',
    department: 'Human Resource',
    profile: 'https://randomuser.me/api/portraits/men/5.jpg',
    task: '4 scheduled interview, Sorting of resumes',
    status: 'Present',
  },
];

const statusOptions = ['All', 'Present', 'Absent'];

const Attendance = () => {
  const [attendance, setAttendance] = useState(initialAttendance);
  const [statusFilter, setStatusFilter] = useState('All');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [rowStatusDropdown, setRowStatusDropdown] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAttendance = attendance.filter(emp => {
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.task.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.attendance-action-menu-container')) {
        setMenuOpen(null);
      }
      if (!event.target.closest('.attendance-status-filter-dropdown')) {
        setStatusDropdownOpen(false);
      }
      if (!event.target.closest('.attendance-row-status-dropdown')) {
        setRowStatusDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setAttendance(prev => prev.map(emp => emp.id === id ? { ...emp, status: newStatus } : emp));
    setRowStatusDropdown(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <h2 style={{marginLeft: 24}}>Attendance</h2>
      </div>
      <div className="menubar" style={{ marginBottom: 0 }}>
        {/* Status Dropdown */}
        <div className="attendance-status-filter-dropdown" style={{ position: 'relative' }}>
          <button
            className="dropdown-btn"
            onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
            style={{ minWidth: 140 }}
          >
            Status
            <span style={{ marginLeft: 8 }}>{statusFilter !== 'All' ? statusFilter : ''}</span>
            <FiChevronDown size={14} style={{ marginLeft: 8 }} />
          </button>
          {statusDropdownOpen && (
            <div className="dropdown-menu" style={{ minWidth: 160 }}>
              {statusOptions.map(option => (
                <div
                  key={option}
                  className="dropdown-item"
                  onClick={() => {
                    setStatusFilter(option);
                    setStatusDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
          style={{ minWidth: 220 }}
        />
      </div>
      <div className="attendance-table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Task</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendance.map(emp => (
              <tr key={emp.id}>
                <td><img src={emp.profile} alt={emp.name} className="attendance-profile-img" /></td>
                <td>{emp.name}</td>
                <td>{emp.position}</td>
                <td>{emp.department}</td>
                <td>{emp.task}</td>
                <td style={{ position: 'relative' }}>
                  <div className="attendance-row-status-dropdown" style={{ display: 'inline-block' }}>
                    <button
                      className={`attendance-status-btn${emp.status === 'Absent' ? ' absent' : ''}`}
                      onClick={() => setRowStatusDropdown(rowStatusDropdown === emp.id ? null : emp.id)}
                    >
                      {emp.status}
                      <FiChevronDown size={14} style={{ marginLeft: 8 }} />
                    </button>
                    {rowStatusDropdown === emp.id && (
                      <div className="attendance-status-dropdown">
                        {statusOptions.filter(opt => opt !== 'All').map(option => (
                          <div
                            key={option}
                            className="attendance-status-option"
                            onClick={() => handleStatusChange(emp.id, option)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ position: 'relative', textAlign: 'center' }}>
                  <div className="attendance-action-menu-container">
                    <button
                      className="action-menu-btn"
                      onClick={() => setMenuOpen(menuOpen === emp.id ? null : emp.id)}
                    >
                      <FiMoreVertical size={16} />
                    </button>
                    {menuOpen === emp.id && (
                      <div className="attendance-action-menu">
                        <div
                          className="attendance-action-menu-item"
                          onClick={() => {
                            // Edit logic here
                            setMenuOpen(null);
                          }}
                        >
                          <FiEdit size={14} /> Edit
                        </div>
                        <div
                          className="attendance-action-menu-item delete"
                          onClick={() => {
                            setAttendance(prev => prev.filter(e => e.id !== emp.id));
                            setMenuOpen(null);
                          }}
                        >
                          <FiTrash2 size={14} /> Delete
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
