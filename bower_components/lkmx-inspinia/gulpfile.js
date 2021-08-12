'use strict';

var gulp = require('gulp');
var path    	= require('path');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');


var config = {
	src:  [ 'src/ui-adjust.js', 'src/run.js', 'src/directives/**/*.js' ],
	dist: 'dist'
};

gulp.task('clean', function() {
	del(config.dist); 
});

gulp.task('build', function () {
  gulp.src(config.src)
    .pipe(sourcemaps.init())
    .pipe(concat('inspinia.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.dist));

});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
