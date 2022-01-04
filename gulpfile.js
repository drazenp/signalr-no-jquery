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
import swc from 'gulp-swc';

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

const swcPipe = (moduleType = 'es6') =>
    swc({
        module: {
            type: moduleType,
        },
    });

const mutatePipes = (moduleType = 'es6') => [
    header(`import jQueryShim from './jQueryShim.${moduleType === 'commonjs' ? 'cjs' : 'js'}';` + EOL),
    replace('window.jQuery', 'jQueryShim'),
    footer(EOL + 'export const hubConnection = jQueryShim.hubConnection;' + EOL + 'export const signalR = jQueryShim.signalR;' + EOL),
];

const renameExtToCommonJs = () =>
    rename(path => {
        path.extname = '.cjs';
    });

const buildSignalR = () => pipeline([gulp.src(signalRTmpPath), ...mutatePipes(), swcPipe(), gulp.dest(destDir)]);

const buildSignalRCommonJs = () =>
    pipeline([gulp.src(signalRTmpPath), ...mutatePipes('commonjs'), swcPipe('commonjs'), renameExtToCommonJs(), gulp.dest(destDir)]);

const copyShim = () => pipeline([gulp.src(shimPath), swcPipe(), gulp.dest(destDir)]);

const copyShimCommonJs = () => pipeline([gulp.src(shimPath), swcPipe('commonjs'), renameExtToCommonJs(), gulp.dest(destDir)]);

const copyTypings = () => pipeline([gulp.src(`${srcDir}/signalR.d.ts`), gulp.dest(destDir)]);

export const build = gulp.series(clearTempDir, getSignalR, buildSignalR, buildSignalRCommonJs, clearTempDir);

export default gulp.series(clearDestDir, build, copyShim, copyShimCommonJs, copyTypings);
