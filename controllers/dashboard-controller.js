const dashboardModel = require("../models/dashboard-model");
const getIndonesianDate  = require("../public/apps/getDateFunc");

exports.getDashboardPage = async (req, res) => {
  try {
    const loggedInUser = req.session.user;
    const roleCounts = await dashboardModel.getRoleCounts();
    const studentCounts = await dashboardModel.getStudentCounts();
    const attendanceStats = await dashboardModel.getAttendanceStats();

    const stats = {
      admin_total: roleCounts.admin_total || 0,
      user_total: roleCounts.user_total || 0,
      student_total: studentCounts.student_total || 0,
      checkin_total: attendanceStats.checkin_total || 0,
      checkout_total: attendanceStats.checkout_total || 0,
      absences: attendanceStats.absences || 0,
    };

    const attendanceChartData = {
      labels: ["Check In Attendance", "Check Out Attendance", "Absences"],
      values: [stats.checkin_total, stats.checkout_total, stats.absences],
    };

    res.render("dashboard/index", {
      title: "Dashboard",
      stats,
      user: loggedInUser,
      attendanceChartData: attendanceChartData,
      todayDate: getIndonesianDate(),
    });
  } catch (error) {
    console.error("Terjadi kesalahan saat me-render halaman dashboard:", error);
  }
};
