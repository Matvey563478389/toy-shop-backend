export function assetUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  const origin = import.meta.env.VITE_ASSET_ORIGIN ?? '';
  return `${origin}${path}`;
}
