import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Activity, Plus, Search } from 'lucide-react';
import LeadCard from '../components/LeadCard';
import NotesModal from '../components/NotesModal';
import AddLeadModal from '../components/AddLeadModal';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/leads/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      // Update local state without refetching everything
      setLeads(leads.map(l => l._id === id ? { ...l, status } : l));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNote = async (id, text) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/leads/${id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      const updatedLead = await res.json();
      
      setLeads(leads.map(l => l._id === id ? updatedLead : l));
      setSelectedLead(updatedLead); // Update modal view
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddNewLead = async (leadData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Optional if your backend accepts public posts, but good practice
        },
        body: JSON.stringify(leadData)
      });
      if (res.ok) {
        const newLead = await res.json();
        setLeads([newLead, ...leads]);
        setIsAddModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const genSampleData = async () => {
    try {
      await fetch('http://localhost:5000/api/leads/seed');
      fetchLeads(); // Refresh
    } catch (error) {
      console.error(error);
    }
  };

  const newLeadsCount = leads.filter(l => l.status === 'new').length;
  const convertedCount = leads.filter(l => l.status === 'converted').length;
  const username = localStorage.getItem('username') || 'Admin';

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>Loading Dashboard...</div>;
  }

  return (
    <>
      <header className="header" style={{ borderBottom: 'none', padding: '2rem', position: 'relative' }}>
        <div className="core-glow-node">
           <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#000', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={32} color="white" />
           </div>
        </div>
        <h1 style={{ fontSize: '0.8rem', opacity: 0.5, letterSpacing: '0.3em' }}>CRM / CORE</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.1em', opacity: 0.6 }}>{username}</span>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className="dashboard-container">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Total Leads</div>
            <div className="stat-value">{leads.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">New Leads</div>
            <div className="stat-value" style={{ color: 'var(--status-new-text)' }}>{newLeadsCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Converted Clients</div>
            <div className="stat-value" style={{ color: 'var(--status-converted-text)' }}>{convertedCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-title">Conversion Rate</div>
            <div className="stat-value" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {leads.length > 0 ? Math.round((convertedCount / leads.length) * 100) : 0}%
            </div>
          </div>
        </div>

        <div className="leads-header" style={{ borderBottom: 'none', marginBottom: '3rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['all', 'new', 'contacted', 'converted'].map(status => (
              <button 
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`btn ${statusFilter === status ? '' : 'btn-outline'}`}
                style={{ padding: '0.5rem 1.5rem', fontSize: '0.7rem' }}
              >
                {status}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
             <h2 style={{ fontSize: '0.9rem' }}>Database <span style={{ opacity: 0.4 }}>/ {statusFilter}</span></h2>
             
             <div style={{ display: 'flex', gap: '1rem', flexGrow: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                <div className="search-wrapper" style={{ position: 'relative', width: '100%', maxWidth: '250px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ marginBottom: 0, paddingLeft: '40px', background: 'rgba(255,255,255,0.03)', height: '40px' }}
                  />
                </div>
                
                <button className="btn" onClick={() => setIsAddModalOpen(true)} style={{ height: '40px' }}>
                  <Plus size={18} /> New
                </button>
             </div>
          </div>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No leads found matching your search or database is empty.
          </div>
        ) : (
          <div className="leads-grid">
            {filteredLeads.map(lead => (
              <LeadCard 
                key={lead._id} 
                lead={lead} 
                onUpdateStatus={handleUpdateStatus}
                onAddNote={setSelectedLead}
              />
            ))}
          </div>
        )}
      </main>
      <footer style={{ marginTop: '5rem', padding: '4rem 2rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.8, letterSpacing: '0.02em', fontWeight: 300 }}>
            Vem comigo que eu quero te mostrar de forma detalhada cada um dos meus serviços e como podemos converter seus leads em clientes fiéis.
          </p>
          <div style={{ marginTop: '2rem', fontSize: '0.6rem', opacity: 0.3, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Orbital CRM Interface © 2026
          </div>
      </footer>

      {isAddModalOpen && (
        <AddLeadModal
          onClose={() => setIsAddModalOpen(false)}
          onAddLead={handleAddNewLead}
        />
      )}

      {selectedLead && (
        <NotesModal 
          lead={selectedLead} 
          onClose={() => setSelectedLead(null)} 
          onSaveNote={handleAddNote}
        />
      )}
    </>
  );
};

export default Dashboard;
