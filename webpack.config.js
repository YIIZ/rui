const PROD = process.argv.includes('-p')
const webpack = require('webpack')

const jsx = require('./jsx')

module.exports = {
  context: `${__dirname}/src`,
  resolve: {
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
      // exclude: /node_modules/,
      exclude: /node_modules\/(?!lib)/,
      // use: ['babel-loader'],
      use: {
        loader: 'babel-loader',
        options: {
          // ignore babelrc in node_modules
          babelrc: false,
          presets: [ ['env', { modules: false }] ],
          plugins: [
            'transform-runtime',
            'transform-object-rest-spread',
            // 'transform-react-jsx'/*, { pragma: 'x' }*/,
            jsx,
            ['transform-class-properties', { spec: true }],
          ],
        },
      },
    }, {
      test: /\.(png|jpg|gif|mp4|mp3|m4a)$/,
      loader: 'file-loader',
      options: {
        name: 'assets/[name]-[hash:8].[ext]',
      },
    }],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new webpack.ProvidePlugin({
      // Components: 'components/index.js', ?
      'Components.Foo': 'components/Foo.js',
      'Components.Bar': 'components/Bar.js',
    }),
  ],
}
