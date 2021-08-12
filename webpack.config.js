"use strict";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const copyPlugin = require("copy-webpack-plugin");
/* global __dirname module require */
/* eslint comma-dangle: ["error", "never"] */
const path = require("path");

module.exports = {
	mode: "development",
	entry: "./src/index.js",
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
				"./bower_components/bootstrap-sass"
			),
			"font-awesome": path.resolve(
				__dirname,
				"./bower_components/font-awesome-sass"
			),
			"lkmx-inspinia": path.resolve(
				__dirname,
				"./bower_components/lkmx-inspinia/dist"
			),
		},
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, "./src/index.html"),
			inject: true,
		}),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery",
		}),
		new copyPlugin({
			patterns: [
				"assets",
				"icons",
				"img",
				"json",
				"lang",
				"partials",
				"favicon.json",
			].map((dir) => ({
				from: path.resolve(__dirname, "src", dir),
				to: path.resolve(__dirname, "dist", dir),
			})),
		}),
	],
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		writeToDisk: true,
		compress: true,
		port: 3000,
	},
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [
					// Creates `style` nodes from JS strings
					"style-loader",
					// Translates CSS into CommonJS
					"css-loader",
					// Compiles Sass to CSS
					// "resolve-url-loader",
					"sass-loader",
				],
			},
		],
	},
	stats: {
		errorDetails: true,
	},
};
