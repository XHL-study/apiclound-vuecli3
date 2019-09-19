module.exports = {
	presets: [
		['@vue/app', {
			polyfills: [
				'es6.array.iterator',
				'es6.promise',
				'es6.object.assign',
				'es7.promise.finally'
			]
		}],
		["@babel/preset-env", {
			"modules": 'commonjs' //设置为false iview会报错
		}]
	],
	"plugins": [
		['import', {
			libraryName: 'vant',
			libraryDirectory: 'es',
			style: true
		}, 'vant'],
		//es7转换
		["@babel/plugin-transform-async-to-generator", {
			"module": "bluebird",
			"method": "coroutine"
		}],
		["@babel/plugin-proposal-optional-chaining"]
	]
}
