const database = require("../configs/database");

module.exports = {
  getAttendanceByDate: async (date, major, grade, limit = null, offset = null) => {
    try {
      let query = `SELECT
        s.full_name AS student_name,
        s.major AS student_major,
        s.class AS student_class,
        a.check_in_time AS check_in,
        a.check_out_time AS check_out
      FROM attendances a JOIN students s ON a.student_id = s.id
      WHERE a.attendance_date = ?`;
      const params = [date];

      if (major !== "All") {
        query += ` AND s.major = ?`;
        params.push(major);
      }

      if (grade !== "All") {
        query += ` AND s.class = ?`;
        params.push(grade);
      }

      query += ` ORDER BY s.full_name ASC`;

      if (limit !== null && offset !== null) {
        query += ` LIMIT ? OFFSET ?`;
        params.push(limit, offset);
      }

      const [rows] = await database.execute(query, params);
      return rows;
    } catch (error) {
      console.error("Terjadi kesalahan dalam memuat data presensi:", error);
    }
  },

  countAttendanceByDate: async (date, major, grade) => {
    try {
      let query = `SELECT
      COUNT(*) AS total
      FROM attendances a JOIN students s ON a.student_id = s.id
      WHERE attendance_date = ?`;
      const params = [date];

      if (major !== "All") {
        query += ` AND s.major = ?`;
        params.push(major);
      }

      if (grade !== "All") {
        query += ` AND s.class = ?`;
        params.push(grade);
      }

      const [rows] = await database.execute(query, params);
      return rows[0].total;
    } catch (error) {
      console.error("Terjadi kesalahan dalam mengambil data presensi:", error);
    }
  },
};
