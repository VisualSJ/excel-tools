'use strict';

const Fs = require('fs');
const Path = require('path');
const Manager = require('./manager');
const Log = require('./log');

var configPath = Path.join(__dirname, '../../profile/config.json');

// 取出 config 数据
var config = null;
try {
	config = JSON.parse(Fs.readFileSync(configPath) + '');
} catch (error) {
	config = {};
}

exports.get = function (name) {
	return config[name] || null;
};

exports.set = function (name, value) {
	Log.log(`[Setting] 更改配置属性 ${name} : ${config[name]} -> ${value}`);

	config[name] = value;
	var string = JSON.stringify(config, null, 4);
	Fs.writeFileSync(configPath, string);

	if (name === 'excel_dir') {
		Manager.include(value);
	}
};