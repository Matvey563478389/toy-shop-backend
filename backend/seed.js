const pool = require('./src/config/db');

const categoriesData = [
  { slug: 'igrovye-nabory', name_ru: 'Игровые наборы', sort_order: 1 },
  { slug: 'radioupravlyaemye', name_ru: 'Радиоуправляемые', sort_order: 2 },
  { slug: 'razvivayushchie', name_ru: 'Развивающие игрушки', sort_order: 3 },
  { slug: 'eko-igrushki', name_ru: 'Эко-игрушки', sort_order: 4 },
  { slug: 'myagkie-igrushki', name_ru: 'Мягкие игрушки', sort_order: 5 },
  { slug: 'prochee', name_ru: 'Прочее', sort_order: 99 },
];

const toysData = [
  {
    title: 'Сортер фигурок в ведёрке',
    description:
      'Яркие фигуры и прочное ведёрко помогают изучать цвета и мелкую моторику. Безопасные краски, гладкие края.',
    price: 39,
    compare_price: null,
    image_url: '/images/theresamuth-toys-5993702_1920.jpg',
    category_slug: 'razvivayushchie',
    badge: null,
    listing_group: 'featured',
    rating: 5,
    review_count: 14,
    sku: 'СР-1068',
    exp_date: '2026-08-06',
    is_popular: true,
  },
  {
    title: 'Деревянная грядка с морковками',
    description: 'Тканевые морковки и деревянное основание для сюжетных игр. Тренирует пальчики и счёт.',
    price: 29,
    compare_price: 39,
    image_url: '/images/trimlack-childrens-toys-4412827_1920.jpg',
    category_slug: 'razvivayushchie',
    badge: 'sale',
    listing_group: 'bestseller',
    rating: 5,
    review_count: 22,
    sku: 'МР-2201',
    exp_date: null,
    is_popular: true,
  },
  {
    title: 'Обучающие карточки с озвучкой',
    description: 'Интерактивный блок и прочные карточки. Словарь и аудирование для малышей.',
    price: 39,
    compare_price: null,
    image_url: '/images/hans-guitar-59655_1920.jpg',
    category_slug: 'razvivayushchie',
    badge: null,
    listing_group: 'new',
    rating: 4.8,
    review_count: 9,
    sku: 'КР-8842',
    exp_date: null,
    is_popular: false,
  },
  {
    title: 'Деревянный сортер «Монтессори»',
    description: 'Классический лоток для сортировки, натуральное дерево.',
    price: 39,
    compare_price: null,
    image_url: '/images/theresamuth-toys-5993702_1920.jpg',
    category_slug: 'razvivayushchie',
    badge: null,
    listing_group: 'featured',
    rating: 5,
    review_count: 11,
    sku: 'СТ-4410',
    exp_date: null,
    is_popular: false,
  },
  {
    title: 'Пазл «Динозавр»',
    description: 'Крупные детали для маленьких ладошек. Логика и усидчивость.',
    price: 39,
    compare_price: null,
    image_url: '/images/stevepb-dancing-dave-minion-510835_1920.jpg',
    category_slug: 'razvivayushchie',
    badge: 'new',
    listing_group: 'new',
    rating: 4.9,
    review_count: 7,
    sku: 'ПЗ-9901',
    exp_date: null,
    is_popular: false,
  },
  {
    title: 'Машинка на радиоуправлении',
    description: 'Прочный корпус и мягкие бамперы. Режимы скорости для игры дома.',
    price: 49,
    compare_price: null,
    image_url: '/images/hans-soccer-59648_1920.jpg',
    category_slug: 'radioupravlyaemye',
    badge: null,
    listing_group: 'bestseller',
    rating: 4.7,
    review_count: 31,
    sku: 'РУ-1200',
    exp_date: null,
    is_popular: true,
  },
  {
    title: 'Мягкая игрушка «Единорог»',
    description: 'Гипоаллергенный наполнитель, вышитые глазки. Стирка в машине.',
    price: 34,
    compare_price: 42,
    image_url: '/images/alexas_fotos-bear-3215700_1920.jpg',
    category_slug: 'myagkie-igrushki',
    badge: 'sale',
    listing_group: 'featured',
    rating: 5,
    review_count: 48,
    sku: 'МГ-7712',
    exp_date: null,
    is_popular: true,
  },
  {
    title: 'Бизикуб деревянный',
    description: 'Пять сторон с шестерёнками, лабиринтами и счётами.',
    price: 59,
    compare_price: null,
    image_url: '/images/trimlack-childrens-toys-4412827_1920.jpg',
    category_slug: 'igrovye-nabory',
    badge: 'new',
    listing_group: 'new',
    rating: 4.9,
    review_count: 18,
    sku: 'БК-3300',
    exp_date: null,
    is_popular: true,
  },
  {
    title: 'Пирамидка колец',
    description: 'Яркие кольца учат размеру и цветам.',
    price: 24,
    compare_price: null,
    image_url: '/images/alexas_fotos-teddy-3131095_1920.jpg',
    category_slug: 'razvivayushchie',
    badge: null,
    listing_group: 'bestseller',
    rating: 4.8,
    review_count: 26,
    sku: 'ПК-5011',
    exp_date: null,
    is_popular: false,
  },
  {
    title: 'Качалка деревянная «Лошадка»',
    description: 'Экологичное дерево, плавный ход. Для возраста 1–3 года под присмотром взрослых.',
    price: 89,
    compare_price: null,
    image_url: '/images/myriams-fotos-teddy-bears-1936200_1920.jpg',
    category_slug: 'eko-igrushki',
    badge: null,
    listing_group: 'featured',
    rating: 5,
    review_count: 12,
    sku: 'ЭК-0098',
    exp_date: null,
    is_popular: true,
  },
  {
    title: 'Сова-ночник мягкая',
    description: 'Спокойные фактуры для ритуала сна.',
    price: 28,
    compare_price: null,
    image_url: '/images/alexas_fotos-owl-3296618_1920.jpg',
    category_slug: 'myagkie-igrushki',
    badge: null,
    listing_group: 'new',
    rating: 4.6,
    review_count: 15,
    sku: 'СН-2214',
    exp_date: null,
    is_popular: false,
  },
];

const promosData = [
  {
    code: 'WELCOME10',
    description: 'Приветственная скидка 10% на сумму товаров',
    discount_type: 'percent',
    discount_value: 10,
    min_order_subtotal: 0,
    max_uses: null,
  },
  {
    code: 'START10',
    description: 'Скидка 10% на сумму товаров в заказе',
    discount_type: 'percent',
    discount_value: 10,
    min_order_subtotal: 0,
    max_uses: 500,
  },
  {
    code: 'MINUS200',
    description: 'Скидка 200 ₽ при заказе от 1 500 ₽',
    discount_type: 'fixed',
    discount_value: 200,
    min_order_subtotal: 1500,
    max_uses: null,
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log('Загрузка данных…');
    await client.query('BEGIN');

    await client.query('TRUNCATE TABLE toys RESTART IDENTITY CASCADE');
    await client.query('TRUNCATE TABLE promo_codes RESTART IDENTITY CASCADE');
    await client.query('TRUNCATE TABLE refresh_tokens RESTART IDENTITY CASCADE');

    for (const row of categoriesData) {
      await client.query(
        `INSERT INTO categories (slug, name_ru, sort_order, active)
         VALUES ($1, $2, $3, true)
         ON CONFLICT (slug) DO UPDATE SET
           name_ru = EXCLUDED.name_ru,
           sort_order = EXCLUDED.sort_order,
           active = EXCLUDED.active`,
        [row.slug, row.name_ru, row.sort_order]
      );
    }

    for (const toy of toysData) {
      await client.query(
        `INSERT INTO toys (
          title, description, price, image_url,
          category_id, compare_price, badge, listing_group,
          rating, review_count, sku, exp_date, is_popular
        )
        SELECT $1,$2,$3,$4, c.id, $6,$7,$8,$9,$10,$11,$12,$13
        FROM categories c WHERE c.slug = $5`,
        [
          toy.title,
          toy.description,
          toy.price,
          toy.image_url,
          toy.category_slug,
          toy.compare_price ?? null,
          toy.badge ?? null,
          toy.listing_group,
          toy.rating,
          toy.review_count,
          toy.sku ?? null,
          toy.exp_date ?? null,
          toy.is_popular === true,
        ]
      );
    }

    for (const p of promosData) {
      await client.query(
        `INSERT INTO promo_codes (
          code, description, discount_type, discount_value,
          min_order_subtotal, max_uses, active
        ) VALUES ($1, $2, $3, $4, $5, $6, true)`,
        [
          p.code,
          p.description,
          p.discount_type,
          p.discount_value,
          p.min_order_subtotal,
          p.max_uses,
        ]
      );
    }

    await client.query('COMMIT');
    console.log(
      `Готово: категорий ${categoriesData.length}, товаров ${toysData.length}, промокодов ${promosData.length}.`
    );
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Ошибка:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
    process.exit(process.exitCode || 0);
  }
}

seed();
