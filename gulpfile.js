//https://viget.com/extend/gulp-browserify-starter-faq

var gulp = require('./gulp')([
    'sass'
]);
 
gulp.task('build', ['sass']);
gulp.task('default', ['build']);