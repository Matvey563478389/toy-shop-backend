const bcrypt = require('bcrypt');

exports.up = async (pgm) => {
  const { ADMIN_EMAIL, ADMIN_NAME, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn('⚠️ Пропуск создания админа: ADMIN_EMAIL или ADMIN_PASSWORD не найдены в .env');
    return;
  }

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

  pgm.sql(`
    INSERT INTO users (name, email, password, role)
    VALUES ('${ADMIN_NAME || 'Admin'}', '${ADMIN_EMAIL}', '${hashedPassword}', 'admin')
    ON CONFLICT (email) DO NOTHING;
  `);
};

exports.down = (pgm) => {
  const email = process.env.ADMIN_EMAIL;
  if (email) {
    pgm.sql(`DELETE FROM users WHERE email = '${email}';`);
  }
};