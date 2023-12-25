/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const packager = require("electron-packager");
const { packagerConfig } = require("./forge.config.js");

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

const ignoreDir = [
  "src",
  "dist",
  "samples",
  "test-old",
  ".github",
  "docs",
  "test-db",
  ".husky",
  "coverage",
  "tests",
  "", // Required as the last element !!
].join("*|");

const ignoreFilesOrExtensions = [
  "rst",
  "py",
  "md",
  "txt",
  "enc",
  ".test.ts",
  ".config.js",
  ".plugins.js",
  ".rules.js",
  ".toml",
  "workbench.ABOUT",
  "LICENSE",
  "NOTICE",
  ".gitignore",
  ".eslintrc.json",
  "packager.js",
  "electron-builder.json",
  "tsconfig.json",
  ...MetaDataFiles,
].join("|");

packager({
  dir: ".",
  out: "out", // @NOTE - If 'out' dir is changed here, change PACKAGE_DIR in archive_builder too,
  overwrite: true,
  icon: "src/assets/app-icon/icon",
  prune: true,
  name: packagerConfig.name,
  ignore: new RegExp(`(${ignoreDir}^.*.(${ignoreFilesOrExtensions})$)`),
  // osxSign: true,
  // osxSign: {
  //   identity: 'Developer ID Application: Felix Rieseberg (LT94ZKYDCJ)',
  //   'hardened-runtime': true,
  //   entitlements: 'entitlements.plist',
  //   'entitlements-inherit': 'entitlements.plist',
  //   'signature-flags': 'library'
  // },
  // osxNotarize: {
  //   appleId: 'felix@felix.fun',
  //   appleIdPassword: 'my-apple-id-password'
  // },
}).then((packagePath) => {
  // Copy the metadata files to package directory
  MetaDataFiles.forEach((file) =>
    fs.copyFileSync(file, `${packagePath}/${file}`)
  );
  console.log(`Packaged app at ${packagePath}`);
});
