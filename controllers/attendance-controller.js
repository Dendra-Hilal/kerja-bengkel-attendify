const attendanceModel = require("../models/attendance-model");
const getIndonesianDate  = require("../public/apps/getDateFunc");
const ejs = require("ejs");
const path = require("path");
const puppeteer = require("puppeteer");

exports.getAttendancePage = async (req, res) => {
  const loggedInUser = req.session.user;
  let attendanceDate = req.query.date;
  const selectedMajor = req.query.major || "All";
  const selectedGrade = req.query.grade || "All";
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  if (!attendanceDate) {
    attendanceDate = new Date().toISOString().split("T")[0];
  }

  try {
    const [attendanceData, totalCount] = await Promise.all([
      attendanceModel.getAttendanceByDate(attendanceDate, selectedMajor, selectedGrade, limit, offset),
      attendanceModel.countAttendanceByDate(attendanceDate, selectedMajor, selectedGrade),
    ]);
    const totalPages = Math.ceil(totalCount / limit);

    res.render("attendance/index", {
      title: "Attendance",
      user: loggedInUser,
      attendanceData,
      attendanceDate,
      selectedMajor,
      selectedGrade,
      currentPage: page,
      totalPages,
      offset,
      todayDate: getIndonesianDate(),
    });
  } catch (error) {
    console.error("Gagal me-render halaman attendance:", error);
  }
};

exports.exportAttendance = async (req, res) => {
  const { date, major, grade } = req.query;

  try {
    const attendanceData = await attendanceModel.getAttendanceByDate(date, major, grade);
    const templatePath = path.join(__dirname, "../views/pages/attendance/pdf-template.ejs");
    const html = await ejs.renderFile(templatePath, {
      attendanceData,
      date,
      major,
      grade,
    });
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    res.setHeader("Content-Disposition", `attachment; filename="Attendify_Report_${date}.pdf"`);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Terjadi kesalahan dalam mencetak laporan presensi:", error);
  }
};
