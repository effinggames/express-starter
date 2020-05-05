/* eslint prefer-arrow-callback: 0 */
const gulp = require('gulp');
const gulpif = require('gulp-if');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const webpack = require('webpack-stream');
const imageMin = require('gulp-imagemin');
const cssMin = require('gulp-minify-css');
const sourcemaps = require('gulp-sourcemaps');
const nodemon = require('gulp-nodemon');
const eventStream = require('event-stream');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const nodeSass = require('node-sass');
const { join } = require('path');

sass.compiler = nodeSass;
process.chdir(process.env.INIT_CWD);

const publicDir = join(process.cwd(), '/public');
const publicImgDir = join(process.cwd(), '/public/img');
const proxyPort = process.env.PORT || 8000;

function webpackAppJS(minifyMe) {
  return gulp
    .src('./assets/scripts/App.js')
    .pipe(
      webpack({
        devtool: 'inline-source-maps',
        mode: minifyMe ? 'production' : 'development',
        module: {
          rules: [
            {
              test: /.js$/,
              exclude: /(node_modules)/,
              use: {
                loader: 'babel-loader?cacheDirectory=true',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        useBuiltIns: 'entry',
                        targets: '> 0.25%, not dead',
                        corejs: 3
                      }
                    ]
                  ]
                }
              }
            }
          ]
        }
      })
    )
    .pipe(concat('app.js'))
    .pipe(gulpif(minifyMe, uglify()))
    .pipe(gulp.dest(publicDir));
}

function concatCSS(minifyMe) {
  return gulp
    .src(['./assets/styles/index.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(gulpif(minifyMe, cssMin()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(publicDir))
    .pipe(browserSync.reload({ stream: true }));
}

function copyAssets() {
  return gulp
    .src(['./assets/img/**/*'], { base: './assets' })
    .pipe(filterEmptyDirs())
    .pipe(gulp.dest(publicDir));
}

// Removes empty dirs from stream
function filterEmptyDirs() {
  return eventStream.map((file, cb) => {
    if (file.stat.isFile()) {
      return cb(null, file);
    }
    return cb();
  });
}

function minifyImages() {
  return gulp
    .src(`${publicImgDir}/**/*`)
    .pipe(imageMin())
    .pipe(gulp.dest(publicImgDir));
}

// Opens up browserSync url
function syncMe() {
  browserSync({
    proxy: `localhost:${proxyPort}`,
    open: false
  });
}

// Cleans build folder
gulp.task('clean', function cleanPublicFolder() {
  console.log('Cleaning:', publicDir);
  return gulp
    .src(publicDir, { read: false, allowEmpty: true })
    .pipe(clean({ force: true }));
});

// Build + watching, for development
gulp.task(
  'default',
  gulp.series('clean', function compileAndWatch(done) {
    gulp.watch(['./assets/scripts/**/*.js'], function recompileJS() {
      return webpackAppJS().pipe(browserSync.reload({ stream: true }));
    });
    gulp.watch('./assets/styles/**/*.scss', function recompileCSS() {
      return concatCSS();
    });
    gulp.watch(['./assets/img/**/*'], function copyImages() {
      return copyAssets().pipe(browserSync.reload({ stream: true }));
    });

    return eventStream
      .concat(copyAssets(), concatCSS(), webpackAppJS())
      .on('end', function () {
        syncMe();

        nodemon({
          script: 'Main.js',
          ext: 'js hbs',
          watch: ['app'],
          done
        }).on('restart', function () {
          setTimeout(browserSync.reload, 5000);
        });
      });
  })
);

// Production build task
gulp.task(
  'build',
  gulp.series('clean', function compileProductionAssets(done) {
    return eventStream
      .concat(copyAssets(), concatCSS(true), webpackAppJS(true))
      .on('end', function () {
        minifyImages().on('end', done);
      });
  })
);
