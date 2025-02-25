module.exports = (sequelize, DataTypes) => {
  const Pic = sequelize.define(
    "Pic",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      //   author: {
      //     type: DataTypes.STRING,
      //     allowNull: false,
      //   },
      path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ext: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      hooks: {
        afterCreate: async (pic, options) => {
          pic.path = `/pics/${pic.id}`;
          await pic.save();
        },
      },
    }
  );
  Pic.associate = function (models) {
    Pic.belongsTo(models.Author, {
      foreignKey: "authorId",
      onDelete: "CASCADE",
    });
  };
  return Pic;
};
