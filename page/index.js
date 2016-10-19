'use strict';

const Vue = require('vue');
const Ipc = require('./lib/ipc');

window._vm = new Vue({
	el: document.body,
	data: {
		index: 1,
		menus: ['设置参数', '查找数据', '表格预览', '运行日志'],
		
		filter: '',
		
		file: '',
		table: '',
		line: 0
	},

	watch: {
		file: {
			handler () {
				Ipc.send('app:read-excel', this.file, (json) => {
					this.table = (json && json[0]) ? json[0].name : '';
				});
			}
		}
	},

	ready () {
		Ipc.send('app:init');
	},

	components: {
		'config-page': require('./components/config'),
		'find-page': require('./components/find'),
		'log-page': require('./components/log'),
		'preview-page': require('./components/preview'),
	},
	methods: {
		_onClickMenu (event) {
			this.index = this.menus.indexOf(event.target.innerHTML);
		}
	}
});