import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import './VotingUI.css';

const VotingUI = ({ voter, hubId, onVoteComplete }) => {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selections, setSelections] = useState({});
    const [confirming, setConfirming] = useState(false);

    const roles = ['Curator', 'Vice Curator', 'Impact Officer'];

    useEffect(() => {
        if (hubId) fetchCandidates();
    }, [hubId]);

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('elections')
                .select('candidates')
                .eq('hub_id', hubId)
                .single();

            if (error) throw error;
            if (data) setCandidates(data.candidates);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (role, candidateId) => {
        setSelections({ ...selections, [role]: candidateId });
    };

    const finalSubmit = async () => {
        setLoading(true);
        try {
            const { error: voteError } = await supabase
                .from('votes')
                .insert([{ hub_id: hubId, choices: selections }]);

            if (voteError) throw voteError;

            const { error: voterError } = await supabase
                .from('voters')
                .update({ used: true })
                .eq('id', voter.id);

            if (voterError) throw voterError;

            onVoteComplete();
        } catch (err) {
            alert('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !confirming) return <div className="loading-container"><div className="spinner"></div></div>;

    const availableRoles = roles.filter(role =>
        candidates.some(c => c.role === role && c.name?.trim())
    );

    return (
        <div className="voting-ui-simple">
            <nav className="voter-nav">
                <div className="container">
                    <strong>Voter: {voter.name}</strong>
                </div>
            </nav>

            <div className="container">
                {!confirming ? (
                    <>
                        <div className="voting-header">
                            <h1>Hub Elections</h1>
                            <p>Select one candidate for each position.</p>
                        </div>

                        {availableRoles.map(role => (
                            <section key={role} className="role-section">
                                <h2>{role}</h2>
                                <div className="candidate-grid">
                                    {candidates.filter(c => c.role === role && c.name?.trim()).map(c => (
                                        <div
                                            key={c.id}
                                            className={`simple-card ${selections[role] === c.id ? 'selected' : ''}`}
                                            onClick={() => handleSelect(role, c.id)}
                                        >
                                            <div className="card-header">
                                                {c.photo ? <img src={c.photo} alt={c.name} /> : <div className="photo-placeholder">{c.name[0]}</div>}
                                                <h3>{c.name}</h3>
                                            </div>
                                            <p>{c.bio}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}

                        <div className="voting-actions">
                            <button
                                className="btn btn-primary"
                                disabled={Object.keys(selections).length === 0}
                                onClick={() => setConfirming(true)}
                            >
                                Review Vote ({Object.keys(selections).length})
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="confirmation">
                        <h2>Confirm Ballot</h2>
                        <div className="review-box">
                            {availableRoles.map(role => (
                                <div key={role} className="review-row">
                                    <span>{role}:</span>
                                    <strong>{candidates.find(c => c.id === selections[role])?.name || 'No selection'}</strong>
                                </div>
                            ))}
                        </div>
                        <div className="form-actions">
                            <button className="btn btn-outline" onClick={() => setConfirming(false)}>Change</button>
                            <button className="btn btn-primary" onClick={finalSubmit}>Confirm Vote</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VotingUI;
