const pool = require('../config/db');

function roundMoney(n) {
  return Math.round(Number(n) * 100) / 100;
}

async function validatePromoForSubtotal(rawCode, subtotal) {
  const code = String(rawCode || '')
    .trim()
    .toUpperCase();
  if (!code) {
    return { ok: false, message: 'Введите промокод' };
  }

  const sub = roundMoney(subtotal);
  if (sub <= 0) {
    return { ok: false, message: 'Корзина пуста' };
  }

  const result = await pool.query(
    `SELECT * FROM promo_codes WHERE UPPER(code) = $1`,
    [code]
  );
  if (result.rows.length === 0) {
    return { ok: false, message: 'Промокод не найден' };
  }

  const row = result.rows[0];
  if (!row.active) {
    return { ok: false, message: 'Промокод неактивен' };
  }

  const now = new Date();
  if (row.valid_from && new Date(row.valid_from) > now) {
    return { ok: false, message: 'Промокод ещё не действует' };
  }
  if (row.valid_until && new Date(row.valid_until) < now) {
    return { ok: false, message: 'Срок действия промокода истёк' };
  }

  const minSub = roundMoney(row.min_order_subtotal || 0);
  if (sub < minSub) {
    return {
      ok: false,
      message: `Минимальная сумма заказа для этого промокода: ${minSub} ₽`,
    };
  }

  if (row.max_uses != null && Number(row.uses_count) >= Number(row.max_uses)) {
    return { ok: false, message: 'Лимит использований промокода исчерпан' };
  }

  const dtype = String(row.discount_type).toLowerCase();
  const val = Number(row.discount_value);
  let discount = 0;

  if (dtype === 'percent') {
    if (val <= 0 || val > 100) {
      return { ok: false, message: 'Промокод настроен некорректно' };
    }
    discount = roundMoney((sub * val) / 100);
  } else if (dtype === 'fixed') {
    if (val <= 0) {
      return { ok: false, message: 'Промокод настроен некорректно' };
    }
    discount = roundMoney(Math.min(val, sub));
  } else {
    return { ok: false, message: 'Неизвестный тип скидки' };
  }

  return {
    ok: true,
    discount,
    code: row.code,
    id: row.id,
  };
}

module.exports = { validatePromoForSubtotal, roundMoney };
