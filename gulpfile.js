const gulp = require('gulp');

const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();

gulp.task('copyHTML', function () {
  return gulp
    .src('./source/**/*.html')
    .pipe(gulp.dest('./public/'))
    .pipe(browserSync.stream());
});

gulp.task('sass', function () {
  return (
    gulp
      .src('./source/scss/**/*.scss')
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('all.css'))
      // .pipe(cleanCSS())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public/css'))
      .pipe(browserSync.stream())
  );
});

gulp.task('babel', () =>
  gulp
    .src('./source/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(concat('all.js'))
    // .pipe(
    //   uglify({
    //     compress: {
    //       drop_console: true,
    //     },
    //   })
    // )
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/js'))
    .pipe(browserSync.stream())
);
gulp.task('browser-sync', function () {
  return browserSync.init({
    server: {
      baseDir: './public',
    },
  });
});
gulp.task('watch', function () {
  gulp.watch('./source/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('./source/scss/**/*.js', gulp.series('babel'));
  gulp.watch('./source/**/*.html', gulp.series('copyHTML'));
});

gulp.task(
  'default',
  gulp.series(
    'sass',
    'copyHTML',
    'babel',
    gulp.parallel('browser-sync', 'watch')
  )
);
