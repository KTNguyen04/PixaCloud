const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config/config");
const fs = require("fs");

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    dialectOptions: {
      ssl: {
        require: true,
        ca: fs.readFileSync("./rds-ca.pem").toString(),
        // rejectUnauthorized: false, // Bỏ kiểm tra chứng chỉ SSL
      },
    },
  }
);

const db = {};
db.Author = require("./Author")(sequelize, DataTypes);
db.Pic = require("./Pic")(sequelize, DataTypes);
// db.Product = require("./Product")(sequelize, DataTypes);
// db.Cart = require("./Cart")(sequelize, DataTypes);
// db.CartItem = require("./CartItem")(sequelize, DataTypes);

Object.keys(db).forEach((modelName) => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
