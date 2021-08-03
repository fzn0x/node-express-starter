const { User, PasswordReset, sequelize } = require("../core/db.sequelizer");
const bcrypt = require("bcrypt");
const { QueryTypes } = require("sequelize");

const userAttributes = ["id", "email", "password", "type"];
const passwordResetAttributes = ["id", "token", "user_id"];

module.exports.createUser = async (userInfo) => {
  const user = await User.create(userInfo);
  let filterResponse = user;
  delete filterResponse["dataValues"].password;
  return filterResponse;
};

module.exports.updateUser = async (user, options) => {
  Object.assign(user, options);
  let updated = await user.save();

  return updated;
};

module.exports.findUserById = async (userId) => {
  if (!userId) {
    return false;
  }

  const condition = {
    id: userId,
  };

  const user = await User.findOne({
    attributes: userAttributes,
    where: condition,
  });

  return user;
};

module.exports.findUserByEmail = async (emailData) => {
  const condition = {
    email: emailData,
  };

  const user = await User.findOne({
    attributes: userAttributes,
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

module.exports.getResetData = async (tokenData) => {
  const condition = {
    token: tokenData,
  };

  const passwordReset = await PasswordReset.findOne({
    attributes: passwordResetAttributes,
    where: condition,
  });

  return passwordReset["dataValues"];
};

module.exports.storeResetToken = async (data) => {
  const condition = {
    token: data.token,
    user_id: data.user_id,
  };

  const passwordReset = await PasswordReset.findOrCreate({
    where: condition,
  });

  return passwordReset;
};

module.exports.deleteResetToken = async (resetId) => {
  const condition = {
    id: resetId,
  };

  const deleted = await PasswordReset.destroy({
    where: condition,
  });

  return deleted;
};
