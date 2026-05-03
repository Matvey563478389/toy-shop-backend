exports.up = (pgm) => {
  pgm.addColumn('toys', {
    created_at: {
      type: 'timestamp',
      default: pgm.func('current_timestamp'),
    }
  });
}

exports.down = (pgm) => {
  pgm.dropColumn('toys', 'created_at')
}