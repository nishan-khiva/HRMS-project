import React, { useState } from 'react';
import { MdOutlineEmail } from 'react-icons/md';
import { FaBell } from 'react-icons/fa';
import { HiOutlineUser, HiOutlineChevronDown } from 'react-icons/hi';
import { FiChevronDown } from 'react-icons/fi';
import '../components/Condidates/Condidates.css';

import CandidatesTable from '../components/Condidates/CandidatesTable';
import CandidateForm from '../components/Condidates/CandidateForm';

// Initial dummy data
const initialCandidates = [
  {
    id: 1,
    name: 'Jacob William',
    email: 'jacob.william@example.com',
    phone: '(252) 555-0111',
    position: 'Senior Developer',
    status: 'New',
    experience: '1+',
  },
  {
    id: 2,
    name: 'Guy Hawkins',
    email: 'kenzi.lawson@example.com',
    phone: '(907) 555-0101',
    position: 'Human Resource Intern',
    status: 'New',
    experience: '0',
  },
  {
    id: 3,
    name: 'Arlene McCoy',
    email: 'arlene.mccoy@example.com',
    phone: '(302) 555-0107',
    position: 'Full Time Designer',
    status: 'Selected',
    experience: '2',
  },
  {
    id: 4,
    name: 'Leslie Alexander',
    email: 'willie.jennings@example.com',
    phone: '(207) 555-0119',
    position: 'Full Time Developer',
    status: 'Rejected',
    experience: '0',
  },
];

const Candidates = () => {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [formOpen, setFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [positionFilter, setPositionFilter] = useState('All');
  const [feedback, setFeedback] = useState({ show: false, message: '', type: '' });
  const [newDropdownOpen, setNewDropdownOpen] = useState(false);
  const [positionDropdownOpen, setPositionDropdownOpen] = useState(false);

  // Filter options
  const statusOptions = ['All', 'New', 'Scheduled', 'Ongoing', 'Selected', 'Rejected'];
  const positionOptions = ['All', 'HR', 'Developer', 'Human Resource', 'Designer', 'Manager'];

  // Filter candidates based on search, status, and position
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || candidate.status === statusFilter;
    const matchesPosition = positionFilter === 'All' || candidate.position.toLowerCase().includes(positionFilter.toLowerCase());
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const showFeedback = (message, type = 'success') => {
    setFeedback({ show: true, message, type });
    setTimeout(() => setFeedback({ show: false, message: '', type: '' }), 3000);
  };

  const handleAdd = (data) => {
    const newCandidate = {
      ...data,
      id: Date.now(),
      status: 'New',
      experience: data.experience || '0'
    };
    setCandidates(prev => [...prev, newCandidate]);
    showFeedback('Candidate added successfully!');
  };

  const handleDelete = (candidate) => {
    if (window.confirm(`Are you sure you want to delete ${candidate.name}?`)) {
      setCandidates(prev => prev.filter(c => c.id !== candidate.id));
      showFeedback('Candidate deleted successfully!');
    }
  };

  const handleStatusChange = (candidateId, newStatus) => {
    setCandidates(prev => 
      prev.map(c => c.id === candidateId ? { ...c, status: newStatus } : c)
    );
    showFeedback('Status updated successfully!');
  };

  const handleDownload = (candidate) => {
    showFeedback(`Downloading resume for ${candidate.name}...`, 'info');
    // Simulate download
    setTimeout(() => {
      showFeedback('Resume downloaded successfully!');
    }, 1000);
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setNewDropdownOpen(false);
        setPositionDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      {/* Feedback Toast */}
      {feedback.show && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          padding: '12px 24px',
          borderRadius: 8,
          color: '#fff',
          background: feedback.type === 'error' ? '#f44336' : feedback.type === 'info' ? '#2196f3' : '#4caf50',
          zIndex: 1001,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          animation: 'slideIn 0.3s ease'
        }}>
          {feedback.message}
        </div>
      )}

      <div className='header'>
        <h2>Candidates ({filteredCandidates.length})</h2>
        <div className='header-icons'>
          <MdOutlineEmail />
          <FaBell />
          <HiOutlineUser />
          <HiOutlineChevronDown />
        </div>
      </div>

      <div className="menubar">
        {/* New Dropdown */}
        <div className="dropdown-container" style={{ position: 'relative' }}>
          <button 
            className="dropdown-btn"
            onClick={() => setNewDropdownOpen(!newDropdownOpen)}
          >
            New
            <FiChevronDown size={14} />
          </button>
          {newDropdownOpen && (
            <div className="dropdown-menu">
              {statusOptions.map(option => (
                <div 
                  key={option}
                  className="dropdown-item"
                  onClick={() => {
                    setStatusFilter(option);
                    setNewDropdownOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Position Dropdown */}
        <div className="dropdown-container" style={{ position: 'relative' }}>
          <button 
            className="dropdown-btn"
            onClick={() => setPositionDropdownOpen(!positionDropdownOpen)}
          >
            Position
            <FiChevronDown size={14} />
          </button>
          {positionDropdownOpen && (
            <div className="dropdown-menu">
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

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="search-input"
          style={{ minWidth: 220 }}
        />

        {/* Add Candidate Button */}
        <button 
          onClick={() => setFormOpen(true)}
          className="add-btn"
        >
          <span style={{ fontSize: '18px' }}>+</span> Add Candidate
        </button>
      </div>

      {/* Active Filters Display */}
      {(statusFilter !== 'All' || positionFilter !== 'All') && (
        <div style={{ 
          display: 'flex', 
          gap: 8, 
          marginBottom: 16,
          flexWrap: 'wrap'
        }}>
          {statusFilter !== 'All' && (
            <span className="filter-tag">
              Status: {statusFilter}
              <button 
                onClick={() => setStatusFilter('All')}
              >
                ×
              </button>
            </span>
          )}
          {positionFilter !== 'All' && (
            <span className="filter-tag position">
              Position: {positionFilter}
              <button 
                onClick={() => setPositionFilter('All')}
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}

      <CandidatesTable 
        candidates={filteredCandidates}
        onDelete={handleDelete} 
        onDownload={handleDownload}
        onStatusChange={handleStatusChange}
      />
      
      <CandidateForm 
        open={formOpen} 
        onClose={() => setFormOpen(false)} 
        onSave={handleAdd} 
      />
    </div>
  );
};

export default Candidates;
