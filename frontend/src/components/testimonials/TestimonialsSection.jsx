import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Rating, Snackbar, Alert } from "@mui/material";
import { useTestimonialsCarousel } from "./useTestimonialsCarousel";
import { TESTIMONIALS } from "./testimonials.data";
import TestimonialQuote from "./TestimonialQuote";
import TestimonialNav from "./TestimonialNav";
import TestimonialDots from "./TestimonialDots";

export default function TestimonialsSection() {
    const [reviews, setReviews] = useState(TESTIMONIALS);
    const [modalOpen, setModalOpen] = useState(false);
    const [status, setStatus] = useState({ open: false, type: "success", text: "" });
    const [formData, setFormData] = useState({ name: "", title: "", rating: 5, quote: "" });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
                const res = await fetch(`${apiBase}/api/reviews`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        setReviews([...TESTIMONIALS, ...data]);
                    }
                }
            } catch (error) {
                console.error("Failed to load reviews:", error);
            }
        };
        fetchReviews();
    }, []);

    const {
        activeIndex,
        count,
        next,
        prev,
        goTo,
        handlers
    } = useTestimonialsCarousel(reviews);

    const activeItem = reviews[activeIndex];

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => {
        setModalOpen(false);
        setFormData({ name: "", title: "", rating: 5, quote: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
            const res = await fetch(`${apiBase}/api/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setReviews([...reviews, data.review]);
                setStatus({ open: true, type: "success", text: "Review submitted!" });
                handleClose();
                goTo(reviews.length); // go to the newly added review
            } else {
                setStatus({ open: true, type: "error", text: data.error || "Failed to submit." });
            }
        } catch (error) {
            setStatus({ open: true, type: "error", text: "Network error occurred." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            className="w-full py-16 lg:py-24 bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-800"
            {...handlers}
            aria-label="Community Testimonials"
        >
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

                    {/* LEFT COLUMN (35%) - Static Content + Nav */}
                    <div className="lg:col-span-4 flex flex-col items-start space-y-6 lg:sticky lg:top-32 order-1">
                        <div className="space-y-4">
                            <h2 className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
                                Testimonials
                            </h2>
                            <h3 className="text-4xl lg:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white leading-[0.95]">
                                From our <br />
                                <span className="text-brand-primary">community.</span>
                            </h3>
                            <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs">
                                Join thousands of professionals who communicate with clarity and confidence.
                            </p>
                        </div>

                        {/* Controls (Desktop Only - Left Aligned) */}
                        <div className="hidden lg:block pt-4">
                            <TestimonialNav
                                onPrev={prev}
                                onNext={next}
                                disabled={count <= 1}
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN (65%) - Animated Quote */}
                    <div className="lg:col-span-8 lg:col-start-5 min-h-[280px] flex flex-col order-2">
                        <AnimatePresence mode="wait">
                            {activeItem && (
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25, ease: "easeOut" }}
                                    className="w-full"
                                >
                                    <TestimonialQuote testimonial={activeItem} />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Desktop Pagination Bar (Dots Left, CTA Right) */}
                        <div className="hidden lg:flex items-center justify-between mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800/50 w-full">
                            <TestimonialDots
                                count={count}
                                activeIndex={activeIndex}
                                onGoTo={goTo}
                            />

                            <button
                                onClick={handleOpen}
                                className="h-11 px-6 rounded-full bg-[#245BFF] text-white font-medium shadow-md shadow-blue-500/15 hover:bg-[#1E4BE6] transition-all duration-200"
                            >
                                Write a review
                            </button>
                        </div>

                        {/* Mobile Stack (Vertical: Dots -> CTA) */}
                        <div className="lg:hidden mt-8 flex flex-col items-center gap-6 w-full">
                            <TestimonialDots
                                count={count}
                                activeIndex={activeIndex}
                                onGoTo={goTo}
                            />

                            <button
                                onClick={handleOpen}
                                className="h-11 px-6 w-full max-w-[200px] rounded-full bg-[#245BFF] text-white font-medium shadow-md shadow-blue-500/15 hover:bg-[#1E4BE6] transition-all duration-200"
                            >
                                Write a review
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <Dialog open={modalOpen} onClose={handleClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4, p: 1 } }}>
                <DialogTitle sx={{ fontWeight: 800 }}>Write a Review</DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <TextField
                            label="Your Name"
                            fullWidth
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            label="Job Title / Role (e.g. Student, Manager)"
                            fullWidth
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-neutral-600">Rating</span>
                            <Rating
                                value={formData.rating}
                                onChange={(e, newValue) => setFormData({ ...formData, rating: newValue })}
                                size="large"
                            />
                        </div>
                        <TextField
                            label="Your Review"
                            fullWidth
                            required
                            multiline
                            rows={4}
                            value={formData.quote}
                            onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions sx={{ p: 2, pt: 3 }}>
                        <Button onClick={handleClose} sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600 }}>Cancel</Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading || !formData.name || !formData.quote}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 700,
                                borderRadius: 2,
                                px: 3,
                                boxShadow: '0 4px 14px rgba(38, 65, 245, 0.3)'
                            }}
                        >
                            {loading ? "Submitting..." : "Submit Review"}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            <Snackbar
                open={status.open}
                autoHideDuration={4000}
                onClose={() => setStatus({ ...status, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={status.type} sx={{ borderRadius: 2, fontWeight: 500 }}>
                    {status.text}
                </Alert>
            </Snackbar>
        </section>
    );
}
