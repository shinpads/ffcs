const path = require("path");
const BundleTracker = require("webpack-bundle-tracker");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  watch: true,
  watchOptions: {
    poll: true,
    ignored: /node_modules/,
  },
  devtool: 'eval-source-map',
  entry: {
    app: "./app/src/index.js",
  },
  output: {
    path: path.resolve("./app/static/app/"),
    filename: "[name]-[hash].js",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleTracker({
      path: __dirname,
      filename: "./webpack-stats.json",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /favicon\.ico$/,
        loader: 'file-loader',
        options: {
          name: 'favicon.ico'
        }
      },
    ],
  },
};
