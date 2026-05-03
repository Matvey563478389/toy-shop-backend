exports.up = (pgm) => {
  pgm.addColumn('users', {
    phone: {
      type: 'text',
    }
  });
}

exports.down = (pgm) => {
  pgm.dropColumn('users', 'phone')
}