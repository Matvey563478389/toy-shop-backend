const { readAccessToken } = require('../config/authCookies');
const { verifyAccessToken } = require('../services/accessToken.service');

exports.protect = async (req, res, next) => {
  try {
    let token = readAccessToken(req);
    if (!token && req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Срок действия сессии истёк' });
    }
    return res.status(401).json({ message: 'Недействительный токен' });
  }
};
