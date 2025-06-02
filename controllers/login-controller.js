const loginModel = require("../models/login-model");
const bcrypt = require("bcrypt");

exports.getLoginPage = async (req, res) => {
  try {
    const loggedInUser = req.session.user;
    res.render("login/index", {
      title: "Login",
      user: loggedInUser,
    });
  } catch (error) {
    console.error("Gagal me-render halaman login.");
    return res.status(500).json({ error: "Internal Server Error." });
  }
};

exports.getLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Cek apakah user dengan email ini ada
    const user = await loginModel.getUserByEmail(email);

    if (!user) {
      req.flash("error", "Email is not registered.");
      return res.redirect("/login");
    }

    // 2. Cek apakah akun aktif
    if (user.is_active !== 1) {
      req.flash("error", "Your account is inactive.");
      return res.redirect("/login");
    }

    // 3. Cek apakah password cocok
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/login");
    }

    // 4. Jika semuanya valid, buat session
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    };

    return res.redirect("/dashboard");
  } catch (error) {
    console.error("Terjadi kesalahan saat login:", error);
    req.flash("error", "An error occurred while processing login.");
    return res.redirect("/login");
  }
};

exports.getLogout = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Terjadi kesalahan saat logout.");
      req.flash("error", "An error occurred while user logout.");
      return res.status(500).json({ error: "Internal Server Error." });
    }
    res.redirect("/login");
  });
};
