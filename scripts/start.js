'use strict';

const Path = require('path');
const ChildProcess = require('child_process');
const ElectronExe = Path.join(__dirname, '../node_modules/electron/dist/electron.exe');
const AppPath = Path.join(__dirname, '../');

console.log(`[Editor] 启动工具`);

var child = ChildProcess.spawn(ElectronExe, [AppPath]);

child.on('exit', function() {
	console.log(`[Editor] 退出工具`);
});

child.stdout.on('data', function(data) {
	var string = (data + '').trim();
	if (!string) return;
	console.log(string);
});