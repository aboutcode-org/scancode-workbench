/* eslint-disable @typescript-eslint/no-var-requires */
const packager = require('electron-packager');

const ignoreDir = [
  'src', 'dist', 'samples', 'test-old',
  '.github', 'docs',
  ''  // Required as the last element !!
].join('*|');
const ignoreFilesOrExtensions = [
  'rst', 'py', 'md', 'txt', 'enc',
  'ABOUT', 'LICENSE', 'NOTICE',
  '.gitignore', '.eslintrc.json',
  'package-lock.json', 'electron-builder.json', 'tsconfig.json',
].join('|');

packager({
  dir: ".",
  out: 'out',     // @NOTE - If 'out' dir is changed here, change PACKAGE_DIR in archive_builder too,
  overwrite: true,
  icon: "src/assets/app-icon/icon",
  prune: true,
  name: "ScanCode Workbench",
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
});