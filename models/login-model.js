const database = require("../configs/database");

module.exports = {
  getUserByEmail: async (email) => {
    try {
      const query = `SELECT * FROM users WHERE email = ?`;
      const [rows] = await database.execute(query, [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Gagal mengambil data pengguna berdasarkan alamat email.");
      throw new Error("Databae error.");
    }
  },

  getUserStatus: async (is_active) => {
    try {
      const query = `SELECT * FROM users WHERE is_active = ?`;
      const [rows] = await database.execute(query, [is_active]);
      return rows.length > 0 ? rows : null;
    } catch (error) {
      console.error("Gagal mengambil status data pengguna.");
      throw new Error("Database error.");
    }
  },
};
