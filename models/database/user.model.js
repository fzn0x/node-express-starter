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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM("customer", "admin"),
        allowNull: true,
        defaultValue: "customer",
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
  return User;
};
