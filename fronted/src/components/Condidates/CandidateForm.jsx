import React, { useState } from 'react';
import './CandidateForm.css';

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
    <div className="candidate-form-overlay">
      <form onSubmit={handleSubmit} className="candidate-form">
        <div className="candidate-form-header">
          <span>Add New Candidate</span>
          <button type="button" onClick={onClose} className="candidate-form-close-btn">&times;</button>
        </div>
        <div className="candidate-form-content">
          <div className="candidate-form-fields">
            <div className="candidate-form-field">
              <label>Full Name*</label>
              <input name="name" value={form.name} onChange={handleChange} />
            </div>
            <div className="candidate-form-field">
              <label>Email Address*</label>
              <input name="email" value={form.email} onChange={handleChange} type="email" />
            </div>
            <div className="candidate-form-field">
              <label>Phone Number*</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="candidate-form-field">
              <label>Position*</label>
              <input name="position" value={form.position} onChange={handleChange} />
            </div>
            <div className="candidate-form-field">
              <label>Experience*</label>
              <input name="experience" value={form.experience} onChange={handleChange} />
            </div>
            <div className="candidate-form-field">
              <label>Resume*</label>
              <input name="resume" type="file" onChange={handleChange} />
            </div>
          </div>
          <div className="candidate-form-declaration">
            <label>
              <input name="declaration" type="checkbox" checked={form.declaration} onChange={handleChange} />
              <span>I hereby declare that the above information is true to the best of my knowledge and belief.</span>
            </label>
          </div>
          {error && <div className="candidate-form-error">{error}</div>}
          <div className="candidate-form-actions">
            <button type="button" onClick={onClose} className="candidate-form-btn candidate-form-btn-cancel">Cancel</button>
            <button type="submit" className="candidate-form-btn candidate-form-btn-save" disabled={!form.declaration}>Save</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CandidateForm; 