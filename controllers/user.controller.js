const CONFIG = require("../config/app");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
  createUser,
  findByEmail,
  comparePassword,
} = require("../services/user.service");
const { verifyObjectProperties } = require("../utils/obj.util");

module.exports.login = async (req, res) => {
  if (!req.body) {
    return res.status(422).json({
      success: false,
      message: "Email and password is required.",
    });
  }

  if (!req.body.email && !req.body.password) {
    return res.status(400).json({
      success: false,
      message: "Email and password cannot empty.",
    });
  }
  // Find active user with supplied email
  let user = await findByEmail(req.body.email);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  let validPass = await comparePassword(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  let jwtSecretKey = CONFIG.jwtSecretKey;
  let data = {
    time: Date(),
    userId: user.id,
    role: user.type,
  };

  const token = jwt.sign(data, jwtSecretKey, { expiresIn: "10h" });

  req.session.user = {
    id: data.userId,
    role: data.role,
  };

  return res.json({
    success: true,
    message: "Login Successful!",
    token: token,
    data: req.session.user,
  });
};

module.exports.register = async (req, res) => {
  if (!req.body) {
    return res.status(422).json({
      success: false,
      message: "Email,fullname,password,address,phone number is required.",
    });
  }

  if (
    !verifyObjectProperties(req.body, [
      "email",
      "name",
      "password",
      "address",
      "phone_number",
    ])
  ) {
    return res.status(422).json({
      success: false,
      message: "Email,fullname,password,address,phone number is required.",
    });
  }
  let user = await findByEmail(req.body.email);
  //if user exist return false,saying cannot be used anymore
  if (user)
    return res.status(422).json({
      success: false,
      message: "Email is already used.",
    });

  let userInfo = {
    email: req.body.email,
    password: await bcrypt.hash(req.body.password, 10),
    name: req.body.name,
    address: req.body.address,
    phone_number: req.body.phone_number,
  };

  let created = await createUser(userInfo);
  if (!created)
    return res.status(500).json({
      success: false,
      message: "Server Failure.",
    });

  return res.json({
    success: true,
    message: "User register successfully.",
    data: created,
  });
};

module.exports.loginTest = async (req, res) => {
  return res.json({
    message: "Logged!",
  });
};
