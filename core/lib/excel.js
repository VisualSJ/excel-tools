'use strict';

const Path = require('path');
const Xlsx = require('node-xlsx');
const Log = require('./log');

exports.parse = function (file) {
	var extname = Path.extname(file);

	try {
		switch (extname) {
			case '.xlsx':
				return Xlsx.parse(file);
			case '.xls':
				return Xlsx.parse(file);
		}
	} catch (error) {
		Log.log(`[Excel] 解析文件失败: ${file}`);
		console.error(error);
		return [];
	}

	Log.log(`[Excel] 无法解析文件: ${file}`);
	return [];
};