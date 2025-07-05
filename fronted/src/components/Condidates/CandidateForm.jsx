import React, { useState } from 'react';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  position: '',
  experience: '',
  resume: null,
  declaration: false,
};

const CandidateForm = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!form.name || !form.email || !form.phone || !form.position || !form.experience || !form.resume || !form.declaration) {
      setError('Please fill all required fields and accept the declaration.');
      return;
    }
    setError('');
    onSave && onSave(form);
    setForm(initialForm);
    onClose && onClose();
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 12, width: 600, maxWidth: '95vw', boxShadow: '0 2px 16px #888', padding: 32, position: 'relative' }}>
        <div style={{ background: '#4B1979', color: '#fff', borderRadius: '12px 12px 0 0', padding: 16, margin: '-32px -32px 24px -32px', fontSize: 20, fontWeight: 600 }}>Add New Candidate
          <button type="button" onClick={onClose} style={{ float: 'right', background: 'none', border: 'none', color: '#fff', fontSize: 24, cursor: 'pointer' }}>&times;</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: '1 1 45%' }}>
            <label>Full Name*</label>
            <input name="name" value={form.name} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }} />
          </div>
          <div style={{ flex: '1 1 45%' }}>
            <label>Email Address*</label>
            <input name="email" value={form.email} onChange={handleChange} type="email" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }} />
          </div>
          <div style={{ flex: '1 1 45%' }}>
            <label>Phone Number*</label>
            <input name="phone" value={form.phone} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }} />
          </div>
          <div style={{ flex: '1 1 45%' }}>
            <label>Position*</label>
            <input name="position" value={form.position} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }} />
          </div>
          <div style={{ flex: '1 1 45%' }}>
            <label>Experience*</label>
            <input name="experience" value={form.experience} onChange={handleChange} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }} />
          </div>
          <div style={{ flex: '1 1 45%' }}>
            <label>Resume*</label>
            <input name="resume" type="file" onChange={handleChange} style={{ width: '100%' }} />
          </div>
        </div>
        <div style={{ margin: '24px 0 12px 0' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input name="declaration" type="checkbox" checked={form.declaration} onChange={handleChange} />
            I hereby declare that the above information is true to the best of my knowledge and belief
          </label>
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button type="button" onClick={onClose} style={{ padding: '8px 24px', borderRadius: 8, border: '1px solid #ccc', background: '#eee', cursor: 'pointer' }}>Cancel</button>
          <button type="submit" style={{ padding: '8px 24px', borderRadius: 8, border: 'none', background: '#4B1979', color: '#fff', cursor: 'pointer' }} disabled={!form.declaration}>Save</button>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm; 