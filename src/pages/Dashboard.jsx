import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [conferences, setConferences] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [submittingTo, setSubmittingTo] = useState(null);
  
  const [paperForm, setPaperForm] = useState({ title: '', abstractText: '', file: null });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const confRes = await api.get('/conferences/public/list');
      setConferences(confRes.data);
      
      const subRes = await api.get('/papers/my-submissions');
      setMySubmissions(subRes.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load dashboard data.');
    }
  };

  const handleSubmitPaper = async (e, conferenceId) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', paperForm.title);
      formData.append('abstractText', paperForm.abstractText);
      if (paperForm.file) {
        formData.append('file', paperForm.file);
      }

      await api.post(`/papers/${conferenceId}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
      setPaperForm({ title: '', abstractText: '', file: null });
      setSubmittingTo(null);
      fetchData(); // Refresh so the new submission shows up
      toast.success('Paper submitted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit paper. Please try again.');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 className="title-gradient">Student Dashboard</h1>
        <button 
          className="btn btn-outline"
          onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); navigate('/auth'); }}
        >
          Logout
        </button>
      </header>

      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Upcoming Conferences</h2>
        {conferences.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No conferences found or backend is not connected.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
            {conferences.map(conf => (
              <div key={conf.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3>{conf.name}</h3>
                <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem', flexGrow: 1 }}>{conf.description}</p>
                
                {submittingTo === conf.id ? (
                  <form onSubmit={(e) => handleSubmitPaper(e, conf.id)} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <input type="text" placeholder="Paper Title" className="form-input" required value={paperForm.title} onChange={e => setPaperForm({...paperForm, title: e.target.value})} />
                    <textarea placeholder="Abstract" className="form-input" required rows="3" value={paperForm.abstractText} onChange={e => setPaperForm({...paperForm, abstractText: e.target.value})}></textarea>
                    
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>Upload Document (PDF/Docx)</label>
                      <input 
                        type="file" 
                        className="form-input" 
                        accept=".pdf,.doc,.docx"
                        onChange={e => setPaperForm({...paperForm, file: e.target.files[0]})} 
                        style={{ padding: '0.5rem' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>Submit</button>
                      <button type="button" className="btn btn-outline" onClick={() => setSubmittingTo(null)}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <button onClick={() => setSubmittingTo(conf.id)} className="btn btn-primary" style={{ width: '100%' }}>Register / Submit Paper</button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--secondary)' }}>My Submissions</h2>
        {mySubmissions.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>You haven't submitted any papers yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mySubmissions.map(sub => (
              <div key={sub.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{sub.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Submitted to: {sub.conference?.name}</p>
                </div>
                <div style={{
                  padding: '0.5rem 1rem', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  background: sub.status === 'ACCEPTED' ? 'rgba(76, 175, 80, 0.2)' : sub.status === 'REJECTED' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                  color: sub.status === 'ACCEPTED' ? '#4CAF50' : sub.status === 'REJECTED' ? '#F44336' : '#FFC107'
                }}>
                  {sub.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
