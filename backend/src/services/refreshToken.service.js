const crypto = require('crypto');
const pool = require('../config/db');

function hashToken(raw) {
  return crypto.createHash('sha256').update(raw, 'utf8').digest('hex');
}

function generateRawRefreshToken() {
  return crypto.randomBytes(48).toString('hex');
}

async function storeRefreshToken(userId, rawToken) {
  const hash = hashToken(rawToken);
  const days = parseInt(process.env.REFRESH_TOKEN_DAYS || '7', 10);
  const expiresAt = new Date(Date.now() + Math.max(1, days) * 24 * 60 * 60 * 1000);

  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [userId, hash, expiresAt]
  );
  return expiresAt;
}

async function validateAndConsumeRefreshToken(rawToken) {
  if (!rawToken || typeof rawToken !== 'string') {
    return null;
  }
  const hash = hashToken(rawToken);
  const result = await pool.query(
    `SELECT rt.*, u.id AS uid, u.role
     FROM refresh_tokens rt
     JOIN users u ON u.id = rt.user_id
     WHERE rt.token_hash = $1 AND rt.expires_at > NOW()`,
    [hash]
  );
  if (result.rows.length === 0) {
    return null;
  }
  const row = result.rows[0];
  await pool.query('DELETE FROM refresh_tokens WHERE id = $1', [row.id]);
  return { userId: row.uid, role: row.role };
}

async function revokeAllForUser(userId) {
  await pool.query('DELETE FROM refresh_tokens WHERE user_id = $1', [userId]);
}

module.exports = {
  generateRawRefreshToken,
  storeRefreshToken,
  validateAndConsumeRefreshToken,
  revokeAllForUser,
};
