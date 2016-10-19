'use strict';

console.log(`[Editor] 初始化 Core`);

const Path = require('path');

const Ipc = require('./lib/ipc');
const Log = require('./lib/log');
const Window = require('./lib/window');
const Setting = require('./lib/setting');
const Manager = require('./lib/manager');
const FileSystem = require('./lib/file-system');
const Menu = require('./lib/menu');

var openWindow = function () {
	Log.log(`[Editor] 启动图形界面`);

	var win = Window.create();
	win.loadURL(`file://${Path.join(__dirname, '../')}/page/index.html`);
};

var registerIpc = function () {

	Log.log(`[Editor] 注册 IPC 通讯`);

	Ipc.on('app:change-setting', function (key, value, callback) {
		Setting.set(key, value);
		callback(key, value);
	});

	Ipc.on('app:read-setting', function (key, callback) {
		callback(Setting.get(key));
	});

	Ipc.on('app:read-files', function (path, callback) {
		callback(FileSystem.readFilesSync(path));
	});

	Ipc.on('app:read-excel', function (path, callback) {
		callback(Manager.get(path));
	});

	Ipc.on('app:filter-excel', function (filter, callback) {
		callback(Manager.filter(filter));
	});

	Ipc.on('app:init', function () {
		Manager.include(Setting.get('excel_dir'));
	});
};

var createMenu = function () {
	Menu.update([
		{
			label: '窗口',
			submenu: [
				{
					label: '刷新',
					accelerator: 'CmdOrCtrl+R',
					click (item, focusedWindow) {
						if (focusedWindow) focusedWindow.reload();
					}
				}, {
					type: 'separator'
				}, {
					label: '开发者工具',
					accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
					click (item, focusedWindow) {
						if (focusedWindow) focusedWindow.webContents.toggleDevTools()
					}
				},
			]
		}, {
			label: '帮助',
			submenu: [
				{
					label: '作者: VisualSJ',
					enabled: false
				}
			]
		}
	]);
};

exports.startup = function () {
	openWindow();
	registerIpc();
	createMenu();
};