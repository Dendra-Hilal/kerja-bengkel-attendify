# kerja-bengkel-attendify# Attendify – Sistem Presensi Otomatis

**Attendify** adalah sistem presensi otomatis berbasis ESP32 dan aplikasi web yang dirancang untuk memudahkan pencatatan kehadiran siswa secara efisien, akurat, dan real-time.

---

## 📶 Informasi WiFi untuk ESP32

Agar ESP32 dapat terhubung ke jaringan dan mengirim data ke server, pastikan hotspot/WiFi tersedia dengan detail berikut:

- **SSID (Nama WiFi):** `Attendify`
- **Password:** `onetap123`

> ⚠️ Jaringan WiFi ini harus aktif sebelum ESP32 dinyalakan agar proses koneksi berjalan lancar.

---

## 🧩 Teknologi yang Digunakan

- **ESP32** sebagai mikrokontroler utama
- **Node.js + Express.js** untuk backend server
- **EJS** sebagai template engine tampilan web
- **MySQL** sebagai basis data
- **MQTT** untuk komunikasi ESP32 ↔ server
- **HTML/CSS/JS** untuk frontend

---

## 🚀 Fitur Utama

- Presensi otomatis menggunakan RFID
- Dashboard kehadiran real-time
- Manajemen data siswa & kartu RFID
- Cetak laporan presensi (PDF)
- Mode koneksi ESP32 ke WiFi lokal

---

## 📝 Catatan Tambahan

Pastikan file `.env` dikonfigurasi sesuai pengaturan server dan database milikmu. Contoh konfigurasi disediakan di `.env.example`.

Jika ada kendala, laporkan melalui fitur **Issues** pada repository ini.

---

© 2025 Dendra Hilal
