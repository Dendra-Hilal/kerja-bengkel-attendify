const cardModel = require("../models/card-model");
const getIndonesianDate  = require("../public/apps/getDateFunc");

exports.getCardPage = async (req, res) => {
  try {
    const loggedInUser = req.session.user;
    res.render("card/index", {
      title: "Card Register",
      user: loggedInUser,
      todayDate: getIndonesianDate(),
    });
  } catch (error) {
    console.error("Gagal me-render halaman register card.");
  }
};

exports.postRegisterCard = async (req, res) => {
  const { number, uid, full_name, major, grade, is_active } = req.body;

  if (!uid || uid.trim() === "") {
    req.flash("error", "UID Card must be filled before submitting.");
    return res.redirect("/card");
  }

  try {
    const isUidExists = await cardModel.isUidExists(uid);
    if (isUidExists) {
      req.flash("error", "Card already registered.");
      return res.redirect("/card");
    }
    await cardModel.registerStudentCard(number, uid, full_name, major, grade, is_active);
    req.flash("success", "Successfully registered student card.");
    res.redirect("/card");
  } catch (error) {
    console.error("Terjadi kesalahan dalam menyimpan data siswa:", error);
    req.flash("error", "Failed to save student card.");
    res.redirect("/card");
  }
};
