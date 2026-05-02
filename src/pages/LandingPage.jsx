import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Calendar, CloudUpload, Users, Star } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="container">
      <nav className="navbar animate-fade-in">
        <div className="nav-brand">
          <BookOpen color="var(--secondary)" size={32} />
          <span style={{ color: 'white' }}>Scholarly</span>
          <span className="title-gradient">Sync</span>
        </div>
        <div>
          <Link to="/auth" className="btn btn-outline" style={{ marginRight: '1rem' }}>Login</Link>
          <Link to="/auth" className="btn btn-primary">Register</Link>
          <Link to="/admin" className="btn btn-primary">Admin</Link>

        </div>
      </nav>

      <main style={{ marginTop: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="animate-fade-in">

        {/* Hero Section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '2rem', flexWrap: 'wrap' }}>

          {/* Left Text */}
          <div style={{ flex: '1 1 500px', maxWidth: '600px' }}>
            <h1 style={{ fontSize: '4.5rem', fontWeight: '700', lineHeight: 1.1, marginBottom: '1.5rem', color: 'white' }}>
              Elevate Your<br />
              Academic <br />
              <span className="title-gradient">Conferences</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
              A unified, seamless platform to submit papers, schedule sessions, and manage your entire conference experience with unparalleled ease.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/auth" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                Get Started <ArrowRight size={20} />
              </Link>
              <Link to="/auth" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
                <Calendar size={20} /> View Schedule
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center' }}>
            <img src="/hero-illustration.png" alt="Hero Illustration" style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', filter: 'drop-shadow(0 0 40px rgba(0, 229, 255, 0.2))' }} />
          </div>
        </div>

        {/* Feature Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '4rem', width: '100%' }}>

          <div className="glass-card" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '1.5rem' }}>
            <div className="icon-box" style={{ background: 'rgba(0, 229, 255, 0.1)', borderColor: 'rgba(0, 229, 255, 0.3)' }}>
              <CloudUpload color="#00E5FF" size={28} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>Submit Papers</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Easily submit your academic papers and track the review progress in real-time.</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'var(--text-muted)' }}>
                <ArrowRight size={16} />
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '1.5rem' }}>
            <div className="icon-box" style={{ background: 'rgba(179, 136, 255, 0.1)', borderColor: 'rgba(179, 136, 255, 0.3)' }}>
              <Users color="#B388FF" size={28} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>Peer Reviews</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>A streamlined workflow for reviewers to evaluate and provide feedback.</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'var(--text-muted)' }}>
                <ArrowRight size={16} />
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '1.5rem' }}>
            <div className="icon-box" style={{ background: 'rgba(79, 70, 229, 0.1)', borderColor: 'rgba(79, 70, 229, 0.3)' }}>
              <Calendar color="#4F46E5" size={28} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'white' }}>Dynamic Schedule</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Stay updated with real-time conference schedules and sessions.</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'var(--text-muted)' }}>
                <ArrowRight size={16} />
              </div>
            </div>
          </div>

        </div>

        {/* Footer Text */}
        <div style={{ marginTop: '4rem', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '12px', width: '100%', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
          <Star color="var(--secondary)" size={24} />
          <span style={{ color: 'var(--text-main)', fontSize: '1.125rem' }}>
            Empowering Academia. <span style={{ color: 'var(--accent)' }}>Connecting Minds.</span> Advancing Knowledge.
          </span>
        </div>

      </main>
    </div>
  );
};

export default LandingPage;


