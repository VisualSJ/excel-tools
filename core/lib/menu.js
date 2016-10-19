'use strict';

const Electron = require('electron');
const Menu = Electron.Menu;

exports.update = function (template) {
	var menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);
};
