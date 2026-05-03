/**
 * URL картинок с бэкенда (/images/...).
 * В dev с Vite proxy и в prod за nginx достаточно относительного пути.
 * Если API на другом хосте — задайте VITE_ASSET_ORIGIN (например http://localhost:3000).
 */
export function assetUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const origin = import.meta.env.VITE_ASSET_ORIGIN ?? '';
  return `${origin}${path}`;
}
