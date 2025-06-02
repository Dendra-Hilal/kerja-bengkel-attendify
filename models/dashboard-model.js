const database = require("../configs/database");

module.exports = {
  getRoleCounts: async () => {
    try {
      const query = `SELECT
            SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) AS admin_total,
            SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) AS user_total
        FROM users`;
      const [rows] = await database.execute(query);
      return rows[0];
    } catch (error) {
      console.error("Terjadi kesalahan dalam mengambil data user:", error);
    }
  },

  getStudentCounts: async () => {
    try {
      const query = `SELECT COUNT(*) AS student_total FROM students`;
      const [rows] = await database.execute(query);
      return rows[0];
    } catch (error) {
      console.error("Terjadi kesalahan dalam mengambil data siswa:", error);
    }
  },

  getAttendanceStats: async () => {
    try {
      const query = `
      SELECT
        COUNT(CASE WHEN check_in_time IS NOT NULL THEN 1 END) AS checkin_total,
        COUNT(CASE WHEN check_out_time IS NOT NULL THEN 1 END) AS checkout_total,
        (
            SELECT COUNT(*) FROM students WHERE id NOT IN (
            SELECT id FROM attendances WHERE attendance_date = CURDATE()
        )
        ) AS absences
      FROM attendances
      WHERE attendance_date = CURDATE()`;
      const [rows] = await database.execute(query);
      return rows[0];
    } catch (error) {
      console.error("Terjadi kesalahan dalam mengambil data presensi:", error);
    }
  },
};
