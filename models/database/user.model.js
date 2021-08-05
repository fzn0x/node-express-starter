"use-strict";
//User model

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("user", "admin"),
        allowNull: true,
        defaultValue: "user",
      },
    },
    {
      tableName: "users",
      underscored: true,
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
    }
  );

  User.associate = (models) => {
    User.hasOne(models.PasswordReset, {
      foreignKey: "user_id",
      as: "PasswordReset",
    });
  };

  return User;
};
