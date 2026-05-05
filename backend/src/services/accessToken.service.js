const jwt = require('jsonwebtoken');

function signAccessToken(payload) {
  const expiresIn = `${parseInt(process.env.JWT_ACCESS_EXPIRES_MIN || '15', 10)}m`;
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { signAccessToken, verifyAccessToken };
