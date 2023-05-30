const path = require('path')
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')

module.exports = {
  context: `${__dirname}/src`,
  resolve: {
    modules: ['src', 'node_modules'],
    alias: { res: `${__dirname}/res` },
  },
  entry: {
    app: './app.js',
  },
  output: {
    clean: true,
    path: `${__dirname}/dist`,
    publicPath: `${process.env.WEBPACK_PUBLIC || ''}`,
    filename: '[name]-[chunkhash:8].js',
    assetModuleFilename: '[name]-[hash][ext]',
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: [
        path.resolve(__dirname, 'src'),
        path.dirname(require.resolve('rui/package.json')),
        path.dirname(require.resolve('lib/package.json')),
        path.dirname(require.resolve('whatwg-fetch/package.json')),
      ],
      loader: 'babel-loader',
    }, {
      // test: path.resolve(__dirname, 'res'),
      test: /\.(png|jpg|gif)$/i,
      type: 'asset/resource',
    }, {
      resourceQuery: /raw/,
      type: 'asset/source',
    }, {
      test: /\.val$/,
      loader: 'val-loader',
    }, {
      resourceQuery: /emit/,
      type: 'asset/source',
    }, {
      resourceQuery: /emit=([\w\.]+)/,
      generator: {
        filename: ({ filename }) => {
          return filename.split('?')[1].match(/emit=([\w\.]+)/)?.[1]
        },
      },
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new webpack.ProvidePlugin({
      fetch: ['whatwg-fetch', 'fetch'],
    }),
    new HTMLPlugin({
      template: 'index.html.ejs',
    }),
  ],
  experiments: {
    topLevelAwait: true,
  },
  snapshot: {
    // enable node_modules reloading
    managedPaths: [],
  },
}

