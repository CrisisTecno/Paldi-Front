"use strict";

const path = require("path")
let filesToDist = [
	"assets",
	"icons",
	"img",
	"json",
	"lang",
	"partials",
	"fonts",
	"favicon.json",
];

filesToDist = filesToDist.map((dir) => ({
	from: path.resolve(__dirname, "src", dir),
	to: path.resolve(__dirname, "dist", dir),
}))

filesToDist = [{
	from: "src/*/**/*.html",
	to({ context, absoluteFilename }) {
		const relPath = absoluteFilename.replace(context, "").replace("src", "dist").replace(/\\/g, "/").replace("/", "")

		console.log(relPath)
		return path.resolve(__dirname, relPath)
	},
}, ...filesToDist]

exports.filesToDist = filesToDist;

// exports.paths = {
// 	src:   'src',
// 	dist:  'dist',
// 	tmp:   '.tmp',
// 	lib:   'bower_components',

// 	// Styles variables
// 	sass:  'src/sass',
// 	cssDirName: '/css',

// 	// Scripts variables
// 	js:  'src/js',
// 	scriptsDirName: '/scripts',

// 	// Icons variables
// 	iconsDataFile: 'src/favicon.json',
// 	iconMaster: 'src/assets/master_icon.png',
// 	iconsDirName: '/icons',

// 	// Fonts to import
// 	fonts: [
// 		"bower_components/font-awesome-sass/assets/fonts/**/*",
// 		"bower_components/bootstrap-sass/assets/fonts/**/*",
// 		"bower_components/font-awesome/fonts/*"
// 	],

// 	// Dependencies to be ignored by the wiredep injection script
// 	dependencyIgnoreList: [
// 		"bower_components/jquery-slimscroll/jquery.slimscroll.min.js"
// 	]
// };
