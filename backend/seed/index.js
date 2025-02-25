const { sequelize, Pic } = require("../models");

const pics = require("./pics.json");
sequelize.sync({ force: true }).then(async () => {
  await Promise.all(
    pics.map((pic) => {
      Pic.create(pic);
    })
  );
});
