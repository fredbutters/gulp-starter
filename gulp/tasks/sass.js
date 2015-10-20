var gulp = require("gulp"),//http://gulpjs.com/
	util = require("gulp-util"),//https://github.com/gulpjs/gulp-util
	sass = require("gulp-sass"),//https://www.npmjs.org/package/gulp-sass
	autoprefixer = require('gulp-autoprefixer'),//https://www.npmjs.org/package/gulp-autoprefixer
	minifycss = require('gulp-minify-css'),//https://www.npmjs.org/package/gulp-minify-css
	gulpif = require('gulp-if'),
	argv = require('yargs').argv,
	log = util.log;


gulp.task('sass', function(){
	log("generate CSS files");
	return gulp.src('styles/lib/**/*.scss')
		.pipe(sass({ outputStyle: 'expanded'}))
		.pipe(autoprefixer('last 2 version'))
		.pipe(gulp.dest('styles/'))
		.pipe(gulpif(argv.prd, minifycss()))
		.pipe(gulp.dest('styles/'));
});