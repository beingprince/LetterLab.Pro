import React, { useState } from "react";
import { Box, Container, Typography, TextField, Button, MenuItem, Paper, Snackbar, Alert } from "@mui/material";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        topic: "Other",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ open: false, type: "success", text: "" });

    const topics = ['Feedback', 'Bug', 'Collaboration', 'Other', 'Talent waitlist'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
            const response = await fetch(`${apiBase}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                setStatus({ open: true, type: "success", text: "Message sent successfully!" });
                setFormData({ name: "", email: "", topic: "Other", message: "" });
            } else {
                setStatus({ open: true, type: "error", text: data.error || "Failed to send message." });
            }
        } catch (error) {
            setStatus({ open: true, type: "error", text: "Network error occurred." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", pt: { xs: 12, md: 16 }, pb: 12, background: 'linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 100%)' }}>
            <Container maxWidth="sm">
                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid', borderColor: 'divider', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                    <Typography variant="h3" sx={{ mb: 1, fontWeight: 800 }}>Contact Us</Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
                        Have a question or feedback? We'd love to hear from you.
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Your Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            sx={{ mb: 3 }}
                        />
                        <TextField
                            select
                            fullWidth
                            label="Topic"
                            name="topic"
                            value={formData.topic}
                            onChange={handleChange}
                            sx={{ mb: 3 }}
                        >
                            {topics.map((option) => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            label="Message"
                            name="message"
                            multiline
                            rows={4}
                            value={formData.message}
                            onChange={handleChange}
                            required={formData.topic !== 'Talent waitlist'}
                            sx={{ mb: 4 }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={loading}
                            sx={{
                                py: 1.5,
                                fontSize: '1rem',
                                fontWeight: 700,
                                borderRadius: 2,
                                textTransform: 'none',
                                boxShadow: '0 4px 14px rgba(38, 65, 245, 0.3)'
                            }}
                        >
                            {loading ? "Sending..." : "Submit Message"}
                        </Button>
                    </form>
                </Paper>
            </Container>

            <Snackbar
                open={status.open}
                autoHideDuration={6000}
                onClose={() => setStatus({ ...status, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={status.type} sx={{ width: '100%', borderRadius: 2, fontWeight: 500 }}>
                    {status.text}
                </Alert>
            </Snackbar>
        </Box>
    );
}
