import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import ReviewCarousel from '../verification/ReviewCarousel';
import ReviewModal from '../SectionSupporters/ReviewModal';

export default function ReviewSection() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@company.com',
      designation: 'Marketing Director',
      organization: 'TechCorp Inc.',
      rating: 5,
      review: 'LetterLab Pro has completely transformed how we handle email campaigns. The automation features save us hours every week!',
      date: '2024-01-15',
      verified: true,
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.c@startup.io',
      designation: 'CEO',
      organization: 'StartupHub',
      rating: 5,
      review: 'The glassmorphism UI is absolutely stunning. Our team loves the intuitive design and powerful features.',
      date: '2024-01-10',
      verified: true,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      email: 'emily.r@agency.com',
      designation: 'Project Manager',
      organization: 'Digital Agency',
      rating: 4,
      review: 'Great tool for email management. The analytics dashboard provides excellent insights into our campaign performance.',
      date: '2024-01-08',
      verified: true,
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);

  const handleReviewSubmit = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
  };

  // Same design language as SectionSupporters
  const accentColor1 = isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)';
  const accentColor2 = isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)';

  return (
    <section className="relative overflow-hidden py-20 md:py-24 bg-transparent">
      {/* Background Elements - Same as SectionSupporters */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, ${accentColor1} 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: `radial-gradient(circle, ${accentColor2} 0%, transparent 70%)`,
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header Section - Using exact same typography as SectionSupporters */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="label text-brand-dim mb-3">
            Authentic Voices & Verified Experiences
          </h2>
          
          <h3 className="hero-heading text-3xl md:text-4xl font-semibold mb-5">
            What Our Users Say About LetterLab Pro
          </h3>
          
          <p className="hero-description text-sm md:text-base leading-relaxed">
            Discover how professionals and teams worldwide are transforming their 
            email communication with our AI-powered platform. Every review is verified 
            for authenticity.
          </p>
        </div>

        {/* Review Carousel */}
        <ReviewCarousel reviews={reviews} isDark={isDark} />

        {/* Write Review Button - Styled to match SectionSupporters exactly */}
        <div className="text-center mt-8">
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <button
              onClick={() => setModalOpen(true)}
              className="relative overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-4 text-white font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-[0_15px_40px_rgba(59,130,246,0.4)]"
            >
              <span className="relative z-10">Write a Review</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </button>
          </motion.div>
          
          <p className="text-brand-dim text-xs mt-3">
            Email verification required for authentic reviews
          </p>
        </div>
      </div>

      {/* Review Modal - with proper theme and OTP */}
      <ReviewModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onReviewSubmit={handleReviewSubmit}
        isDark={isDark}
      />
    </section>
  );
}