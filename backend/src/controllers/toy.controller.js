const pool = require('../config/db');

const SORT_MAP = {
  default: 't.created_at DESC',
  price_asc: 't.price ASC',
  price_desc: 't.price DESC',
  newest: 't.created_at DESC',
};

const SELECT_TOY = `
  SELECT t.*, cat.slug AS category_slug, cat.name_ru AS category_name
  FROM toys t
  LEFT JOIN categories cat ON cat.id = t.category_id
`;

async function resolveCategoryId(body, currentId) {
  const raw = body.category_id ?? body.category;
  if (raw === undefined || raw === null || raw === '') {
    return currentId;
  }
  const n = parseInt(String(raw), 10);
  if (!Number.isNaN(n)) {
    const r = await pool.query('SELECT id FROM categories WHERE id = $1', [n]);
    if (r.rows[0]) return r.rows[0].id;
  }
  const slug = String(raw).trim().toLowerCase();
  const r = await pool.query('SELECT id FROM categories WHERE slug = $1', [slug]);
  if (!r.rows[0]) {
    const err = new Error('BAD_CATEGORY');
    err.status = 400;
    throw err;
  }
  return r.rows[0].id;
}

async function defaultCategoryId() {
  const r = await pool.query(
    'SELECT id FROM categories WHERE active = true ORDER BY sort_order ASC, id ASC LIMIT 1'
  );
  if (!r.rows[0]) {
    throw Object.assign(new Error('NO_CATEGORIES'), { status: 500 });
  }
  return r.rows[0].id;
}

exports.getToys = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      q,
      sort = 'default',
      page = '1',
      limit = '24',
      group,
    } = req.query;

    const conditions = [];
    const params = [];
    let i = 1;

    if (category) {
      conditions.push(`(cat.slug = $${i} OR cat.id::text = $${i})`);
      params.push(String(category));
      i += 1;
    }
    if (group) {
      conditions.push(`t.listing_group = $${i++}`);
      params.push(group);
    }
    if (minPrice !== undefined && minPrice !== '') {
      conditions.push(`t.price >= $${i++}`);
      params.push(Number(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      conditions.push(`t.price <= $${i++}`);
      params.push(Number(maxPrice));
    }
    if (q) {
      conditions.push(`(t.title ILIKE $${i} OR t.description ILIKE $${i})`);
      params.push(`%${q}%`);
      i += 1;
    }

    const whereSql = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const orderBy = SORT_MAP[sort] || SORT_MAP.default;

    const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10) || 24));
    const offset = (pageNum - 1) * limitNum;

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM toys t
       LEFT JOIN categories cat ON cat.id = t.category_id
       ${whereSql}`,
      params
    );
    const total = countResult.rows[0].total;

    const listResult = await pool.query(
      `${SELECT_TOY}
       ${whereSql}
       ORDER BY ${orderBy}
       LIMIT $${i} OFFSET $${i + 1}`,
      [...params, limitNum, offset]
    );

    res.status(200).json({
      items: listResult.rows,
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.getPopularToys = async (req, res) => {
  try {
    const limit = Math.min(20, Math.max(1, parseInt(String(req.query.limit || '4'), 10) || 4));
    const { category } = req.query;
    const params = [limit];
    let where = 'WHERE t.is_popular = true';
    if (category) {
      where += ' AND (cat.slug = $2 OR cat.id::text = $2)';
      params.push(String(category));
    }
    const result = await pool.query(
      `${SELECT_TOY}
       ${where}
       ORDER BY t.created_at DESC
       LIMIT $1`,
      params
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.getToyById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`${SELECT_TOY} WHERE t.id = $1`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.getRelatedToys = async (req, res) => {
  try {
    const { id } = req.params;
    const limit = Math.min(12, Math.max(1, parseInt(String(req.query.limit || '4'), 10) || 4));

    const self = await pool.query('SELECT category_id FROM toys WHERE id = $1', [id]);
    if (self.rows.length === 0) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    const { category_id } = self.rows[0];

    const result = await pool.query(
      `${SELECT_TOY}
       WHERE t.category_id = $1 AND t.id != $2
       ORDER BY t.created_at DESC
       LIMIT $3`,
      [category_id, id, limit]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

exports.createToy = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      category,
      category_id,
      compare_price,
      badge,
      listing_group,
      rating,
      review_count,
      sku,
      exp_date,
      is_popular,
    } = req.body;
    const imageUrl = req.file ? `/images/${req.file.filename}` : null;
    const popular =
      is_popular === true || is_popular === 'true' || is_popular === '1';

    let catId;
    try {
      catId = await resolveCategoryId({ category, category_id }, null);
    } catch (e) {
      if (e.message === 'BAD_CATEGORY') {
        return res.status(400).json({ message: 'Укажите существующую категорию' });
      }
      throw e;
    }
    if (catId == null) {
      catId = await defaultCategoryId();
    }

    const result = await pool.query(
      `INSERT INTO toys (
        title, description, price, image_url,
        category_id, compare_price, badge, listing_group,
        rating, review_count, sku, exp_date, is_popular
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [
        title,
        description,
        price,
        imageUrl,
        catId,
        compare_price || null,
        badge || null,
        listing_group || 'featured',
        rating != null ? rating : 5,
        review_count != null ? review_count : 14,
        sku || null,
        exp_date || null,
        popular,
      ]
    );

    const full = await pool.query(`${SELECT_TOY} WHERE t.id = $1`, [result.rows[0].id]);
    res.status(201).json(full.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.status === 500 && error.message === 'NO_CATEGORIES') {
      return res.status(500).json({ message: 'Нет категорий в базе' });
    }
    res.status(500).json({ message: 'Не удалось создать товар' });
  }
};

exports.updateToy = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      price,
      category,
      category_id,
      compare_price,
      badge,
      listing_group,
      rating,
      review_count,
      sku,
      exp_date,
      is_popular,
    } = req.body;

    const existing = await pool.query('SELECT * FROM toys WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Товар не найден' });
    }
    const cur = existing.rows[0];

    let nextCatId = cur.category_id;
    if (category !== undefined || category_id !== undefined) {
      try {
        nextCatId = await resolveCategoryId({ category, category_id }, cur.category_id);
      } catch (e) {
        if (e.message === 'BAD_CATEGORY') {
          return res.status(400).json({ message: 'Укажите существующую категорию' });
        }
        throw e;
      }
    }

    const next = {
      title: title ?? cur.title,
      description: description ?? cur.description,
      price: price ?? cur.price,
      image_url: cur.image_url,
      category_id: nextCatId,
      compare_price: compare_price !== undefined ? compare_price || null : cur.compare_price,
      badge: badge !== undefined ? badge || null : cur.badge,
      listing_group: listing_group ?? cur.listing_group,
      rating: rating ?? cur.rating,
      review_count: review_count ?? cur.review_count,
      sku: sku !== undefined ? sku || null : cur.sku,
      exp_date: exp_date !== undefined ? exp_date || null : cur.exp_date,
      is_popular:
        is_popular !== undefined
          ? is_popular === true || is_popular === 'true' || is_popular === '1'
          : cur.is_popular === true,
    };

    if (req.file) {
      next.image_url = `/images/${req.file.filename}`;
    }

    await pool.query(
      `UPDATE toys SET
        title=$1, description=$2, price=$3, image_url=$4,
        category_id=$5, compare_price=$6, badge=$7, listing_group=$8,
        rating=$9, review_count=$10, sku=$11, exp_date=$12, is_popular=$13
      WHERE id=$14`,
      [
        next.title,
        next.description,
        next.price,
        next.image_url,
        next.category_id,
        next.compare_price,
        next.badge,
        next.listing_group,
        next.rating,
        next.review_count,
        next.sku,
        next.exp_date,
        next.is_popular,
        id,
      ]
    );

    const full = await pool.query(`${SELECT_TOY} WHERE t.id = $1`, [id]);
    res.status(200).json(full.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не удалось обновить товар' });
  }
};

exports.deleteToy = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM toys WHERE id = $1', [id]);
    res.status(200).json({ message: 'Товар удалён' });
  } catch (error) {
    res.status(500).json({ message: 'Не удалось удалить товар' });
  }
};
