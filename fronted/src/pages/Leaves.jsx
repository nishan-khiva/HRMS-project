import React, { useState } from 'react';
import LeavesTable from '../components/Leaves/LeavesTable';
import LeaveCalendar from '../components/Leaves/LeaveCalendar';
import '../components/Leaves/LeavesTable.css';
import '../components/Leaves/LeaveCalendar.css';
import Header from '../components/Header';

const initialLeaves = [
  {
    id: 1,
    name: 'Cody Fisher',
    designation: 'Senior Backend Developer',
    profile: 'https://randomuser.me/api/portraits/men/3.jpg',
    date: '8/09/24',
    reason: 'Visiting House',
    status: 'Approved',
    docs: '',
  },
];

const Leaves = () => {
  const [leaves, setLeaves] = useState(initialLeaves);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusChange = (id, newStatus) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  const handleDelete = (id) => {
    setLeaves(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div>
      <Header title="Leaves" count={leaves.length} />
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: 2 }}>
          <LeavesTable
            leaves={leaves}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        <div style={{ flex: 1, minWidth: 340 }}>
          <LeaveCalendar />
        </div>
      </div>
    </div>
  );
};

export default Leaves;
