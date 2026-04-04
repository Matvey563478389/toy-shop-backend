const pool = require('../config/db');

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user;
    const { items, totalPrice, address, phone } = req.body;

    const result = await pool.query(
      'INSERT INTO orders (user_id, items, total_price, address, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, JSON.stringify(items), totalPrice, address, phone]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user;
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, u.name as user_name, u.email as user_email 
      FROM orders o 
      JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};