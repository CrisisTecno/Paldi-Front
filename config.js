"use strict";

const path = require("path")
let filesToDist = [
	"assets",
	"icons",
	"img",
	"json",
	"lang",
	// "partials",
	"fonts",
	"favicon.json",
];

filesToDist = filesToDist.map((dir) => ({
	from: path.resolve(__dirname, "src", dir),
	to: path.resolve(__dirname, "dist", dir),
}))

// filesToDist = [{
// 	from: "src/*/**/*.html",
// 	to({ context, absoluteFilename }) {
// 		const relPath = absoluteFilename.replace(context, "").replace("src", "dist").replace(/\\/g, "/").replace("/", "")
//
// 		// //console.log(relPath)
// 		return path.resolve(__dirname, relPath)
// 	},
// }, ...filesToDist]

exports.filesToDist = filesToDist;
