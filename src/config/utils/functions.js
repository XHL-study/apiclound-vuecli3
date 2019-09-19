/**
 * 查找数组内与item[itemKey]相等的下标/下标集合;
 * @param {Object} arr ：要查找的目标对象
 * @param {Object} arrKey ：要匹配的键与itemKey对应，可不相同
 * @param {Object} item：匹配项
 * @param {Object} itemKey：要匹配的键与arrKey对应，可不相同
 * @param {Object} getAll：是否匹配所有
 * @return {Number / Array}:返回的结果，如果getAll为true，则类型为数字数组，否则为Number；
 */
export function findArrItemIndex(arr, arrKey, item, itemKey, getAll) {
	let _indexArr = [];
	let _arr = (arr || []);
	let _len = _arr.length;
	if (_len < 1)
		return -1;
	//返回所有匹配的
	if (getAll) {
		for (let i = 0; i < _len; i++) {
			if (_arr[i][arrKey] == item[itemKey])
				_indexArr.push(i);
			else
				continue;
		}
		return _indexArr;
	}
	let _index = -1;
	//返回单个匹配的
	for (let i = 0; i < _len; i++) {
		if (_arr[i][arrKey] == item[itemKey]) {
			_index = i;
			break;
		} else
			continue;
	}
	return _index;
}

/**
 * 获取url内的参数
 * @param {String} url ：链接
 * @param {String} key ：根据key获取值
 * @return {Object/String} ：如果传入key则返回key的值，不传则返回所有值
 */
export function getUrlArgs(url, key) {
	let _url = (decodeURIComponent(url) || '?').split('?');
	_url.splice(0, 1);
	_url = _url.join('&');
	var _argArr = (_url || "").split('&');
	var _args = {};
	for (var v in _argArr) {
		var _item = _argArr[v].split('=');
		if (_item[1])
			_args[_item[0]] = _item[1]
	}
	if (key)
		return _args[key];
	return _args;
}
