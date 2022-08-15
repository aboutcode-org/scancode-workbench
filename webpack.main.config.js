// const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  // target: 'electron-renderer',
  plugins: [
    // // Copier experiment
    // new CopyWebpackPlugin({
    //   patterns: [
    //     "node_modules/sqlite3/build/Release/node_sqlite3.node",
    //   ]
    // }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
};
