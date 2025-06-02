const managementModel = require("../models/management-model");
const getIndonesianDate  = require("../public/apps/getDateFunc");

exports.getManagementPage = async (req, res) => {
  try {
    const loggedInUser = req.session.user;
    const users = await managementModel.getAllUsers();
    res.render("management/index", {
      title: "User Management",
      user: loggedInUser,
      users,
      todayDate: getIndonesianDate(),
    });
  } catch (error) {
    console.error("Gagal me-render halaman management user:", error);
  }
};

exports.getRegisterPage = async (req, res) => {
  const loggedInUser = req.session.user;
  try {
    res.render("management/register", {
      title: "Register User",
      user: loggedInUser,
      todayDate: getIndonesianDate(),
    });
  } catch (error) {
    console.error("Gagal me-render halaman register user:", error);
  }
};

exports.postRegisterUser = async (req, res) => {
  const { username, email, password, full_name, is_active, role } = req.body;
  try {
    await managementModel.registerUser(username, email, password, full_name, is_active, role);
    req.flash("success", "Successfully registered new user.");
    res.redirect("/management");
  } catch (error) {
    console.error("Terjadi kesalahan dalam menyimpan register user:", error);
    req.flash("error", "An error occurred while saving the new user.");
  }
};

exports.getEditPage = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await managementModel.getUserById(id);
    if (!user) {
      return res.redirect("/management");
    }
    res.render("management/edit", {
      title: "Edit User",
      user,
      todayDate: getIndonesianDate(),
    });
  } catch (error) {
    console.log("Gagal me-render halaman edit user:", error);
  }
};

exports.postEditUser = async (req, res) => {
  const id = req.params.id;
  const { username, email, password, full_name, is_active, role } = req.body;
  try {
    await managementModel.updateUser(username, email, password, full_name, is_active, role, id);
    req.flash("success", "Successfully updated user data.");
    res.redirect("/management");
  } catch (error) {
    console.error("Terjadi kesalahan dalam memperbaharui user:", error);
    req.flash("error", "Failed to update user data.");
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    await managementModel.deleteUser(id);
    req.flash("success", "Successfully deleted user data.");
    res.redirect("/management");
  } catch (error) {
    console.error("Terjadi kesalahan dalam menghapus data user:", error);
    req.flash("error", "Gagal menghapus data user.");
  }
};
