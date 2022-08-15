const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const { NormalModuleReplacementPlugin } = require("webpack");


module.exports = [
  new ForkTsCheckerWebpackPlugin(),
  
  // // Copier experiment
  // new NormalModuleReplacementPlugin(
  //   /^bindings$/,
  //   `${__dirname}/src/bindings`
  // ),
];