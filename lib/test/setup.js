/* eslint-disable */
const http = require("http");
const exec = require("child_process").exec;

// root hook to run before every test (even in other files)
before(function (done) {
  console.log = function () {};
  process.env.MODE = "TEST";
  const app = require("../../main.js");
  const server = http.createServer(app);
  server.listen(3000);
  done();
});

// root hook to run after every test (even in other files)
afterEach(function () {});
