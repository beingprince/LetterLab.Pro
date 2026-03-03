// backend/utils/cookieConfig.js
export function authCookieOptions() {
  const secure = process.env.COOKIE_SECURE === "true";
  const sameSite = process.env.COOKIE_SAMESITE || (secure ? "None" : "Lax");
  const domain = process.env.COOKIE_DOMAIN || undefined; // undefined on localhost

  return {
    httpOnly: true,
    secure,        // true in prod (HTTPS), false on localhost (http)
    sameSite,      // 'None' in prod; 'Lax' in dev
    domain,        // .letterlab.pro in prod; undefined in dev
    path: "/",
  };
}

export function issueSessionCookies(res, { accessToken, refreshToken }) {
  const opts = authCookieOptions();
  // 15 minutes access
  res.cookie("ll_access", accessToken, { ...opts, maxAge: 15 * 60 * 1000 });
  // 30 days refresh
  res.cookie("ll_refresh", refreshToken, { ...opts, maxAge: 30 * 24 * 60 * 60 * 1000 });
}
