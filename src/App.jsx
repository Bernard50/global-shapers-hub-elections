import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import HubOnboarding from './components/HubOnboarding';
import AdminDashboard from './components/AdminDashboard';
import VoterLogin from './components/VoterLogin';
import VotingUI from './components/VotingUI';
import AdminAccess from './components/AdminAccess';
import SuccessView from './components/SuccessView';
import { supabase, isSupabaseConfigured } from './services/supabase';
import './index.css';

function App() {
  if (!isSupabaseConfigured) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#e74c3c' }}>Configuration Error 🛡️</h1>
        <p>Your Supabase environment variables are missing or incorrect.</p>
        <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginTop: '1rem', border: '1px solid #ddd' }}>
          <strong>Action Required:</strong> Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your Vercel project settings.
        </div>
      </div>
    );
  }

  const [view, setView] = useState('landing');
  const [currentHub, setCurrentHub] = useState(null);
  const [voter, setVoter] = useState(null);
  const [targetHubId, setTargetHubId] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [loading, setLoading] = useState(false);
  const [hubName, setHubName] = useState('');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Disable old reset logic for migration
    localStorage.setItem('gs_elections_reset_done', 'true');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleCreateHub = () => setView('onboarding');
  const handleVote = () => setView('voter-login');
  const handleManageHub = () => setView('admin-access');

  const onHubComplete = async (hubData) => {
    setLoading(true);
    try {
      const { data: hub, error } = await supabase
        .from('hubs')
        .insert([{
          name: hubData.name,
          city: hubData.city,
          country: hubData.country,
          year: hubData.year,
          admin_key: hubData.adminKey
        }])
        .select()
        .single();

      if (error) throw error;

      // Also initialize an empty election row for this hub
      const { error: electionError } = await supabase
        .from('elections')
        .insert([{
          hub_id: hub.id,
          candidates: [
            { id: 1, role: 'Curator', name: '', bio: '', photo: null },
            { id: 2, role: 'Vice Curator', name: '', bio: '', photo: null },
            { id: 3, role: 'Impact Officer', name: '', bio: '', photo: null }
          ]
        }]);

      if (electionError) throw electionError;

      setCurrentHub(hub);
      setView('admin-dashboard');
    } catch (err) {
      alert('Error creating hub: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const onAdminAccess = async (hubId) => {
    setLoading(true);
    try {
      const { data: hub, error } = await supabase
        .from('hubs')
        .select('*')
        .eq('id', hubId)
        .single();

      if (error) throw error;
      setCurrentHub(hub);
      setView('admin-dashboard');
    } catch (err) {
      alert('Error accessing hub: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const onVoterLogin = (voterData, hubId, nameOfHub) => {
    setVoter(voterData);
    setTargetHubId(hubId);
    setHubName(nameOfHub);
    setView('voting');
  };

  const handleHubDeleted = () => {
    setCurrentHub(null);
    setView('landing');
  };

  return (
    <div className="App">
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      {view === 'landing' && (
        <LandingPage
          onCreateHub={handleCreateHub}
          onVote={handleVote}
          onManage={handleManageHub}
        />
      )}

      {view === 'onboarding' && (
        <HubOnboarding onComplete={onHubComplete} />
      )}

      {view === 'admin-access' && (
        <AdminAccess onAccess={onAdminAccess} onBack={() => setView('landing')} />
      )}

      {view === 'admin-dashboard' && (
        <AdminDashboard hub={currentHub} onBack={() => setView('landing')} onDelete={handleHubDeleted} />
      )}

      {view === 'voter-login' && (
        <VoterLogin onLogin={onVoterLogin} onBack={() => setView('landing')} />
      )}

      {view === 'voting' && (
        <VotingUI voter={voter} hubId={targetHubId} onVoteComplete={() => setView('success')} />
      )}

      {view === 'success' && (
        <SuccessView hubName={hubName} onExit={() => setView('landing')} />
      )}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Processing...</p>
        </div>
      )}
    </div>
  );
}

export default App;
