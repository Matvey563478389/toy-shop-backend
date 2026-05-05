exports.up = (pgm) => {
  pgm.addColumns('toys', {
    category: {
      type: 'varchar(64)',
      notNull: true,
      default: 'Educational Toys',
    },
    compare_price: { type: 'decimal', notNull: false },
    badge: { type: 'varchar(16)', notNull: false },
    listing_group: {
      type: 'varchar(24)',
      notNull: true,
      default: 'featured',
    },
    rating: {
      type: 'decimal(2,1)',
      notNull: true,
      default: 5.0,
    },
    review_count: { type: 'integer', notNull: true, default: 14 },
    sku: { type: 'varchar(32)', notNull: false },
    exp_date: { type: 'date', notNull: false },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('toys', [
    'category',
    'compare_price',
    'badge',
    'listing_group',
    'rating',
    'review_count',
    'sku',
    'exp_date',
  ]);
};
