var gulp = require("gulp"),
	util = require("gulp-util"),
	runSequence = require('run-sequence'),
	sass = require("gulp-sass"),
	autoprefixer = require('gulp-autoprefixer'),
	minifycss = require('gulp-minify-css'),
	jslint = require('gulp-jslint'),
	source = require('vinyl-source-stream'),
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
		.pipe(gulp.dest(config.paths.css))
});

gulp.task('cssmin', function(){
	log("**** Minifying CSS");
	return gulp.src(config.files.main_css)	
		.pipe(minifycss())
		.pipe(gulp.dest(config.paths.css));
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
	return gulp.src(config.files.app_min_js)
		.pipe(uglify())
		.pipe(gulp.dest(config.paths.js));
});

gulp.task('jslint', function(){
	log("**** jslint");
	return gulp.src(config.files.app_min_js)
		.pipe(jslint())
		.pipe(gulp.dest(config.paths.js));
});

gulp.task('watch', function(){
	gulp.watch(config.files.js, ['browserify']);
	gulp.watch(config.files.css, ['sass']);
})


/*********************************/
/******* Dev and Prd tasks *******/

gulp.task('prd', function(){
	runSequence('sass', 'browserify', 'cssmin', 'uglify');
});
gulp.task('default', function(){
	runSequence('sass', 'browserify', 'watch');
});