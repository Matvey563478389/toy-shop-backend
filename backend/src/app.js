const express = require('express');
const pool = require('./config/db');
const router = require('./routes')
const cors = require('cors')
const path = require('path')

const app = express();
const PORT = process.env.PORT || 3000;

if (pool?.query) {
  pool.query('SELECT NOW()', (error, response) => {
    if (error) console.error(`Error connecting to database ${process.env.DATABASE_NAME}`, error.stack)

    console.log(`Connected to database ${process.env.DATABASE_NAME}`, response?.rows?.[0].now)
  })
}

app.use(cors({
  origin: 'http://localhost:5173',
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

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});