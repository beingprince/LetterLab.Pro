// src/NavBar.jsx - Simplified version that works with window.history navigation
import React from "react";

export default function NavBar() {
    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '72px',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 2rem',
            zIndex: 1000
        }}>
            <div style={{ fontWeight: 800, fontSize: '1.5rem', background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                LetterLab
            </div>
        </nav>
    );
}
