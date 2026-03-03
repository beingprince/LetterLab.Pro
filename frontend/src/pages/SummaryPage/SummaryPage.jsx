import React from "react";
import { Box, Typography, Button } from "@mui/material";
import SummaryHeader from "../../components/summary/SummaryHeader";
import SummaryHeroCard from "../../components/summary/SummaryHeroCard";
import SummaryInsightGrid from "../../components/summary/SummaryInsightGrid";
import SummaryFooterMeta from "../../components/summary/SummaryFooterMeta";
import SummaryActionButtons from "../../components/summary/SummaryActionButtons";

// --- MOCK DATA FOR DEV ---
const MOCK_SUMMARY = {
    threadId: "thread-123",
    subject: "Project Roadmap Update - Q2 2026",
    from: { name: "Alex Chen", email: "alex.chen@acme.com", roleLabel: "Product Lead" },
    cc: [{ name: "Sarah", email: "sarah@acme.com", roleLabel: "Engineering" }],
    date: "Oct 24, 2:30 PM",
    urgency: "medium", // high, medium, low
    deadline: { text: "Reply by Friday" },
    threadSummary:
        "Alex is requesting your feedback on the Q2 roadmap timeline. The team needs sign-off by Friday to start the API migration. He highlights that backend work is on track but frontend needs a buffer week.",
    actionRequired: "Approve/reject buffer week & confirm Friday deadline.",
    keyPoints: [
        "Backend migration approved and on schedule for April 10.",
        "Frontend refresh timeline is tight; Alex suggests adding 1 buffer week.",
        "Needs confirmation if the Friday deadline for sign-off works for you.",
    ],
    respondTo: [
        "Validate if the buffer week impacts the Beta Launch date (May 20).",
        "Confirm you can review the doc by Friday.",
    ],
    tone: { sentiment: "professional", confidence: 0.9 },
    openQuestions: ["Should we push the Beta Launch if we add the buffer?"],
};

// --- MAIN PAGE ---
const SummaryPage = ({ threadId, isEmbedded = false, onDraft, provider = 'gmail', initialData = null }) => {
    const [data, setData] = React.useState(initialData || null);
    const [loading, setLoading] = React.useState(!initialData && !!threadId);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        if (initialData) {
            setData(initialData);
            setLoading(false);
            return;
        }
        if (!threadId) {
            setData(MOCK_SUMMARY);
            setLoading(false);
            return;
        }

        const stripHtml = (html) => {
            const temp = document.createElement('div');
            temp.innerHTML = html;
            return temp.textContent || temp.innerText || "";
        };

        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("authToken");

                if (!token) {
                    window.location.href = "/";
                    return;
                }

                const endpoint = provider === 'outlook'
                    ? `/api/outlook/threads/${threadId}`
                    : `/api/gmail/threads/${threadId}`;

                const threadRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (threadRes.status === 401) {
                    try {
                        window.dispatchEvent(new Event("llp_session_expired"));
                    } catch (_) { }
                    throw new Error("Session expired. Please log in again.");
                }

                if (!threadRes.ok) {
                    const errText = await threadRes.text();
                    throw new Error(`Failed to fetch email thread: ${errText}`);
                }
                const threadData = await threadRes.json();

                const simplifiedMessages = threadData.messages.map(msg => ({
                    ...msg,
                    body: stripHtml(msg.body).substring(0, 15000)
                }));

                const aiRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/ai/analyze-thread-structured`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ threadContent: simplifiedMessages })
                });

                if (aiRes.status === 401) {
                    try {
                        window.dispatchEvent(new Event("llp_session_expired"));
                    } catch (_) { }
                    throw new Error("Session expired. Please log in again.");
                }

                if (!aiRes.ok) throw new Error("AI analysis failed");
                const aiData = await aiRes.json();

                const firstMsg = threadData.messages[0];
                const lastMsg = threadData.messages[threadData.messages.length - 1];

                const fromName = firstMsg.from.includes('<')
                    ? firstMsg.from.split('<')[0].trim().replace(/"/g, '')
                    : firstMsg.from;
                const fromEmail = firstMsg.from.match(/<(.+)>/)?.[1] || firstMsg.from;

                const realData = {
                    ...aiData,
                    threadId: threadId,
                    subject: firstMsg.subject,
                    from: { name: fromName, email: fromEmail },
                    date: new Date(lastMsg.date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    cc: [],
                    rawMessages: threadData.messages
                };

                setData(realData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [threadId, provider, initialData]);

    const handleDraftReply = () => {
        if (isEmbedded && onDraft) {
            onDraft(data);
            return;
        }
        alert(`Drafting reply for thread: ${data.threadId}`);
    };

    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: isEmbedded ? "50vh" : "100vh",
                    bgcolor: isEmbedded ? "transparent" : "background.default",
                    pt: isEmbedded ? 10 : 20,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                    {[0, 1, 2].map((i) => (
                        <Box
                            key={i}
                            sx={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                bgcolor: "primary.main",
                                animation: "pulse 1.4s ease-in-out infinite both",
                                animationDelay: `${i * 0.16}s`,
                                "@keyframes pulse": {
                                    "0%, 80%, 100%": { opacity: 0.3, transform: "scale(0.8)" },
                                    "40%": { opacity: 1, transform: "scale(1)" },
                                },
                            }}
                        />
                    ))}
                </Box>
                <Typography sx={{ fontSize: "0.9375rem", fontWeight: 600, color: "text.secondary" }}>
                    Analyzing conversation...
                </Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    minHeight: isEmbedded ? "50vh" : "100vh",
                    bgcolor: isEmbedded ? "transparent" : "background.default",
                    pt: isEmbedded ? 10 : 20,
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "error.main" }}>
                    Unable to load summary
                </Typography>
                <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>{error}</Typography>
                <Button variant="outlined" onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </Box>
        );
    }

    if (!data) return null;

    const providerLabel = provider === "outlook" ? "Outlook" : "Gmail";
    const threadCount = data.rawMessages?.length ?? null;

    const containerSx = isEmbedded
        ? { pt: 1, pb: 2, px: 2, maxWidth: "100%", flex: 1, minHeight: 0, overflowY: "auto" }
        : {
            maxWidth: 1160,
            mx: "auto",
            px: { xs: 2, md: 4 },
            pt: { xs: 5, md: 8 },
            pb: 8,
        };

    return (
        <Box
            sx={{
                minHeight: isEmbedded ? 0 : "100vh",
                height: isEmbedded ? "100%" : "auto",
                display: isEmbedded ? "flex" : "block",
                flexDirection: isEmbedded ? "column" : undefined,
                bgcolor: isEmbedded ? "transparent" : "background.default",
                pb: isEmbedded ? 0 : 14,
                position: "relative",
                overflow: isEmbedded ? "hidden" : undefined,
                "&::before": isEmbedded ? undefined : {
                    content: '""',
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59,130,246,0.08), transparent)",
                    pointerEvents: "none",
                    zIndex: 0,
                },
            }}
        >
            <Box sx={{ position: "relative", zIndex: 1, flex: isEmbedded ? 1 : undefined, minHeight: isEmbedded ? 0 : undefined, display: isEmbedded ? "flex" : "block", flexDirection: isEmbedded ? "column" : undefined, overflow: isEmbedded ? "hidden" : undefined }}>
                <Box sx={containerSx}>
                    {/* GreetingHeader removed for launch stability */}
                    <SummaryHeader
                        subject={data.subject}
                        from={data.from}
                        cc={data.cc}
                        date={data.date}
                        deadline={data.deadline}
                        providerLabel={providerLabel}
                        threadCount={threadCount}
                    />

                    {/* 2-column: left = summary + AI confidence, right = insights (math-balanced) */}
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(0, 1fr)" },
                            gap: { xs: 4, md: 5 },
                            alignItems: "stretch",
                            mb: 4,
                        }}
                    >
                        <Box
                            sx={(theme) => ({
                                minWidth: 0,
                                pr: { md: 3 },
                                borderRight: {
                                    md: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                                },
                                display: "flex",
                                flexDirection: "column",
                                gap: 3,
                                minHeight: 0,
                            })}
                        >
                            <SummaryHeroCard threadSummary={data.threadSummary} />
                            <Box sx={{ flex: 1, minHeight: 16 }} />
                            <SummaryFooterMeta
                                confidence={data.tone?.confidence}
                                generatedAt={data.date}
                                providerLabel={providerLabel}
                            />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                            <SummaryInsightGrid
                                actionRequired={data.actionRequired}
                                keyPoints={data.keyPoints}
                                respondTo={data.respondTo}
                                tone={data.tone}
                                openQuestions={data.openQuestions}
                                urgency={data.urgency}
                            />
                        </Box>
                    </Box>
                </Box>
            </Box>

            <SummaryActionButtons
                onCopy={() => navigator.clipboard.writeText(data.threadSummary)}
                onDraft={handleDraftReply}
                isEmbedded={isEmbedded}
            />
        </Box>
    );
};

export default SummaryPage;
