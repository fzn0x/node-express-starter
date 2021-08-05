/* eslint-disable */
let assert = require("chai").assert;
const { fetchText } = require("../lib/test/fetcher");

describe("/", function () {
  it("Main page content", async function () {
    const content = await fetchText("http://localhost:3000");
    assert.match(content, /Aksara/g);
  });
});
