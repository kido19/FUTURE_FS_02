import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';

const AddLeadModal = ({ onClose, onAddLead }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    source: 'Manual Entry'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onAddLead(formData);
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h3>Add New Lead</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Lead Name</label>
            <input 
              type="text" 
              placeholder="e.g. John Smith" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
            <input 
              type="email" 
              placeholder="john@example.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Lead Source</label>
            <input 
              type="text" 
              placeholder="e.g. Cold Call, LinkedIn..." 
              value={formData.source}
              onChange={(e) => setFormData({...formData, source: e.target.value})}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn" 
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={isSubmitting}
          >
            <UserPlus size={18} /> {isSubmitting ? 'Adding...' : 'Add Lead'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;
