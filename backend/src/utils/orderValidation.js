const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+7\d{10}$/;

function str(v) {
  return typeof v === 'string' ? v.trim() : '';
}

function validateCreateOrderPayload(body) {
  const { items, address, phone, customerEmail, customer_email } = body;

  if (!Array.isArray(items) || items.length === 0) {
    return 'Корзина пуста';
  }

  for (let i = 0; i < items.length; i += 1) {
    const row = items[i];
    if (!row || typeof row !== 'object') {
      return 'Некорректные позиции заказа';
    }
    const qty = Number(row.quantity);
    const price = Number(row.price);
    if (!Number.isFinite(qty) || qty < 1 || !Number.isInteger(qty)) {
      return 'Укажите корректное количество для каждого товара';
    }
    if (!Number.isFinite(price) || price < 0) {
      return 'Некорректная цена в заказе';
    }
    if (row.id == null || row.id === '') {
      return 'В заказе есть товар без идентификатора';
    }
  }

  const addr = str(address);
  if (addr.length < 8) {
    return 'Укажите полный адрес доставки';
  }

  const ph = str(phone);
  if (!PHONE_RE.test(ph)) {
    return 'Укажите телефон в формате +7 и 10 цифр номера';
  }

  const emailRaw = str(customerEmail || customer_email);
  if (!emailRaw) {
    return 'Укажите e-mail для уведомлений о заказе';
  }
  if (!EMAIL_RE.test(emailRaw)) {
    return 'Укажите корректный e-mail';
  }

  return null;
}

module.exports = { validateCreateOrderPayload };
