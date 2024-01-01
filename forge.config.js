/* eslint-disable @typescript-eslint/no-var-requires */
const { version } = require("./package.json");
const {
  addMetaDataFilesToPackage,
  buildPackageArchive,
} = require("./package-utils");

const APP_NAME_WITH_VERSION = `ScanCode-Workbench-${version}`;
const ARCHIVE_DIR = "dist";

const MetaDataFiles = [
  "apache-2.0.LICENSE",
  "AUTHORS.rst",
  "CHANGELOG.rst",
  "CODE_OF_CONDUCT.rst",
  "CONTRIBUTING.rst",
  "NOTICE",
  "package-lock.json",
  "README.md",
  "SCANCODE_WORKBENCH_VERSION",
  "workbench.ABOUT",
];

/** @type {import('@electron-forge/shared-types').ForgeConfig} */
const forgeConfig = {
  /** @type {import('@electron/packager').Options} */
  packagerConfig: {
    name: APP_NAME_WITH_VERSION,
    appBundleId: "com.nexb.scancode-workbench",
    icon: "src/assets/app-icon/icon",
    dir: ".",
    out: "out",
    overwrite: true,
    prune: true,
    protocols: [
      {
        name: "JSON File",
        schemes: ["file"],
        extensions: ["json"],
      },
      {
        name: "SQLite Database",
        schemes: ["file"],
        extensions: ["sqlite", "db"],
      },
    ],
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
    {
      name: "@timfish/forge-externals-plugin",
      config: {
        externals: ["sqlite3"],
        includeDeps: true,
      },
    },
  ],
  hooks: {
    postPackage: async (_, options) => {
      // Add metadata files like Readme, License, etc to the packaged app
      addMetaDataFilesToPackage(options.outputPaths[0], MetaDataFiles);

      // Build zip/tar.gz archive of the packaged app
      buildPackageArchive(options.outputPaths[0], ARCHIVE_DIR);
    },
  },
};

module.exports = forgeConfig;
