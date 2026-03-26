const pool = require('../config/db');

exports.getUsers = async (req, res) => {
 try {
    const result = await pool?.query('SELECT * FROM users')
    res.status(200).json(result.rows)
 } catch (error) {
   console.error('Error: ', error)
 }
}

exports.createUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email) res.status(400).json({ message: 'Email is required' });
    if (!password) res.status(400).json({ message: 'Password is required' });
    if (!name) res.status(400).json({ message: 'Name is required' });

    const userExist = await pool?.query('SELECT * FROM users WHERE email = $1', [email])

    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const result = await pool?.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password]
    )

    res.status(200).json(result.rows[0])
  } catch (error) {
    console.error('Error: ', error)
  }
}