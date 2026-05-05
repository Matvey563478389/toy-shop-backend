const ACCESS_COOKIE = 'access_token';
const REFRESH_COOKIE = 'refresh_token';

function baseCookieOptions() {
  const opts = {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: process.env.COOKIE_SAMESITE || 'lax',
    path: '/',
  };
  const domain = process.env.COOKIE_DOMAIN?.trim();
  if (domain) opts.domain = domain;
  return opts;
}

function accessTokenMaxAgeMs() {
  const m = parseInt(process.env.JWT_ACCESS_EXPIRES_MIN || '15', 10);
  return Math.max(1, m) * 60 * 1000;
}

function refreshTokenMaxAgeMs() {
  const d = parseInt(process.env.REFRESH_TOKEN_DAYS || '7', 10);
  return Math.max(1, d) * 24 * 60 * 60 * 1000;
}

function setAccessTokenCookie(res, token) {
  res.cookie(ACCESS_COOKIE, token, {
    ...baseCookieOptions(),
    maxAge: accessTokenMaxAgeMs(),
  });
}

function setRefreshTokenCookie(res, rawToken) {
  res.cookie(REFRESH_COOKIE, rawToken, {
    ...baseCookieOptions(),
    maxAge: refreshTokenMaxAgeMs(),
  });
}

function clearAuthCookies(res) {
  const opts = { ...baseCookieOptions(), maxAge: 0 };
  res.clearCookie(ACCESS_COOKIE, opts);
  res.clearCookie(REFRESH_COOKIE, opts);
}

function readAccessToken(req) {
  return req.cookies?.[ACCESS_COOKIE] || null;
}

function readRefreshToken(req) {
  return req.cookies?.[REFRESH_COOKIE] || null;
}

module.exports = {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAuthCookies,
  readAccessToken,
  readRefreshToken,
  accessTokenMaxAgeMs,
  refreshTokenMaxAgeMs,
};
