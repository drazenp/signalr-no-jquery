const gulp = require('gulp')

const pipe = require('gulp-pipe')
const clean = require('gulp-clean')
const rename = require('gulp-rename')
const header = require('gulp-header')
const footer = require('gulp-footer')
const replace = require('gulp-replace')
const babel = require('gulp-babel')

const path = require('path')

const getPackageDir = packageName => path.dirname(require.resolve(`${packageName}/package.json`))

const srcDir = path.join(__dirname, 'src')

const destDir = path.join(__dirname, 'lib')

const tempDir = path.join(__dirname, 'tmp')

const signalRDestName = 'signalR.js'

const signalRPath = path.join(getPackageDir('signalr'), 'jquery.signalR.js')

const shimPath = path.join(srcDir, 'jQueryShim.js')

const signalRTmpPath = path.join(tempDir, signalRDestName)

gulp.task('tempDir:clear', () => pipe([
	gulp.src(tempDir, { read: false, allowEmpty: true }),
	clean()
]))

gulp.task('destDir:clear', () => pipe([
	gulp.src(tempDir, { read: false, allowEmpty: true }),
	clean()
]))

gulp.task('signalr:get', () => pipe([
	gulp.src(signalRPath),
	rename(signalRDestName),
	gulp.dest(tempDir)
]))

gulp.task('signalr:build', () => pipe([
	gulp.src(signalRTmpPath),
	header(`const jQueryShim = require('./jQueryShim');\n`),
	replace('window.jQuery', 'jQueryShim'),
	footer(`\nexports.hubConnection = jQueryShim.hubConnection;\nexports.signalR = jQueryShim.signalR;`),
	babel({ presets: ['@babel/env'] }),
	gulp.dest(destDir)
]))

gulp.task('shim:copy', () => pipe([
	gulp.src(shimPath),
	gulp.dest(destDir)
]))

gulp.task('typings:copy', () => pipe([
	gulp.src(`${srcDir}/signalR.d.ts`),
	gulp.dest(destDir)
]))

gulp.task('build', gulp.series('tempDir:clear', 'signalr:get', 'signalr:build', 'tempDir:clear'))

gulp.task('default', gulp.series('destDir:clear', 'build', 'shim:copy', 'typings:copy'))
