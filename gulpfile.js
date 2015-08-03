var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');

var paths = {
  js:   'src/react/**/*.js',
  node: 'src/server/**/*.js',
  test: 'test/**/*_test.js'
};

/*
 * Testing
 */

gulp.task('lint', function () {
  return gulp.src([paths.js, paths.node])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jasmine', function () {
  return gulp.src(paths.test)
    .pipe(jasmine());
});

gulp.task('watch:test', function () {
  gulp.watch([paths.js, paths.node, paths.test], ['jasmine']);
});

gulp.task('test', ['jasmine', 'lint']);
