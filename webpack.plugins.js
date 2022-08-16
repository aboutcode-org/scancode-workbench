const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const { NormalModuleReplacementPlugin } = require("webpack");


module.exports = [
  new ForkTsCheckerWebpackPlugin(),
];