import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

export default function TabSecurity() {
    const [enabled, setEnabled] = useState(false);
    const [qrData, setQrData] = useState(null); // { secret, qrCode }
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Check Status
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/2fa/status`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setEnabled(data.enabled);
            } catch (e) {
                console.error(e);
            }
        };
        checkStatus();
    }, []);

    const handleEnableStart = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/2fa/generate`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            console.log("QR Gen Response:", data);

            if (data.success) {
                setQrData(data);
            } else {
                console.error("QR Gen Failed Backend:", data);
                alert("Failed to generate QR: " + (data.error || 'Unknown error'));
            }
        } catch (e) {
            console.error("Generate Exec Error:", e);
            alert("Failed to connect to server for 2FA");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/2fa/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
                body: JSON.stringify({ token })
            });
            const data = await res.json();
            if (data.success) {
                setEnabled(true);
                setQrData(null);
            } else {
                alert("Invalid Token");
            }
        } catch (e) {
            console.error(e);
            alert("Verification failed");
        }
    };

    const handleDisable = async () => {
        if (!window.confirm("Are you sure you want to disable 2FA? This makes your account less secure.")) return;

        try {
            const authToken = localStorage.getItem('authToken');
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/2fa/disable`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${authToken}` }
            });
            const data = await res.json();
            if (data.success) setEnabled(false);
        } catch (e) {
            console.error(e);
            alert("Failed to disable");
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-brand-card/30 rounded-2xl p-6 border border-brand-border/50">
                <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-full ${enabled ? 'bg-green-500/20 text-green-400' : 'bg-brand-bg text-brand-dim'}`}>
                        {enabled ? <VerifiedUserIcon /> : <SecurityIcon />}
                    </div>
                    <div>
                        <h3 className="text-xl font-heading font-bold text-brand-text">Two-Factor Authentication</h3>
                        <p className="text-brand-dim text-sm">Secure your account with Google/Microsoft Authenticator.</p>
                    </div>
                </div>

                {enabled ? (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-green-400 font-medium">
                            <CheckCircleIcon />
                            <span>2FA is currently enabled.</span>
                        </div>
                        <button
                            onClick={handleDisable}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold transition-colors"
                        >
                            Disable
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {!qrData ? (
                            <button
                                onClick={handleEnableStart}
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all"
                            >
                                <QrCodeScannerIcon />
                                {loading ? 'Generating...' : 'Setup 2FA'}
                            </button>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-brand-bg/50 p-6 rounded-xl border border-brand-border"
                            >
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="bg-white p-2 rounded-lg">
                                        <img src={qrData.qrCode} alt="2FA QR" className="w-48 h-48" />
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <h4 className="font-bold text-brand-text">1. Scan QR Code</h4>
                                        <p className="text-sm text-brand-dim">Open Google Authenticator or Microsoft Authenticator and scan the image.</p>

                                        <h4 className="font-bold text-brand-text pt-2">2. Enter Code</h4>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={token}
                                                onChange={(e) => setToken(e.target.value)}
                                                placeholder="123456"
                                                className="w-32 bg-brand-bg border border-brand-border rounded-lg px-4 py-2 text-brand-text text-center tracking-widest font-mono focus:border-blue-500 outline-none"
                                            />
                                            <button
                                                onClick={handleVerify}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold"
                                            >
                                                Verify
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
