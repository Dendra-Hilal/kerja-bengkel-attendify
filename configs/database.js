const mysql = require("mysql2/promise");
const { MYSQL_CONFIG } = require("./config");

const database = mysql.createPool(MYSQL_CONFIG);

database.getConnection((err) => {
  if (err) {
    console.error("Kesalahan saat menghubungkan ke database:", err);
  } else {
    console.log("Berhasil terhubung ke database!");
  }
});

module.exports = database;
