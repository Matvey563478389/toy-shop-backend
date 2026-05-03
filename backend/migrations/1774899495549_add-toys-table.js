exports.up = (pgm) => {
  pgm.createTable('toys', {
    id: 'id',
    title: { type: 'varchar(100)', notNull: true },
    description: { type: 'text', notNull: true },
    price: { type: 'decimal', notNull: true }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('toys')
}