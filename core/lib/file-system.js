'use strict';

const Fs = require('fs');
const Path = require('path');

/**
 * 传入文件夹
 * 返回文件夹内所有的文件路径数组
 * @param dir
 */
exports.readFilesSync = function (dir) {
	var result = [];

	var files = Fs.readdirSync(dir);
	files.forEach((name) => {
		var path = Path.join(dir, name);
		var stat = Fs.statSync(path);
		if (stat.isDirectory()) {
			var dirFiles = exports.readFilesSync(path);
			dirFiles.forEach((file) => {
				result.push(file);
			});
		} else {
			result.push(path);
		}
	});
	return result;
};