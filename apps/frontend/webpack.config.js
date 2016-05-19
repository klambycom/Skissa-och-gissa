var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  devtool: "source-map",
  entry: {
    app: "./web/static/js/app.js",
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
    new ExtractTextPlugin("css/[name].css"),
    new CopyWebpackPlugin([{from: "./web/static/assets"}])
  ]
};
