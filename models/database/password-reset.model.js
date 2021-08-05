"use-strict";
//PasswordReset model

module.exports = (sequelize, DataTypes) => {
  const PasswordReset = sequelize.define(
    "PasswordReset",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.BIGINT,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      tableName: "password_resets",
      underscored: true,
    }
  );

  PasswordReset.associate = (models) => {
    PasswordReset.belongsTo(models.User, {
      as: "User",
    });
  };

  return PasswordReset;
};
