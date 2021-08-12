/* eslint-disable */
let assert = require("chai").assert;
const redis = require("../../utils/redis.util");

describe("redis.util.js", function () {
  it("Synchronous set/get should return as expected.", async function () {
    redis.set("chat_id", 21390841290);
    redis.get("chat_id", (err, value) => {
      if (err) throw err;
      assert.equal(value, 21390841290);
    });
  });

  it("Asynchronous set/get should return as expected.", async function () {
    try {
      await redis.setAsync("chat_id", 564565464564);
      let getValue = await redis.getAsync("chat_id");
      assert.equal(getValue, 564565464564);
    } catch (err) {
      throw err;
    }
  });
});
