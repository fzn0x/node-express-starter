const { promisify } = require("util");
const redis = require("redis");
const client = redis.createClient(); // default : 127.0.0.1:6379

client.on("error", function (error) {
  console.error(error);
});

module.exports.set = (key, value) => {
  return client.set(key, value, redis.print);
};

module.exports.get = (key, fn) => {
  return client.get(key, fn);
};

module.exports.setAsync = (key, value) => {
  const bindClient = promisify(client.set).bind(client);

  return bindClient(key, value);
};

module.exports.getAsync = (key) => {
  const bindClient = promisify(client.get).bind(client);

  return bindClient(key);
};
