import React, { useState } from 'react';
import { FiDownload, FiTrash2, FiMoreVertical } from 'react-icons/fi';

const statusOptions = ['New', 'Selected', 'Rejected'];

const getStatusColor = (status) => {
  switch (status) {
    case 'New': return '#2196f3';
    case 'Selected': return '#4caf50';
    case 'Rejected': return '#f44336';
    default: return '#757575';
  }
};

const CandidatesTable = ({ candidates = [], onEdit, onDelete, onDownload, onStatusChange }) => {
  const [menuOpen, setMenuOpen] = useState(null);

  const handleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.action-menu-container')) {
        setMenuOpen(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStatusChange = (candidateId, newStatus) => {
    onStatusChange && onStatusChange(candidateId, newStatus);
    setMenuOpen(null);
  };

  if (candidates.length === 0) {
    return (
      <div style={{ 
        background: '#fff', 
        borderRadius: 12, 
        boxShadow: '0 2px 8px #eee', 
        padding: 48, 
        textAlign: 'center',
        color: '#666'
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
        <h3>No candidates found</h3>
        <p>Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #eee' }}>
      <div className="table-container">
        <table className="candidates-table">
          <thead>
            <tr style={{ background: '#4B1979', color: '#fff' }}>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600 }}>Sr no.</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600 }}>Candidates Name</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600 }}>Email Address</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600 }}>Phone Number</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600 }}>Position</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '16px 12px', textAlign: 'left', fontWeight: 600 }}>Experience</th>
              <th style={{ padding: '16px 12px', textAlign: 'center', fontWeight: 600 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, idx) => (
              <tr key={candidate.id} style={{ 
                borderBottom: '1px solid #eee',
                transition: 'background-color 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td style={{ padding: '16px 12px', color: '#666' }}>{String(idx + 1).padStart(2, '0')}</td>
                <td style={{ padding: '16px 12px', fontWeight: 500 }}>{candidate.name}</td>
                <td style={{ padding: '16px 12px', color: '#666' }}>{candidate.email}</td>
                <td style={{ padding: '16px 12px', color: '#666' }}>{candidate.phone}</td>
                <td style={{ padding: '16px 12px', color: '#666' }}>{candidate.position}</td>
                <td style={{ padding: '16px 12px' }}>
                  <select 
                    value={candidate.status} 
                    onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                    style={{ 
                      borderRadius: 20, 
                      padding: '4px 12px', 
                      border: '1px solid #ddd',
                      background: '#fff',
                      color: getStatusColor(candidate.status),
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    {statusOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </td>
                <td style={{ padding: '16px 12px', color: '#666' }}>
                  {candidate.experience} {candidate.experience === '0' ? 'years' : candidate.experience === '1+' ? 'years' : 'years'}
                </td>
                <td style={{ padding: '16px 12px', position: 'relative', textAlign: 'center' }}>
                  <div className="action-menu-container">
                    <button 
                      className="action-menu-btn"
                      onClick={() => handleMenu(candidate.id)} 
                    >
                      <FiMoreVertical size={16} />
                    </button>
                                    {menuOpen === candidate.id && (
                    <div className="action-menu">
                      <div 
                        className="action-menu-item"
                        onClick={() => {
                          onDownload && onDownload(candidate);
                          setMenuOpen(null);
                        }}
                      >
                        <FiDownload size={14} />
                        Download Resume
                      </div>
                      <div 
                        className="action-menu-item delete"
                        onClick={() => {
                          onDelete && onDelete(candidate);
                          setMenuOpen(null);
                        }}
                      >
                        <FiTrash2 size={14} />
                        Delete Candidate
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

export default CandidatesTable; 