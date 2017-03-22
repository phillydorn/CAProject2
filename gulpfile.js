'use strict';

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const cleanCSS = require('gulp-clean-css');

gulp.task('css', () => {
  return gulp.src('app/styles/main.scss')
           .pipe($.sourcemaps.init())
           .pipe($.sass().on('error', $.sass.logError))
           .pipe($.autoprefixer({
             browsers: ['last 2 versions'],
             cascade: false,
           }))
           .pipe($.sourcemaps.write())
           .pipe(gulp.dest('./dist/public'));
});

gulp.task('css:watch', () => {
  gulp.watch('app/styles/**/*.scss', ['css']);
});

gulp.task('fonts', ['css'], () => {
  return gulp.src('app/assets/fonts/*.*')
            .pipe(gulp.dest('./dist/public/fonts'));
});

gulp.task('images', () => {
  return gulp.src('app/assets/images/*.*')
            .pipe(gulp.dest('./dist/public/images'));
});

gulp.task('css:build', ['fonts', 'images'], () => {
  return gulp.src('./dist/public/main.css')
             .pipe(cleanCSS())
             .pipe($.rev())
             .pipe(gulp.dest('./dist/public'))
             .pipe($.rev.manifest())
             .pipe(gulp.dest('./dist/public'));
});
