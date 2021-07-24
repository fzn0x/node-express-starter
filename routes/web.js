const webRouter = require("express").Router();
const dashboardController = require("../controllers/dashboard.controller");

const sessionMiddleware = require("../middlewares/session.middleware");

// Without Auth Middleware
webRouter.get("/", dashboardController.index);

// With Auth Middleware

module.exports = webRouter;
