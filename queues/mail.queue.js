const CONFIG = require("../config/app");
const Queue = require("bull");
const Mail = require("../handlers/mail.handler");
const socket = require("socket.io-client")(
  `http://localhost:${process.env.SOCKET_PORT || 4488}`
);

module.exports.mailQueue = async (
  event,
  data,
  options = {
    delay: 10000,
    attempts: 10,
    removeOnComplete: true,
    timeout: 60000,
  }
) => {
  const queue = new Queue(event, {
    redis: {
      host: CONFIG.redisHost,
      port: CONFIG.redisPort,
      password: CONFIG.redisPass,
    },
  });

  queue.add(data, options);

  queue.process(async (job, done) => {
    console.log(`Starting ${event} job.`);

    const run = await Mail.send(job.data);
    if (!run) {
      console.log(`${job.data.email || "unknown email"} job failed`);
    } else {
      console.log(`${job.data.email || "unknown email"} job success`);
    }

    // call done when finished
    done();
  });

  queue.on("failed", function (job, err) {
    console.log(
      `${job.data.email || "unknown email"} job failed, error: ${err}`
    );
  });

  // eslint-disable-next-line
  queue.on("completed", (job, result) => {
    console.log(`${job.data.email || "unknown email"} job completed`);
    socket.emit(
      "emailNotification",
      `Email to ${job.data.email} sended successfully.`
    );
  });
};
