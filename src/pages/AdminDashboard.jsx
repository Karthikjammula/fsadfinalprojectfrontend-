import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '../services/api';

const AdminDashboard = () => {
  const [conferences, setConferences] = useState([]);
  const [activeTab, setActiveTab] = useState('conferences');
  const [selectedConferenceId, setSelectedConferenceId] = useState('');
  
  // States for sub-data
  const [submissions, setSubmissions] = useState([]);
  const [schedules, setSchedules] = useState([]);
  
  // Forms
  const [confForm, setConfForm] = useState({ name: '', description: '', startDate: '', endDate: '', location: '' });
  const [scheduleForm, setScheduleForm] = useState({ title: '', speaker: '', startTime: '', endTime: '' });

  const navigate = useNavigate();

  useEffect(() => {
    fetchConferences();
  }, []);

  const fetchConferences = async () => {
    try {
      const res = await api.get('/conferences/public/list');
      setConferences(res.data);
      if (res.data.length > 0 && !selectedConferenceId) {
          setSelectedConferenceId(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch conferences');
    }
  };

  const fetchSubmissions = async (id) => {
    try {
      const res = await api.get(`/papers/conference/${id}`);
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch submissions');
    }
  };

  const fetchSchedules = async (id) => {
    try {
      const res = await api.get(`/schedules/conference/${id}`);
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch schedules');
    }
  }

  useEffect(() => {
    if (selectedConferenceId) {
      fetchSubmissions(selectedConferenceId);
      fetchSchedules(selectedConferenceId);
    }
  }, [selectedConferenceId]);

  const handleCreateConference = async (e) => {
    e.preventDefault();
    try {
      await api.post('/conferences', confForm);
      setConfForm({ name: '', description: '', startDate: '', endDate: '', location: '' });
      fetchConferences();
      toast.success('Conference created successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create conference');
    }
  };

  const handleDeleteConference = async (id) => {
    if(!window.confirm("Delete this conference?")) return;
    try {
      await api.delete(`/conferences/${id}`);
      fetchConferences();
      toast.success('Conference deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete conference');
    }
  };

  const handleUpdateSubmission = async (id, status) => {
    try {
      await api.put(`/papers/${id}/status?status=${status}`);
      fetchSubmissions(selectedConferenceId);
      toast.success(`Submission ${status.toLowerCase()}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update submission status');
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/schedules/${selectedConferenceId}`, scheduleForm);
      setScheduleForm({ title: '', speaker: '', startTime: '', endTime: '' });
      fetchSchedules(selectedConferenceId);
      toast.success('Schedule added successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add schedule');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--text)', margin: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ background: 'var(--accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Admin Control Center
          </span>
        </h1>
        <button className="btn" style={{ background: 'transparent', border: '1px solid var(--border)' }} onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button className={`btn ${activeTab === 'conferences' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('conferences')}>Conferences</button>
        <button className={`btn ${activeTab === 'submissions' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('submissions')}>Submissions</button>
        <button className={`btn ${activeTab === 'schedules' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('schedules')}>Schedules</button>
        <button className={`btn ${activeTab === 'analytics' ? 'btn-primary' : ''}`} onClick={() => setActiveTab('analytics')}>Analytics</button>
      </div>

      {/* CONFERENCES TAB */}
      {activeTab === 'conferences' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
          <div className="glass-card">
            <h3>Create Conference</h3>
            <form onSubmit={handleCreateConference} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <input type="text" placeholder="Name" className="form-input" value={confForm.name} onChange={e => setConfForm({...confForm, name: e.target.value})} required />
              <textarea placeholder="Description" className="form-input" value={confForm.description} onChange={e => setConfForm({...confForm, description: e.target.value})} required rows="3"></textarea>
              <input type="date" className="form-input" value={confForm.startDate} onChange={e => setConfForm({...confForm, startDate: e.target.value})} required />
              <input type="date" className="form-input" value={confForm.endDate} onChange={e => setConfForm({...confForm, endDate: e.target.value})} required />
              <input type="text" placeholder="Location" className="form-input" value={confForm.location} onChange={e => setConfForm({...confForm, location: e.target.value})} required />
              <button type="submit" className="btn btn-primary">Add Conference</button>
            </form>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {conferences.length === 0 ? <p>No conferences exist.</p> : null}
            {conferences.map(c => (
              <div key={c.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{c.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{c.description}</p>
                  <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {c.location} | {new Date(c.startDate).toLocaleDateString()} - {new Date(c.endDate).toLocaleDateString()}
                  </span>
                </div>
                <button onClick={() => handleDeleteConference(c.id)} className="btn" style={{ background: '#ff4444', color: 'white', border: 'none', padding: '0.5rem 1rem' }}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SHARED TOP BAR FOR SUBMISSIONS, SCHEDULES, AND ANALYTICS */}
      {(activeTab === 'submissions' || activeTab === 'schedules' || activeTab === 'analytics') && (
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Target Conference:</span>
          <select className="form-input" style={{ width: 'auto' }} value={selectedConferenceId} onChange={e => setSelectedConferenceId(e.target.value)}>
             {conferences.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      )}

      {/* SUBMISSIONS TAB */}
      {activeTab === 'submissions' && selectedConferenceId && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {submissions.length === 0 ? <div className="glass-card">No submissions found for this conference.</div> : null}
          {submissions.map(s => (
            <div key={s.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-muted)' }}>Author: {s.author?.name || 'Unknown'}</p>
                <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginTop: '1rem' }}>
                  <p style={{ fontSize: '0.9rem' }}>{s.abstractText}</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', marginLeft: '2rem' }}>
                <span style={{ 
                  padding: '0.5rem 1rem', 
                  borderRadius: '20px', 
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  background: s.status === 'ACCEPTED' ? 'rgba(76, 175, 80, 0.2)' : s.status === 'REJECTED' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                  color: s.status === 'ACCEPTED' ? '#4CAF50' : s.status === 'REJECTED' ? '#F44336' : '#FFC107'
                }}>
                  {s.status}
                </span>
                {s.status === 'PENDING' && (
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button onClick={() => handleUpdateSubmission(s.id, 'ACCEPTED')} className="btn" style={{ background: '#4CAF50', border: 'none' }}>Accept</button>
                    <button onClick={() => handleUpdateSubmission(s.id, 'REJECTED')} className="btn" style={{ background: '#F44336', border: 'none' }}>Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SCHEDULES TAB */}
      {activeTab === 'schedules' && selectedConferenceId && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
          <div className="glass-card">
            <h3>Add Session</h3>
            <form onSubmit={handleCreateSchedule} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              <input type="text" placeholder="Session Title" className="form-input" value={scheduleForm.title} onChange={e => setScheduleForm({...scheduleForm, title: e.target.value})} required />
              <input type="text" placeholder="Speaker Name" className="form-input" value={scheduleForm.speaker} onChange={e => setScheduleForm({...scheduleForm, speaker: e.target.value})} required />
              <input type="datetime-local" className="form-input" value={scheduleForm.startTime} onChange={e => setScheduleForm({...scheduleForm, startTime: e.target.value})} required />
              <input type="datetime-local" className="form-input" value={scheduleForm.endTime} onChange={e => setScheduleForm({...scheduleForm, endTime: e.target.value})} required />
              <button type="submit" className="btn btn-primary">Schedule Session</button>
            </form>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {schedules.length === 0 ? <div className="glass-card">No sessions scheduled yet.</div> : null}
            {schedules.map(s => (
              <div key={s.id} className="glass-card">
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent)' }}>{s.title}</h4>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>Speaker: {s.speaker}</p>
                <div style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.8 }}>
                  Time: {new Date(s.startTime).toLocaleString()} - {new Date(s.endTime).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && selectedConferenceId && (
        <div className="glass-card" style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ marginBottom: '1rem' }}>Submission Status Distribution</h3>
          {submissions.length === 0 ? (
            <p>No submissions to analyze.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Pending', value: submissions.filter(s => s.status === 'PENDING').length },
                    { name: 'Accepted', value: submissions.filter(s => s.status === 'ACCEPTED').length },
                    { name: 'Rejected', value: submissions.filter(s => s.status === 'REJECTED').length }
                  ].filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {
                    [
                      { name: 'Pending', value: submissions.filter(s => s.status === 'PENDING').length, color: '#FFC107' },
                      { name: 'Accepted', value: submissions.filter(s => s.status === 'ACCEPTED').length, color: '#4CAF50' },
                      { name: 'Rejected', value: submissions.filter(s => s.status === 'REJECTED').length, color: '#F44336' }
                    ].filter(d => d.value > 0).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))
                  }
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
