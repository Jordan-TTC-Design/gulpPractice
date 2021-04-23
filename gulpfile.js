const gulp = require('gulp');

const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const gpostcss = require('gulp-postcss');
const postcss = require('postcss');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync').create();
const mainBowerFiles = require('main-bower-files');
const ghPages = require('gulp-gh-pages');
 

gulp.task('copyHTML', function () {
  return gulp
    .src('./source/**/*.html')
    .pipe(gulp.dest('./public/'))
    .pipe(browserSync.stream());
});

gulp.task('sass', function () {
  return gulp
    .src('./source/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('all.css'))
    .pipe(gpostcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public/css'))
    .pipe(browserSync.stream());
});

gulp.task('bower', function () {
  return gulp.src(mainBowerFiles()).pipe(gulp.dest('./.tmp/vendors'));
});

gulp.task('vendorJs', gulp.series('bower'), function () {
  return gulp
    .src('./.tmp/vendors/**/**.js')
    .pipe(concat('vendors.js'))
    .pipe(gulp.dest('./public/js'));
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
gulp.task('deploy', function() {
  return gulp.src('./public/**/*')
    .pipe(ghPages());
});



gulp.task(
  'default',
  gulp.series(
    'sass',
    'copyHTML',
    'babel',
    'vendorJs',
    gulp.parallel('browser-sync', 'watch')
  )
);
