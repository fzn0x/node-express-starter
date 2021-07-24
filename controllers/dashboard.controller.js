const { name, description } = require("../package.json");

module.exports.index = (req, res) => {
  return res.render("index", {
    title: `${name} - ${description}`,
  });
};
