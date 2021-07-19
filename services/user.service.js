const { User, sequelize } = require("../core/db.sequelizer");
const bcrypt = require("bcrypt");
const { QueryTypes } = require("sequelize");
const publicAttributes = [
  "id",
  "email",
  "password",
  "name",
  "phone_number",
  "address",
  "phone_number",
  "type",
];

module.exports.createUser = async (userInfo) => {
  userInfo.credit = 10;
  let user = await User.create(userInfo);
  let filterResponse = user;
  delete filterResponse["dataValues"].password;
  return filterResponse;
};

module.exports.findByEmail = async (emailData) => {
  let condition = {
    email: emailData,
  };

  let user = await User.findOne({
    attributes: publicAttributes,
    where: condition,
  });

  return user;
};

module.exports.comparePassword = async (data, hash) => {
  try {
    return await bcrypt.compare(data, hash);
  } catch (e) {
    console.error(e);
  }
};
