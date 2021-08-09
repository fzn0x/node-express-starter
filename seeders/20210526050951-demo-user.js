"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  // eslint-disable-next-line
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users", [
      {
        email: "admin@test.com",
        password: await bcrypt.hash("test123", 10),
        type: "admin",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "developerfauzan@gmail.com",
        password: await bcrypt.hash("test123", 10),
        type: "user",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  // eslint-disable-next-line
  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
