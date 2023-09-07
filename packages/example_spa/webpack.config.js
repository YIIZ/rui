const path = require("path")
const webpack = require("webpack")
const HTMLPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")

/** @type {import("webpack").Configuration} */
module.exports = {
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      // hoist polyfill for node_modules
      "core-js": path.dirname(require.resolve("core-js/package.json")),
      "@": `${__dirname}/src`,
    },
  },
  entry: {
    app: "./src/app.tsx",
  },
  output: {
    clean: true,
    publicPath: "/",
    filename: "[name]-[contenthash:8].js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.svg$/i,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.m?js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },
  plugins: [
    new HTMLPlugin({
      template: "src/index.html.ejs",
    }),
    new MiniCssExtractPlugin({ filename: "[name]-[chunkhash:8].css" }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ],
  optimization: {
    minimizer: ["...", new CssMinimizerPlugin()],
  },
  devServer: {
    historyApiFallback: true,
  },
}
