const bent = require("bent");

module.exports.fetchText = async (url) => {
  const getStream = bent(url);
  let stream = await getStream("/");
  return await stream.text();
};

module.exports.fetchJson = async (url) => {
  const getStream = bent(url);
  let stream = await getStream("/");
  return await stream.json();
};
