import React from 'react';

const LeaveCalendar = () => {
  return (
    <div className="leave-calendar-container">
      <div style={{ background: '#4B1979', color: '#fff', borderRadius: '8px 8px 0 0', padding: 12, fontWeight: 600 }}>
        Leave Calendar
      </div>
      <div style={{ padding: 16, minHeight: 200, textAlign: 'center' }}>
        {/* Placeholder for calendar */}
        <span style={{ color: '#888' }}>[Calendar Here]</span>
      </div>
    </div>
  );
};

export default LeaveCalendar; 