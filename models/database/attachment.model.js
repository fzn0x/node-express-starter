"use-strict";
//Attachment model

module.exports = (sequelize, DataTypes) => {
  const Attachment = sequelize.define(
    "Attachment",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      uuid: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "attachments",
      underscored: true,
    }
  );

  return Attachment;
};
