import React from 'react';
import './SuccessView.css';

const SuccessView = ({ hubName, onExit }) => {
    return (
        <div className="success-overlay fade-in">
            <div className="success-card">
                <div className="success-icon-wrapper">
                    <div className="success-icon">✓</div>
                </div>
                <h1>Vote Recorded!</h1>
                <p>
                    Thank you for shaping <strong>{hubName || 'your Hub'}</strong>.
                    Your contribution helps lead our community forward.
                </p>
                <div className="success-actions">
                    <button className="btn btn-primary btn-large" onClick={onExit}>
                        Exit Portal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessView;
