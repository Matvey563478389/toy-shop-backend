const pool = require('../config/db');

exports.getToys = async (req, res) => {
  try {
    const result = await pool?.query('SELECT * FROM toys ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createToy = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const imageUrl = req.file ? `/images/${req.file.filename}` : null;

    const result = await pool?.query(
      'INSERT INTO toys (title, description, price, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, description, price, imageUrl]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating toy' });
  }
};

exports.updateToy = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price } = req.body;
    let query = 'UPDATE toys SET title=$1, description=$2, price=$3';
    let values = [title, description, price];

    if (req.file) {
      query += ', image_url=$4 WHERE id=$5 RETURNING *';
      values.push(`/images/${req.file.filename}`, id);
    } else {
      query += ' WHERE id=$4 RETURNING *';
      values.push(id);
    }

    const result = await pool?.query(query, values);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error updating toy' });
  }
};

exports.deleteToy = async (req, res) => {
  try {
    const { id } = req.params;
    await pool?.query('DELETE FROM toys WHERE id = $1', [id]);
    res.status(200).json({ message: 'Toy deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting toy' });
  }
};