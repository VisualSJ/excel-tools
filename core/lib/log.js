'use strict';

const Ipc = require('./ipc');

exports.log = function (message) {
	console.log(message);
	Ipc.send('app:log', message);
};