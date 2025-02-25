module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define("Author", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  Author.associate = function (models) {
    Author.hasMany(models.Pic, { foreignKey: "authorId", onDelete: "CASCADE" });
  };

  return Author;
};
