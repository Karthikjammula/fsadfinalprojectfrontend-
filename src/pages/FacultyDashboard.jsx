import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await api.get('/faculty/submissions');
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load submissions.');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 className="title-gradient">Faculty Dashboard</h1>
        <button 
          className="btn btn-outline"
          onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('role'); navigate('/auth'); }}
        >
          Logout
        </button>
      </header>

      <section>
        <h2 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Student Submissions</h2>
        {submissions.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>No student submissions found.</p>
          </div>
        ) : (
          <div className="glass-card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem' }}>Student Name</th>
                  <th style={{ padding: '1rem' }}>ID Number</th>
                  <th style={{ padding: '1rem' }}>Branch</th>
                  <th style={{ padding: '1rem' }}>Paper Title</th>
                  <th style={{ padding: '1rem' }}>Document</th>
                  <th style={{ padding: '1rem' }}>Date Submitted</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map(sub => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem' }}>{sub.studentName}</td>
                    <td style={{ padding: '1rem' }}>{sub.idNumber}</td>
                    <td style={{ padding: '1rem' }}>{sub.branch}</td>
                    <td style={{ padding: '1rem' }}>{sub.title}</td>
                    <td style={{ padding: '1rem' }}>
                      {sub.fileUrl ? (
                        <a href={`http://localhost:8080${sub.fileUrl}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>
                          View PDF
                        </a>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>No File</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem' }}>{new Date(sub.submissionDate).toLocaleString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '20px', 
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        background: sub.status === 'ACCEPTED' ? 'rgba(76, 175, 80, 0.2)' : sub.status === 'REJECTED' ? 'rgba(244, 67, 54, 0.2)' : 'rgba(255, 193, 7, 0.2)',
                        color: sub.status === 'ACCEPTED' ? '#4CAF50' : sub.status === 'REJECTED' ? '#F44336' : '#FFC107'
                      }}>
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default FacultyDashboard;
