var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');
var markdox = require('gulp-markdox');
var rename = require('gulp-rename');

var paths = {
  js:   'src/react/**/*.js',
  node: 'src/server/**/*.js',
  test: 'test/**/*_test.js',
  docs: 'docs'
};

/*
 * Documentation
 */

gulp.task('docs:js', function () {
  return gulp.src(paths.js)
    .pipe(markdox())
    .pipe(rename({ extname: '.markdown' }))
    .pipe(gulp.dest(paths.docs + '/js'));
});

gulp.task('docs:node', function () {
  return gulp.src(paths.node)
    .pipe(markdox())
    .pipe(rename({ extname: '.markdown' }))
    .pipe(gulp.dest(paths.docs + '/node'));
});

gulp.task('docs', ['docs:js', 'docs:node']);

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

/*
 * Watch
 */

gulp.task('watch', function () {
  gulp.watch([paths.js, paths.node], ['docs']);
});
