'use strict';

const Electron = require('electron');
const App = Electron.app;
const Core = require('./core');

App.on('ready', Core.startup);

App.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		App.quit();
	}
});