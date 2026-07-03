import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    return (
        <div className="navbar">
            <div
                className="navbar-logo"
                onClick={() => navigate('/dashboard')}
            >
                🎮 QuizForge
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.9rem'
                }}>
                    👋 {user?.name}
                </span>
                <button
                    onClick={() => { logout(); navigate('/'); }}
                    style={{
                        background: 'rgba(245,87,108,0.15)',
                        border: '1px solid rgba(245,87,108,0.3)',
                        color: '#f5576c',
                        padding: '8px 16px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontFamily: 'Poppins',
                        fontWeight: 600,
                        fontSize: '0.875rem'
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Navbar;