export const BRAND_NAME = 'ToyShop';

export const DEFAULT_CATEGORY_SLUG = 'razvivayushchie';

export const SHOP_ADDRESS_LINE = '344091, г. Ростов-на-Дону, ул. Каширская, д. 4/2';

export const SHOP_PHONE_DISPLAY = '+7 (988) 516-27-43';
export const SHOP_PHONE_TEL = '+79885162743';

export const HOME_HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop';

export const HOME_ECO_BANNER_IMAGE = '/images/trimlack-childrens-toys-4412827_1920.jpg';

export const HOME_GALLERY_IMAGE_URLS = [
  'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=400&fit=crop',
  '/images/alexas_fotos-mouse-3215692_1920.jpg',
];

export function formatRub(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return '0 ₽';
  return `${n.toLocaleString('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} ₽`;
}

export function formatUsd(value) {
  return formatRub(value);
}
