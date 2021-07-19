const CONFIG = require("../config/app");
const jwt = require("jsonwebtoken");

module.exports.verify = async (req, res, next) => {
  let tokenHeaderKey = CONFIG.tokenHeaderKey;
  let jwtSecretKey = CONFIG.jwtSecretKey;

  if (!req.get(tokenHeaderKey)) {
    return res.status(422).json({
      success: false,
      message: "Authorization header not found!",
    });
  }

  try {
    const token = req.get(tokenHeaderKey).split(" ")[1];

    const verified = jwt.verify(token, jwtSecretKey);

    if (!Object.keys(verified).length) {
      return res.status(400).json({
        success: false,
        message: "Invalid token used.",
      });
    }

    next();
  } catch (error) {
    // Access Denied
    return res.status(401).json({
      success: false,
      message: "User is unauthenticated.",
      error,
    });
  }
};
