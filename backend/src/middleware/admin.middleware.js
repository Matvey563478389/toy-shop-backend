exports.isAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Доступ только для администратора' });
  }
  next();
};
