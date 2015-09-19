var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');
var markdox = require('gulp-markdox');
var rename = require('gulp-rename');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var babel = require('gulp-babel');

var paths = {
  js:     'src/{components,browser}/**/*.js',
  flux:   'src/flux/**/*.js',
  main:   'src/index.js',
  node:   'src/server/**/*.js',
  test:   'test/**/*_test.js',
  docs:   'docs',
  dist:   'dist',
  public: 'dist/public',
  assets: 'assets/**/*',
  css:    'dist/public/screen.css',
  src:    'src/**/*.js'
};

/*
 * CSS
 */

gulp.task('minify-css', function () {
  return gulp.src(paths.css)
    .pipe(minifyCss())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.public));
});

/*
 * Build browser js
 */

gulp.task('browserify', function () {
  return gulp.src(paths.main)
    .pipe(browserify({ transform: 'reactify', debug: true }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.public));
});

gulp.task('uglify', ['browserify'], function () {
  return gulp.src(paths.public + '/main.js')
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(paths.public));
});

/*
 * Build server js
 */

gulp.task('babel', function () {
  return gulp.src(paths.src)
    .pipe(babel())
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

gulp.task('docs:flux', function () {
  return gulp.src(paths.flux)
    .pipe(markdox())
    .pipe(rename({ extname: '.markdown' }))
    .pipe(gulp.dest(paths.docs + '/flux'));
});

gulp.task('docs:node', function () {
  return gulp.src(paths.node)
    .pipe(markdox())
    .pipe(rename({ extname: '.markdown' }))
    .pipe(gulp.dest(paths.docs + '/node'));
});

gulp.task('docs', ['docs:js', 'docs:flux', 'docs:node']);

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
 * Assets
 */

gulp.task('assets', function () {
  return gulp.src(paths.assets)
    .pipe(gulp.dest(paths.public + '/assets'));
});

/*
 * Watch
 */

gulp.task('watch', function () {
  gulp.watch([paths.js, paths.flux, paths.node], ['docs']);
  gulp.watch([paths.js, paths.main], ['browserify']);
  gulp.watch([paths.assets], ['assets']);
});

/*
 * Combined tasks
 */

gulp.task('default', ['uglify', 'assets', 'docs', 'minify-css']);
gulp.task('build', ['uglify', 'assets', 'minify-css']);
