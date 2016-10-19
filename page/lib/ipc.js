'use strict';

const Electron = require('electron');
const Ipc = Electron.ipcRenderer;

var MessageId = 1;
var CallbackMaps = {};

Ipc.on('app:ipc-reply', function (event, id, ...args) {
	if (CallbackMaps[id]) {
		CallbackMaps[id](...args);
	}
});

exports.send = function (message, ...args) {
	var options = {
		reply: false
	};
	if (args && args.length > 1 && typeof args[args.length - 1] === 'function') {
		CallbackMaps[MessageId] = args.pop();
		options.reply = true;
	}
	Ipc.send(message, MessageId++, options, ...args);
};

exports.on = function (message, callback) {
	Ipc.on(message, function (event, ...args) {
		callback(...args);
	});
};