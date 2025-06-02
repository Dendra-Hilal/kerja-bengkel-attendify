const database = require("../configs/database");
const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

module.exports = {
  getAllUsers: async () => {
    try {
      const query = `SELECT * FROM users`;
      const [rows] = await database.execute(query);
      return rows;
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    }
  },

  getUserById: async (id) => {
    try {
      const query = `SELECT * FROM users WHERE id = ?`;
      const [rows] = await database.execute(query, [id]);
      return rows[0];
    } catch (error) {
      console.error("Terjadi kesalahan dalam mengambil data user:", error);
    }
  },

  registerUser: async (username, email, password, full_name, is_active, role) => {
    try {
      const hashedPassword = await hashPassword(password);
      const query = `INSERT INTO users (username, email, password, full_name, is_active, role, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())`;
      const [result] = await database.execute(query, [username, email, hashedPassword, full_name, is_active, role]);
      return result;
    } catch (error) {
      console.error("Terjadi kesalahan dalam memasukkan data user:", error);
    }
  },

  updateUser: async (username, email, password, full_name, is_active, role, id) => {
    try {
      const hashedPassword = await hashPassword(password);
      const query = `UPDATE users SET username = ?, email = ?, password = ?, full_name = ?, is_active = ?, role = ?, updated_at = NOW() WHERE id = ?`;
      const [result] = await database.execute(query, [username, email, hashedPassword, full_name, is_active, role, id]);
      return result;
    } catch (error) {
      console.error("Gagal memperbaharui data user:", error);
    }
  },

  deleteUser: async (id) => {
    try {
      const query = `DELETE FROM users WHERE id = ?`;
      const [result] = await database.execute(query, [id]);
      return result;
    } catch (error) {
      console.error("Gagal menghapus data user:", error);
    }
  },
};
