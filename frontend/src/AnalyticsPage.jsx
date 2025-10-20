// frontend/src/AnalyticsPage.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Stack,
  Button,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Area,
} from "recharts";

/**
 * LetterLab Pro — Analytics (GSC-style)
 * Adds: glass fill on panels + 5-row paging with metric selector for "top" logic.
 */

// --- dummy data utilities ---
function seededRand(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}
function formatDate(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function generateSeries(days) {
  const today = new Date();
  const out = [];
  let cum = 0;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const seed = Number(formatDate(d).replaceAll("-", ""));
    const dailyTokens = Math.round(600 + seededRand(seed) * 1400);
    const emailsDrafted = Math.max(1, Math.round(1 + seededRand(seed + 7) * 6));
    cum += dailyTokens;
    out.push({ date: formatDate(d), dailyTokens, totalTokens: cum, emailsDrafted });
  }
  return out;
}

// --- KPI helpers ---
const sum = (arr, key) => arr.reduce((acc, x) => acc + (x[key] || 0), 0);
const avg = (arr, key) => (arr.length ? sum(arr, key) / arr.length : 0);

export default function AnalyticsPage() {
  const [range, setRange] = useState(30); // 7 / 30 / 90
  const [active, setActive] = useState(["total", "daily", "emails"]); // lines toggles
  const [topMetric, setTopMetric] = useState("dailyTokens"); // which metric defines "top"
  const [rowsShown, setRowsShown] = useState(5); // 5-row paging

  const data = useMemo(() => generateSeries(range), [range]);

  // KPIs
  const kpiTotalTokens = sum(data, "dailyTokens");
  const kpiAvgTokens = Math.round(avg(data, "dailyTokens"));
  const kpiEmails = sum(data, "emailsDrafted");
  const kpiAvgEmails = (kpiEmails / (data.length || 1)).toFixed(1);

  const showTotal = active.includes("total");
  const showDaily = active.includes("daily");
  const showEmails = active.includes("emails");

  // Build a "top days" list based on the selected metric (desc)
  const sortedForTop = useMemo(() => {
    const arr = [...data];
    arr.sort((a, b) => (b[topMetric] || 0) - (a[topMetric] || 0));
    return arr;
  }, [data, topMetric]);

  const visibleRows = sortedForTop.slice(0, rowsShown);
  const canShowMore = rowsShown < sortedForTop.length;

  // Reset paging when range or metric changes
  React.useEffect(() => { setRowsShown(5); }, [range, topMetric]);

  return (
    <Box component="main" sx={{ py: { xs: 5, md: 7 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={1.5}
          sx={{ mb: 2 }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Analytics
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button size="small" variant={range === 7 ? "contained" : "outlined"} onClick={() => setRange(7)}>
              Last 7D
            </Button>
            <Button size="small" variant={range === 30 ? "contained" : "outlined"} onClick={() => setRange(30)}>
              Last 30D
            </Button>
            <Button size="small" variant={range === 90 ? "contained" : "outlined"} onClick={() => setRange(90)}>
              Last 90D
            </Button>
          </Stack>
        </Stack>

        {/* KPI Row */}
        <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
          <Grid item xs={6} md={3}>
            <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Total tokens
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Consolas','Menlo','Monaco','Courier New',monospace",
                  fontWeight: 800,
                  fontSize: "1.8rem",
                  letterSpacing: 0.3,
                  mt: 0.5,
                }}
              >
                {kpiTotalTokens.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Avg daily tokens
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Consolas','Menlo','Monaco','Courier New',monospace",
                  fontWeight: 800,
                  fontSize: "1.8rem",
                  letterSpacing: 0.3,
                  mt: 0.5,
                }}
              >
                {kpiAvgTokens.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Emails drafted
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Consolas','Menlo','Monaco','Courier New',monospace",
                  fontWeight: 800,
                  fontSize: "1.8rem",
                  letterSpacing: 0.3,
                  mt: 0.5,
                }}
              >
                {kpiEmails.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Avg emails / day
              </Typography>
              <Typography
                sx={{
                  fontFamily: "'Consolas','Menlo','Monaco','Courier New',monospace",
                  fontWeight: 800,
                  fontSize: "1.8rem",
                  letterSpacing: 0.3,
                  mt: 0.5,
                }}
              >
                {kpiAvgEmails}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Series toggles + date range chip */}
        <Paper
          variant="outlined"
          sx={{
            p: 1,
            mb: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
            background: (t) => (t.palette.mode === 'dark' ? 'rgba(20,26,34,0.55)' : 'rgba(255,255,255,0.75)'),
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <Typography variant="body2" sx={{ mr: 1, color: "text.secondary" }}>
            Metrics
          </Typography>
          <ToggleButtonGroup value={active} onChange={(_, val) => val && setActive(val)} size="small">
            <ToggleButton value="total">Total tokens</ToggleButton>
            <ToggleButton value="daily">Daily tokens</ToggleButton>
            <ToggleButton value="emails">Emails drafted</ToggleButton>
          </ToggleButtonGroup>
          <Chip sx={{ ml: "auto" }} size="small" label={`${data[0]?.date} → ${data[data.length - 1]?.date}`} />
        </Paper>

        {/* Main Chart */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 1.5,
            background: (t) => (t.palette.mode === 'dark' ? 'rgba(20,26,34,0.55)' : 'rgba(255,255,255,0.75)'),
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <Box sx={{ width: "100%", height: 360 }}>
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} minTickGap={24} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  width={64}
                  tickFormatter={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
                />
                <Tooltip />
                <Legend />
                {showDaily && (
                  <Area
                    type="monotone"
                    dataKey="dailyTokens"
                    stroke="#60A5FA"
                    fill="#60A5FA"
                    fillOpacity={0.08}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )}
                {showTotal && (
                  <Line
                    type="monotone"
                    dataKey="totalTokens"
                    stroke="#00A3FF"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )}
                {showEmails && (
                  <Line
                    type="monotone"
                    dataKey="emailsDrafted"
                    stroke="#34D399"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>

        {/* Top-N Table with 5-row paging */}
        <Paper
          variant="outlined"
          sx={{
            background: (t) => (t.palette.mode === 'dark' ? 'rgba(20,26,34,0.55)' : 'rgba(255,255,255,0.78)'),
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mr: 1 }}>
              Sort top days by
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={topMetric}
              onChange={(_, v) => v && setTopMetric(v)}
            >
              <ToggleButton value="dailyTokens">Daily tokens</ToggleButton>
              <ToggleButton value="emailsDrafted">Emails drafted</ToggleButton>
              <ToggleButton value="totalTokens">Total tokens</ToggleButton>
            </ToggleButtonGroup>
            <Chip sx={{ ml: 'auto' }} size="small" label={`${visibleRows.length} / ${sortedForTop.length} shown`} />
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell align="right">Daily tokens</TableCell>
                  <TableCell align="right">Total tokens</TableCell>
                  <TableCell align="right">Emails drafted</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((row) => (
                  <TableRow key={row.date}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell align="right">{row.dailyTokens.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.totalTokens.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.emailsDrafted.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ p: 1.25, textAlign: "right", display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            {canShowMore ? (
              <Button size="small" variant="outlined" onClick={() => setRowsShown((n) => Math.min(n + 5, sortedForTop.length))}>
                Show 5 more
              </Button>
            ) : (
              <Button size="small" variant="outlined" onClick={() => setRowsShown(5)}>
                Collapse
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
