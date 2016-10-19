'use strict';

const Electron = require('electron');
const Ipc = Electron.ipcMain;
const Window = require('./window');

exports.on = function (message, callback) {
	Ipc.on(message, function (event, id, options, ...args) {
		if (options.reply) {
			args.push(function (...args) {
				event.sender.send('app:ipc-reply', id, ...args);
			});
		} else {
			args.push(function () {});
		}
		callback(...args);
	});
};

exports.send = function (message, ...args) {
	var cache = Window.getWindows();
	for (let id in cache) {
		let win = cache[id];
		win.send(message, ...args);
	}
};