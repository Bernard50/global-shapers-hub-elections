import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import ResultsView from './ResultsView';
import './AdminDashboard.css';
import './ResultsView.css';

const AdminDashboard = ({ hub, onBack, onDelete }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [candidates, setCandidates] = useState([]);
    const [voters, setVoters] = useState([]);
    const [votesCount, setVotesCount] = useState(0);
    const [newVoter, setNewVoter] = useState({ name: '', memberId: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [hub.id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Candidates
            const { data: election, error: electError } = await supabase.from('elections').select('candidates').eq('hub_id', hub.id).single();
            if (election) setCandidates(election.candidates);
            if (electError && electError.code !== 'PGRST116') throw electError; // Ignore "no rows found" if it's a new hub

            // Fetch Voters
            const { data: votersList, error: vError } = await supabase.from('voters').select('*').eq('hub_id', hub.id);
            if (votersList) setVoters(votersList);
            if (vError) throw vError;

            // Fetch Votes Count
            const { count, error: countError } = await supabase.from('votes').select('*', { count: 'exact', head: true }).eq('hub_id', hub.id);
            if (countError) throw countError;
            setVotesCount(count || 0);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Auto-save candidates to Supabase when they change
    const [isSaving, setIsSaving] = useState(false);
    useEffect(() => {
        if (candidates.length > 0 && !loading) {
            const timer = setTimeout(async () => {
                setIsSaving(true);
                await supabase
                    .from('elections')
                    .update({ candidates })
                    .eq('hub_id', hub.id);
                setIsSaving(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [candidates, hub.id, loading]);

    const addCandidate = (role) => {
        setCandidates([...candidates, { id: Date.now(), role, name: '', bio: '', photo: null }]);
    };

    const handlePhotoUpload = (candidateId, file) => {
        if (!file) return;

        if (file.size > 1024 * 1024) {
            alert('Image size must be less than 1MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const next = [...candidates];
            const item = next.find(i => i.id === candidateId);
            if (item) {
                item.photo = reader.result;
                setCandidates(next);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleVoterAdd = async () => {
        if (newVoter.name && newVoter.memberId) {
            const token = `GS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
            const voterData = {
                hub_id: hub.id,
                name: newVoter.name,
                member_id: newVoter.memberId,
                token: token,
                used: false
            };

            const { data, error } = await supabase.from('voters').insert([voterData]).select().single();
            if (error) {
                alert('Error adding voter: ' + error.message);
            } else if (data) {
                setVoters([...voters, data]);
                setNewVoter({ name: '', memberId: '' });
            }
        }
    };

    const [bulkText, setBulkText] = useState('');
    const [showBulk, setShowBulk] = useState(false);

    const handleBulkAdd = async () => {
        const lines = bulkText.split('\n').filter(l => l.trim());
        const newVoters = lines.map(line => {
            const [name, memberId] = line.split(',').map(s => s.trim());
            return {
                hub_id: hub.id,
                name: name,
                member_id: memberId || `ID-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
                token: `GS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                used: false
            };
        }).filter(v => v.name);

        if (newVoters.length === 0) return;

        const { data, error } = await supabase.from('voters').insert(newVoters).select();
        if (error) {
            alert('Error adding voters: ' + error.message);
        } else {
            setVoters([...voters, ...data]);
            setBulkText('');
            setShowBulk(false);
        }
    };

    return (
        <div className="admin-dashboard">
            <nav className="admin-nav">
                <div className="container flex-between">
                    <div className="admin-info">
                        <strong>{hub.name}</strong> <span>{hub.year} Election</span>
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={onBack}>Logout</button>
                </div>
            </nav>

            <div className="container admin-content">
                <aside className="admin-sidebar">
                    <button className={activeTab === 'overview' ? 'active' : ''} onClick={() => setActiveTab('overview')}>Overview</button>
                    <button className={activeTab === 'candidates' ? 'active' : ''} onClick={() => setActiveTab('candidates')}>Candidates</button>
                    <button className={activeTab === 'voters' ? 'active' : ''} onClick={() => setActiveTab('voters')}>Voters</button>
                    <button className={activeTab === 'results' ? 'active' : ''} onClick={() => setActiveTab('results')}>Final Results</button>
                    <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>Settings</button>
                </aside>

                <main className="admin-main">
                    {activeTab === 'overview' && (
                        <div className="overview-tab">
                            <h2>Election Overview</h2>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <h4>Total Voters</h4>
                                    <p className="stat-val">{voters.length}</p>
                                </div>
                                <div className="stat-card">
                                    <h4>Candidates</h4>
                                    <p className="stat-val">{candidates.filter(c => c.name).length}</p>
                                </div>
                                <div className="stat-card">
                                    <h4>Turnout</h4>
                                    <p className="stat-val">
                                        {voters.length > 0 ? Math.round((votesCount / voters.length) * 100) : 0}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'candidates' && (
                        <div className="candidates-tab">
                            <h2>Manage Candidates</h2>
                            {['Curator', 'Vice Curator', 'Impact Officer'].map(role => (
                                <div key={role} className="role-section">
                                    <h3>{role}</h3>
                                    {candidates.filter(c => c.role === role).map((c, idx) => (
                                        <div key={idx} className="candidate-form">
                                            <div className="candidate-form-main">
                                                <div className="photo-upload-section">
                                                    {c.photo ? (
                                                        <img src={c.photo} alt="Candidate" className="candidate-photo-preview" />
                                                    ) : (
                                                        <div className="photo-placeholder">No Photo</div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handlePhotoUpload(c.id, e.target.files[0])}
                                                        id={`photo-${c.id}`}
                                                        style={{ display: 'none' }}
                                                    />
                                                    <label htmlFor={`photo-${c.id}`} className="btn-text" style={{ fontSize: '0.8rem' }}>
                                                        {c.photo ? 'Change Photo' : 'Upload Photo'}
                                                    </label>
                                                </div>
                                                <div className="info-section">
                                                    <input type="text" placeholder="Candidate Name" value={c.name} onChange={(e) => {
                                                        const next = [...candidates];
                                                        const item = next.find(i => i.id === c.id);
                                                        item.name = e.target.value;
                                                        setCandidates(next);
                                                    }} />
                                                    <textarea placeholder="Short Bio/Manifesto" value={c.bio} onChange={(e) => {
                                                        const next = [...candidates];
                                                        const item = next.find(i => i.id === c.id);
                                                        item.bio = e.target.value;
                                                        setCandidates(next);
                                                    }}></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="btn-text" onClick={() => addCandidate(role)}>+ Add Candidate</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'voters' && (
                        <div className="voters-tab">
                            <div className="flex-between" style={{ marginBottom: '1rem' }}>
                                <h2>Eligible Voters</h2>
                                <button className="btn btn-outline btn-sm" onClick={() => setShowBulk(!showBulk)}>
                                    {showBulk ? 'Close Bulk Add' : 'Bulk Add Voters'}
                                </button>
                            </div>

                            {showBulk ? (
                                <div className="bulk-add" style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-light)', borderRadius: '8px' }}>
                                    <h3>Bulk Import</h3>
                                    <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1rem' }}>
                                        Paste names and IDs (Format: <strong>Name, ID</strong>). One per line.
                                    </p>
                                    <textarea
                                        style={{ width: '100%', height: '150px', padding: '0.75rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                                        placeholder="John Doe, JOS-001&#10;Jane Smith, JOS-002"
                                        value={bulkText}
                                        onChange={(e) => setBulkText(e.target.value)}
                                    ></textarea>
                                    <div className="flex-between">
                                        <button className="btn btn-outline" onClick={() => setShowBulk(false)}>Cancel</button>
                                        <button className="btn btn-primary" onClick={handleBulkAdd}>Import Voters</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="voter-add">
                                    <input type="text" placeholder="Full Name" value={newVoter.name} onChange={(e) => setNewVoter({ ...newVoter, name: e.target.value })} />
                                    <input type="text" placeholder="Member ID" value={newVoter.memberId} onChange={(e) => setNewVoter({ ...newVoter, memberId: e.target.value })} />
                                    <button className="btn btn-primary" onClick={handleVoterAdd}>Add Voter</button>
                                </div>
                            )}

                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Member ID</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {voters.map((v, i) => (
                                            <tr key={i}>
                                                <td>{v.name}</td>
                                                <td>{v.member_id}</td>
                                                <td>{v.used ? <span className="tag used">Voted</span> : <span className="tag active">Pending</span>}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'results' && (
                        <ResultsView hubId={hub.id} candidates={candidates} />
                    )}

                    {activeTab === 'settings' && (
                        <div className="settings-tab">
                            <h2>Hub Settings</h2>
                            <div className="settings-card" style={{ padding: '2rem', background: 'var(--bg-white)', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: '1rem' }}>
                                <h3 style={{ color: 'var(--accent-red)', marginBottom: '1rem' }}>Danger Zone</h3>
                                <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>Deleting this hub will permanently remove all election data, including candidates, voters, and submitted votes. This action cannot be undone.</p>
                                <button className="btn btn-primary" style={{ backgroundColor: 'var(--accent-red)', borderColor: 'var(--accent-red)' }} onClick={async () => {
                                    if (window.confirm(`Are you absolutely sure you want to delete the ${hub.name} election? All data will be lost forever.`)) {
                                        const { error } = await supabase.from('hubs').delete().eq('id', hub.id);
                                        if (!error) onDelete();
                                    }
                                }}>Delete Hub Election</button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
