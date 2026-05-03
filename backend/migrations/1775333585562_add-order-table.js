exports.up = (pgm) => {
  pgm.createTable('orders', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    items: { type: 'jsonb', notNull: true },
    total_price: { type: 'decimal', notNull: true },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'pending'
    },
    address: { type: 'text', notNull: true },
    phone: { type: 'varchar(20)', notNull: true },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('orders');
};