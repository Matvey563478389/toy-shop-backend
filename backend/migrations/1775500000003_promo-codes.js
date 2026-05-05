exports.up = (pgm) => {
  pgm.createTable('promo_codes', {
    id: 'id',
    code: { type: 'varchar(40)', notNull: true, unique: true },
    description: { type: 'text' },
    discount_type: { type: 'varchar(20)', notNull: true },
    discount_value: { type: 'decimal', notNull: true },
    min_order_subtotal: { type: 'decimal', notNull: true, default: 0 },
    max_uses: { type: 'integer' },
    uses_count: { type: 'integer', notNull: true, default: 0 },
    active: { type: 'boolean', notNull: true, default: true },
    valid_from: { type: 'timestamptz' },
    valid_until: { type: 'timestamptz' },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addColumns('orders', {
    promo_code: { type: 'varchar(40)' },
    promo_discount: { type: 'decimal', notNull: true, default: 0 },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('orders', ['promo_code', 'promo_discount']);
  pgm.dropTable('promo_codes');
};
