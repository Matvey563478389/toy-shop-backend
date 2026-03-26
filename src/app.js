const express = require('express');
const pool = require('./config/db');
const router = require('./routes/index')


const app = express();
const PORT = process.env.PORT || 3000;

if (pool?.query) {
  pool.query('SELECT NOW()', (error, response) => {
    if (error) console.error(`Error connecting to database ${process.env.DATABASE_NAME}`, error.stack)

    console.log(`Connected to database ${process.env.DATABASE_NAME}`, response?.rows?.[0].now)
  })
}
app.use(express.json());

app.use(router)

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});