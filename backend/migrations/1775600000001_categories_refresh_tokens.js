exports.up = (pgm) => {
  pgm.createTable('categories', {
    id: 'id',
    slug: { type: 'varchar(64)', notNull: true, unique: true },
    name_ru: { type: 'varchar(120)', notNull: true },
    sort_order: { type: 'integer', notNull: true, default: 0 },
    active: { type: 'boolean', notNull: true, default: true },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('categories', ['active', 'sort_order'], { name: 'categories_active_sort_idx' });

  pgm.sql(`
    INSERT INTO categories (slug, name_ru, sort_order) VALUES
      ('igrovye-nabory', 'Игровые наборы', 1),
      ('radioupravlyaemye', 'Радиоуправляемые', 2),
      ('razvivayushchie', 'Развивающие игрушки', 3),
      ('eko-igrushki', 'Эко-игрушки', 4),
      ('myagkie-igrushki', 'Мягкие игрушки', 5),
      ('prochee', 'Прочее', 99);
  `);

  pgm.addColumn('toys', {
    category_id: {
      type: 'integer',
      notNull: false,
      references: 'categories',
      onDelete: 'RESTRICT',
    },
  });

  pgm.sql(`
    UPDATE toys SET category_id = (SELECT id FROM categories WHERE slug = 'igrovye-nabory') WHERE category = 'Playsets';
    UPDATE toys SET category_id = (SELECT id FROM categories WHERE slug = 'radioupravlyaemye') WHERE category = 'Control Toys';
    UPDATE toys SET category_id = (SELECT id FROM categories WHERE slug = 'razvivayushchie') WHERE category = 'Educational Toys';
    UPDATE toys SET category_id = (SELECT id FROM categories WHERE slug = 'eko-igrushki') WHERE category = 'Eco-Friendly Toys';
    UPDATE toys SET category_id = (SELECT id FROM categories WHERE slug = 'myagkie-igrushki') WHERE category = 'Stuffed Toys';
    UPDATE toys SET category_id = (SELECT id FROM categories WHERE slug = 'prochee') WHERE category = 'Type 1' OR category_id IS NULL;
  `);

  pgm.alterColumn('toys', 'category_id', { notNull: true });
  pgm.dropColumn('toys', 'category');

  pgm.createTable('refresh_tokens', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    token_hash: { type: 'varchar(64)', notNull: true, unique: true },
    expires_at: { type: 'timestamptz', notNull: true },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('refresh_tokens', ['user_id'], { name: 'refresh_tokens_user_idx' });
};

exports.down = (pgm) => {
  pgm.dropTable('refresh_tokens');
  pgm.addColumn('toys', {
    category: {
      type: 'varchar(64)',
      notNull: true,
      default: 'razvivayushchie',
    },
  });
  pgm.sql(`
    UPDATE toys t SET category = c.slug FROM categories c WHERE c.id = t.category_id;
  `);
  pgm.dropColumn('toys', 'category_id');
  pgm.dropTable('categories');
};
