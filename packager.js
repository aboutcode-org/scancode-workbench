/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const packager = require("electron-packager");
const archiver = require("archiver");
const { packagerConfig } = require("./forge.config.js");

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
  out: "out",
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

  buildPackageArchive(packagePath[0]);
});

/** @param {string} packagePath */
function buildPackageArchive(packagePath) {
  // Get the base name of the package directory
  const packageName = path.basename(packagePath);

  // Determine the packaging format based on the OS
  const isWindows = process.platform === "win32";
  const archiveFormat = isWindows ? "zip" : "tar";
  const archiveExtension = isWindows ? "zip" : "tar.gz";

  console.log("Building release archive ...");

  // Ensure that the archive destination directory exists
  if (!fs.existsSync(ARCHIVE_DIR)) {
    fs.mkdirSync(ARCHIVE_DIR);
  }

  // Create the archive file with the same name as the package directory
  const archiveFileName = `${packageName}.${archiveExtension}`;
  const archiveFilePath = path.join(ARCHIVE_DIR, archiveFileName);
  const output = fs.createWriteStream(archiveFilePath);
  const archive = archiver(archiveFormat, { gzip: true });

  output.on("close", () => {
    console.log(`Created release archive at ${archiveFilePath}`);
  });

  archive.pipe(output);
  archive.directory(packagePath, false);
  archive.finalize();
}
