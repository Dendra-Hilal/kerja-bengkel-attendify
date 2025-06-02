module.exports = {
  isAuthenticated: (req, res, next) => {
    if (req.session.user) {
      return next();
    }
    res.redirect("/login");
  },

  authorizeRoles: (...allowedRoles) => {
    return (req, res, next) => {
      if (!req.session.user) {
        return res.redirect("/login");
      }

      if (allowedRoles.includes(req.session.user.role)) {
        return next();
      } else {
        res.status(403).send("Dilarang: Anda tidak memiliki izin untuk mengakses sumber daya ini.");
      }
    };
  },
};
