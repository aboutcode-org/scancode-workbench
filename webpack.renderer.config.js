// import rules from './webpack.rules';
// import plugins from './webpack.plugins';

const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

// rules.push(
//    // Add support for native node modules
//   {
//     test: /\.node$/,
//     use: 'node-loader',
//   },
//   // {
//   //   test: /\.(m?js|node)$/,
//   //   parser: { amd: false },
//   //   use: {
//   //     loader: '@marshallofsound/webpack-asset-relocator-loader',
//   //     options: {
//   //       outputAssetBase: 'native_modules',
//   //     },
//   //   },
//   // },
// )

module.exports = {
  module: {
    rules,
  },
  // target: 'node',
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
    // sqlite3: 'commonjs2 sqlite3',
    stream: 'commonjs2 stream',
    timers: 'commonjs2 timers',
    zlib: 'commonjs2 zlib',
    constants: 'commonjs2 constants',
  },
  plugins: plugins,
  // externals: [
  //   // 'commonjs2 electron',
  //   // 'commonjs2 sqlite3',
  //   (function () {
  //     const IGNORES = [
  //       'electron'
  //     ];
  //     return function (context, request, callback) {
  //       if (IGNORES.indexOf(request) >= 0) {
  //         return callback(null, "require('" + request + "')");
  //       }
  //       return callback();
  //     };
  //   })()
  // ],
  // target: ['node', 'web'],

  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
