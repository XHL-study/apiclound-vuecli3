/**
 * api文档地址：https://docs.apicloud.com/Client-API/api#c0
 * 常用功能封装
 */

/**
 * 实体返回键监听，返回到手机桌面
 */
export function apiBackToLauncherEventLisener() {

	apiAddEventlistener('keyback', function() {
		api.historyBack({
			frameName: api.pageParam.name
		}, function(ret, err) {
			if (!ret.status) {
				api.toLauncher();
			}
		});
	});
}

/**
 * 返回项目地址根目录
 */
export function apiWgtRootDir() {
	return api.wgtRootDir;
}

/**
 * 处理远程，本地网页返回
 * @param {Boolean} onlyWin : 如果 apiOpenWindow 没有frameUrl参数则必传为true
 * 							 为true时直接关闭win窗体
 */
export function apiBackPage(onlyWin) {
	if (onlyWin)
		return apiCloseWin();
	apiHistoryBack();
}

/**
 * 监听返回键事件，只能用于win 页面内
 */
export function apiBackPageEventlistener() {
	apiAddEventlistener('keyback', function() {
		apiHistoryBack();
	});
}

/**
 * 浏览器路由栈返回，如果返回失败，则关闭win页面
 */
function apiHistoryBack() {
	api.historyBack({
		frameName: api.pageParam.name
	}, function(ret, err) {
		if (!ret.status) {
			apiCloseWin();
		}
	});
}

/**
 * 添加事件监听
 * @param {String} eventName：事件名称(必传参数)
 * @param {Funcion} func：回调函数（必传参数）
 */
export function apiAddEventlistener(eventName, func) {
	if (!eventName)
		return console.error("eventName is undefined/null");
	if (!func)
		return console.error("func is undefined");
	api.addEventListener({
		name: eventName
	}, function(ret, err) {
		func(ret, err);
	});
}
/**
 * 触发注册的监听事件,传递参数
 * @param {String} evetName :事件名称
 * @param {Object} data :传过去的参数
 */
export function apiSendEvent(evetName, data) {
	api.sendEvent({
		name: evetName,
		extra: data
	})
}

/**
 * 关闭frame页面
 * @param {String} frameName：frame的名字（可选参数），不传则关闭当前frame页面
 */
export function apiCloseFrame(frameName) {
	if (!frameName)
		return api.closeFrame();
	api.closeFrame({
		name: frameName
	});
}

/**
 * 关闭win页面
 * @param {String} winName：win的名字（可选参数），不传则关闭当前win页面
 */
export function apiCloseWin(winName) {
	if (!winName)
		return api.closeWin();
	api.closeWin({
		name: winName
	});
}


/**
 * 设置偏好数据
 * @param {String} key（必传参数）
 * @param {Object} val（必传参数）
 */
export function apiSetStorage(key, val) {
	api.setPrefs({
		key: key,
		value: val
	});
}
/**
 * 获取偏好数据
 * @param {String} key（必传参数）
 * @return {String} 返回的数据
 */
export function apiGetStorage(key) {
	var val = api.getPrefs({
		sync: true,
		key: key
	});
	return val
}

/**
 * 删除偏好数据
 * @param {String} key：要删除的偏好数据的key（必传参数）
 */
export function rmStorage(key) {
	api.removePrefs({
		key: key
	});
}


/**
 * 打开win窗体
 * @param {Object} data：（必传参数）
 */
export function apiOpenWindow(data) {
	//frameUrl, title, winName,frameName, winUrl, hasHead,data,pageParam,bgColor,delay
	api.openWin({
		name: (data.winName || 'win'),
		url: data.winUrl || '',
		pageParam: { //下个页面的配置信息
			leftTitle: data.leftTitle || false,
			bounces: data.bounces || false,
			name: (data.frameName || 'child-frame'),
			title: data.title || '',
			url: data.frameUrl || '',
			data: data.pageParam || {} //传入下个frame页面的数据
		},
		animation: data.animation || ({
			type: "push", //动画类型（详见动画类型常量）
			subType: "from_right", //动画子类型（详见动画子类型常量）
			duration: 300 //动画过渡时间，默认300毫秒
		}),
		bgColor: data.bgColor || 'rgba(0,0,0,0)',
		delay: data.delay || 0, //延时多少毫秒显示页面
	});
}

/**
 * 打开frame窗体
 * @param {Object} data
 */
export function apiOpenFrame(data) {
	//frameName,frameUrl,rect,animation,pageParam,bounces,allowEdit,VSBEprogress
	api.openFrame({
		name: (data.frameName || 'frame'),
		url: data.frameUrl,
		rect: data.rect || {
			x: 0,
			y: 0,
			w: 'auto',
			h: 'auto',
			marginTop: 0,
			marginBottom: 0
		},
		animation: data.animation || ({
			type: "push", //动画类型（详见动画类型常量）
			subType: "from_right", //动画子类型（详见动画子类型常量）
			duration: 300 //动画过渡时间，默认300毫秒
		}),
		pageParam: data.pageParam || {}, //页面参数
		scaleEnabled:data.scaleEnabled,
		bounces: (typeof data.bounces == 'boolean') ? data.bounces : true,
		allowEdit: (typeof data.allowEdit == 'boolean') ? data.allowEdit : true,
		vScrollBarEnabled: (typeof data.VSBE == 'boolean') ? data.VSBE : true, //是否显示垂直滚动条
		progress: data.progress || {
			type: "page", //加载进度效果类型，默认值为default，取值范围为default|page，default等同于showProgress参数效果；为page时，进度效果为仿浏览器类型，固定在页面的顶部
			title: "", //type为default时显示的加载框标题
			text: "", //type为default时显示的加载框内容
			color: "rgba(51, 153, 153, 1)" //type为page时进度条的颜色，默认值为#45C01A，支持#FFF，#FFFFFF，rgb(255,255,255)，rgba(255,255,255,1.0)等格式
		}
	});
}

function isElement(obj) {
	return !!(obj && obj.nodeType == 1);
}

/**
 * 设置头沉浸式部样式
 * @param {Object} el
 * @return {Numbber} : 元素高度
 */
export function apiFixStatusBar(el) {
	if (!isElement(el)) {
		console.warn('$api.fixStatusBar Function need el param, el param must be DOM Element');
		return 0;
	}
	el.style.paddingTop = api.safeArea.top + 'px';
	return el.offsetHeight;
}

/**
 * 设置底部沉浸式样式
 * @param {HtmlElement} el
 */
export function apiFixTabBar(el) {
	if (!isElement(el)) {
		console.warn('$api.fixTabBar Function need el param, el param must be DOM Element');
		return 0;
	}
	el.style.paddingBottom = api.safeArea.bottom + 'px';
	return el.offsetHeight;
}

/**
 * 设置状态栏样式
 * @param {String} style：'light' | 'dark'（可选参数）
 */
export function apiSetStatusBar(style) {
	api.setStatusBarStyle({
		style: style || 'dark'
	});
}

/**
 * toast轻提示
 * @param {String} text :提示文字 必传参数
 * @param {Number} time :显示时长 可选参数
 * @param {String} location :显示位置 可选参数
 * 
 */
export function apiToast(text, time, location) {
	if (!text) {
		return;
	}
	api.toast({
		msg: text,
		duration: time || 2000,
		location: location || 'bottom'
	});
}


/**
 * 获取当前win的名字
 */
export function apiGetWinName() {
	return api.winName;
}

/**
 * 获取当前页面参数
 */
export function apiGetPageParam() {
	return api.pageParam;
}

/**
 * 对frame窗口设置监听
 * @param {Object} options：
 * 	{
		frameName:"",frame窗体的名字 （必填参数）
	}
 * @param {Function} func：frame内的网页变化回调 （必填参数）
 */
export function apiSetFrameClient(options, func) {
	if (!options || typeof options !== "object")
		return console.warn("options is not Object");
	if (!options.frameName)
		return console.warn("options.frameName is null/undefined");
	if (!func || typeof func != "function")
		return console.warn("func must be function");
	api.setFrameClient(options, func);
}

/**
 * 给某个页面注入script脚本
 * @param {Object} options 	：必填参数
 * 		{
			name: win窗体的名字,
			frameName: frame窗体的名字,
			script: 注入的js代码
		}
 */
export function apiExecScript(options) {
	if (!options || typeof options !== "object")
		return console.warn("options is not Object");
	if (!options.name)
		return console.warn("options.name is null/undefined");
	if (!options.frameName)
		return console.warn("options.frameName is null/undefined");
	api.execScript(options);
}

/**
 * 清理缓存
 * @param {String} text：清理完成的提示文字：可选参数
 */
export function apiClearCache(text) {
	api.clearCache(function() {
		if (text)
			apiToast(text);
	});
}

/**
 * 注入自定meta
 * @param {String} name：要注入代码的win窗体的名字（必填）
 * @param {String} frameName：要注入代码的frame窗体的名字（必填）
 * @param {String} script :要注入的代码（可选）
 */
export function apiInsertMetaScript(name, frameName, script) {
	let _defScript = '<meta name="viewport" content="maximum-scale=5.0,minimum-scale=1.0,user-scalable=yes,initial-scale=1.0,width=device-width" />';
	apiExecScript({
		name: name,
		frameName: frameName,
		script: `var _dh_meta = document.querySelector('head');_dh_meta.innerHTML = _dh_meta.innerHTML+'${script || _defScript}'`
	});
}
