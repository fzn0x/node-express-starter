/* eslint-disable */
let assert = require("chai").assert;
const { fetchText } = require("../../lib/test/fetcher");
const { verifyObjectProperties } = require("../../utils/obj.util");

describe("obj.util.js", function () {
  it("Password should be required.", async function () {
    const validation = ["email", "password"];
    const verify = verifyObjectProperties(
      {
        email: null,
      },
      validation
    );
    assert.equal(verify, false);
  });

  it("Required object properties must had value", async function () {
    const validation = ["email", "password"];
    const verify = verifyObjectProperties(
      {
        email: null,
        password: null,
      },
      validation
    );
    assert.equal(verify, true);
  });
});
