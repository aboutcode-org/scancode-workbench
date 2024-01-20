/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");

/**
 * @param {string[]} metaDataFiles
 * @param {string} packagePath
 */
function addMetaDataFilesToPackage(packagePath, metaDataFiles) {
  metaDataFiles.forEach((file) =>
    fs.copyFileSync(file, `${packagePath}/${file}`)
  );
  console.log(
    `Added ${metaDataFiles.length} metadata files to Packaged app at ${packagePath}`
  );
}

/**
 * @param {string} packagePath
 * @param {string} archiveDirectory
 */
function buildPackageArchive(packagePath, archiveDirectory) {
  // Get the base name of the package directory
  const packageName = path.basename(packagePath);

  // Determine the packaging format based on the OS
  const isWindows = process.platform === "win32";
  const archiveFormat = isWindows ? "zip" : "tar";
  const archiveExtension = isWindows ? "zip" : "tar.gz";

  console.log("Building release archive ...");

  // Ensure that the archive destination directory exists
  if (!fs.existsSync(archiveDirectory)) {
    fs.mkdirSync(archiveDirectory);
  }

  // Create the archive file with the same name as the package directory
  const archiveFileName = `${packageName}.${archiveExtension}`;
  const archiveFilePath = path.join(archiveDirectory, archiveFileName);
  const output = fs.createWriteStream(archiveFilePath);
  const archive = archiver(archiveFormat, { gzip: true });

  output.on("close", () => {
    console.log(`Created release archive at ${archiveFilePath}`);
  });

  archive.pipe(output);
  archive.directory(packagePath, false);
  archive.finalize();
}


module.exports = {
  addMetaDataFilesToPackage,
  buildPackageArchive,
};
