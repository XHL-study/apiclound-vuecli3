var buildConfig = require('./src/build/index.js');
var pagesConfig = require('./src/build/views/views.js');

var path = require('path');

function resolve(dir) {
	return path.join(__dirname, dir);
}
//判断是否为发布模式
var isProduction = process.env.NODE_ENV === 'production';
//打包压缩代码
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
//生成 gz 包
// const CompressionWebpackPlugin = require('compression-webpack-plugin');
// const productionGzipExtensions = ['js', 'css'];
var vueConfig = {
	//项目根路径
	publicPath: buildConfig.publicPath,
	// 输出文件目录
	outputDir: buildConfig.outPath,
	//静态资源路径
	// assetsDir:"../",
	// eslint-loader 是否在保存的时候检查
	lintOnSave: false,
	//是否给生成的文件加上hash
	filenameHashing: false,
	//构建多页文件
	pages: pagesConfig.pages({
		clearEntrys: process.argv[3] == '-clear=true' //每次编译时是否清空entry文件夹,慎用
	}),
	// webpack配置
	chainWebpack: (config) => {
		//去掉 预加载
		config.plugins.delete('preload');
		config.plugins.delete('prefetch');
		// 路径别名
		// config.resolve.alias
		// 	.set('@x', resolve('src'))
		// 	.set('@assets', resolve('src/assets'))

		//图片打包优化
		const imagesLoader = config.module
			.rule('images');
		// 		imagesLoader.uses.clear();
		imagesLoader.use('url-loader')
			.loader('url-loader')
			.tap(options => {
				return Object.assign(options || {}, {
					limit: 3096,
				});
			});

	},
	configureWebpack: (config) => {
		if (isProduction) {
			//gz 包
			// config.plugins.push(new CompressionWebpackPlugin({
			// 	algorithm: 'gzip',
			// 	test: new RegExp(`\\.(${productionGzipExtensions.join('|')})$`),
			// 	threshold: 10240,
			// 	minRatio: 0.8,
			// }));


			// js美化
			config.plugins.push(
				new UglifyJsPlugin({
					sourceMap: vueConfig.productionSourceMap,
					uglifyOptions: {
						warnings: false,
						compress: {
							drop_debugger: true,
							//drop_console: true,
							pure_funcs: ['console.log', 'console.warn', 'console.info', 'console.dir']
						},
					},
				}));

			//资源单独分块
			config.optimization.splitChunks.cacheGroups.common = {
				name: 'chunk-common',
				test: /[\\\/](config|components|assets)[\\\/]/,
				//test: /[\\\/]src[\\\/](config|utils|assets[\\\/]css)[\\\/]/,
				priority: -20,
				chunks: 'initial'
			};

			//运行时单独分块
			config.optimization.runtimeChunk = {
				name: "runtime"
			}

			//处理页面引用的静态资源路径问题
			const fs = require("fs");
			config.plugins.push({
				apply: (compiler) => {
					compiler.hooks.done.tap('---', (a) => {
						const k = Object.keys(a);
						const assets = a['compilation']['assets'];
						const assetsKeys = Object.keys(assets);
						assetsKeys.map(item => {
							if (/js\//.test(item)) {
								const data = assets[item];
								const source = data.existsAt;
								const emitted = data.emitted;
								let value = data._value;
								if (emitted && /{e.exports=(.).p/.test(value)) {
									const v = value.replace(/{e.exports=(.).p/g, '{e.exports=$1.p+(window.____p())');
									fs.writeFile(source, v, (e) => {});
								}
							}
						});
					});
				}
			});
		} else {
			//开发模式 -- 处理页面引用的静态资源路径问题
			const fs = require("fs");
			const regExpStr = 'module.exports = __webpack_require__.p +';
			const regExp = new RegExp(regExpStr, '');
			config.plugins.push({
				apply: (compiler) => {
					compiler.hooks.shouldEmit.tap('=', (a) => {
						let assets = a['assets'];
						let assetsKeys = Object.keys(assets);
						assetsKeys.map(item => {
							if (/.js/.test(item)) {
								const source = assets[item]['_source'];
								source.children.map(ci => {
									if (typeof ci == 'object') {
										const value = ci._value;
										if (regExp.test(value) && value.indexOf("(window.____p())") < 0) {
											const v = value.replace(regExp, regExpStr + '(window.____p())');
											ci._value = v;
										}
									}
								});
							}
						});
					});
				}
			});
		}
	},
	// 生产环境是否生成 sourceMap 文件
	productionSourceMap: false,
	// css相关配置
	css: {
		// 是否使用css分离插件 ExtractTextPlugin
		extract: true,
		// 开启 CSS source maps?
		sourceMap: false,
		// css预设器配置项
		loaderOptions: {},
		// 启用 CSS modules for all css / pre-processor files.
		modules: false
	},
	parallel: require('os').cpus().length > 1,
	pwa: {},
	// webpack-dev-server 相关配置
	devServer: {
		open: false, //配置自动启动浏览器
		...buildConfig.devServer,
		hotOnly: true, // https:{type:Boolean}
		// proxy: { // 配置跨域代理
		// 	"/babyHealthDiaryApi": {
		// 		target: "http://pae.babyangle365.com", 
		// 		changeOrigin: true, 
		// 		ws: true, //是否代理websockets
		// 		// pathRewrite: {
		// 		// 	'^/api': ''
		// 		// }
		// 	}
		// }, 
		after: (app, server) => {
			//创建http服务
			if (vueConfig.devServer.https) {
				var port = vueConfig.devServer.port + 1;
				var fs = require("fs");
				var https = require("http");
				https.createServer(app).listen(port, vueConfig.devServer.host);
				var httpUri = 'http://' + vueConfig.devServer.host + ":" + port;
				console.log('\n\n App running at http: \n\n  - http-uri ' + httpUri + '\n\n');
			}
		}
	},
	pluginOptions: {
		webpackBundleAnalyzer: {
			openAnalyzer: false
		}
	},
	transpileDependencies: [],
}
module.exports = vueConfig;
