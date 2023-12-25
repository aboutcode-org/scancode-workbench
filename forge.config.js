/* eslint-disable @typescript-eslint/no-var-requires */
const { version } = require("./package.json");

const APP_NAME_WITH_VERSION = `ScanCode-Workbench-${version}`;

module.exports = {
  packagerConfig: {
    name: APP_NAME_WITH_VERSION,
    icon: "src/assets/app-icon/icon",
  },
  plugins: [
    {
      name: "@electron-forge/plugin-webpack",
      config: {
        mainConfig: "./webpack.main.config.js",
        renderer: {
          config: "./webpack.renderer.config.js",
          entryPoints: [
            {
              html: "./src/index.html",
              js: "./src/renderer.ts",
              name: "main_window",
            },
          ],
        },
      },
    },
  ],
};
