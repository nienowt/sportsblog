'use strict';

var gulp = require('gulp');
var lint = require('gulp-eslint');
var clean = require('gulp-clean');
var webpack = require('webpack-stream');
var sass = require('gulp-sass');
var minifyCss = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var mocha = require('gulp-mocha');

var paths = {
  js: ['*.js', 'routes/*.js', 'test/*.js', 'app/**/*.js', 'lib/*.js', 'models/*.js'],
  html: ['app/**/*.html'],
  css: ['app/**/*.scss', 'app/**/*.sass'],
  test: ['test/*.js']
};

gulp.task('lint', function(){
  return gulp.src(paths.js)
    .pipe(lint())
    .pipe(lint.format());
});

gulp.task('build:css', function() {
  gulp.src('app/sass/app.sass')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/'));
});

gulp.task('build:html', function() {
  gulp.src('app/**/*.html')
  .pipe(gulp.dest('public/'));
});

gulp.task('build:js', function() {
  return gulp.src('app/js/client.js')
  .pipe(webpack({
    output: {
      filename: 'bundle.js'
    }
  }))
  .pipe(gulp.dest('public/'));
});

gulp.task('clean', function() {
  return gulp.src('build', {read: false})
        .pipe(clean({force: true}));
});

gulp.task('test', function(){
  return gulp.src(paths.test)
  .pipe(mocha());
});

gulp.task('watch:css', function() {
  gulp.watch(paths.css, ['build:css']);
});

gulp.task('watch:html', function() {
  gulp.watch(paths.html, ['build:html']);
});

gulp.task('watch:js', function() {
  gulp.watch(paths.js, ['build:js']);
});

gulp.task('build:all', ['build:css', 'build:html', 'build:js']);
gulp.task('test:all', ['test:mocha']);
gulp.task('watch:all', ['watch:css', 'watch:html', 'watch:js']);
gulp.task('default', ['build:all', 'watch:all']);
