require("dotenv").config();
const { env } = process;

module.exports = {
  MQTT_BROKER_URL: env.MQTT_BROKER_URL,
  MQTT_BROKER_PORT: parseInt(env.MQTT_BROKER_PORT),

  MQTT_OPTIONS: {
    clientId: env.MQTT_CLIENT_ID_PREFIX,
    clean: true,
    connectTimeout: 4000,
  },

  UNIQUE_ID: env.UNIQUE_ID,

  MYSQL_CONFIG: {
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  },

  SERVER_PORT: parseInt(env.SERVER_PORT),
};
