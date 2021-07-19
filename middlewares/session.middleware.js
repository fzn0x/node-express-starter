module.exports.validate = (req, res, next) => {
  if (!req.session.user) {
    return res.status(301).json({
      success: false,
      message: "Session Expired, Please Re-login.",
    });
  }

  next();
};
