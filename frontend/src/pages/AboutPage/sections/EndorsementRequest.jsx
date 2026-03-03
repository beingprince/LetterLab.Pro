
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  stepConnectorClasses,
  styled
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const steps = ['Personal Info', 'Institution', 'Message'];

// Engineered Custom Connector
const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#3b82f6', // blue-500
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: '#3b82f6', // blue-500
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    borderTopWidth: 2,
    borderRadius: 1,
    transition: 'all 0.3s ease',
  },
}));

// Engineered Step Icon
function QontoStepIcon(props) {
  const { active, completed } = props;

  return (
    <div className={`
      flex items-center justify-center w-8 h-8 rounded-full z-10 
      transition-all duration-300 ease-out
      ${active ? 'bg-blue-600 scale-110 shadow-lg shadow-blue-500/30' : ''}
      ${completed ? 'bg-blue-600' : ''}
      ${!active && !completed ? 'bg-slate-200 dark:bg-slate-800' : ''}
    `}>
      {completed ? (
        <Check className="w-4 h-4 text-white" strokeWidth={3} />
      ) : (
        <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-white' : 'bg-slate-400 dark:bg-slate-500'}`} />
      )}
    </div>
  );
}

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.5)',
    transition: 'all 0.2s',
    '& fieldset': {
      borderColor: 'rgba(0,0,0,0.1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(59, 130, 246, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3b82f6',
      borderWidth: '1px',
    },
    // Dark mode
    '.dark &': {
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
      '& input': { color: 'white' }
    }
  },
  '& .MuiInputLabel-root': {
    color: '#64748b',
    '&.Mui-focused': { color: '#3b82f6' }
  }
};

const StepContent = ({ step, formData, handleChange }) => {
  switch (step) {
    case 0:
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* 24px gap */}
          <TextField
            fullWidth
            label="Your Name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            required
            variant="outlined"
            sx={inputStyles}
          />
          <TextField
            fullWidth
            label="Your Email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            required
            variant="outlined"
            sx={inputStyles}
          />
          <TextField
            fullWidth
            label="Your Position"
            name="position"
            value={formData.position || ''}
            onChange={handleChange}
            required
            variant="outlined"
            className="md:col-span-2"
            sx={inputStyles}
          />
        </div>
      );
    case 1:
      return (
        <div className="grid grid-cols-1 gap-6">
          <TextField
            fullWidth
            label="Your Institution"
            name="institution"
            placeholder="University or Organization Name"
            value={formData.institution || ''}
            onChange={handleChange}
            required
            variant="outlined"
            sx={inputStyles}
          />
        </div>
      );
    case 2:
      return (
        <div className="grid grid-cols-1 gap-6">
          <TextField
            fullWidth
            label="Endorsement Message"
            name="message"
            placeholder="Share your experience with LetterLab Pro..."
            value={formData.message || ''}
            onChange={handleChange}
            required
            multiline
            rows={5}
            variant="outlined"
            sx={inputStyles}
          />
        </div>
      );
    default:
      return null;
  }
};

export default function EndorsementRequest() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your endorsement request! We will review it shortly.');
    setActiveStep(0);
    setFormData({});
  };

  return (
    <section className="py-24 md:py-32 bg-slate-50 dark:bg-[#0B0D12] border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">

        {/* Header - Engineering Clean */}
        <div className="text-center mb-16">
          <Typography
            variant="h2"
            className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-4"
          >
            Endorse LetterLab Pro
          </Typography>
          <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
            If you are a professor or professional who values engineering excellence, we'd love to hear from you.
          </p>
        </div>

        {/* Stepper - Custom Engineered */}
        <div className="mb-12">
          <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={QontoStepIcon}>
                  <span className="font-medium text-sm text-slate-600 dark:text-slate-400 mt-1 block">
                    {label}
                  </span>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>

        {/* Form Container - Floating Slab */}
        <div className="bg-white dark:bg-[#151921] p-8 md:p-10 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[200px]"
              >
                <StepContent step={activeStep} formData={formData} handleChange={handleChange} />
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex justify-between mt-10 pt-6 border-t border-slate-100 dark:border-slate-800/50">
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="text"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 3,
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                Back
              </Button>

              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disableElevation
                  sx={{
                    backgroundColor: '#3b82f6',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    py: 1,
                    '&:hover': { backgroundColor: '#2563eb' }
                  }}
                >
                  Submit Endorsement
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  disableElevation
                  sx={{
                    backgroundColor: '#3b82f6',
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    py: 1,
                    '&:hover': { backgroundColor: '#2563eb' }
                  }}
                >
                  Next Step
                </Button>
              )}
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}