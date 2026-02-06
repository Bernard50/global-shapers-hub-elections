import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const VoterLogin = ({ onLogin, onBack }) => {
    const [hubs, setHubs] = useState([]);
    const [formData, setFormData] = useState({
        hubId: '',
        name: '',
        memberId: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchHubs();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fetchHubs = async () => {
        const { data } = await supabase.from('hubs').select('id, name, year');
        if (data) setHubs(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data: voter, error: dbError } = await supabase
                .from('voters')
                .select('*')
                .eq('hub_id', formData.hubId)
                .ilike('name', formData.name.trim())
                .eq('member_id', formData.memberId.trim())
                .single();

            if (dbError || !voter) {
                setError('Voter not found in this hub list. Please check your Name and Member ID.');
            } else if (voter.used) {
                setError('This member has already cast a vote.');
            } else {
                const selectedHub = hubs.find(h => h.id === formData.hubId);
                onLogin(voter, formData.hubId, selectedHub ? selectedHub.name : '');
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="onboarding-container">
            <div className="container">
                <div className="onboarding-card">
                    <h2>Voter Access</h2>
                    <p>Enter your details to access the voting portal.</p>

                    {error && <div className="error-msg">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Select Your Hub</label>
                            <select name="hubId" value={formData.hubId} onChange={handleChange} required className="hub-select">
                                <option value="">-- Choose Hub --</option>
                                {hubs.map(h => <option key={h.id} value={h.id}>{h.name} ({h.year})</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="As registered in your hub list" required />
                        </div>
                        <div className="form-group">
                            <label>Member ID</label>
                            <input type="text" name="memberId" value={formData.memberId} onChange={handleChange} placeholder="e.g. JOS-042" required />
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-outline" onClick={onBack}>Cancel</button>
                            <button type="submit" className="btn btn-primary" disabled={!formData.hubId}>Verify & Access</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VoterLogin;
