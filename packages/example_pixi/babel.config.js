// preset-env features
// https://github.com/babel/babel/blob/main/packages/babel-preset-env/data/shipped-proposals.js
// https://github.com/babel/babel/blob/master/packages/babel-compat-data/scripts/data/plugin-features.js
// https://github.com/babel/babel/blob/master/packages/babel-compat-data/data/plugins.json
// https://github.com/zloirock/core-js/blob/master/packages/core-js-compat/src/data.js

module.exports = {
  // ignore babelrc in node_modules
  babelrc: false,
  presets: [
    "@babel/preset-react",
    [
      "@babel/preset-env",
      {
        modules: false,
        useBuiltIns: "usage",
        corejs: { version: "3.29", proposals: true },
        shippedProposals: true,
        // debug: true,
      },
    ],
  ],
  plugins: ["babel-plugin-transform-jsxspreadchild"],
}
