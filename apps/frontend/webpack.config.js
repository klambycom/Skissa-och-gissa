var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  devtool: "source-map",
  entry: "./web/static/js/app.js",
  output: {
    path: "./priv/static",
    filename: "js/app.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          presets: ["es2015"]
        }
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          "css?sourceMap!" +
          "less?sourceMap"
        )
      }
    ]
  },
  resolve: {
    modulesDirectories: ["node_modules", __dirname + "/web/static/js"]
  },
  plugins: [
    new ExtractTextPlugin("css/app.css"),
    new CopyWebpackPlugin([{from: "./web/static/assets"}])
  ]
};
