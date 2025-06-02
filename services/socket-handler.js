const { UNIQUE_ID } = require("../configs/config");

function setupSocketIO(io, mqttClient) {
  io.on("connection", (socket) => {
    console.log("Klien terhubung:", socket.id);

    socket.on("disconnected", () => {
      console.log("Klien terputus:", socket.id);
    });

    socket.on("rfid-tap", (data) => {
      console.log(`Pesan dari klien ${socket.id}:`, data);
      mqttClient.publish(`rfid/taps/data/${UNIQUE_ID}`, JSON.stringify(data));
    });
  });
}

module.exports = { setupSocketIO };
