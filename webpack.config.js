var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  devtool: "source-map",
  entry: {
    app: "./web/static/js/app.js",
    game: "./web/static/js/game.js",
    admin: "./web/static/js/admin.js"
  },
  output: {
    path: "./priv/static",
    filename: "js/[name].js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["es2015", "react"]
        }
      },
      {
        test: /\.less/,
        loader: ExtractTextPlugin.extract(
          "css?sourceMap!" +
          "less?sourceMap"
        )
      }
    ]
  },
  resolve: {
    modulesDirectories: [
      "node_modules",
      __dirname + "/web/static/js",
      __dirname + "/web/static/css"
    ]
  },
  plugins: [
    new ExtractTextPlugin("css/[name].css"),
    new CopyWebpackPlugin([{from: "./web/static/assets"}])
  ]
};
