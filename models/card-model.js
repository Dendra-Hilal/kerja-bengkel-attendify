const database = require("../configs/database");
const bcrypt = require("bcrypt");

module.exports = {
  registerStudentCard: async (number, uid, full_name, major, grade, is_active) => {
    try {
      const query = `INSERT INTO students (student_number, uid_card, full_name, major, class, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())`;
      const [results] = await database.execute(query, [number, uid, full_name, major, grade, is_active]);
      return results;
    } catch (error) {
      console.error("Gagal menambahkan data siswa baru:", error);
    }
  },

  isUidExists: async (uid) => {
    try {
      const query = `SELECT * FROM students WHERE uid_card = ?`;
      const [rows] = await database.execute(query, [uid]);
      return rows.length > 0;
    } catch (error) {
      console.error("Terjadi kesalahan dalam memeriksa data uid siswa:", error);
    }
  },
};
