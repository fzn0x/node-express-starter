"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users", [
      {
        email: "admin@aksara.com",
        password: await bcrypt.hash("aksara123", 10),
        type: "admin",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "fncolon@pm.me",
        password: await bcrypt.hash("aksara123", 10),
        type: "user",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
