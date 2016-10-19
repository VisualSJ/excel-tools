'use strict';

const Electron = require('electron');
const BrowserWindow = Electron.BrowserWindow;

var id = 1;
var windows = {};

exports.create = function () {
	var windowID = id++;
	
	var window = new BrowserWindow({width: 800, height: 600});
	windows[windowID] = window;

	// win.webContents.openDevTools();
	window.on('closed', () => {
		delete windows[windowID];
	});
	
	return window;
};

exports.getWindows = function () {
	return windows;
};