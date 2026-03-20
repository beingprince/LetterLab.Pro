/*  ReviewModal.jsx  –  fixed light-mode glass + viewport safe  */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, CheckCircle, AlertCircle, Mail, Lock, Briefcase, Building } from 'lucide-react';
import { Button, TextField, Typography, Box, CircularProgress, Alert } from '@mui/material';

/* ----------  StarRating sub-component (unchanged)  ---------- */
const StarRating = ({ rating, setRating, hover, setHover, disabled = false, isDark }) => (
  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 3 }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <motion.div
        key={star}
        whileHover={!disabled ? { scale: 1.2 } : {}}
        whileTap={!disabled ? { scale: 0.9 } : {}}
        style={{ display: 'inline-flex' }}
      >
        <Star
          size={28}
          color={star <= (hover || rating) ? '#FFD700' : isDark ? '#64748B' : '#D1D5DB'}
          fill={star <= (hover || rating) ? '#FFD700' : 'transparent'}
          style={{
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            filter: star <= (hover || rating) ? 'drop-shadow(0 0 6px #FFD700)' : 'none',
          }}
          onClick={() => !disabled && setRating(star)}
          onMouseEnter={() => !disabled && setHover(star)}
          onMouseLeave={() => !disabled && setHover(0)}
        />
      </motion.div>
    ))}
  </Box>
);

/* ----------  Main Modal  ---------- */
export default function ReviewModal({ open, onClose, onReviewSubmit, isDark }) {
  /* ---- state ---- */
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [organization, setOrganization] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  /* ---- theme colours (light-first) ---- */
  const modalBgColor = isDark ? 'rgba(30,41,59,0.25)' : 'rgba(255,255,255,0.92)';
  const modalBorderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
  const textColor = isDark ? '#F8FAFC' : '#1F2937';
  const secondaryTextColor = isDark ? '#CBD5E1' : '#6B7280';
  const inputBgColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)';
  const inputBorderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const closeButtonBg = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)';

  /* ---- OTP helpers ---- */
  const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleSendOtp = async () => {
    if (!email || !rating || !reviewText.trim() || !designation.trim() || !organization.trim()) {
      setError('Please fill all required fields and select a rating'); return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setError('Please enter a valid email address'); return; }

    setLoading(true); setError('');
    try {
      const otpCode = generateOTP(); setGeneratedOtp(otpCode);
      console.log('=== OTP SENT TO EMAIL ==='); console.log(`Email: ${email}`); console.log(`OTP: ${otpCode}`); console.log('=========================');
      await new Promise(r => setTimeout(r, 1500));
      setOtpSent(true); setShowOtp(true); setSuccess(`OTP sent to ${email}! Check your inbox.`);
    } catch { setError('Failed to send OTP.'); } finally { setLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) { setError('Enter a valid 6-digit OTP'); return; }
    setLoading(true); setError('');
    try {
      await new Promise(r => setTimeout(r, 1000));
      if (otp === generatedOtp) {
        setIsVerified(true); setSuccess('Email verified! Submitting…');
        setTimeout(async () => { await submitReview(); }, 1500);
      } else setError('Invalid OTP.');
    } catch { setError('Verification failed.'); } finally { setLoading(false); }
  };

  const submitReview = async () => {
    try {
      setLoading(true);
      await new Promise(r => setTimeout(r, 1000));
      const newReview = {
        id: Date.now(), name: email.split('@')[0], email, designation, organization,
        rating, review: reviewText, date: new Date().toISOString().split('T')[0], verified: true,
      };
      setSuccess('Review submitted! Thank you.');
      setTimeout(() => { onClose(); resetForm(); onReviewSubmit(newReview); }, 2000);
    } catch { setError('Submission failed.'); } finally { setLoading(false); }
  };

  const resetForm = () => {
    setRating(0); setHover(0); setReviewText(''); setEmail(''); setDesignation('');
    setOrganization(''); setOtp(''); setShowOtp(false); setLoading(false);
    setError(''); setSuccess(''); setOtpSent(false); setIsVerified(false); setGeneratedOtp('');
  };

  const handleClose = () => { resetForm(); onClose(); };

  /* ---- lock body scroll ---- */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { 
      document.body.style.overflow = ''; 
    };
  }, [open]);

  /* ---- render ---- */
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40, // below navbar (navbar = 50)
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '88px', // navbar height + breathing room
            paddingLeft: 'env(safe-area-inset-left)',
            paddingRight: 'env(safe-area-inset-right)',
            backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(10px)',
          }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              background: modalBgColor,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${modalBorderColor}`,
              borderRadius: '24px',
              width: '100%',
              maxWidth: '500px',
              maxHeight: 'calc(100vh - 80px)',
              overflowY: 'auto',
              padding: '24px', // xs
              '@media (min-width:600px)': { padding: '40px' },
              position: 'relative',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* ---- close button ---- */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                border: `2px solid ${modalBorderColor}`,
                background: closeButtonBg,
                color: textColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              <X size={24} />
            </motion.button>

            {/* ---- header ---- */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: textColor }}>Write a Review</Typography>
              <Typography variant="body2" sx={{ color: secondaryTextColor }}>Share your experience with LetterLab Pro</Typography>
            </Box>

            {/* ---- messages ---- */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ mb: 2 }}>
                  <Alert severity="error" sx={{ backgroundColor: isDark ? 'rgba(239,68,68,0.1)' : 'rgba(239,68,68,0.05)', color: isDark ? '#F87171' : '#DC2626' }}><AlertCircle size={16} style={{ mr: 1 }} />{error}</Alert>
                </motion.div>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ mb: 2 }}>
                  <Alert severity="success" sx={{ backgroundColor: isDark ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.05)', color: isDark ? '#4ADE80' : '#16A34A' }}><CheckCircle size={16} style={{ mr: 1 }} />{success}</Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ---- star rating ---- */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, color: textColor }}>Rate your experience</Typography>
              <StarRating rating={rating} setRating={setRating} hover={hover} setHover={setHover} disabled={loading || isVerified} isDark={isDark} />
            </Box>

            {/* ---- review text ---- */}
            <TextField fullWidth multiline rows={3} placeholder="Tell us about your experience..." value={reviewText} onChange={(e) => setReviewText(e.target.value)} disabled={loading || isVerified} sx={{ mb: 2, '& .MuiOutlinedInput-root': { backgroundColor: inputBgColor, borderRadius: '12px', color: textColor, '& fieldset': { borderColor: inputBorderColor }, '&:hover fieldset': { borderColor: '#3B82F6' }, '&.Mui-focused fieldset': { borderColor: '#3B82F6' } } }} />

            {/* ---- email / designation / org ---- */}
            {!showOtp && (
              <>
                <TextField fullWidth type="email" placeholder="your.email@company.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading || otpSent} sx={{ mb: 2, '& .MuiOutlinedInput-root': { backgroundColor: inputBgColor, borderRadius: '12px', color: textColor, '& fieldset': { borderColor: inputBorderColor }, '&:hover fieldset': { borderColor: '#3B82F6' }, '&.Mui-focused fieldset': { borderColor: '#3B82F6' } } }} InputProps={{ startAdornment: <Mail size={20} style={{ marginRight: '12px', color: secondaryTextColor }} /> }} />
                <TextField fullWidth placeholder="Your designation (e.g., Marketing Manager)" value={designation} onChange={(e) => setDesignation(e.target.value)} disabled={loading || otpSent} sx={{ mb: 2, '& .MuiOutlinedInput-root': { backgroundColor: inputBgColor, borderRadius: '12px', color: textColor, '& fieldset': { borderColor: inputBorderColor }, '&:hover fieldset': { borderColor: '#3B82F6' }, '&.Mui-focused fieldset': { borderColor: '#3B82F6' } } }} InputProps={{ startAdornment: <Briefcase size={20} style={{ marginRight: '12px', color: secondaryTextColor }} /> }} />
                <TextField fullWidth placeholder="Your organization (e.g., Acme Corp)" value={organization} onChange={(e) => setOrganization(e.target.value)} disabled={loading || otpSent} sx={{ mb: 3, '& .MuiOutlinedInput-root': { backgroundColor: inputBgColor, borderRadius: '12px', color: textColor, '& fieldset': { borderColor: inputBorderColor }, '&:hover fieldset': { borderColor: '#3B82F6' }, '&.Mui-focused fieldset': { borderColor: '#3B82F6' } } }} InputProps={{ startAdornment: <Building size={20} style={{ marginRight: '12px', color: secondaryTextColor }} /> }} />
              </>
            )}

            {/* ---- otp input ---- */}
            {showOtp && (
              <>
                <Typography variant="body2" sx={{ color: secondaryTextColor, mb: 1, textAlign: 'center' }}>Enter the 6-digit code sent to {email}</Typography>
                <TextField fullWidth type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} disabled={loading || isVerified} sx={{ mb: 3, '& .MuiOutlinedInput-root': { backgroundColor: inputBgColor, borderRadius: '12px', color: textColor, '& fieldset': { borderColor: inputBorderColor }, '&:hover fieldset': { borderColor: '#3B82F6' }, '&.Mui-focused fieldset': { borderColor: '#3B82F6' } } }} InputProps={{ startAdornment: <Lock size={20} style={{ marginRight: '12px', color: secondaryTextColor }} /> }} />
              </>
            )}

            {/* ---- action buttons ---- */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {!showOtp ? (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button fullWidth variant="contained" onClick={handleSendOtp} disabled={loading || !email || !rating || !reviewText.trim() || !designation.trim() || !organization.trim()} sx={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', borderRadius: '12px', py: 1.5, fontWeight: 600, textTransform: 'none', '&:disabled': { background: 'rgba(59,130,246,0.3)', color: 'rgba(255,255,255,0.5)' }, '&:hover:not(:disabled)': { background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' } }}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP for Verification'}
                  </Button>
                </motion.div>
              ) : (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button fullWidth variant="contained" onClick={handleVerifyOtp} disabled={loading || !otp || otp.length !== 6 || isVerified} sx={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', borderRadius: '12px', py: 1.5, fontWeight: 600, textTransform: 'none', '&:disabled': { background: 'rgba(59,130,246,0.3)', color: 'rgba(255,255,255,0.5)' }, '&:hover:not(:disabled)': { background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' } }}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : isVerified ? 'Verified!' : 'Verify OTP & Submit Review'}
                  </Button>
                </motion.div>
              )}
              {otpSent && !isVerified && <Typography variant="body2" sx={{ textAlign: 'center', color: secondaryTextColor }}>Didn’t receive OTP? Check spam or try again.</Typography>}
            </Box>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}