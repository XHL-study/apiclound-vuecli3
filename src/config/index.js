import Vue from 'vue';

//全局css
import '@/assets/css/main.css';

//ui框架配置
import './ui'

//vue指令配置
import './directive';

//static 资源根路径
Vue.prototype.$staticUrl = process.env.BASE_URL;


//ajax 请求
import {
	getData
} from './axios';
Vue.prototype.$http = getData;

//请求api 地址配置
import ApiUri from './uri';
Vue.prototype.$api = ApiUri;


//处理多页面内静态资源引用路径		****千万不要改****
window.____p = () => {
	var __scripts = document.querySelector('script[data-static]');
	return __scripts.dataset.static || '';
}
