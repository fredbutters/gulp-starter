var gulp = require("gulp"),
    $ = require('gulp-load-plugins')(),
    runSequence = require('run-sequence'),
    log = $.util.log,
	source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
	browserify = require('browserify'),
	config = require('./config'),
	app = {};

/******************/
/****** CSS *******/
gulp.task('sass', function() {
    log("**** Compiling CSS");
    log("config file path: " + config.files.css);
	return gulp.src(config.files.css)
		.pipe($.sass({ outputStyle: 'expanded' }))
		.pipe($.autoprefixer('last 2 version'))
		.pipe(gulp.dest(config.paths.css))
});

gulp.task('cssmin', function() {
	log("**** Minifying CSS");
	return gulp.src(config.files.main_css)	
		.pipe($.minifyCss())
		.pipe(gulp.dest(config.paths.css));
});


/******************/
/******* JS *******/
gulp.task('browserify', function() {
	log("**** Browserify");
	return browserify(config.files.app_js).bundle()
		.pipe(source('app.min.js'))
		.pipe(gulp.dest(config.paths.js));
});

gulp.task('uglify', function() {
	log("**** Uglify");
	return gulp.src(config.files.app_min_js)
		.pipe($.uglify())
		.pipe(gulp.dest(config.paths.js));
});

gulp.task('jslint', function() {
	log("**** jslint");
	return gulp.src(config.files.app_min_js)
		.pipe($.jslint())
		.pipe(gulp.dest(config.paths.js));
});

gulp.task('watch', function () {
    gulp.watch(config.files.js, ['browserify', 'page-scripts']);
    gulp.watch(config.files.css, ['sass']);
});


/**
* Bundle and minify script files
* @param {array} paths to js files
* @param {string} output filename ex: app.min.js
* @param {bool} if true will compress the file
**/
app.generateOutputFile = function (paths, outputFilename, isCompressed) {
    return browserify(paths)
        .bundle()
		.pipe(source(outputFilename))
        .pipe($.if(isCompressed, buffer())) //gulp-uglify (and most gulp plugins) work on buffered vinyl file objects
        .pipe($.if(isCompressed, $.uglify()))
		.pipe(gulp.dest(config.paths.js));
};



gulp.task('page-scripts', function () {
    app.generateOutputFile(config.files.catalog, config.files.catalog_min, false);
    app.generateOutputFile(config.files.cart, config.files.cart_min, false);
});
gulp.task('page-scripts-prd', function () {
    app.generateOutputFile(config.files.catalog, config.files.catalog_min, true);
    app.generateOutputFile(config.files.cart, config.files.cart_min, true);
});




/*********************************/
/******* Dev and Prd tasks *******/

gulp.task('prd', function() {
	runSequence('sass', 'browserify', 'cssmin', 'uglify');
});
gulp.task('default', function() {
	runSequence('sass', 'browserify', 'watch');
});
gulp.task('page', function () {
    runSequence('sass', 'page-scripts', 'watch');
});
gulp.task('page-prd', function () {
    runSequence('page-scripts-prd', 'sass', 'cssmin');
});