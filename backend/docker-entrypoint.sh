#!/bin/sh
set -e
echo "Waiting for PostgreSQL..."
i=0
while [ "$i" -lt 45 ]; do
  if node -e "
    const { Client } = require('pg');
    const c = new Client({ connectionString: process.env.DATABASE_URL });
    c.connect().then(() => c.end()).then(() => process.exit(0)).catch(() => process.exit(1));
  " 2>/dev/null; then
    break
  fi
  i=$((i + 1))
  sleep 2
done
npm run migrate:up
exec node src/app.js
