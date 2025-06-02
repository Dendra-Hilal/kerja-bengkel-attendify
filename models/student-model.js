const database = require("../configs/database");

module.exports = {
  getAllStudents: async (major, grade, limit = 10, offset = 0) => {
    try {
      let query = `SELECT * FROM students`;
      const params = [];

      if (major !== "All") {
        query += ` WHERE class = ?`;
        params.push(major);
      }

      if (grade !== "All") {
        query += params.length ? ` AND major = ?` : ` WHERE major = ?`;
        params.push(grade);
      }

      query += ` ORDER BY full_name ASC LIMIT ? OFFSET ?`;
      params.push(limit, offset);

      const [rows] = await database.execute(query, params);
      return rows;
    } catch (error) {
      console.error("Terjadi kesalahan dalam mengambil data siswa:", error);
    }
  },

  getTotalCounts: async (major, grade) => {
    try {
      let query = `SELECT COUNT(*) AS total FROM students`;
      const params = [];

      if (major !== "All") {
        query += ` WHERE class = ?`;
        params.push(major);
      }

      if (grade !== "All") {
        query += params.length ? ` AND major = ?` : ` WHERE major = ?`;
        params.push(grade);
      }

      const [rows] = await database.query(query, params);
      return rows[0].total;
    } catch (error) {
      console.error("Terjadi kesalahan dalam mengambil jumlah siswa:", error);
    }
  },

  getStudentById: async (id) => {
    try {
      const query = `SELECT * FROM students WHERE id = ?`;
      const [rows] = await database.execute(query, [id]);
      return rows[0];
    } catch (error) {
      console.error("Gagal dalam mengambil data siswa:", error);
    }
  },

  updateStudentData: async (number, uid, full_name, major, grade, is_active, id) => {
    try {
      const query = `UPDATE students SET student_number = ?, uid_card = ?, full_name = ?, major = ?, class = ?, is_active = ?, updated_at = NOW() WHERE id = ?`;
      const [result] = await database.execute(query, [number, uid, full_name, major, grade, is_active, id]);
      return result;
    } catch (error) {
      console.error("Terjadi kesalahan dalam memperbaharui data siswa:", error);
    }
  },

  deleteStudentData: async (id) => {
    try {
      const query = `DELETE FROM students WHERE id = ?`;
      const [result] = await database.execute(query, [id]);
      return result;
    } catch (error) {
      console.error("Terjadi kesalahan dalam menghapus data siswa:", error);
    }
  },
};
