require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET,
  },
};
