import React, { useState } from 'react';
import { Mail, Clock, MessageSquarePlus } from 'lucide-react';

const LeadCard = ({ lead, onUpdateStatus, onAddNote }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    setIsUpdating(true);
    await onUpdateStatus(lead._id, e.target.value);
    setIsUpdating(false);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'new': return 'status-new';
      case 'contacted': return 'status-contacted';
      case 'converted': return 'status-converted';
      default: return 'status-new';
    }
  };

  return (
    <div className="lead-card">
      <div className="lead-header">
        <div>
          <div className="lead-name">{lead.name}</div>
          <div className="lead-email"><Mail size={14} /> {lead.email}</div>
        </div>
        <span className={`status-badge ${getStatusClass(lead.status)}`}>
          {lead.status}
        </span>
      </div>
      
      <div>
        <div className="lead-source">Source: {lead.source}</div>
        <div className="lead-email" style={{ marginTop: '0.5rem' }}>
          <Clock size={14} /> 
          {new Date(lead.createdAt).toLocaleDateString()}
        </div>
      </div>

      <div className="lead-actions">
        <select 
          value={lead.status} 
          onChange={handleStatusChange} 
          disabled={isUpdating}
          style={{ marginBottom: 0, padding: '0.4rem' }}
        >
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="converted">Converted</option>
        </select>
        
        <button 
          className="btn btn-outline" 
          onClick={() => onAddNote(lead)}
          style={{ flexGrow: 1, justifyContent: 'center' }}
        >
          <MessageSquarePlus size={16} /> Notes ({lead.notes?.length || 0})
        </button>
      </div>
    </div>
  );
};

export default LeadCard;
