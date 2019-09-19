import axios from 'axios'

import qs from 'qs'

//添加一个请求发出前的拦截器
axios.interceptors.request.use(function(config) {
	
	//处理get请求参数传递方式
	if (config.method.toLocaleLowerCase() == 'get') {
		config.params = config.data;
		delete config.data;
	}
	return config;
}, function(error) {
	//Do something with request error
	return Promise.reject(error)
});

//添加一个响应请求的拦截器
axios.interceptors.response.use(function(res) {
	//在这里对返回的数据进行处理	
	var resdt = (res.msg ? res : res.data) || (typeof res.request.responseText == 'string' ? JSON.parse(res.request.responseText) : res.request.responseText);
	return resdt;
}, function(error) {
	return Promise.reject(error)
})

const getData = (data) => {
	let promise = axios({
		method: data.methodType || 'get',
		url: data.url || '',
		data: data.data || {},
		paramsSerializer: function(params) {
			return qs.stringify(params);
		},
		responseType: data.dataType || 'json'
	});
	
	//请求 错误
	promise.catch((res) => {
		throw "服务器开小差了，请稍后再试~~~😥";
		console.warn('url：' + data.url + ' \n data：' + JSON.stringify(data.data));
	});
	return promise;
}

export {
	getData
}
