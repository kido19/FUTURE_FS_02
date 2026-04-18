import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

const NotesModal = ({ lead, onClose, onSaveNote }) => {
  const [newNote, setNewNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!lead) return null;

  const handleSave = async () => {
    if (!newNote.trim()) return;
    setIsSaving(true);
    await onSaveNote(lead._id, newNote);
    setNewNote('');
    setIsSaving(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Notes for {lead.name}</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="notes-list">
          {lead.notes && lead.notes.length > 0 ? (
            lead.notes.map((note, index) => (
              <div key={index} className="note-item">
                <div className="note-date">
                  {new Date(note.createdAt).toLocaleString()}
                </div>
                <div>{note.text}</div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              No notes yet. Start the conversation!
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <textarea 
            placeholder="Add a new follow-up note..." 
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            style={{ marginBottom: 0, resize: 'vertical', minHeight: '60px' }}
          />
          <button 
            className="btn" 
            onClick={handleSave} 
            disabled={isSaving || !newNote.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotesModal;
