var gulp = require("gulp"),
    gulpif = require('gulp-if'),
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
	config = require('./config'),
	app = {};

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
	return browserify(config.files.app_js).bundle()
		.pipe(source('app.min.js'))
		.pipe(gulp.dest(config.paths.js));
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

gulp.task('watch', function () {
    gulp.watch(config.files.js, ['browserify']);
    gulp.watch(config.files.css, ['sass']);
});


// For page specific js files
app.generateOutputFile = function (paths, outputFilename) {
    //log('paths ' + paths);
    //log('output ' + outputFilename);
    return browserify(paths).bundle()
		.pipe(source(outputFilename))
		.pipe(gulp.dest(config.paths.js));
};
app.minifyOutputFile = function (fileName) {
    log('minify ' + fileName);
    return gulp.src(fileName)
		.pipe(uglify())
		.pipe(gulp.dest(config.paths.js));
};


gulp.task('page-scripts', function () {
    app.generateOutputFile(config.files.catalog, config.files.catalog_min);
});
gulp.task('page-scripts-prd', function () {
    return app.generateOutputFile(config.files.catalog, config.files.catalog_min);
});
gulp.task('page-min-prd', function () {
    return app.minifyOutputFile(config.files.catalog_min);
});



/*********************************/
/******* Dev and Prd tasks *******/

gulp.task('prd', function(){
	runSequence('sass', 'browserify', 'cssmin', 'uglify');
});
gulp.task('default', function(){
	runSequence('sass', 'browserify', 'watch');
});
gulp.task('page', function () {
    runSequence('page-scripts');
});
gulp.task('page-prd', function () {
    runSequence('page-scripts-prd', 'page-min-prd');
});
