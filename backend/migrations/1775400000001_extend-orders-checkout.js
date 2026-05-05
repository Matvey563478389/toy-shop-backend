exports.up = (pgm) => {
  pgm.addColumns('orders', {
    shipping_cost: {
      type: 'decimal',
      notNull: true,
      default: 0,
    },
    notes: { type: 'text', notNull: false },
    customer_email: { type: 'varchar(255)', notNull: false },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('orders', ['shipping_cost', 'notes', 'customer_email']);
};
