require("dotenv").config();
const path = require("path");

let CONFIG = {};

// APPLICATION CONTEXT CONFIG
CONFIG.appKey = process.env.APP_KEY;
CONFIG.mode = process.env.MODE;
CONFIG.appPort = process.env.PORT;
CONFIG.appUrl = process.env.APP_URL || "http://localhost:3000/";
CONFIG.frontendUrl = process.env.FRONTEND_URL || CONFIG.appUrl;

//DATABASE CONFIG
CONFIG.dbHost = process.env.DB_HOST;
CONFIG.dbName = process.env.DB_NAME;
CONFIG.dbUser = process.env.DB_USER;
CONFIG.dbPass = process.env.DB_PASS;
CONFIG.dbDialect = process.env.DB_DIALECT;
CONFIG.dbPort = process.env.DB_PORT;

//MAILING CONFIG
CONFIG.mailUser = process.env.MAIL_USER;
CONFIG.mailPass = process.env.MAIL_PASS;

//REDIS CONFIG
CONFIG.redisUser = process.env.REDIS_HOST;
CONFIG.redisPort = process.env.REDIS_PORT;
CONFIG.redisPass = process.env.REDIS_PASS;

//SOCKET CONFIG
CONFIG.socketPort = process.env.SOCKET_PORT;

//JWT CONFIG
CONFIG.jwtSecretKey = process.env.JWT_SECRET_KEY;
CONFIG.tokenHeaderKey = process.env.TOKEN_HEADER_KEY || "Authorization";

//FILE STORAGE
CONFIG.baseFileStorage = process.env.BASE_FILE_STORAGE;

//File storage creation
CONFIG.privateStorage = path.join(CONFIG.baseFileStorage, "files");
CONFIG.publicStorage = path.join(CONFIG.baseFileStorage, "public");

module.exports = CONFIG;
