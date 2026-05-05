require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { Client } = require('pg');
const { execSync } = require('child_process');
const path = require('path');

const backendRoot = path.join(__dirname, '..');

function run(cmd) {
  execSync(cmd, { cwd: backendRoot, stdio: 'inherit', env: process.env });
}

async function main() {
  const { DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME } =
    process.env;

  if (!DATABASE_NAME) {
    console.error('В .env не задано DATABASE_NAME');
    process.exit(1);
  }

  const client = new Client({
    user: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    host: DATABASE_HOST || 'localhost',
    port: DATABASE_PORT || 5432,
    database: DATABASE_NAME,
  });

  console.log(`Сброс схемы public в базе «${DATABASE_NAME}»…`);
  await client.connect();
  await client.query('DROP SCHEMA IF EXISTS public CASCADE');
  await client.query('CREATE SCHEMA public');
  await client.query('GRANT ALL ON SCHEMA public TO CURRENT_USER');
  await client.query('GRANT ALL ON SCHEMA public TO public');
  await client.end();

  console.log('Миграции…');
  run('npx node-pg-migrate up');

  console.log('Сид…');
  run('node seed.js');

  console.log('Готово: БД пустая по данным заказов/сессий, категории и товары из миграций+сида.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
