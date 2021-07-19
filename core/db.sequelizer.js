"use strict";
const { Sequelize } = require("sequelize");
const CONFIG = require("../config/app");
const db = {};
const fs = require("fs");
const path = require("path");

const sequelize = new Sequelize(CONFIG.dbName, CONFIG.dbUser, CONFIG.dbPass, {
  host: CONFIG.dbHost,
  port: CONFIG.dbPort,
  dialect: CONFIG.dbDialect,
});

if (CONFIG.profile === "prod") {
  //Add database pooling on production
  sequelize.options.pool = {
    max: 8,
    min: 0,
    acquire: 30000,
    idle: 10000,
  };
}
//Read all models in models folder
const modelDir = require("../models/database/_dir");
console.log("CRAWLING DATABASE MODEL DEFINITION in ", modelDir);
fs.readdirSync(modelDir)
  .filter((file) => {
    return file.indexOf(".") !== 0 && file.slice(-8) === "model.js";
  })
  .forEach((file) => {
    let modelPath = path.join(modelDir, file);
    let model = require(modelPath)(sequelize, Sequelize.DataTypes);
    console.log("====> MODEL FOUND :", model, " (", modelPath, ")");
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) db[modelName].associate(db);
});
//Done

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
