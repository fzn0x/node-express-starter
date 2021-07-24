this is default directory for handling queue.

## Usage

```js
// IIFE
(async () => {
  try {
    await mailQueue("sendMailEvent", data);
  } catch (e) {
    console.log(e);
  }
})();

// MODULES
module.exports.sendMail = () => {
  try {
    await mailQueue("sendMailEvent", data);
  } catch (e) {
    console.log(e);
  }
};
```
