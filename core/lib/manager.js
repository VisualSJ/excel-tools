'use strict';

const Fs = require('fs');
const FileSystem = require('./file-system');
const Excel = require('./excel');
const Log = require('./log');

// 文件信息缓存，用于判断是否更新文件数据缓存
var statCache = {};
// 文件数据缓存，用于实际匹配数据
var dataCache = {};

exports.include = function (dir) {
	var exists = Fs.existsSync(dir);
	if (!exists) {
		statCache = {};
		dataCache = {};
		return Log.log(`[Manager] 导入文件路径错误: ${dir}`);
	}
	var files = FileSystem.readFilesSync(dir);

	// 检查被删除的文件
	for (let file in statCache) {
		if (files.indexOf(file) === -1) {
			delete statCache[file];
			delete dataCache[file];
		}
	}

	// 获取所有文件地址，拼装成数组
	for (let i=0; i<files.length; i++) {
		let file = files[i];
		var stat = Fs.statSync(file);

		// 检查没有改动的文件
		if (
			statCache[file] &&
			statCache[file].atime === stat.atime-0 &&
			statCache[file].birthtime === stat.birthtime-0 &&
			statCache[file].ctime === stat.ctime-0 &&
			statCache[file].mtime === stat.mtime-0 &&
			statCache[file].size === stat.size-0
		) {
			files.splice(i--, 1);
		}

		statCache[file] = {
			atime: stat.atime - 0,
			birthtime: stat.birthtime - 0,
			ctime: stat.ctime - 0,
			mtime: stat.mtime - 0,
			size: stat.size - 0
		};
	}

	// 缓存所有的文件数据
	files.forEach((file) => {
		dataCache[file] = Excel.parse(file);
	});
};

exports.get = function (path) {
	return dataCache[path] || null;
};

exports.filter = function (filter) {
	filter = filter.toLowerCase();

	var result = [
		/* { file: 'd:\\abc', table: '表格1', line: 5 } */
	];

	for (let file in dataCache) {
		let data = dataCache[file];
		data.forEach((table) => {
			var name = table.name;
			var lines = table.data;

			lines.forEach((line, index) => {
				var string = line.toString();
				string = string.toLowerCase();
				if (string.indexOf(filter) !== -1) {
					result.push({
						file: file, table: name, line: index, string: string
					});
				}
			});
		});
	}

	return result;
};