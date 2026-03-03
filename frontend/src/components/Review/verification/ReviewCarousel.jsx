import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';
import { Typography, Box } from '@mui/material';

export default function ReviewCarousel({ reviews = [], isDark }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (reviews.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const nextSlide = () => {
    if (reviews.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    if (reviews.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Theme-aware colors from fontTheme.js
  const cardBgColor = isDark ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255, 255, 255, 0.3)';
  const cardBorderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const textColor = isDark ? '#F8FAFC' : '#1F2937';
  const secondaryTextColor = isDark ? '#CBD5E1' : '#6B7280';
  const navButtonBg = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
  const dotActiveColor = '#3B82F6';
  const dotInactiveColor = isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';

  // Star rating component matching your theme
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <motion.div
        key={i}
        whileHover={{ scale: 1.1 }}
        style={{ display: 'inline-flex' }}
      >
        <Star
          size={20}
          color={i < rating ? '#FFD700' : (isDark ? '#64748B' : '#D1D5DB')}
          fill={i < rating ? '#FFD700' : 'transparent'}
          style={{ 
            filter: i < rating ? 'drop-shadow(0 0 4px #FFD700)' : 'none',
            transition: 'all 0.2s ease'
          }}
        />
      </motion.div>
    ));
  };

  if (reviews.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h6" sx={{ color: secondaryTextColor }}>
          No reviews yet. Be the first to write one!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', mb: 8 }}>
      {/* Carousel Container */}
      <Box sx={{ 
        overflow: 'hidden', 
        borderRadius: '24px',
        position: 'relative'
      }}>
        <motion.div
          animate={{ x: `-${currentSlide * 100}%` }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          style={{ display: 'flex' }}
        >
          {reviews.map((review, index) => (
            <Box
              key={review.id}
              sx={{
                minWidth: '100%',
                padding: { xs: '40px 20px', md: '60px 40px' },
                background: cardBgColor,
                backdropFilter: 'blur(20px)',
                border: `1px solid ${cardBorderColor}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Content Container - Perfectly centered */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{ 
                  width: '100%',
                  maxWidth: '900px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {/* Star Rating */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                  {renderStars(review.rating)}
                </Box>
                
                {/* Review Text */}
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '16px', md: '20px' },
                    lineHeight: 1.7,
                    color: textColor,
                    mb: 5,
                    fontStyle: 'italic',
                    fontWeight: 400,
                    textAlign: 'center',
                    maxWidth: '800px',
                  }}
                >
                  "{review.review}"
                </Typography>
                
                {/* User Info - VERTICALLY ALIGNED, NO EXTRA TABS */}
                <Box sx={{ 
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1.5
                }}>
                  {/* Name with blue gradient */}
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '18px',
                      background: 'linear-gradient(135deg, #3B82F6, #64748B)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {review.name}
                  </Typography>
                  
                  {/* Designation & Organization - SINGLE LINE */}
                  {(review.designation || review.organization) && (
                    <Typography variant="body2" sx={{ 
                      color: secondaryTextColor,
                      fontWeight: 500,
                      fontSize: '14px'
                    }}>
                      {review.designation && review.organization 
                        ? `${review.designation} at ${review.organization}`
                        : review.designation || review.organization}
                    </Typography>
                  )}
                  
                  {/* Email - DIRECTLY BELOW, NO EXTRA SPACING */}
                  <Typography variant="body2" sx={{ 
                    color: secondaryTextColor,
                    fontSize: '13px',
                    fontWeight: 400
                  }}>
                    {review.email}
                  </Typography>
                  
                  {/* Verified Badge */}
                  {review.verified && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      style={{ marginTop: '8px' }}
                    >
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: 1,
                        px: 2,
                        py: 0.5,
                        borderRadius: '12px',
                        background: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.05)',
                        border: `1px solid ${isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'}`,
                      }}>
                        <CheckCircle size={14} color="#22C55E" />
                        <Typography variant="caption" sx={{ color: '#22C55E', fontWeight: 500 }}>
                          Verified Review
                        </Typography>
                      </Box>
                    </motion.div>
                  )}
                </Box>
              </motion.div>
            </Box>
          ))}
        </motion.div>
      </Box>

      {/* LEFT ARROW - Fixed positioning */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={prevSlide}
        style={{
          position: 'absolute',
          left: { xs: '10px', md: '20px' },
          top: '50%',
          transform: 'translateY(-50%)',
          background: navButtonBg,
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: textColor,
          backdropFilter: 'blur(10px)',
          zIndex: 10,
          fontSize: '20px',
        }}
      >
        ←
      </motion.button>

      {/* RIGHT ARROW - Fixed positioning */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={nextSlide}
        style={{
          position: 'absolute',
          right: { xs: '10px', md: '20px' },
          top: '50%',
          transform: 'translateY(-50%)',
          background: navButtonBg,
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: textColor,
          backdropFilter: 'blur(10px)',
          zIndex: 10,
          fontSize: '20px',
        }}
      >
        →
      </motion.button>

      {/* Dots Indicator */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {reviews.map((_, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.2 }}
            onClick={() => setCurrentSlide(index)}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: currentSlide === index ? dotActiveColor : dotInactiveColor,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </Box>
    </Box>
  );
}