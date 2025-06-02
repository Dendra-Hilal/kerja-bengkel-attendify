const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const http = require("http");
const path = require("path");
const flash = require("connect-flash");
const { Server } = require("socket.io");
const { SERVER_PORT } = require("./configs/config");
const { connectMQTT } = require("./services/mqtt-client");
const { setupSocketIO } = require("./services/socket-handler");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const mqttClient = connectMQTT(io);
setupSocketIO(io, mqttClient);

// Routes here:
const loginRoutes = require("./routes/login-routes");
const dashboardRoutes = require("./routes/dashboard-routes");
const studentRoutes = require("./routes/student-routes");
const managementRoutes = require("./routes/management-routes");
const cardRoutes = require("./routes/card-routes");
const attendanceRoutes = require("./routes/attendance-routes");

app.set("view engine", "ejs");
app.set("views", "./views/pages");
app.use(express.static(path.join(__dirname, "public")));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(
  session({
    secret: "pexuEaWz5edB",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 120000 },
    rolling: true,
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.warning = req.flash("warning");
  res.locals.info = req.flash("info");
  next();
});

// API Routes here:
app.use("/", loginRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/student", studentRoutes);
app.use("/management", managementRoutes);
app.use("/card", cardRoutes);
app.use("/attendance", attendanceRoutes);

server.listen(SERVER_PORT, () => {
  console.log(`Server berjalan di http://localhost:${SERVER_PORT}`);
});

process.on("SIGINT", () => {
  console.log("Server dimatikan. Koneksi MQTT ditutup.");
  mqttClient.end(() => {
    console.log("Koneksi MQTT ditutup.");
    server.close(() => {
      console.log("Server ditutup.");
      process.exit(0);
    });
  });
});
