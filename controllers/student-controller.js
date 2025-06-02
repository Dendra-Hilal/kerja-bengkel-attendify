const studentModel = require("../models/student-model");
const getIndonesianDate  = require("../public/apps/getDateFunc");

exports.getStudentPage = async (req, res) => {
  try {
    const loggedInUser = req.session.user;
    const selectedClass = req.query.grade || "All";
    const selectedMajor = req.query.major || "All";
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const [students, totalCounts] = await Promise.all([studentModel.getAllStudents(selectedClass, selectedMajor, limit, offset), studentModel.getTotalCounts(selectedClass, selectedMajor)]);

    const totalPages = Math.ceil(totalCounts / limit);

    res.render("student/index", {
      title: "Student Data",
      user: loggedInUser,
      students,
      selectedClass,
      selectedMajor,
      currentPage: page,
      totalPages,
      offset,
      todayDate: getIndonesianDate(),
    });
  } catch (error) {
    console.error("Terjadi kesalahan dalam me-render halaman student:", error);
  }
};

exports.getEditPage = async (req, res) => {
  const id = req.params.id;
  const loggedInUser = req.session.user;
  try {
    const student = await studentModel.getStudentById(id);
    if (!student) {
      req.flash("error", "Student data not found.");
      return res.redirect("/student");
    }
    res.render("student/edit", {
      title: "Edit",
      student,
      user: loggedInUser,
      todayDate: getIndonesianDate(),
    });
  } catch (error) {
    console.error("Terjadi kesalahan dalam memuat halaman edit siswa:", error);
  }
};

exports.postEditStudent = async (req, res) => {
  const id = req.params.id;
  const { number, uid, full_name, major, grade, is_active } = req.body;
  try {
    await studentModel.updateStudentData(number, uid, full_name, major, grade, is_active, id);
    req.flash("success", "Student data has been successfully updated.");
    res.redirect("/student");
  } catch (error) {
    console.error("Terjadi kesalahan dalam memperbaharui data siswa:", error);
    req.flash("error", "An error occured while updating student data.");
    return res.redirect(`/student/edit/${id}`);
  }
};

exports.deleteStudentData = async (req, res) => {
  const id = req.params.id;
  try {
    await studentModel.deleteStudentData(id);
    req.flash("success", "Student data has been successfully deleted.");
    res.redirect("/student");
  } catch (error) {
    console.error("Terjadi kesalahan dalam menghapus data siswa:", error);
    req.flash("error", "An error occurred while deleting student data.");
    return res.redirect("/student");
  }
};
