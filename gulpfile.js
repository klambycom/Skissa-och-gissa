var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');
var markdox = require('gulp-markdox');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var paths = {
  js:   'src/react/**/*.js',
  main: 'src/index.js',
  node: 'src/server/**/*.js',
  test: 'test/**/*_test.js',
  docs: 'docs',
  dist: 'dist'
};

/*
 * Build browser js
 */

gulp.task('browserify', function () {
  return gulp.src(paths.main)
    .pipe(browserify({ transform: 'reactify', debug: true }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('uglify', ['browserify'], function () {
  return gulp.src('dist/main.js')
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(paths.dist));
});

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
  gulp.watch([paths.js, paths.main], ['browserify']);
});

/*
 * Combined tasks
 */

gulp.task('default', ['uglify', 'docs']);
gulp.task('build', ['uglify']);
