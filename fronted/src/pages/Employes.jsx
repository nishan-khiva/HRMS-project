import React, { useState } from 'react';
import { FiMoreVertical, FiEdit, FiTrash2, FiChevronDown } from 'react-icons/fi';
import '../components/Employees/Employees.css';
import Header from '../components/Header';
import EmployeeEditForm from '../components/Employees/EmployeeEditForm';

const initialEmployees = [
  {
    id: 1,
    name: 'Jane Copper',
    email: 'jane.copper@example.com',
    phone: '(704) 555-0127',
    position: 'Designer',
    department: 'Designer',
    doj: '10/06/13',
    profile: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 2,
    name: 'Arlene McCoy',
    email: 'arlene.mccoy@example.com',
    phone: '(302) 555-0107',
    position: 'Designer',
    department: 'Designer',
    doj: '11/07/16',
    profile: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: 3,
    name: 'Cody Fisher',
    email: 'deanna.curtis@example.com',
    phone: '(252) 555-0126',
    position: 'Developer',
    department: 'Backend Development',
    doj: '08/15/17',
    profile: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: 4,
    name: 'Janney Wilson',
    email: 'janney.wilson@example.com',
    phone: '(252) 555-0126',
    position: 'Developer',
    department: 'Backend Development',
    doj: '12/04/17',
    profile: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
  {
    id: 5,
    name: 'Leslie Alexander',
    email: 'willie.jennings@example.com',
    phone: '(207) 555-0119',
    position: 'Human Resource',
    department: 'Human Resource',
    doj: '05/30/14',
    profile: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
];

const positionOptions = ['All', 'Designer', 'Developer', 'Human Resource'];

const Employes = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('All');
  const [menuOpen, setMenuOpen] = useState(null);
  const [positionDropdownOpen, setPositionDropdownOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = positionFilter === 'All' || emp.position === positionFilter;
    return matchesSearch && matchesPosition;
  });

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.emp-action-menu-container')) {
        setMenuOpen(null);
      }
      if (!event.target.closest('.emp-position-dropdown-container')) {
        setPositionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setEditModalOpen(true);
    setMenuOpen(null);
  };

  const handleSaveEdit = (updatedEmployee) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    ));
    setEditModalOpen(false);
    setEditingEmployee(null);
  };

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setEditingEmployee(null);
  };

  return (
    <div>
      <Header title="Employees" count={filteredEmployees.length} />
      <div className="menubar" style={{ marginBottom: 0 }}>
        {/* Position Dropdown */}
        <div className="emp-position-dropdown-container" style={{ position: 'relative' }}>
          <button
            className="dropdown-btn"
            onClick={() => setPositionDropdownOpen(!positionDropdownOpen)}
            style={{ minWidth: 140 }}
          >
            Position
            <span style={{ marginLeft: 8 }}>{positionFilter !== 'All' ? positionFilter : ''}</span>
            <FiChevronDown size={14} style={{ marginLeft: 8 }} />
          </button>
          {positionDropdownOpen && (
            <div className="dropdown-menu" style={{ minWidth: 160 }}>
              {positionOptions.map(option => (
                <div
                  key={option}
                  className="dropdown-item"
                  onClick={() => {
                    setPositionFilter(option);
                    setPositionDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="employees-table-container">
        <table className="employees-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Email Address</th>
              <th>Phone Number</th>
              <th>Position</th>
              <th>Department</th>
              <th>Date of Joining</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(emp => (
              <tr key={emp.id}>
                <td><img src={emp.profile} alt={emp.name} className="employees-profile-img" /></td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.position}</td>
                <td>{emp.department}</td>
                <td>{emp.doj}</td>
                <td style={{ position: 'relative', textAlign: 'center' }}>
                  <div className="emp-action-menu-container">
                    <button
                      className="action-menu-btn"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setMenuOpen(menuOpen === emp.id ? null : emp.id);
                        if (menuOpen !== emp.id) {
                          // Position the dropdown
                          const dropdown = document.querySelector('.emp-action-menu');
                          if (dropdown) {
                            dropdown.style.left = `${rect.left - 120}px`;
                            dropdown.style.top = `${rect.bottom + 5}px`;
                          }
                        }
                      }}
                    >
                      <FiMoreVertical size={16} />
                    </button>
                    {menuOpen === emp.id && (
                      <div className="emp-action-menu">
                        <div
                          className="emp-action-menu-item"
                          onClick={() => handleEdit(emp)}
                        >
                          <FiEdit size={14} /> Edit
                        </div>
                        <div
                          className="emp-action-menu-item delete"
                          onClick={() => {
                            setEmployees(prev => prev.filter(e => e.id !== emp.id));
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

      {/* Edit Form Modal */}
      <EmployeeEditForm
        employee={editingEmployee}
        isOpen={editModalOpen}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default Employes;
