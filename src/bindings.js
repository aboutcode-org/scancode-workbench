module.exports = x =>
  __non_webpack_require__(
    `${require("electron").remote.app.getAppPath()}/${x}`
  );