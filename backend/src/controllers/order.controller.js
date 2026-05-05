const pool = require('../config/db');
const { validatePromoForSubtotal, roundMoney } = require('../services/promo.service');
const { validateCreateOrderPayload } = require('../utils/orderValidation');
const { shippingRubForSubtotal } = require('../utils/shipping');

const ALLOWED_ORDER_STATUSES = [
  'pending',
  'processing',
  'ready_for_pickup',
  'shipped',
  'delivered',
  'cancelled',
];

exports.createOrder = async (req, res) => {
  try {
    const userId = req.user;

    const userRow = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userRow.rows.length === 0) {
      return res.status(401).json({
        message:
          'Сессия устарела: этого пользователя больше нет в базе (например, после сброса БД). Выйдите и войдите снова.',
      });
    }

    const payloadError = validateCreateOrderPayload(req.body);
    if (payloadError) {
      return res.status(400).json({ message: payloadError });
    }

    const {
      items,
      address,
      phone,
      notes,
      customerEmail,
      customer_email,
      promoCode,
      promo_code,
    } = req.body;

    const subtotal = roundMoney(
      items.reduce((s, i) => s + Number(i.price) * Number(i.quantity), 0)
    );

    const ship = shippingRubForSubtotal(subtotal);
    const email = String(customerEmail ?? customer_email ?? '')
      .trim()
      .toLowerCase();
    const addressTrim = String(address).trim();
    const phoneTrim = String(phone).trim();

    const promoRaw = String(promoCode ?? promo_code ?? '').trim();
    let promoDiscount = 0;
    let promoStored = null;
    let promoRowId = null;

    if (promoRaw) {
      const v = await validatePromoForSubtotal(promoRaw, subtotal);
      if (!v.ok) {
        return res.status(400).json({ message: v.message });
      }
      promoDiscount = v.discount;
      promoStored = v.code;
      promoRowId = v.id;
    }

    const total = roundMoney(subtotal + ship - promoDiscount);

    const result = await pool.query(
      `INSERT INTO orders (
        user_id, items, total_price, address, phone, shipping_cost, notes, customer_email,
        promo_code, promo_discount
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [
        userId,
        JSON.stringify(items),
        total,
        addressTrim,
        phoneTrim,
        ship,
        notes || null,
        email,
        promoStored,
        promoDiscount,
      ]
    );

    if (promoRowId) {
      await pool.query(
        'UPDATE promo_codes SET uses_count = uses_count + 1 WHERE id = $1',
        [promoRowId]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error.code === '23503') {
      return res.status(401).json({
        message:
          'Сессия устарела: пользователь не найден. Выйдите из аккаунта и войдите снова.',
      });
    }
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
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
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
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
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!ALLOWED_ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Недопустимый статус заказа' });
    }

    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Заказ не найден' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};
