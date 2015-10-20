//http://www.codingpedia.org/ama/how-to-use-gulp-to-generate-css-from-sass-scss/

var gulp = require("gulp"),//http://gulpjs.com/
	util = require("gulp-util"),//https://github.com/gulpjs/gulp-util
	runSequence = require('run-sequence'),
	sass = require("gulp-sass"),//https://www.npmjs.org/package/gulp-sass
	autoprefixer = require('gulp-autoprefixer'),//https://www.npmjs.org/package/gulp-autoprefixer
	minifycss = require('gulp-minify-css'),//https://www.npmjs.org/package/gulp-minify-css
	jslint = require('gulp-jslint'),
	source = require('vinyl-source-stream'), //https://www.npmjs.com/package/vinyl-source-stream
	browserify = require('browserify'),
	uglify = require('gulp-uglify'),
	log = util.log,
	path = require('path'),
	config = require('./config');

/******************/
/****** CSS *******/
gulp.task('sass', function(){
	log("**** Compiling CSS");
	return gulp.src(config.files.css)
		.pipe(sass({ outputStyle: 'expanded'}))
		.pipe(autoprefixer('last 2 version'))
		.pipe(gulp.dest('styles/'))
});

gulp.task('cssmin', function(){
	log("**** Minifying CSS");
	return gulp.src('styles/main.css')	
		.pipe(minifycss())
		.pipe(gulp.dest('styles/'));
});


/******************/
/******* JS *******/
gulp.task('browserify', function(){
	log("**** Browserify");
	log(config.paths.css);
	return browserify('./scripts/app.js').bundle()
		.pipe(source('app.min.js'))
		.pipe(gulp.dest('./scripts'));
});

gulp.task('uglify', function(){
	log("**** Uglify");
	return gulp.src('scripts/app.min.js')
		.pipe(uglify())
		.pipe(gulp.dest('scripts'));
});

gulp.task('jslint', function(){
	log("**** jslint");
	return gulp.src('scripts/app.min.js')
		.pipe(jslint())
		.pipe(gulp.dest('scripts'));
});

gulp.task('watch', function(){
	gulp.watch(config.files.js, ['browserify']);
	gulp.watch(config.files.css, ['sass']);
})


/*********************************/
/******* Dev and Prd tasks *******/

gulp.task('prd', function(){
	runSequence('sass', 'cssmin', 'browserify', 'uglify');
});
gulp.task('default', function(){
	runSequence('sass', 'browserify', 'watch');
});