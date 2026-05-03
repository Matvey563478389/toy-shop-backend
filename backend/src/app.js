const express = require('express');
const pool = require('./config/db');
const router = require('./routes')
const cors = require('cors')
const path = require('path')

const app = express();
const PORT = process.env.PORT || 3000;

const defaultCorsOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const extraOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultCorsOrigins, ...extraOrigins])];

if (pool?.query) {
  pool.query('SELECT NOW()', (error, response) => {
    if (error) console.error(`Error connecting to database ${process.env.DATABASE_NAME}`, error.stack)

    console.log(`Connected to database ${process.env.DATABASE_NAME}`, response?.rows?.[0].now)
  })
}

app.use(cors({
  origin: (requestOrigin, callback) => {
    if (!requestOrigin) return callback(null, true);
    if (allowedOrigins.includes(requestOrigin)) return callback(null, true);
    callback(null, false);
  },
  credentials: true
}));

app.use('/images', express.static(path.join(process.cwd(), 'public', 'images')));

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use('/images', express.static('public/images'));
app.use(router)

const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
    console.log(`Server started on http://${HOST}:${PORT}`);
});