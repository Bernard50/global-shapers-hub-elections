import React, { useState } from 'react';
import './HubOnboarding.css';

const HubOnboarding = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const [inviteCode, setInviteCode] = useState('');
    const [inviteError, setInviteError] = useState(false);
    const [hubData, setHubData] = useState({
        name: '',
        city: '',
        country: '',
        year: new Date().getFullYear(),
        adminKey: ''
    });

    const MASTER_CODE = "SHAPERS-GLOBAL-2025"; // In production, this would be an env variable

    const handleVerifyInvite = () => {
        if (inviteCode.trim().toUpperCase() === MASTER_CODE) {
            setStep(1);
        } else {
            setInviteError(true);
            setTimeout(() => setInviteError(false), 2000);
        }
    };

    const handleChange = (e) => {
        setHubData({ ...hubData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = (e) => {
        e.preventDefault();
        onComplete(hubData);
    };

    return (
        <div className="onboarding-container">
            <div className="container">
                <div className="onboarding-card">
                    <div className="progress-bar">
                        <div className={`progress-step ${step >= 0 ? 'active' : ''}`}>🔑</div>
                        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
                        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
                    </div>

                    {step === 0 && (
                        <div className="onboarding-step invite-step">
                            <div className="header-icon">🛡️</div>
                            <h2>Hub Authorization</h2>
                            <p>This platform is reserved for authorized Global Shapers Hubs. A master code is required to initialize a new election.</p>

                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Enter Master Code"
                                    className={`invite-input ${inviteError ? 'error' : ''}`}
                                    value={inviteCode}
                                    onChange={(e) => setInviteCode(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleVerifyInvite()}
                                />
                                {inviteError && <p className="error-text">Invalid code. Please check your spelling or request a new one.</p>}
                            </div>

                            <button className="btn btn-primary btn-block" onClick={handleVerifyInvite}>Verify Access</button>

                            <div className="request-access">
                                <p><strong>Need the master code?</strong></p>
                                <p style={{ fontSize: '0.85rem', marginBottom: '0.75rem', opacity: 0.8 }}>Contact the administrator to verify your hub and receive your access code.</p>
                                <a href={`mailto:byambinibernard@gmail.com?subject=Request for Hub Master Code&body=Hello,%0D%0A%0D%0AI would like to request the master code to set up an election for our hub.%0D%0A%0D%0AHub Name: %0D%0ACity/Country:%0D%0AYour Name/Role:`} className="btn-text" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                    Email: byambinibernard@gmail.com 📧
                                </a>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="onboarding-step">
                            <h2>Hub Profile</h2>
                            <p>Let's set up your hub's identity.</p>
                            <div className="form-group">
                                <label>Hub Name</label>
                                <input type="text" name="name" value={hubData.name} onChange={handleChange} placeholder="e.g. Geneva Hub" required />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input type="text" name="city" value={hubData.city} onChange={handleChange} placeholder="e.g. Geneva" required />
                                </div>
                                <div className="form-group">
                                    <label>Country</label>
                                    <input type="text" name="country" value={hubData.country} onChange={handleChange} placeholder="e.g. Switzerland" required />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button className="btn btn-outline" onClick={() => setStep(0)}>Back</button>
                                <button className="btn btn-primary" onClick={nextStep} disabled={!hubData.name || !hubData.city}>Next</button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="onboarding-step">
                            <h2>Admin Access</h2>
                            <p>Set a secret key to manage this hub later. <strong>Safeguard this key.</strong></p>
                            <div className="form-group">
                                <label>Admin Secret Key</label>
                                <input type="password" name="adminKey" value={hubData.adminKey} onChange={handleChange} placeholder="e.g. HUB-SECRET-123" required />
                            </div>
                            <div className="form-group">
                                <label>Election Year</label>
                                <input type="number" name="year" value={hubData.year} onChange={handleChange} required />
                            </div>
                            <div className="form-actions">
                                <button className="btn btn-outline" onClick={prevStep}>Back</button>
                                <button className="btn btn-primary" onClick={handleSubmit}>Initialize Hub</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HubOnboarding;
