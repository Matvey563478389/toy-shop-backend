export const STANDARD_SHIPPING = 500;

export const FREE_SHIPPING_MIN_SUBTOTAL = 500;

export function shippingRubForSubtotal(subtotal) {
  const s = Number(subtotal) || 0;
  return s >= FREE_SHIPPING_MIN_SUBTOTAL ? 0 : STANDARD_SHIPPING;
}
