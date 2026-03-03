
import React from "react";
import { Box, Container, Typography } from "@mui/material";

export default function ContactPage() {
    return (
        <Box sx={{ minHeight: "80vh", pt: 12, pb: 12 }}>
            <Container maxWidth="md">
                <Typography variant="h2" sx={{ mb: 4, fontWeight: 800 }}>
                    Contact Us
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    Please use the contact form in the footer to reach us.
                </Typography>
            </Container>
        </Box>
    );
}
