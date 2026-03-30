exports.up = (pgm) => {
  pgm.addColumn('users', {
    role: {
      type: 'varchar(20)',
      notNull: true,
      default: 'user',
      check: "role IN ('user', 'admin')"
    },
  });
}

exports.down = (pgm) => {
  pgm.dropColumn('users', 'role')
}