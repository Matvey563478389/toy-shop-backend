const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getUsers = async (req, res) => {
 try {
    const result = await pool?.query('SELECT * FROM users')
    res.status(200).json(result.rows)
 } catch (error) {
   console.error('Error: ', error)
   res.status(500).json({ message: 'Internal server error' });
 }
}

exports.signUp = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email) res.status(400).json({ message: 'Email is required' });
    if (!password) res.status(400).json({ message: 'Password is required' });
    if (!name) res.status(400).json({ message: 'Name is required' });

    const userExist = await pool?.query('SELECT * FROM users WHERE email = $1', [email])

    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUserResult = await pool?.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );

    const newUser = newUserResult.rows[0];

    const token = jwt.sign(
      {
        id: newUser.id,
        role: newUser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.status(201).json({ message: 'User created successfully', token: token})
  } catch (error) {
    console.error('Error: ', error)
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

    const result = await pool?.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) return res.status(400).json({ message: 'User not found' });

    const user = result.rows[0]

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.status(200).json({ message: 'User signed in successfully', token: token })
  } catch (error) {
    console.error('Error: ', error)
    res.status(500).json({ message: 'Internal server error' });
  }
}

exports.getMe = async (req, res) => {
  try {
    const userId = req.user;

    const result = await pool?.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};