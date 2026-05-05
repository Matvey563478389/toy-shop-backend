const pool = require('../config/db');
const bcrypt = require('bcrypt');
const {
  setAccessTokenCookie,
  setRefreshTokenCookie,
  clearAuthCookies,
  readRefreshToken,
} = require('../config/authCookies');
const { signAccessToken } = require('../services/accessToken.service');
const {
  generateRawRefreshToken,
  storeRefreshToken,
  validateAndConsumeRefreshToken,
  revokeAllForUser,
} = require('../services/refreshToken.service');

async function issueSession(res, userRow) {
  await revokeAllForUser(userRow.id);
  const access = signAccessToken({ id: userRow.id, role: userRow.role });
  const rawRefresh = generateRawRefreshToken();
  await storeRefreshToken(userRow.id, rawRefresh);
  setAccessTokenCookie(res, access);
  setRefreshTokenCookie(res, rawRefresh);
}

exports.refreshSession = async (req, res) => {
  try {
    const raw = readRefreshToken(req);
    const session = await validateAndConsumeRefreshToken(raw);
    if (!session) {
      clearAuthCookies(res);
      return res.status(401).json({ message: 'Сессия недействительна или истекла' });
    }

    const userRes = await pool.query('SELECT id, role FROM users WHERE id = $1', [session.userId]);
    if (userRes.rows.length === 0) {
      clearAuthCookies(res);
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    const user = userRes.rows[0];
    const newAccess = signAccessToken({ id: user.id, role: user.role });
    const newRaw = generateRawRefreshToken();
    await storeRefreshToken(user.id, newRaw);
    setAccessTokenCookie(res, newAccess);
    setRefreshTokenCookie(res, newRaw);

    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    clearAuthCookies(res);
    res.status(500).json({ message: 'Не удалось обновить сессию' });
  }
};

exports.logout = async (req, res) => {
  try {
    const userId = req.user;
    await revokeAllForUser(userId);
    clearAuthCookies(res);
    res.status(200).json({ message: 'Вы вышли из аккаунта' });
  } catch (e) {
    console.error(e);
    clearAuthCookies(res);
    res.status(500).json({ message: 'Ошибка при выходе' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, address, phone, created_at FROM users ORDER BY id'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const adminId = req.user;
    const userId = parseInt(req.params.id, 10);
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: 'Некорректный ID' });
    }
    if (userId === adminId) {
      return res.status(400).json({ message: 'Нельзя удалить свою учётную запись' });
    }

    const target = await pool.query('SELECT id, role FROM users WHERE id = $1', [userId]);
    if (target.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    if (target.rows[0].role === 'admin') {
      const cnt = await pool.query(
        "SELECT COUNT(*)::int AS n FROM users WHERE role = 'admin'"
      );
      if (cnt.rows[0].n <= 1) {
        return res.status(400).json({ message: 'Нельзя удалить последнего администратора' });
      }
    }

    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.status(200).json({ message: 'Пользователь удалён' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

exports.signUp = async (req, res) => {
  try {
    const { email, name, password, address, phone } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Укажите email' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Укажите пароль' });
    }
    if (!phone) {
      return res.status(400).json({ message: 'Укажите телефон' });
    }

    const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const displayName =
      (name && String(name).trim()) ||
      String(email)
        .split('@')[0]
        .slice(0, 80) ||
      'Покупатель';

    const newUserResult = await pool.query(
      'INSERT INTO users (name, email, password, address, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, role, name, email',
      [displayName, email, hashedPassword, address || null, phone || null]
    );

    const newUser = newUserResult.rows[0];
    await issueSession(res, { id: newUser.id, role: newUser.role });

    res.status(201).json({
      message: 'Регистрация успешна',
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user;
    const { name, address, phone } = req.body;

    const result = await pool.query(
      'UPDATE users SET name = $1, address = $2, phone = $3 WHERE id = $4 RETURNING id, name, email, address, phone, role',
      [name, address, phone, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Нужны email и пароль' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Пользователь не найден' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль' });
    }

    await issueSession(res, { id: user.id, role: user.role });

    res.status(200).json({
      message: 'Вход выполнен',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user;

    const result = await pool.query(
      'SELECT id, name, email, role, address, phone, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};
