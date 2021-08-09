/* eslint-disable */
let assert = require("chai").assert;
const { fetchText } = require("../../lib/test/fetcher");

describe("/", function () {
  it('Match "Welcome" inside the content', async function () {
    const content = await fetchText("http://localhost:3000");
    assert.match(content, /Welcome/g);
  });

  it('Match "node-express-starter" inside the content', async function () {
    const content = await fetchText("http://localhost:3000");
    assert.match(content, /node-express-starter/g);
  });
});
