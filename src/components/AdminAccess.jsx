import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AdminAccess = ({ onAccess, onBack }) => {
    const [hubs, setHubs] = useState([]);
    const [selectedHub, setSelectedHub] = useState('');
    const [adminKey, setAdminKey] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHubs();
    }, []);

    const fetchHubs = async () => {
        const { data, error } = await supabase.from('hubs').select('id, name, city, year');
        if (data) setHubs(data);
    };

    const handleAccess = async (e) => {
        e.preventDefault();
        if (!selectedHub) {
            setError('Please select a hub');
            return;
        }

        setLoading(true);
        try {
            const { data: hub, error } = await supabase
                .from('hubs')
                .select('admin_key')
                .eq('id', selectedHub)
                .single();

            if (hub && hub.admin_key === adminKey) {
                onAccess(selectedHub);
            } else {
                setError('Invalid Secret Key for the selected hub.');
            }
        } catch (err) {
            setError('Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="onboarding-container">
            <div className="container" style={{ maxWidth: '500px' }}>
                <div className="onboarding-card">
                    <h2 style={{ marginBottom: '0.5rem' }}>Hub Admin Access</h2>
                    <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>Enter your secret key to manage your hub election.</p>

                    <form onSubmit={handleAccess}>
                        <div className="form-group">
                            <label>Select Hub</label>
                            <select
                                value={selectedHub}
                                onChange={(e) => { setSelectedHub(e.target.value); setError(''); }}
                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-white)', color: 'var(--text-charcoal)' }}
                                required
                            >
                                <option value="">-- Choose Hub --</option>
                                {hubs.map(h => (
                                    <option key={h.id} value={h.id}>{h.name} ({h.city}, {h.year})</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Admin Secret Key</label>
                            <input
                                type="password"
                                value={adminKey}
                                onChange={(e) => { setAdminKey(e.target.value); setError(''); }}
                                placeholder="Enter Key"
                                required
                            />
                        </div>

                        {error && <p style={{ color: 'var(--accent-red)', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}

                        <div className="form-actions" style={{ display: 'flex', gap: '1rem' }}>
                            <button type="button" className="btn btn-outline" onClick={onBack} style={{ flex: 1 }}>Back</button>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminAccess;
