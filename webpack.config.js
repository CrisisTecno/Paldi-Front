"use strict"

const webpack = require("webpack")
const copyPlugin = require("copy-webpack-plugin")
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const filesToCopy = require("./config").filesToDist
const environment = require("./environments")

const htmlParser = require('./webpack/html-localizer')
const {getLocalizerPlugins} = require("./webpack/html-localizer")

module.exports = (env) => ({
  mode: "development",
  entry: ["./src/index.js", "./src/sass/style.scss"],
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    modules: ["bower_components", "node_modules"],
    descriptionFiles: ["package.json", "bower.json"],
    alias: {
      bootstrap: path.resolve(
        __dirname,
        "./bower_components/bootstrap-sass",
      ),
      "font-awesome": path.resolve(
        __dirname,
        "./bower_components/font-awesome-sass",
      ),
      "lkmx-inspinia": path.resolve(
        __dirname,
        "./bower_components/lkmx-inspinia/dist",
      ),
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      GLOBALS: environment[env.stage],
      EXECUTION_ENV: JSON.stringify(env.stage.toUpperCase().split("_")[0]),
      LOCALE: {
        ...require(`./webpack/locale/${env.locale}`),
        ...require(`./webpack/locale-extensions/${env.stage.split("_")[1]}.js`)
      }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/index.html"),
      inject: true,
    }),
    ...getLocalizerPlugins("src", env.locale, require(`./webpack/locale-extensions/${env.stage.split("_")[1]}.js`)),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      moment: "moment",
      swal: "sweetalert",
    }),
    new copyPlugin({
      patterns: filesToCopy,
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    writeToDisk: true,
    compress: true,
    port: env.stage === "production" ? 3432 : 3434,
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          {
            loader: "style-loader",
            options: {injectType: "linkTag"},
          },
          {
            loader: "file-loader",
            options: {
              outputPath: "css/",
              name: "[name].min.css",
            },
          },

          "sass-loader",
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  stats: {
    errorDetails: true,
  },
})
