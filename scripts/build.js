'use strict';

const Async = require('async');
const Gulp = require('gulp');
const Path = require('path');
const ChildProcess = require('child_process');

console.log('[Build] 开始构建项目');

Async.series([
	function (next) {
		console.log('[Build] 复制 Electron');
		Gulp.src(['node_modules/electron/dist/**/*'])
		.pipe(Gulp.dest('bin'))
		.on('end', next);
	},
	function (next) {
		console.log('[Build] 构建项目源');
		Gulp.src(['**/*', '!node_modules', '!node_modules/**/*', '!bin', '!bin/**/*'])
		.pipe(Gulp.dest('bin/resources/app'))
		.on('end', next);
	},
	function (next) {
		console.log('[Build] 安装 nodeJS 依赖模块');
		var cmdstr = process.platform === 'win32' ? 'npm.cmd' : 'npm';
		var child = ChildProcess.spawn(cmdstr, ['install', '--production'], {
			cwd: Path.join(__dirname, '../bin/resources/app'),
			stdio: 'inherit',
			env: process.env
		});
		child.on('error', function (error) {
			console.log(error)
		});
		child.on('exit', function() {
			console.log('[Build] 依赖安装成功');
			next();
		});
	},
	function () {
		console.log('[Build] 构建成功');
	}
]);