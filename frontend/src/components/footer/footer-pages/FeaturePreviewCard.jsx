import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Slider, Typography, Tooltip, IconButton, Button, Paper } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import './FeaturePreviewCard.css';

const PREVIEWS = {
  draft: () => {
    const [isRefined, setIsRefined] = useState(false);
    return (
      <Box className="FeaturePreviewCard__inner">
        <Typography variant="caption" sx={{ opacity: 0.5, mb: 1, display: 'block' }}>Draft Preview</Typography>
        <Box sx={{ minHeight: 120, position: 'relative' }}>
          <AnimatePresence mode="wait">
            {!isRefined ? (
              <motion.div
                key="raw"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  i want to ask about the homework deadline because i was sick today and couldnt come to class. can i get an extension?
                </Typography>
              </motion.div>
            ) : (
              <motion.div
                key="refined"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Dear Professor, I am writing to request an extension on the current assignment. I was unable to attend class today due to illness. Thank you for your consideration.
                </Typography>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
        <Button
          startIcon={<AutoAwesomeIcon />}
          size="small"
          variant={isRefined ? "contained" : "outlined"}
          onClick={() => setIsRefined(!isRefined)}
          sx={{ mt: 2, borderRadius: '999px', textTransform: 'none' }}
        >
          {isRefined ? "Reset Draft" : "Refine with AI"}
        </Button>
      </Box>
    );
  },
  tone: () => {
    const [tone, setTone] = useState(1);
    const sentences = [
      "I think we should probably meet to talk about this.",
      "I recommend we schedule a meeting to discuss this further.",
      "I look forward to our meeting to finalize these details."
    ];
    const labels = ["Casual", "Neutral", "Formal"];

    return (
      <Box className="FeaturePreviewCard__inner">
        <Typography variant="caption" sx={{ opacity: 0.5, mb: 2, display: 'block' }}>Tone Intelligence</Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ mb: 2, transition: 'all 0.2s', color: tone === 2 ? 'primary.main' : 'text.primary' }}>
            "{sentences[tone]}"
          </Typography>
        </Box>
        <Box sx={{ px: 1 }}>
          <Slider
            value={tone}
            step={1}
            marks
            min={0}
            max={2}
            onChange={(e, val) => setTone(val)}
            sx={{
              '& .MuiSlider-markLabel': { fontSize: '10px' }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            {labels.map((l, i) => (
              <Typography key={l} variant="caption" sx={{ opacity: tone === i ? 1 : 0.4, fontWeight: tone === i ? 700 : 400 }}>
                {l}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    );
  },
  structure: () => {
    const [isOptimized, setIsOptimized] = useState(false);
    return (
      <Box className="FeaturePreviewCard__inner">
        <Typography variant="caption" sx={{ opacity: 0.5, mb: 1, display: 'block' }}>Message Structure</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <motion.div layout transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
            <Paper variant="outlined" sx={{ p: 1, fontSize: '12px', borderColor: isOptimized ? 'success.main' : 'divider' }}>
              Subject: Question about the test
            </Paper>
          </motion.div>
          <motion.div layout>
            <Paper variant="outlined" sx={{ p: 1, fontSize: '12px', opacity: isOptimized ? 0.6 : 1 }}>
              Hey professor, how are you?
            </Paper>
          </motion.div>
          <AnimatePresence>
            {isOptimized && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Paper variant="outlined" sx={{ p: 1, fontSize: '12px', bgcolor: 'primary.main', color: 'white' }}>
                  Summary: Requesting clarification on Chapter 4 concepts.
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
        <Button
          fullWidth
          size="small"
          startIcon={<UnfoldMoreIcon />}
          onClick={() => setIsOptimized(!isOptimized)}
          sx={{ mt: 2, textTransform: 'none', borderStyle: 'dashed' }}
          variant="outlined"
        >
          {isOptimized ? "Revert" : "Inject Purpose-First Structure"}
        </Button>
      </Box>
    );
  },
  review: () => {
    const [isCorrected, setIsCorrected] = useState(false);
    return (
      <Box className="FeaturePreviewCard__inner">
        <Typography variant="caption" sx={{ opacity: 0.5, mb: 1, display: 'block' }}>Proof & Review</Typography>
        <Box sx={{ p: 2, bgcolor: isCorrected ? 'rgba(46, 125, 50, 0.05)' : 'transparent', borderRadius: 2, transition: 'all 0.3s' }}>
          <Typography variant="body2" sx={{ lineHeight: 1.8 }}>
            I would like to <Tooltip title={isCorrected ? "" : "Spelling: definitely"} open={!isCorrected} arrow placement="top">
              <span style={{
                textDecoration: isCorrected ? 'none' : 'underline wave red',
                color: isCorrected ? 'inherit' : '#d32f2f',
                fontWeight: isCorrected ? 600 : 400,
                transition: 'all 0.3s'
              }}>
                {isCorrected ? "definitely" : "definately"}
              </span>
            </Tooltip> follow up on our meeting yesterday.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          {!isCorrected ? (
            <Button
              size="small"
              variant="contained"
              color="success"
              onClick={() => setIsCorrected(true)}
              startIcon={<CheckCircleOutlineIcon />}
              sx={{ borderRadius: '999px', textTransform: 'none' }}
            >
              Accept Fix
            </Button>
          ) : (
            <Button
              size="small"
              variant="text"
              onClick={() => setIsCorrected(false)}
              sx={{ textTransform: 'none' }}
            >
              Undo
            </Button>
          )}
        </Box>
      </Box>
    );
  },
};

export default function FeaturePreviewCard({ type = 'draft' }) {
  const Render = PREVIEWS[type] || PREVIEWS.draft;
  return (
    <Box className="FeaturePreviewCard__wrap">
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          border: '1px solid',
          borderColor: 'divider',
          background: (theme) => theme.palette.mode === 'dark'
            ? 'rgba(255,255,255,0.03)'
            : 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(10px)',
          minHeight: 240,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }
        }}
      >
        {Render()}
      </Paper>
    </Box>
  );
}
