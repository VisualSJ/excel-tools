'use strict';

const Ipc = require('../lib/ipc');
const Dialog = require('electron').remote.dialog;

exports.template = `
<header>
    <h1>设置参数</h1>
    <h2>在这里设置所有的可配置属性</h2>
</header>
<section>
    <div class="prop">
        <span>excel文件夹</span>
        <input v-bind:value="excel_dir" disabled/>
        <button v-on:click="_openDirectory">打开文件夹</button>
    </div>
</section>
`;

exports.props = {};

exports.data = function () {
	return {
		excel_dir: ''
	};
};

exports.ready = function () {
	Ipc.send('app:read-setting', 'excel_dir', (value) => {
		this.excel_dir = value;
	});
};

exports.methods = {
	_openDirectory () {
		var result = Dialog.showOpenDialog({properties: ['openFile', 'openDirectory', 'multiSelections']});
		if (!result || !result[0]) {
			return;
		}

		var dir = result[0];
		this.excel_dir = dir;
		Ipc.send('app:change-setting', 'excel_dir', dir);
	}
};