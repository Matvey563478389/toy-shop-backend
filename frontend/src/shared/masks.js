export function normalizeRuPhoneDigits(input) {
  let d = String(input || '').replace(/\D/g, '');
  if (d.startsWith('8')) d = `7${d.slice(1)}`;
  if (d.startsWith('7')) d = d.slice(1);
  return d.slice(0, 10);
}

export function formatRuPhoneMask(input) {
  const d = normalizeRuPhoneDigits(input);
  if (!d) return '';
  let s = '+7';
  if (d.length > 0) s += ` (${d.slice(0, 3)}`;
  if (d.length >= 3) s += ')';
  if (d.length > 3) s += ` ${d.slice(3, 6)}`;
  if (d.length > 6) s += `-${d.slice(6, 8)}`;
  if (d.length > 8) s += `-${d.slice(8, 10)}`;
  return s;
}

export function isRuPhoneComplete(digits10) {
  return digits10.length === 10;
}

export function ruPhoneToE164(digits10) {
  if (!isRuPhoneComplete(digits10)) return '';
  return `+7${digits10}`;
}

export function maskPostalCode(input) {
  return String(input || '').replace(/\D/g, '').slice(0, 6);
}

export function isValidRuPostal(code) {
  return /^\d{6}$/.test(code);
}

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(email) {
  return EMAIL_RE.test(String(email || '').trim());
}

export function buildRuAddress({ postalCode, city, street, building }) {
  const pc = maskPostalCode(postalCode);
  const c = String(city || '').trim();
  const s = String(street || '').trim();
  const b = String(building || '').trim();
  return `${pc}, г. ${c}, ${s}, д. ${b}`;
}
