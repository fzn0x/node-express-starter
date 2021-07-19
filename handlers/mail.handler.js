const CONFIG = require("../config/app");
const nodemailer = require("nodemailer");
module.exports.send = (data) => {
  return new Promise((resolve, reject) => {
    let mailOptions = {
      from: CONFIG.mailUser,
      to: data.email,
      subject: data.subject,
      text: data.text,
    };
    let mailConfig = {
      service: "gmail",
      auth: {
        user: CONFIG.mailUser,
        pass: CONFIG.mailPass,
      },
    };
    nodemailer
      .createTransport(mailConfig)
      .sendMail(mailOptions, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
  });
};
