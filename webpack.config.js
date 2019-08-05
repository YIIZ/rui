const path = require('path')
const webpack = require('webpack')

module.exports = {
  context: `${__dirname}/src`,
  resolve: {
    symlinks: false,
    modules: ['src', 'node_modules'],
  },
  entry: {
    app: './app.js',
  },
  output: {
    path: `${__dirname}/dist`,
    publicPath: `${process.env.PUBLIC || ''}`,
    filename: '[name].js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: [
        path.resolve(__dirname, 'src'),
      ],
      use: {
        loader: 'babel-loader',
        options: {
          // ignore babelrc in node_modules
          babelrc: false,
          presets: [ ['@babel/preset-env', { modules: false }] ],
          plugins: [
            ['@babel/plugin-transform-runtime', { corejs: { version: 3, proposals: true }, useESModules: true }],
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-proposal-class-properties',
            ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: false }],
            '@babel/plugin-proposal-do-expressions',
            '@babel/plugin-proposal-logical-assignment-operators',
            '@babel/plugin-proposal-nullish-coalescing-operator',
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-partial-application',
            ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
            'babel-plugin-transform-functional-jsx',
          ],
        },
      },
    }, {
      test: path.resolve(__dirname, 'res'),
      type: 'javascript/auto', // fix json type
      loader: 'file-loader',
      options: {
        name: '[name]-[hash:8].[ext]',
      },
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
  ],
}
