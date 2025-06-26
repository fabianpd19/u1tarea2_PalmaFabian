module.exports = (req, res, next) => {
  try {
    // delete req.cookies;
    if (req.cookies.username) {
      return next();
    }
    res.redirect("/register");
  } catch (error) {
    console.error("Error en isLoggedIn middleware:", error);
    res.status(500).send("Error interno del servidor");
  }
};
