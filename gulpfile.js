const gulp = require('gulp')

const pipe = require('gulp-pipe')
const clean = require('gulp-clean')
const rename = require('gulp-rename')
const header = require('gulp-header')

const path = require('path')

const getPackageDir = packageName => path.dirname(require.resolve(`${packageName}/package.json`))

const destDir = path.join(__dirname, 'lib')

const signalRDestName = 'signalR.js'

const signalRPath = path.join(getPackageDir('signalr'), 'jquery.signalR.min.js')

const signalRDestPath = path.join(destDir, signalRDestName)

gulp.task('clear-signalr-dest', () => pipe([
	gulp.src(signalRDestPath, { read: false, allowEmpty: true }),
	clean()
]))

gulp.task('get-signalr', () => pipe([
	gulp.src(signalRPath),
	header(`const jQueryShim = require('./jQueryShim');\n`),
	rename(signalRDestName),
	gulp.dest(destDir)
]))

gulp.task('default', gulp.series('clear-signalr-dest', 'get-signalr'))
