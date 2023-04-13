/* eslint-disable @typescript-eslint/no-var-requires */

const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});


module.exports = {
  module: {
    rules,
  },
  target: "electron-renderer",
  externals: {
    assert: 'commonjs2 assert',
    child_process: 'commonjs2 child_process',
    crypto: 'commonjs2 crypto',
    electron: 'commonjs2 electron',
    path: 'commonjs2 path',
    fs: 'commonjs2 fs',
    http: 'commonjs2 http',
    https: 'commonjs2 https',
    os: 'commonjs2 os',
    sqlite3: 'commonjs sqlite3',
    stream: 'commonjs2 stream',
    timers: 'commonjs2 timers',
    zlib: 'commonjs2 zlib',
    constants: 'commonjs2 constants',
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
};
