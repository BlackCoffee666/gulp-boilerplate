'use strict';

import gulp from 'gulp'
import path from 'path'
import del from 'del'

import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import cleanCss from 'gulp-clean-css'
import concat from 'gulp-concat'
import connect from 'gulp-connect'
import uglify from 'gulp-uglify'
import sourcemaps from 'gulp-sourcemaps'
import babel from 'gulp-babel'
import notify from 'gulp-notify'
import imagemin from 'gulp-imagemin'
import watch from 'gulp-watch'
import pug from 'gulp-pug'
import moduleImporter from 'sass-module-importer'
import browserify from 'gulp-browserify'

import svgmin from 'gulp-svgmin';
import rename from 'gulp-rename';
import svgstore from 'gulp-svgstore';

import webpack from 'webpack-stream';

import through from 'through2';

const dirs = { src: 'src', dest: 'build' };

const paths = {
  pug: {
    src: `${dirs.src}/views/**/*.pug`,
    dest: `${dirs.dest}/`
  },
  styles: {
    main: `${dirs.src}/styles/main.scss`,
    src: `${dirs.src}/styles/**/*.{scss, css}`,
    dest: `${dirs.dest}/styles/`
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
  svg: {
    src: `${dirs.src}/svg/**/*.svg`,
    dest: `${dirs.dest}/svg`
  }
};

gulp.task('pug', () => {
  return gulp.src(paths.pug.src)
    .pipe(pug({ pretty: true }))
		.on('error', notify.onError(function (error) {
			return 'An error occurred while compiling pug.\nLook in the console for details.\n' + error;
		}))
    .pipe(gulp.dest(paths.pug.dest))
});

gulp.task('styles', () => {
  return gulp.src(paths.styles.main)
    .pipe(sourcemaps.init())
    .pipe(sass({ importer: moduleImporter() }))
    .on('error', notify.onError(function (error) {
			return 'An error occurred while compiling styles.\nLook in the console for details.\n' + error;
		}))
    .pipe(sass.sync())
    .pipe(concat('main.css'))
    .pipe(cleanCss({compatibility: 'ie8'}))
    .pipe(autoprefixer({
      browsers: ['last 15 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
});

gulp.task('scripts', () => {
  gulp.src(paths.scripts.main)
    .pipe(webpack({
      config: require('./webpack.config.js')
    }))
    .on('error', notify.onError(function (error) {
			return 'An error occurred while compiling scripts.\nLook in the console for details.\n' + error;
		}))
    .pipe(uglify())
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest(paths.scripts.dest))
});

gulp.task('images', () => {
  return gulp.src(paths.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest))
});

gulp.task('fonts', () => {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
});

gulp.task('svg', () => {
	return gulp.src('./src/svg/**/*.svg')
		.pipe(svgmin())
		.pipe(svgstore())
		.pipe(rename("sprite.svg"))
		.pipe(gulp.dest(paths.svg.dest))
});

gulp.task('files', () => {
	gulp.src(paths.fonts.src)
		.pipe(gulp.dest(paths.fonts.dest))
	gulp.src(paths.images.src)
		.pipe(gulp.dest(paths.images.dest))
	gulp.src(paths.svg.src)
		.pipe(gulp.dest(paths.svg.dest))
});

gulp.task('watch', () => {
    gulp.watch([paths.pug.src], ['pug'])
        .on('change', (event) => {
            if (event.type === 'deleted') {
                let filePathFromSrc = path.relative(path.resolve('src'), event.path);
                let destFilePath = path.resolve('build', filePathFromSrc);
                del.sync(destFilePath.replace('views\\', '').replace('.pug', '.html'));
            }
        });
    gulp.watch([paths.styles.src], ['styles']);
    gulp.watch([paths.scripts.src], ['scripts']);
    gulp.watch(paths.images.src, () => {
        gulp.start('images')
    });
    gulp.watch([paths.fonts.src], ['fonts']);
	  gulp.watch([paths.svg.src], ['svg']);
    watch('./build/**/*.*').pipe(connect.reload());
});

gulp.task('connect', () => {
  connect.server({
    root: './build',
    port: 8080,
    livereload: true
  })
});

gulp.task('pug-layout', [
  'pug',
  'styles',
  'scripts',
  'images',
  'fonts',
  'connect',
	'svg',
	'files',
  'watch'
]);
