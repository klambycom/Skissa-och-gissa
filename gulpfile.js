var gulp = require('gulp');
var jasmine = require('gulp-jasmine');

var paths = {
  js:   'src/react/**/*.js',
  node: 'src/server/**/*.js',
  test: 'test/**/*_test.js'
};

gulp.task('jasmine', function () {
  return gulp.src(paths.test)
    .pipe(jasmine());
});

gulp.task('watch:test', function () {
  gulp.watch([paths.js, paths.node, paths.test], ['jasmine']);
});

gulp.task('test', ['jasmine']);
