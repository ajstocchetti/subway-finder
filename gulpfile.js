'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var livereload = require('gulp-livereload');
var minify = require('gulp-minify');  // minify makes two files - one is minified, one is not
var plumber = require('gulp-plumber');
var runSeq = require('run-sequence');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');  // uglify makes one minified file


// Live Reload
gulp.task('reload', function () {
  livereload.reload();
});
gulp.task('reloadCSS', function () {
  return gulp.src('./public/style.css').pipe(livereload());
});

// Linter
gulp.task('lintJS', function () {
  // return gulp.src(['./browser/js/**/*.js', './server/**/*.js'])
  //   .pipe(eslint())
  //   .pipe(eslint.format())
    // .pipe(eslint.failOnError());
});

// Angular & other JS
gulp.task('ng-compile', ['lintJS'],function() {
  return gulp.src(['./browser/js/app.js', './browser/js/**/*.js'])
  .pipe(plumber())
  .pipe(concat('ng-app.js'))
  .pipe(babel())
  .pipe(gulp.dest('./public/js/'))
});

gulp.task('ng-prod', ['lintJS'],function() {
  return gulp.src(['./browser/js/*.js', './browser.js/**/*.js'])
  .pipe(concat('ng-app.js'))
  .pipe(babel())
  .pipe(ngAnnotate())
  .pipe(uglify())
  .pipe(gulp.dest('./public/js/'))
});

// CSS
gulp.task('sass', function () {
  gulp.src('./browser/css/*.scss')
    .pipe(concat('style.css'))
    // .pipe(sass().on('error', sass.logError))
    .pipe(sass({ errLogToConsole: true }))
    .pipe(gulp.dest('./public/css/'));
});

gulp.task('sass-prod', function () {
  return gulp.src('./browser/scss/*.scss')
    .pipe(concat('style.css'))
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(gulp.dest('./public/css/'));
});

// Vendor/third party libraries
// gulp.task('library', function(){
//   gulp.src(mainBowerFiles())
//   .pipe(concat('vendor.js'))
//   .pipe(minify())
//   .pipe(gulp.dest('./public/js/'));
// });

gulp.task('build', function () {
    if (process.env.NODE_ENV === 'production') {
        runSeq(['ng-prod', 'sass-prod']);
    } else {
        runSeq(['ng-compile', 'sass']);
    }
});


gulp.task('default', function () {
    livereload.listen();
    gulp.start('build');

    gulp.watch(['browser/*.js', 'browser/**/*.js'], function() {
      runSeq('ng-compile', 'reload')
    });
    gulp.watch('browser/scss/**', function () {
        runSeq('sass', 'reloadCSS');
    });

    // gulp.watch('server/**/*.js', ['lintJS']);

    // Reload when a template (.html) file changes.
    // gulp.watch(['browser/**/*.html', 'server/app/views/*.html'], ['reload']);
});
