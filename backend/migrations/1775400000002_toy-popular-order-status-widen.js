exports.up = (pgm) => {
  pgm.addColumns('toys', {
    is_popular: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
  });
  pgm.alterColumn('orders', 'status', {
    type: 'varchar(40)',
    notNull: true,
    default: 'pending',
  });
  pgm.sql(`
    UPDATE toys SET is_popular = true
    WHERE id IN (
      SELECT id FROM toys ORDER BY rating DESC NULLS LAST, review_count DESC NULLS LAST LIMIT 6
    );
  `);
};

exports.down = (pgm) => {
  pgm.dropColumns('toys', ['is_popular']);
  pgm.alterColumn('orders', 'status', {
    type: 'varchar(20)',
    notNull: true,
    default: 'pending',
  });
};
