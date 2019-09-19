
	import Vue from 'vue';
	import '@/config/index';
	import App from '@/views/html/win/win/win.vue';
	if(process.env.NODE_ENV === 'production'){
		window.apiready = function(){
			new Vue({ render: h => h(App) }).$mount('#app');
		}
	} else {
		new Vue({ render: h => h(App) }).$mount('#app');
	}
	