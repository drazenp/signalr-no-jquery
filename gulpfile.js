const gulp = require('gulp')

const pipe = require('gulp-pipe')
const clean = require('gulp-clean')
const rename = require('gulp-rename')
const header = require('gulp-header')

const path = require('path')

const getPackageDir = packageName => path.dirname(require.resolve(`${packageName}/package.json`))

const srcDir = path.join(__dirname, 'src')

const destDir = path.join(__dirname, 'lib')

const signalRPath = path.join(getPackageDir('signalr'), 'jquery.signalR.min.js')

const shimPath = path.join(srcDir, 'jQueryShim.js')

gulp.task('get-signalr-file', () => pipe([
	gulp.src(signalRPath),
	header(`const jQueryShim = require('./jQueryShim');\n`),
	rename('signalR.js'),
	gulp.dest(destDir)
]))

gulp.task('get-shim-file', () => pipe([
	gulp.src(shimPath),
	gulp.dest(destDir)
]))

gulp.task('clear-dest', () => pipe([
	gulp.src(destDir, { read: false, allowEmpty: true }),
	clean()
]))

gulp.task('default', gulp.series('clear-dest', 'get-shim-file', 'get-signalr-file'))
