
	import Vue from 'vue';
	import '@/config/index';
	import App from '@/views/html/frame/About.vue';
	if(process.env.NODE_ENV === 'production'){
		window.apiready = function(){
			new Vue({ render: h => h(App) }).$mount('#app');
		}
	} else {
		//调试模式延时,等待apiclound api加载完成
		setTimeout(() => {
			new Vue({ render: h => h(App) }).$mount('#app');
		}, 100);
	}
	