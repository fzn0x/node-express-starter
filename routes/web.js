const webRouter = require("express").Router();

const dashboardController = require("../controllers/dashboard.controller");
const userController = require("../controllers/user.controller");

// eslint-disable-next-line
const sessionMiddleware = require("../middlewares/session.middleware");

// Without Auth Middleware
webRouter.get("/", dashboardController.index);
webRouter.get("/reset-password/:token", userController.confirmResetPassword);

// With Auth Middleware

module.exports = webRouter;
