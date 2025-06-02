const mqtt = require("mqtt");
const database = require("../configs/database");
const { MQTT_BROKER_URL, MQTT_OPTIONS, UNIQUE_ID } = require("../configs/config");

const dataScanned = `rfid/taps/data/${UNIQUE_ID}`;
let mqttClient;

function connectMQTT(io) {
  console.log("Menghubungkan ke MQTT Broker ...");
  mqttClient = mqtt.connect(MQTT_BROKER_URL, MQTT_OPTIONS);

  mqttClient.on("connect", () => {
    console.log("Berhasil terhubung pada MQTT Broker.");
    mqttClient.subscribe(dataScanned, (error) => {
      if (error) {
        console.error("Gagal berlanggan pada topik:", error);
      } else {
        console.log(`Berlanggan pada topik: ${dataScanned}`);
      }
    });
  });

  mqttClient.on("message", async (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
      const uid = data.uid.toUpperCase();
      console.log(`Pesan MQTT diterima dari topik ${topic}:`, data);

      if (io) {
        io.emit("rfid-tap", data);
      }

      if (data.mode === "Register") {
        const query = `SELECT * FROM students WHERE uid_card = ?`;
        const [rows] = await database.execute(query, [uid]);
        if (rows.length === 0) {
          console.log("UID tidak ditemukan di database.");
        } else {
          console.log("UID telah terdaftar.");
        }
      } else if (data.mode === "Masuk") {
        const query = `SELECT id FROM students WHERE uid_card = ?`;
        const [students] = await database.execute(query, [uid]);
        if (students.length === 0) {
          console.log("UID tidak terdaftar:", uid);
          return;
        }
        if (students[0].is_active === 0) {
          console.log("Siswa dengan UID ini tidak aktif.");
          return;
        }
        const student_id = students[0].id;
        const now = new Date();
        const attendanceDate = now.toISOString().split("T")[0];

        const [existing] = await database.execute(
          `SELECT id
          FROM attendances 
          WHERE student_id = ? 
          AND attendance_date = ? 
          AND check_out_time IS NULL`,
          [student_id, attendanceDate]
        );

        if (existing.length > 0) {
          console.log(`Check-in sudah dilakukan hari ini untuk student_id ${student_id}, scan diabaikan.`);
          return;
        }
        const check_in = `INSERT INTO attendances (student_id, attendance_date, check_in_time, check_out_time) VALUES (?, ?, ?, NULL)`;
        await database.execute(check_in, [student_id, attendanceDate, now]);

        console.log(`Check-in direkam oleh siswa dengan id: ${student_id} pada ${now}`);
      } else if (data.mode === "Pulang") {
        const query = `SELECT id FROM students WHERE uid_card = ?`;
        const [students] = await database.execute(query, [uid]);
        if (students.length === 0) {
          console.log("UID tidak terdaftar:", uid);
          return;
        }
        const student_id = students[0].id;
        const now = new Date();

        const [result] = await database.execute(
          `UPDATE attendances
          SET check_out_time = ?
          WHERE student_id = ? AND check_out_time IS NULL
          ORDER BY check_in_time DESC
          LIMIT 1`,
          [now, student_id]
        );
        if (result.affectedRows === 0) {
          console.log(`Tidak ada record check-in terbuka untuk student_id ${student_id}`);
        } else {
          console.log(`Check-out direkam oleh siswa dengan id ${student_id} pada ${now}`);
        }
      } else {
        console.log("Mode tidak dikenali:", data.mode);
      }
    } catch (error) {
      console.error("Gagal memproses pesan MQTT:", error);
    }
  });

  mqttClient.on("error", (error) => {
    console.error("MQTT error:", error);
    setTimeout(() => {
      console.log("Mencoba menghubungkan kembali ke MQTT Broker ...");
      connectMQTT(io);
    }, 5000);
  });

  mqttClient.on("close", () => {
    console.log("Koneksi MQTT ditutup.");
  });

  mqttClient.on("offline", () => {
    console.log("Klien MQTT offline.");
  });

  return mqttClient;
}

module.exports = {
  connectMQTT,
};
