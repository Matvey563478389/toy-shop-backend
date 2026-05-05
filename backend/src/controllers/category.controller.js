const pool = require('../config/db');

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

exports.listCategoriesPublic = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, slug, name_ru, sort_order FROM categories WHERE active = true ORDER BY sort_order ASC, id ASC`
    );
    res.status(200).json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка загрузки категорий' });
  }
};

exports.listCategoriesAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.*, (SELECT COUNT(*)::int FROM toys t WHERE t.category_id = c.id) AS toys_count
       FROM categories c ORDER BY c.sort_order ASC, c.id ASC`
    );
    res.status(200).json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка загрузки категорий' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { slug, name_ru, sort_order, active } = req.body;
    const s = String(slug || '')
      .trim()
      .toLowerCase();
    if (!s || !SLUG_RE.test(s)) {
      return res.status(400).json({
        message: 'Код категории (slug): только латиница в нижнем регистре, цифры и дефис',
      });
    }
    const name = String(name_ru || '').trim();
    if (!name) {
      return res.status(400).json({ message: 'Укажите название на русском' });
    }
    const order = sort_order != null ? parseInt(String(sort_order), 10) : 0;
    const isActive = active !== false && active !== 'false';

    const result = await pool.query(
      `INSERT INTO categories (slug, name_ru, sort_order, active) VALUES ($1,$2,$3,$4) RETURNING *`,
      [s, name, Number.isNaN(order) ? 0 : order, isActive]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    if (e.code === '23505') {
      return res.status(400).json({ message: 'Категория с таким кодом уже есть' });
    }
    console.error(e);
    res.status(500).json({ message: 'Не удалось создать категорию' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Некорректный ID' });
    }

    const cur = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
    if (cur.rows.length === 0) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }
    const row = cur.rows[0];

    const { slug, name_ru, sort_order, active } = req.body;

    let s = row.slug;
    if (slug !== undefined) {
      s = String(slug)
        .trim()
        .toLowerCase();
      if (!s || !SLUG_RE.test(s)) {
        return res.status(400).json({ message: 'Некорректный код категории' });
      }
    }

    const name = name_ru !== undefined ? String(name_ru).trim() : row.name_ru;
    if (!name) {
      return res.status(400).json({ message: 'Укажите название' });
    }

    const order =
      sort_order !== undefined ? parseInt(String(sort_order), 10) : row.sort_order;
    const isActive =
      active !== undefined ? !(active === false || active === 'false') : row.active;

    const result = await pool.query(
      `UPDATE categories SET slug=$1, name_ru=$2, sort_order=$3, active=$4 WHERE id=$5 RETURNING *`,
      [s, name, Number.isNaN(order) ? 0 : order, isActive, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (e) {
    if (e.code === '23505') {
      return res.status(400).json({ message: 'Категория с таким кодом уже есть' });
    }
    console.error(e);
    res.status(500).json({ message: 'Не удалось обновить категорию' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Некорректный ID' });
    }

    const cnt = await pool.query(
      'SELECT COUNT(*)::int AS n FROM toys WHERE category_id = $1',
      [id]
    );
    if (cnt.rows[0].n > 0) {
      return res.status(400).json({
        message: 'Нельзя удалить категорию: сначала перенесите или удалите товары',
      });
    }

    const r = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING id', [id]);
    if (r.rows.length === 0) {
      return res.status(404).json({ message: 'Категория не найдена' });
    }
    res.status(200).json({ message: 'Категория удалена' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Не удалось удалить' });
  }
};
