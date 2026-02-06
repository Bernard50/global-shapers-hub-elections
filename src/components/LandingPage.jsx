import React from 'react';
import './LandingPage.css';

const LandingPage = ({ onCreateHub, onVote, onManage }) => {
  return (
    <div className="landing-page">
      <header className="hero">
        <div className="container">
          <nav className="nav">
            <div className="logo">GLOBAL SHAPERS HUB <span>ELECTIONS</span></div>
          </nav>
          <div className="hero-content">
            <h1>Transparent, Fair, Hub-Specific Elections</h1>
            <p>
              A platform built for Global Shapers values: integrity, accountability, inclusion, and impact.
              Empowering hubs worldwide to lead with confidence.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={onCreateHub}>Create Hub Election</button>
              <button className="btn btn-primary" onClick={onVote}>Vote in an Election</button>
              <button className="btn btn-outline" onClick={onManage}>Manage Hub</button>
            </div>
          </div>
        </div>
      </header>

      <section className="features">
        <div className="container">
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Integrity</h3>
              <p>Secure, one-time voting tokens ensure every voice is heard once and fairly.</p>
            </div>
            <div className="feature-card">
              <h3>Accountability</h3>
              <p>Transparent result dashboards for hub admins and community trust.</p>
            </div>
            <div className="feature-card">
              <h3>Inclusion</h3>
              <p>Designed for every Global Shaper hub, accessible from any device.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Global Shapers Hub Elections platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
