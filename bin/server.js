#!/usr/bin/env node
"use strict";

const path = require("path");
const webpack = require("webpack");
const express = require("express");
const projectConfig = require("../webpack.config");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const config = Object.assign({}, projectConfig, {
  entry: [
    "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&quiet=true",
    path.join(__dirname, "../public/js/main.js")
  ]
});

config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
]);

config.module.loaders = config.module.loaders.concat([
  { test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    loader: "react-hot-loader/webpack" }
]);

const app = express();
const compiler = webpack(config);

app.use(express.static("public"));

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  noInfo: true,
  stats: {
    colors: true
  }
}));

app.use(webpackHotMiddleware(compiler, {
  log: console.log,
  path: '/__webpack_hmr',
  heartbeat: 10 * 1000
}));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../index.html"));
});

app.listen(8000, "localhost", function(err, result) {
  if (err) {
    console.log(err);
  }

  console.log("Listening at http://localhost:8000");
});
