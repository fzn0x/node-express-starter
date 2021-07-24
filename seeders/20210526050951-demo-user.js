"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users", [
      {
        email: "admin@early.com",
        password: await bcrypt.hash("assessment123", 10),
        name: "Admin Early",
        address: "Jakarta Pusat",
        phone_number: "081289976429",
        type: "admin",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: "developerfauzan@gmail.com",
        password: await bcrypt.hash("assessment123", 10),
        name: "Muhammad Fauzan",
        address: "Kamarung",
        phone_number: "081293287123",
        type: "customer",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
