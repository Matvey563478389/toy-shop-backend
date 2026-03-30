exports.up = (pgm) => {
  pgm.addColumn('toys', { image_url: { type: 'varchar(255)' } });
}

exports.down = (pgm) => {
  pgm.dropColumn('users', 'image_url')
}