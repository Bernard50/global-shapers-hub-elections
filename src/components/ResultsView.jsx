import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const ResultsView = ({ hubId, candidates }) => {
    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const roles = ['Curator', 'Vice Curator', 'Impact Officer'];

    useEffect(() => {
        fetchVotes();
    }, [hubId]);

    const fetchVotes = async () => {
        const { data } = await supabase.from('votes').select('*').eq('hub_id', hubId);
        if (data) setVotes(data);
        setLoading(false);
    };

    const getResultsForRole = (role) => {
        const roleCandidates = candidates.filter(c => c.role === role && c.name);
        if (roleCandidates.length === 0) return [];

        const totalVotes = votes.length;

        return roleCandidates.map(c => {
            const candidateVotes = votes.filter(v => v.choices[role] === c.id).length;
            return {
                ...c,
                votes: candidateVotes,
                percent: totalVotes > 0 ? Math.round((candidateVotes / totalVotes) * 100) : 0
            };
        }).sort((a, b) => b.votes - a.votes);
    };

    return (
        <div className="results-view">
            <h2>Final Election Results</h2>
            <p className="subtitle">Official certified results for the leadership cycle.</p>

            {roles.map(role => {
                const results = getResultsForRole(role);
                const total = results.reduce((sum, r) => sum + r.votes, 0);

                return (
                    <div key={role} className="role-results">
                        <h3>{role}</h3>
                        {results.length > 0 ? (
                            <div className="results-card">
                                <div className="total-label">Total Votes: <strong>{total}</strong></div>
                                <div className="charts-container">
                                    {results.map(r => (
                                        <div key={r.id} className="result-row">
                                            <div className="result-row-content">
                                                {r.photo ? (
                                                    <img src={r.photo} alt={r.name} className="result-photo" />
                                                ) : (
                                                    <div className="result-photo-placeholder">{r.name.charAt(0)}</div>
                                                )}
                                                <div className="result-details">
                                                    <div className="result-info">
                                                        <span>{r.name}</span>
                                                        <span>{r.votes} votes ({r.percent}%)</span>
                                                    </div>
                                                    <div className="progress-bg">
                                                        <div className="progress-fill" style={{ width: `${r.percent}%` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="no-data">No candidates registered for this position.</p>
                        )}
                    </div>
                );
            })}

            <div className="admin-actions">
                <button className="btn btn-primary" onClick={() => window.print()}>Export Results (PDF)</button>
            </div>
        </div>
    );
};

export default ResultsView;
