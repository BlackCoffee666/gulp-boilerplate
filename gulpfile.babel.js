'use strict'

import fs from 'fs'
import path from 'path'
import gulp from 'gulp'
import colors from 'colors'

import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import cleanCss from 'gulp-clean-css'
import concat from 'gulp-concat'
import connect from 'gulp-connect'
import jscs from 'gulp-jscs'
import uglify from 'gulp-uglify'
import babel from 'gulp-babel'
import imagemin from 'gulp-imagemin'
import watch from 'gulp-watch'
import pug from 'gulp-pug'
import moduleImporter from 'sass-module-importer'
import browserify from 'gulp-browserify'

const dirs = { src: 'src', dest: 'build' }

const plugins = {
  js: [
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/slick-carousel/slick/slick.min.js'
  ]
}

const paths = {
  html: {
    src: `${dirs.src}/**/*.html`,
    dest: `${dirs.dest}/`,
  },
  pug: {
    src: `${dirs.src}/**/*.pug`,
    dest: `${dirs.dest}/`,
  },
  styles: {
    main: `${dirs.src}/styles/main.scss`,
    src: `${dirs.src}/styles/**/*.{scss, css}`,
    dest: `${dirs.dest}/styles/`,
  },
  scripts: {
    main: `${dirs.src}/scripts/app.js`,
    src: `${dirs.src}/scripts/**/*.js`,
    dest: `${dirs.dest}/scripts/`
  },
  images: {
    src: `${dirs.src}/images/**/*.{png,jpg,jpeg,svg}`,
    dest: `${dirs.dest}/images/`
  },
  fonts: {
    src: `${dirs.src}/fonts/**/*.{ttf,woff,eof,svg,otf}`,
    dest: `${dirs.dest}/fonts/`
  },
  vendor: {
    src: `${dirs.src}/vendor/**/*`,
    dest: `${dirs.dest}/vendor/`
  }
}

gulp.task('html', () => {
  return gulp.src(paths.html.src)
    .pipe(gulp.dest(paths.html.dest))
})

gulp.task('pug', () => {
  return gulp.src(paths.pug.src)
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(paths.pug.dest))
})

gulp.task('styles', () => {
  return gulp.src(paths.styles.main)
    .pipe(sass({ importer: moduleImporter() }))
    .on('error', (err) => {
      console.log(err.toString().red.underline)
    })
    .pipe(sass.sync())
    .pipe(concat('main.css'))
    .pipe(cleanCss({compatibility: 'ie8'}))
    .pipe(autoprefixer({
      browsers: ['last 15 versions'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.styles.dest))
})

gulp.task('scripts', () => {
  return gulp.src(paths.scripts.main)
    .pipe(browserify({ insertGlobals : true }))
    .on('error', (err) => {
      console.log(`Error in module ${err.plugin}`)
      console.log(err.message.red.underline)
    })
    .pipe(concat('bundle.js'))
    .pipe(babel({compact: false, presets: ['es2015']}))
    .pipe(gulp.dest(paths.scripts.dest))
})

gulp.task('images', () => {
  return gulp.src(paths.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest))
})

gulp.task('fonts', () => {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
})

gulp.task('vendor', function () {
	gulp.src(plugins.js)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(paths.scripts.dest));
});

gulp.task('watch', () => {
  gulp.watch([paths.html.src], ['html']);
  gulp.watch([paths.pug.src], ['pug']);
  gulp.watch([paths.styles.src], ['styles']);
  gulp.watch([paths.scripts.src], ['scripts']);
  gulp.watch([paths.images.src], ['images']);
  gulp.watch([paths.fonts.src], ['fonts']);
  watch('./build/**/*.*').pipe(connect.reload());
})

gulp.task('connect', () => {
  connect.server({
    root: './build',
    port: 8080,
    livereload: true
  })
})

gulp.task('default', [
  'html',
  'styles',
  'scripts',
  'images',
  'fonts',
  'connect',
  'vendor',
  'watch',
])

gulp.task('pug-layout', [
  'pug',
  'styles',
  'scripts',
  'images',
  'fonts',
  'connect',
  'vendor',
  'watch',
])
