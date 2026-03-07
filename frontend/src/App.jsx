// frontend/src/App.jsx
// LetterLab main shell
// This file controls:
// - theme (light/dark, gradient bg, glass surfaces)
// - header AppBar (fixed, translucent, flat, version menu, avatar, etc.)
// - Drawer (mobile nav / history / now Professors link)
// - path-based client routing (no react-router)
// - auth gating (forces /account if not logged in)
// - page container layout offsets (headerHeight padding, minHeight, etc.)

import React, {
  useMemo,
  useRef,
  useState,
  useEffect
} from 'react';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import { jwtDecode } from 'jwt-decode';
import { Box } from '@mui/material';

import { lightTheme } from './theme';
import Header from './components/Header';
import MobileDrawer from './components/mobileDrawer/MobileDrawer';
import MinimalHeader from './components/MinimalHeader'; // ✅ Auth Header

import HomePage from './pages/HomePage.jsx';
import DocsPage from './DocsPage';
import PrivacyPage from './PrivacyPage';
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard';
import AuthPage from './AuthPage';
import AboutPage from "./pages/AboutPage";
import OAuthSuccess from "./pages/OAuthSuccess.jsx";
import AddProfessor from './pages/AddProfessor.jsx';
import UserProfilePage from './pages/UserProfile/UserProfileLayout'; // ✅ MODULAR IMPORT

import ComposePage from './pages/ComposePage/index.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import SessionTimeoutDialog from './components/session/SessionTimeoutDialog';
import { useSessionTimeout } from './hooks/useSessionTimeout';
import { setLoginTimestamp, getLoginTimestamp, getLastActivityTimestamp, clearSession } from './components/session/sessionUtils';
import SummaryPage from './pages/SummaryPage/SummaryPage.jsx';
import TermsPage from './pages/TermsPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import FooterPage from './pages/footer/FooterPage.jsx';
import FeaturesPage from './pages/footer/product/features/index.jsx';
import StatusPage from './pages/footer/StatusPage.jsx';
import FirstLoginNoticeModal from './components/FirstLoginNoticeModal.jsx';
// import MobileBottomNav from './components/nav/MobileBottomNav.jsx'; // ❌ Removed mobile nav

// ────────────────────────────────────────────────────────────────────────────
// persistent keys / helpers
// ────────────────────────────────────────────────────────────────────────────

const LS_KEY = 'letterlab_user';

// read current "authed user" snapshot from localStorage
function getAuthUser() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || 'null');
  } catch {
    return null;
  }
}

// avatar initials
function initialsFromName(name) {
  if (!name || typeof name !== 'string') return 'U';
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  const ini = `${first}${last}`.toUpperCase();
  return ini || 'U';
}

// ────────────────────────────────────────────────────────────────────────────
// main app component
// ────────────────────────────────────────────────────────────────────────────

function App() {
  // Always use light theme
  const theme = lightTheme;

  // ── First-login notice modal ─────────────────────────────────────────────
  const NOTICE_KEY = 'letterlab_first_login_notice_seen';
  const [showLoginNotice, setShowLoginNotice] = useState(false);

  const handleDismissNotice = () => {
    setShowLoginNotice(false);
    try { localStorage.setItem(NOTICE_KEY, 'true'); } catch { /* ignore */ }
  };

  // menus / drawer anchors
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Session timeout: warn at 55min, auto-logout at 60min
  const sessionTimeout = useSessionTimeout({
    onLogout: (url) => { window.location.href = url; },
  });

  // 401-triggered session expired dialog (no blank screen)
  const [sessionExpiredOpen, setSessionExpiredOpen] = useState(false);
  useEffect(() => {
    const onExpired = () => {
      setSessionExpiredOpen(true);
    };
    window.addEventListener("llp_session_expired", onExpired);
    return () => window.removeEventListener("llp_session_expired", onExpired);
  }, []);

  const handleSessionExpiredContinue = () => {
    setSessionExpiredOpen(false);
    window.location.href = "/account";
  };

  const handleSessionExpiredLogOff = () => {
    setSessionExpiredOpen(false);
    clearSession();
    window.location.href = "/account";
  };

  const loginAt = getLoginTimestamp();
  const lastActivityAt = getLastActivityTimestamp();
  const now = Date.now();
  const loggedInDurationMs = loginAt ? Math.max(0, now - loginAt) : 0;
  const inactiveDurationMs = lastActivityAt ? Math.max(0, now - lastActivityAt) : 0;

  const [isBootstrapping, setIsBootstrapping] = useState(false);

  // header height measurement (for page offset) — single source of truth
  const HEADER_HEIGHT_DEFAULT = 72;
  const appBarRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(HEADER_HEIGHT_DEFAULT);

  useEffect(() => {
    const el = appBarRef.current;
    if (!el) return;

    const update = () =>
      setHeaderHeight(Math.round(el.getBoundingClientRect().height || 0) || HEADER_HEIGHT_DEFAULT);

    let ro = null;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(update);
      ro.observe(el);
    }

    window.addEventListener('resize', update);
    update(); // initial

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  // simple client-side routing using window.history
  const [path, setPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  // listen to browser back/forward
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // navigate helper
  const navigate = (to) => {
    if (window.location.pathname === to) return;
    window.history.pushState({}, '', to);
    setPath(to);
  };

  // auth: keep local state synced to localStorage/user changes
  const [authedUser, setAuthedUser] = useState(getAuthUser());
  useEffect(() => {
    const savedUser = getAuthUser();
    if (savedUser && !authedUser) setAuthedUser(savedUser);
  }, []);

  // Show first-login notice once per device after successful login
  useEffect(() => {
    if (!authedUser) return;
    try {
      if (localStorage.getItem(NOTICE_KEY) === 'true') return;
    } catch { /* ignore */ }
    const timer = setTimeout(() => setShowLoginNotice(true), 500);
    return () => clearTimeout(timer);
  }, [authedUser]);

  // store Outlook access token separately
  const [outlookAccessToken, setOutlookAccessToken] = useState(null);

  useEffect(() => {
    const prov = localStorage.getItem("letterlab_auth_provider");

    if (prov === "outlook") {
      // setOutlookAccessToken(stored); // 🔒 REMOVED
      // setAuthedUser({ name: null, provider: "outlook", token: stored }); // Handled by /auth/status or exchange
    }
  }, []);

  // ✅ Outlook short-code exchange handler
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const provider = params.get("provider");
    const sessionCode = params.get("session_code");

    if (provider === "outlook" && sessionCode) {
      setIsBootstrapping(true); // block redirects during login

      const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";
      fetch(`${apiBase}/api/oauth/outlook/exchange?code=${sessionCode}`)
        .then((res) => res.json())
        .then(({ jwtToken, userProfile }) => {
          if (jwtToken) {
            // store immediately
            // localStorage.setItem("letterlab_outlook_token", accessToken); // 🔒 REMOVED
            localStorage.setItem("letterlab_auth_provider", "outlook");
            setLoginTimestamp();

            const name = userProfile?.displayName ||
              (userProfile?.firstName ? `${userProfile.firstName} ${userProfile.lastName}` : null);

            const user = {
              name: name,
              email: userProfile?.email || null,
              provider: "outlook"
            };
            localStorage.setItem("letterlab_user", JSON.stringify(user));
            localStorage.setItem("authToken", jwtToken);

            // cleanup URL and send to homepage
            window.history.replaceState({}, document.title, "/");
            window.location.href = "/";
          } else {
            console.error("❌ No jwtToken returned.");
          }
        })
        .catch((err) => console.error("❌ Exchange failed:", err))
        .finally(() => setIsBootstrapping(false));
    }
  }, []);

  // ✅ Google OAuth token handler
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Store auth data
        localStorage.setItem("authToken", token);
        localStorage.setItem("letterlab_auth_provider", "google");
        setLoginTimestamp();

        // Construct user object matching the app's structure
        const user = {
          name: decoded.name,
          email: decoded.email,
          id: decoded.id,
          provider: "google"
        };
        localStorage.setItem("letterlab_user", JSON.stringify(user));

        // Update state immediately
        setAuthedUser(user);

        // Notify other components/listeners
        window.dispatchEvent(new Event('llp_auth_changed'));

        // Cleanup URL and redirect
        window.history.replaceState({}, document.title, "/");

        // ✅ Match Outlook's behavior: Force full reload to ensure clean state
        window.location.href = "/";

      } catch (err) {
        console.error("❌ Failed to decode Google token:", err);
      }
    }
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LS_KEY) setAuthedUser(getAuthUser());
    };
    const onFocus = () => setAuthedUser(getAuthUser());
    const onCustom = () => setAuthedUser(getAuthUser());

    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    window.addEventListener('llp_auth_changed', onCustom);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('llp_auth_changed', onCustom);
    };
  }, []);

  // ✅ Redirect guard: Strict Public/Protected Separation
  useEffect(() => {
    if (isBootstrapping) return;

    const jwtAuth = localStorage.getItem("authToken");
    const prov = localStorage.getItem("letterlab_auth_provider");
    const pathNow = window.location.pathname;

    const isLoggedIn = !!jwtAuth || prov === "outlook" || prov === "google";
    const isPublicRoute = pathNow === "/account" || pathNow.startsWith("/oauth-success");

    // 1. Unauthenticated User trying to access Protected Route
    //    (Everything is protected except /account and /oauth-success)
    //    Users can accidentally land on / so we redirect them to /account if not logged in.
    if (!isLoggedIn && !isPublicRoute) {
      // Allow specific public landing pages if any, otherwise lock it down.
      // For now, root '/' is treated as protected/dashboard in this new model?
      // User said: "Public: /, /pricing ... /auth/connect"
      // User said: "Protected: /app/*"
      // But currrent app structure is root-based.
      // Let's follow the user's specific request:
      // "If unauthenticated user hits /app/* → redirect to /auth/connect"
      // "If authenticated user hits /auth/connect → redirect to /app"

      // Checking existing routing... The app currently uses '/' as HomePage (Public) AND Dashboard?
      // Actually reading App.jsx: "if (path === '/') return <HomePage />;"
      // And HomePage seems to be the landing page.

      // Let's refine the guard based on "Public: /, /pricing, /auth/connect" + all footer pages
      const footerPaths = [
        '/product/features', '/product/pricing', '/product/use-cases', '/product/updates',
        '/resources/documentation', '/resources/help-center', '/resources/blog', '/resources/community',
        '/company/about', '/company/contact',
        '/legal/privacy-policy', '/legal/terms-of-service', '/legal/cookies-settings',
        '/status',
      ];
      const isFooterPath = footerPaths.some((p) => pathNow === p);
      const isPublic = pathNow === '/' || pathNow === '/pricing' || pathNow === '/account' || pathNow === '/about' || isFooterPath;
      // Note: mapping /account to /auth/connect concept for now.

      if (!isPublic && !pathNow.startsWith('/oauth-success')) {
        navigate('/account');
      }
    }

    // 2. Authenticated User trying to access Auth pages
    if (isLoggedIn && pathNow === "/account") {
      navigate("/");
    }
  }, [isBootstrapping, path]);

  // feature flag for homepage
  const HOMEPAGE_ENABLED = !!import.meta.env.VITE_HOMEPAGE_V2;

  // ────────────────────────────────────────────────────────────────────────────
  // ROUTING TABLE
  // ────────────────────────────────────────────────────────────────────────────
  const renderPage = () => {
    if (path.startsWith('/oauth-success')) {
      const OAuthSuccess = React.lazy(() => import('./pages/OAuthSuccess.jsx'));
      return (
        <React.Suspense fallback={<div>Redirecting...</div>}>
          <OAuthSuccess />
        </React.Suspense>
      );
    }

    // Account route special case
    if (path === '/account') {
      // This line was missing in your original file, which might be an error
      // return authedUser ? <AccountPage /> : <AuthPage />;
      // Sticking to your file's logic:
      return <AuthPage />;
    }

    // ✅ NEW: Profile route
    if (path === '/profile') {
      return <UserProfilePage />;
    }

    // ✅ Homepage is public - allow unauthenticated access
    if (path === '/') return <HomePage />;

    // Footer pages (public)
    if (path === '/status') return <StatusPage />;
    if (path === '/product/features') return <FeaturesPage />;

    // Redirects for removed routes
    if (path === '/product/pricing') { navigate('/product/features'); return null; }
    if (path === '/resources/help-center' || path === '/resources/blog' || path === '/resources/community' || path === '/resources/documentation') {
      navigate('/docs');
      return null;
    }

    if (path === '/product/use-cases') return <FooterPage slug="product/use-cases" />;
    if (path === '/product/updates') return <FooterPage slug="product/updates" />;
    if (path === '/company/about') return <FooterPage slug="company/about" />;
    if (path === '/company/contact') return <FooterPage slug="company/contact" />;
    if (path === '/legal/privacy-policy' || path === '/privacy') return <PrivacyPage />;
    if (path === '/legal/terms-of-service' || path === '/terms') return <TermsPage />;
    if (path === '/legal/cookies-settings') return <FooterPage slug="legal/cookies-settings" />;

    // If not logged in, show the AuthPage by default
    if (!authedUser) {
      return <AuthPage />;
    }

    // Primary chat/drafting interface (renamed from /compose)
    if (path === '/chat') {
      return (
        <ComposePage
          headerHeight={headerHeight}
          jwtToken={localStorage.getItem("authToken")}
          outlookAccessToken={outlookAccessToken}
          authProvider={localStorage.getItem("letterlab_auth_provider")}
          navigate={navigate}
        />
      );
    }

    /* Removed clean-demo route */

    if (path === '/docs') return <DocsPage />;
    if (path === '/about') return <AboutPage />;
    if (path === '/contact') return <ContactPage />;
    if (path === '/analytics') return <AnalyticsDashboard />;
    if (path === '/add-professor') return <AddProfessor />;

    // ✅ Extract threadId for Summary Page
    if (path.startsWith('/summary')) {
      const parts = path.split('/');
      // supports /summary (demo) or /summary/:threadId
      const threadId = parts[2] || null;
      return <SummaryPage threadId={threadId} />;
    }

    // ✅ Explicit Error Routes (for testing/demo)
    if (path === '/404') return <ErrorPage code={404} />;
    if (path === '/502') return <ErrorPage code={502} />;
    if (path === '/500') return <ErrorPage code={500} />;

    // ✅ Catch-all: 404 Not Found
    return <ErrorPage code={404} />;
  };

  // avatar string + aria label
  const avatarInitials = initialsFromName(authedUser?.name);
  const avatarAria = authedUser
    ? `${authedUser.name} – open account`
    : 'Sign in';

  // ────────────────────────────────────────────────────────────────────────────
  // RENDER START
  // ────────────────────────────────────────────────────────────────────────────

  return (
    <ThemeProvider theme={theme}>
      {/* baseline + global gradient background */}
      <CssBaseline />
      <GlobalStyles
        styles={{
          ':root': {
            '--app-header-height': `${headerHeight || HEADER_HEIGHT_DEFAULT}px`,
          },
          '*, *::before, *::after': { boxSizing: 'border-box' },
          'html, body, #root': { height: '100%' },
          html: {
            overflowX: 'hidden',
            overscrollBehaviorY: 'none',
          },
          body: {
            margin: 0,
            overflowX: 'hidden',
            // background gradient behind all glass surfaces
            backgroundImage: 'linear-gradient(170deg, #F7FAFF 0%, #FFFFFF 60%)',
            backgroundAttachment: 'scroll',
          },
          a: {
            textDecoration: 'none',
            color: 'inherit',
          },
        }}
      />

      {/* ────────────────────────────────────────────────────────────────────
          MOBILE DRAWER (left, mobile only)
          ──────────────────────────────────────────────────────────────────── */}
      <MobileDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        path={path}
        navigate={navigate}
        authedUser={authedUser}
      />

      <SessionTimeoutDialog
        open={sessionTimeout.dialogOpen}
        countdownSeconds={sessionTimeout.countdownSeconds}
        onContinue={sessionTimeout.onContinue}
        onLogOff={sessionTimeout.onLogOff}
        continueLoading={sessionTimeout.continueLoading}
      />

      {/* First-login notice — shows once per device after successful login */}
      <FirstLoginNoticeModal
        open={showLoginNotice}
        onClose={handleDismissNotice}
      />

      {/* ────────────────────────────────────────────────────────────────────
          APP BAR (TOP FIXED HEADER)
          ──────────────────────────────────────────────────────────────────── */}
      {path === '/account' || path.startsWith('/oauth-success') ? (
        <MinimalHeader theme={theme} />
      ) : (
        <Header
          appBarRef={appBarRef}
          theme={theme}
          path={path}
          setIsDrawerOpen={setIsDrawerOpen}
          navigate={navigate}
          authedUser={authedUser}
        />
      )}


      {/* ────────────────────────────────────────────────────────────────────
          PAGE SURFACE
          ──────────────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          pt: path === '/'
            ? 0
            : {
              xs: 'calc(var(--app-header-height, 72px) + 16px)',
              md: 'calc(var(--app-header-height, 72px) + 24px)',
            },
          pb: 0,
          minHeight: '100dvh',
          isolation: 'isolate',
          position: 'relative',
          zIndex: path === '/' ? 0 : 1,
          p: 0,
        }}
      >
        {path === '/' ? (
          <HomePage />
        ) : (
          <Box sx={{ px: { xs: 1.5, sm: 3 }, py: { xs: 2, sm: 3 } }}>
            {renderPage()}
          </Box>
        )}
      </Box>
    </ThemeProvider >
  );
}

export default App;