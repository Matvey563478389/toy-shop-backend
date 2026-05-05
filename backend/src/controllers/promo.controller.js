const pool = require('../config/db');
const { validatePromoForSubtotal } = require('../services/promo.service');

exports.checkPromo = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const sub = Number(subtotal);
    if (Number.isNaN(sub)) {
      return res.status(400).json({ message: 'Укажите сумму корзины' });
    }
    const v = await validatePromoForSubtotal(code, sub);
    if (!v.ok) {
      return res.status(400).json({ message: v.message });
    }
    res.status(200).json({
      discount: v.discount,
      code: v.code,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка проверки промокода' });
  }
};

exports.listPromos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM promo_codes ORDER BY id DESC`
    );
    res.status(200).json(result.rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Ошибка загрузки промокодов' });
  }
};

exports.createPromo = async (req, res) => {
  try {
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_subtotal,
      max_uses,
      active,
      valid_from,
      valid_until,
    } = req.body;

    const c = String(code || '')
      .trim()
      .toUpperCase();
    if (!c) {
      return res.status(400).json({ message: 'Укажите код' });
    }
    const dtype = String(discount_type || '').toLowerCase();
    if (!['percent', 'fixed'].includes(dtype)) {
      return res.status(400).json({ message: 'Тип скидки: percent или fixed' });
    }
    const val = Number(discount_value);
    if (Number.isNaN(val) || val <= 0) {
      return res.status(400).json({ message: 'Укажите значение скидки' });
    }
    if (dtype === 'percent' && val > 100) {
      return res.status(400).json({ message: 'Процент не может быть больше 100' });
    }

    const minSub =
      min_order_subtotal != null && min_order_subtotal !== ''
        ? Number(min_order_subtotal)
        : 0;
    let maxU =
      max_uses === '' || max_uses == null ? null : parseInt(String(max_uses), 10);
    if (maxU !== null && Number.isNaN(maxU)) {
      maxU = null;
    }

    const result = await pool.query(
      `INSERT INTO promo_codes (
        code, description, discount_type, discount_value,
        min_order_subtotal, max_uses, active, valid_from, valid_until
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [
        c,
        description || null,
        dtype,
        val,
        minSub,
        maxU,
        active === false || active === 'false' ? false : true,
        valid_from || null,
        valid_until || null,
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    if (e.code === '23505') {
      return res.status(400).json({ message: 'Такой код уже существует' });
    }
    console.error(e);
    res.status(500).json({ message: 'Не удалось создать промокод' });
  }
};

exports.updatePromo = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Некорректный ID' });
    }
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_subtotal,
      max_uses,
      active,
      valid_from,
      valid_until,
    } = req.body;

    const existing = await pool.query('SELECT * FROM promo_codes WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'Промокод не найден' });
    }

    const cur = existing.rows[0];
    const c =
      code !== undefined
        ? String(code).trim().toUpperCase()
        : cur.code;
    if (!c) {
      return res.status(400).json({ message: 'Укажите код' });
    }

    const dtype =
      discount_type !== undefined
        ? String(discount_type).toLowerCase()
        : String(cur.discount_type).toLowerCase();
    if (!['percent', 'fixed'].includes(dtype)) {
      return res.status(400).json({ message: 'Тип скидки: percent или fixed' });
    }

    const val =
      discount_value !== undefined ? Number(discount_value) : Number(cur.discount_value);
    if (Number.isNaN(val) || val <= 0) {
      return res.status(400).json({ message: 'Укажите значение скидки' });
    }
    if (dtype === 'percent' && val > 100) {
      return res.status(400).json({ message: 'Процент не может быть больше 100' });
    }

    const minSub =
      min_order_subtotal !== undefined && min_order_subtotal !== ''
        ? Number(min_order_subtotal)
        : Number(cur.min_order_subtotal || 0);
    let maxU =
      max_uses !== undefined
        ? max_uses === '' || max_uses == null
          ? null
          : parseInt(String(max_uses), 10)
        : cur.max_uses;
    if (maxU !== null && maxU !== undefined && Number.isNaN(Number(maxU))) {
      maxU = null;
    }

    const isActive =
      active !== undefined
        ? !(active === false || active === 'false')
        : cur.active;

    const result = await pool.query(
      `UPDATE promo_codes SET
        code=$1, description=$2, discount_type=$3, discount_value=$4,
        min_order_subtotal=$5, max_uses=$6, active=$7, valid_from=$8, valid_until=$9
      WHERE id=$10 RETURNING *`,
      [
        c,
        description !== undefined ? description || null : cur.description,
        dtype,
        val,
        minSub,
        maxU,
        isActive,
        valid_from !== undefined ? valid_from || null : cur.valid_from,
        valid_until !== undefined ? valid_until || null : cur.valid_until,
        id,
      ]
    );
    res.status(200).json(result.rows[0]);
  } catch (e) {
    if (e.code === '23505') {
      return res.status(400).json({ message: 'Такой код уже существует' });
    }
    console.error(e);
    res.status(500).json({ message: 'Не удалось обновить промокод' });
  }
};

exports.deletePromo = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Некорректный ID' });
    }
    const r = await pool.query('DELETE FROM promo_codes WHERE id = $1 RETURNING id', [id]);
    if (r.rows.length === 0) {
      return res.status(404).json({ message: 'Промокод не найден' });
    }
    res.status(200).json({ message: 'Удалено' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Не удалось удалить' });
  }
};
