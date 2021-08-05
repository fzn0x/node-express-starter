/* eslint-disable */
let assert = require("chai").assert;
const { fetchText } = require("../lib/test/fetcher");

describe("/", function () {
  it('Match "Welcome" inside content', async function () {
    const content = await fetchText("http://localhost:3000");
    assert.match(content, /Welcome/g);
  });

  it('Match "Aksara" inside the content', async function () {
    const content = await fetchText("http://localhost:3000");
    assert.match(content, /Aksara/g);
  });
});
