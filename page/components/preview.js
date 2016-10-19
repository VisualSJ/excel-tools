'use strict';

'use strict';

const Ipc = require('../lib/ipc');
const Path = require('path');
const Electron = require('electron');
const Shell = Electron.shell;

exports.template = `
<header>
    <h1>表格数据预览</h1>
    <h2>这里可以直接预览某个表格内的数据</h2>
</header>
<section>
	<div class="prop">
        <span>当前文件：</span>
        <span>{{file}}</span>
    </div>
    <div class="container">
	    <div v-bind:active="item===file" class="file-item" v-for="item in files" v-on:click="_onClickFile(item)">{{item}}</div>
	</div>
    <div class="container" id="preview-table">
    	<header class="table-header-preview">
    		<div v-bind:active="item===table" v-for="item in names" v-on:click="_onClickTable(item)">{{item}}</div>
		</header>
    	<section class="table-data-preview" v-if="data">
    		<div class="tr" v-for="tr in data" track-by="$index" v-bind:active="$index===line">
    			<div class="index">{{$index+1}}</div>
    			<div class="td" v-for="td in tr" v-bind:title="td" track-by="$index">{{td}}</div>
			</div>
		</section>
	</div>
</section>
`;

exports.props = {
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

exports.watch = {
	file: {
		handler () {
			this._initNames();
		}
	},
	table: {
		handler () {
			this._initTable();
		}
	}
};

exports.data = function () {
	return {
		files: [],
		names: [],
		data: null
	};
};

exports.ready = function () {

	Ipc.send('app:read-setting', 'excel_dir', (value) => {
		Ipc.send('app:read-files', value, (files) => {
			this.files = files;
		});
	});

	this._initNames();
	this._initTable();
	this._onClickLine();
};

exports.methods = {
	_onClickFile (file) {
		this.file = file;
		this.line = -1;
	},
	_onClickTable (table) {
		this.table = table;
		this.line = -1;
	},
	_onClickLine () {
		var dom = document.getElementById('preview-table');
		setTimeout(() => {
			dom.scrollTop = this.line * 23 + 24 + 10;
		}, 500);
	},

	_initNames () {
		Ipc.send('app:read-excel', this.file, (json) => {
			if (!json) return;
			this.names = json.map((item) => {
				return item.name;
			});
		});
	},
	_initTable () {
		Ipc.send('app:read-excel', this.file, (json) => {
			if (!json) return;
			json.some((table) => {
				if (table.name === this.table) {
					this.data = table.data;
				}
			});
		});
	}
};