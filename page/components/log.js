'use strict';

const Ipc = require('../lib/ipc');

var logs = [];

Ipc.on('app:log', function (message) {
	logs.push(message);
});

exports.template = `
<header>
    <h1>运行日志</h1>
    <h2>这里将显示开启后，程序的运行日志</h2>
</header>
<section>
    <div class="container">
    	<div class="log-item" v-for="item in items"><span class="log-span">{{item}}</span></div>
	</div>
</section>
`;

exports.props = {};

exports.data = function () {
	return {
		items: logs
	};
};

exports.ready = function () {
};

exports.methods = function () {
	
};