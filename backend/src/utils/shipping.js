function roundMoney(n) {
  return Math.round(Number(n) * 100) / 100;
}

const STANDARD = Number(process.env.SHIPPING_STANDARD_RUB || 500);
const FREE_FROM = Number(process.env.FREE_SHIPPING_MIN_SUBTOTAL || 500);

function shippingRubForSubtotal(subtotal) {
  const s = roundMoney(Number(subtotal) || 0);
  return s >= FREE_FROM ? 0 : STANDARD;
}

module.exports = {
  shippingRubForSubtotal,
  STANDARD_SHIPPING_RUB: STANDARD,
  FREE_SHIPPING_MIN_SUBTOTAL: FREE_FROM,
};
