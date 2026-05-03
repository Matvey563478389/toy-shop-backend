exports.up = (pgm) => {
  pgm.addColumn('users', {
    address: {
      type: 'text',
    }
  });
}

exports.down = (pgm) => {
  pgm.dropColumn('users', 'address')
}