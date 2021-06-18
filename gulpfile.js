import path from 'path';
import { EOL } from 'os';
import { fileURLToPath } from 'url';

import gulp from 'gulp';

import pipeline from 'gulp-pipe';
import clean from 'gulp-clean';
import rename from 'gulp-rename';
import header from 'gulp-header';
import footer from 'gulp-footer';
import replace from 'gulp-replace';
import babel from 'gulp-babel';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getPackageDir = packageName => path.join(__dirname, 'node_modules', packageName);

const srcDir = path.join(__dirname, 'src');

const destDir = path.join(__dirname, 'lib');

const tempDir = path.join(__dirname, 'tmp');

const signalRDestName = 'signalR.js';

const signalRPath = path.join(getPackageDir('signalr'), 'jquery.signalR.js');

const shimPath = path.join(srcDir, 'jQueryShim.js');

const signalRTmpPath = path.join(tempDir, signalRDestName);

const clearTempDir = () => pipeline([gulp.src(tempDir, { read: false, allowEmpty: true }), clean()]);

const clearDestDir = () => pipeline([gulp.src(tempDir, { read: false, allowEmpty: true }), clean()]);

const getSignalR = () => pipeline([gulp.src(signalRPath), rename(signalRDestName), gulp.dest(tempDir)]);

const buildSignalR = () =>
    pipeline([
        gulp.src(signalRTmpPath),
        header(`import jQueryShim from './jQueryShim';\n`),
        replace('window.jQuery', 'jQueryShim'),
        footer(EOL + 'export const hubConnection = jQueryShim.hubConnection;' + EOL + 'export const signalR = jQueryShim.signalR;'),
        babel({ presets: ['@babel/preset-env'] }),
        gulp.dest(destDir),
    ]);

const copyShim = () => pipeline([gulp.src(shimPath), babel({ presets: ['@babel/preset-env'] }), gulp.dest(destDir)]);

const copyTypings = () => pipeline([gulp.src(`${srcDir}/signalR.d.ts`), gulp.dest(destDir)]);

export const build = gulp.series(clearTempDir, getSignalR, buildSignalR, clearTempDir);

export default gulp.series(clearDestDir, build, copyShim, copyTypings);
