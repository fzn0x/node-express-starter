const CONFIG = require("../config/app");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { mailQueue } = require("../queues/mail.queue");
const uuid = require("uuid");

const {
  createUser,
  findUserById,
  findUserByEmail,
  comparePassword,
  updateUser,
  getResetData,
  storeResetToken,
  deleteResetToken,
} = require("../services/user.service");
const { verifyObjectProperties } = require("../utils/obj.util");

module.exports.login = async (req, res) => {
  const validation = ["email", "password"];
  if (!verifyObjectProperties(req.body, validation)) {
    return res.status(422).json({
      success: false,
      message: `${validation.join()} is required.`,
    });
  }

  try {
    // find active user with supplied email
    const user = await findUserByEmail(req.body.email);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User with the email is not exist.",
      });
    }

    const validPass = await comparePassword(req.body.password, user.password);
    if (!validPass) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const jwtSecretKey = CONFIG.jwtSecretKey;
    const data = {
      time: Date(),
      userId: user.id,
      email: user.email,
      role: user.type,
    };

    const token = jwt.sign(data, jwtSecretKey, { expiresIn: "10h" });

    req.session.user = {
      id: data.userId,
      email: data.email,
      role: data.role,
    };

    return res.json({
      success: true,
      message: "Logged in successfully.",
      token: token,
      data: req.session.user,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

module.exports.register = async (req, res) => {
  const validation = ["email", "password"];
  if (!verifyObjectProperties(req.body, validation)) {
    return res.status(422).json({
      success: false,
      message: `${validation.join()} is required.`,
    });
  }

  try {
    const user = await findUserByEmail(req.body.email);
    //if user exist return false,saying cannot be used anymore
    if (user)
      return res.status(422).json({
        success: false,
        message: "Email is already used.",
      });

    const userInfo = {
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, 10),
      name: req.body.name,
    };

    const created = await createUser(userInfo);
    if (!created)
      return res.status(500).json({
        success: false,
        message: "Server Failure.",
      });

    return res.json({
      success: true,
      message: "User registered successfully.",
      data: created,
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

module.exports.forgotPassword = async (req, res) => {
  const validation = ["email"];
  if (!verifyObjectProperties(req.body, validation)) {
    return res.status(422).json({
      success: false,
      message: `${validation.join()} is required.`,
    });
  }

  try {
    // find active user with supplied email
    const user = await findUserByEmail(req.body.email);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User with the email is not exist.",
      });
    }

    let token = uuid.v4();

    await storeResetToken({
      token: token,
      user_id: user.id,
    });

    await mailQueue("forgotPassword", {
      email: req.body.email,
      subject: "Forgot Password",
      text: `Here is your link to be used for forgot password ${CONFIG.frontendUrl}reset-password/${token}, don't share this link to anyone!`,
    });

    return res.json({
      success: true,
      message: "Forgot password email already sent to your email.",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

module.exports.confirmResetPassword = async (req, res) => {
  return res.render("reset-password", {
    appUrl: CONFIG.appUrl,
    token: req.params.token,
  });
};

module.exports.resetPassword = async (req, res) => {
  const validation = ["password", "repeat_password"];
  if (!verifyObjectProperties(req.body, validation)) {
    return res.status(422).json({
      success: false,
      message: `${validation.join()} is required.`,
    });
  }

  try {
    const resetData = await getResetData(req.params.token);

    if (!resetData) {
      return res.status(400).json({
        success: false,
        message: "Token is invalid.",
      });
    }

    const user = await findUserById(resetData.user_id);

    if (user) {
      const newPassword = await bcrypt.hash(req.body.password, 10);

      const isEqualPass = await comparePassword(
        req.body.repeat_password,
        newPassword
      );
      if (!isEqualPass) {
        return res.status(400).json({
          success: false,
          message: "Repeated password is not equal with new password.",
        });
      }

      const updated = await updateUser(user, {
        password: newPassword,
      });

      if (updated) {
        await deleteResetToken(resetData.id);

        return res.json({
          success: true,
          message: "Forgot password successfully.",
        });
      }
    }

    return res.status(400).json({
      success: false,
      message:
        "Invalid request, whether token is invalid or user is not found.",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

module.exports.changePassword = async (req, res) => {
  const validation = ["old_password", "password", "repeat_password"];
  if (!verifyObjectProperties(req.body, validation)) {
    return res.status(422).json({
      success: false,
      message: `${validation.join()} is required.`,
    });
  }

  try {
    const user = await findUserByEmail(req.session.user.email);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: `Current user session is not found.`,
      });
    }

    const validPass = await comparePassword(
      req.body.old_password,
      user.password
    );
    if (!validPass) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const newPassword = await bcrypt.hash(req.body.password, 10);

    const isEqualPass = await comparePassword(
      req.body.repeat_password,
      newPassword
    );
    if (!isEqualPass) {
      return res.status(400).json({
        success: false,
        message: "Repeated password is not equal with new password.",
      });
    }

    const updated = await updateUser(user, {
      password: newPassword,
    });

    if (updated) {
      return res.json({
        success: true,
        message: "Change password successfully.",
      });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

module.exports.logout = async (req, res) => {
  req.session.destroy();

  return res.json({
    success: true,
    message: "Logged out successfully.",
  });
};
