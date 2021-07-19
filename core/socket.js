const CONFIG = require("../config/app");
const server = require("http").createServer();
const io = require("socket.io")(server);
const PORT = CONFIG.socketPort || 4488;
io.on("connection", (client) => {
  client.on("event", (data) => {
    console.log(data);
  });
  client.on("disconnect", (a) => {
    console.log(a);
  });
});
server.listen(PORT, () => console.log(`Websocket connected to port: ${PORT}`));
