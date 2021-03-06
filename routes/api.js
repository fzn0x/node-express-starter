const apiRouter = require("express").Router();
const userController = require("../controllers/user.controller");
const fileController = require("../controllers/file.controller");

const tokenMiddleware = require("../middlewares/token.middleware");
const sessionMiddleware = require("../middlewares/session.middleware");

// Without Auth Middleware
apiRouter.post("/auth/login", userController.login);
apiRouter.post("/auth/register", userController.register);

apiRouter.post("/auth/forgot-password", userController.forgotPassword);
apiRouter.post("/auth/reset-password/:token", userController.resetPassword);

// With Auth Middleware
// User
apiRouter.post(
  "/auth/change-password",
  tokenMiddleware.verify,
  sessionMiddleware.validate,
  userController.changePassword
);
apiRouter.post(
  "/auth/logout",
  tokenMiddleware.verify,
  sessionMiddleware.validate,
  userController.logout
);

// File Management
apiRouter.get("/file/:uuid", fileController.getFile);
apiRouter.post("/file", fileController.uploadFile);

module.exports = apiRouter;
