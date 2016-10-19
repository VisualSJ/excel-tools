'use strict';

const Ipc = require('../lib/ipc');
const Path = require('path');
const Electron = require('electron');
const Shell = Electron.shell;

exports.template = `
<header>
    <h1>查找数据</h1>
    <h2>在下方输入字段，将在设置的文件夹内查找对应的行数据</h2>
</header>
<section>
    <div class="prop">
        <span>查找条件</span>
        <input v-on:keydown="_onFilter" v-bind:value="filter" />
    </div>
    <div class="container">
    	<table>
    		<tr>
                <td style="width:120px;">文件</td>
                <td style="width:80px;">表名</td>
                <td style="width:40px;">行号</td>
                <td>预览字段</td>
			</tr>
    		<tr v-for="item in items">
                <td><span class="name" v-on:click="_onOpenFile(item.file)" v-bind:title="item.basename">{{item.basename}}</span></td>
                <td><span>{{item.table}}</span></td>
                <td><span class="name" v-on:click="_onPreviewFile(item.file, item.table, item.line)">{{item.line + 1}}</span></td>
                <td><span v-bind:title="item.string">{{item.string}}</span></td>
			</tr>
		</table>
	</div>
</section>
`;

exports.props = {
	filter: {
		twoWay: true
	},
	index: {
		twoWay: true
	},
	file: {
		twoWay: true
	},
	table: {
		twoWay: true
	},
	line: {
		twoWay: true
	}
};

exports.data = function () {
	return {
		items: []
	};
};

exports.ready = function () {
	this._onFilter();
};

exports.methods = {
	_onFilter (event) {
		if (event && event.keyCode !== 13) return;
		var filter = (event && event.target) ? event.target.value : this.filter;
		this.filter = filter;
		if (!this.filter) return;
		Ipc.send('app:filter-excel', filter, (array) => {
			this.items = array.map((item) => {
				item.basename = Path.basename(item.file);
				return item;
			});
		});
	},
	_onOpenFile (file) {
		Shell.openExternal(file);
	},

	_onPreviewFile (file, table, line) {
		this.file = file;
		this.table = table;
		this.line = line;
		this.index = 2;
	}
};