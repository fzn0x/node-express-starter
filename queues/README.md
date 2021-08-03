this is default directory for handling queue.

## Queue Usage Example

```js
// IIFE
const data = {
  email: "developerfauzan@gmail.com",
}(async () => {
  try {
    await mailQueue("sendMailEvent", data);
  } catch (e) {
    console.log(e);
  }
})();

// MODULES
const data = {
  email: "developerfauzan@gmail.com",
};

module.exports.sendMail = async () => {
  try {
    await mailQueue("sendMailEvent", data);
  } catch (e) {
    console.log(e);
  }
};
```
