const path = require('path');
const fs = require('fs');
const glob = require('glob');

const outRelativePath = require('../index.js').outRelativePath;
// 存放生成的入口文件的目录
const entryDir = 'src/config/entrys/';

//存储路由配置的文件路径
const viewsJsonFile = 'src/build/views/views.json';
let pageDatas = {}
//如果文件则直接读取
if (fs.existsSync(viewsJsonFile)) {
	pageDatas = fs.readFileSync(viewsJsonFile, 'utf-8'); //require('./views.json');
} else {
	//不存再则创建
	fs.writeFileSync(viewsJsonFile, "{}");
}
//如果文件内容为空则赋予默认值
if (!pageDatas)
	pageDatas = {};
if (typeof pageDatas != 'object')
	pageDatas = JSON.parse(pageDatas);

// 多页路由配置选项
const config = {
	pages: (options) => {
		/**
		 * options：配置项
		 * 	clearEntrys：每次打包时是否创建新的entry，
		 * 			请运行一次run build/run dev后在去对应的entry js文件改
		 */
		return getPages(options);
	}
};

//删除目录内的文件
function deleteFolderRecursive(path) {
	if (fs.existsSync(path)) {
		fs.readdirSync(path).forEach(function(file) {
			var curPath = path + "/" + file;
			if (fs.statSync(curPath).isDirectory()) { // recurse
				deleteFolderRecursive(curPath);
			} else { // change file add old
				fs.unlinkSync(curPath);				
			}
		});
	}
};

// 获取多页面的配置数据
function getPages(options) {
	const pages = {};
	//是否清空entry目录所有文件--- 慎用
	if (options.clearEntrys) {
		deleteFolderRecursive(entryDir);
	}
	//如果不存在entry，创建entry目录
	let hasEntryDir = fs.existsSync(entryDir);
	if (!hasEntryDir) {
		fs.mkdirSync(entryDir);
	}
	glob.sync('src/views/**/*.vue').forEach(function(pageUrl) {
		const appTpl = pageUrl.replace('src/', '');
		// 打包文件路径
		const filename = appTpl.replace('.vue', '').replace('views/', ''); //.replace(/\//g, '');
		//获取/初始化配置数据
		let pageData = pageDatas[filename] || {};
		//入口js文件
		const entryFile = entryDir + `${filename}.js`;
		let exitsFile = fs.existsSync(entryFile);
		//初始化各个页面的入口文件
		if (!exitsFile) {
			mkdirs(entryFile, 'js');
			//写入 入口文件信息
			fs.writeFile(entryFile, buildEntryData(appTpl), function(err) {
				if (err) console.log(`writeFile entry/${entryFile} error=> ` + err);
			});
		}
		// 配置多页面
		let build_filename = filename + '.html';
		pages[filename.replace(/\//g, '')] = {
			publicPath: outRelativePath ? getRelativePath(filename) : '',
			entry: entryFile, // 入口文件
			template: 'public/index.html', // 模板文件
			filename: build_filename, // 打包后的文件路径
			title: pageData.title || '',
			head: pageData.head,
			chunks: ['chunk-vendors', 'chunk-common', 'runtime', filename.replace(/\//g, '')],
			inject: false
		};
		//覆盖views.json的某些值
		pageData['build_path'] = build_filename;
		pageData['dev_path'] = appTpl;
		pageData['title'] = pageData.title || '';
		pageData['head'] = pageData.head || {};
		pageDatas[filename] = pageData;
	});

	//更改views.json
	fs.writeFile(viewsJsonFile, JSON.stringify(pageDatas), function(err) {
		if (err) console.log("write views.json error => " + err);
	});
	return pages;
}
//构建entry文件内容
function buildEntryData(file) {
	return `
	import Vue from 'vue';
	import '@/config/index';
	import App from '@/${file}';
	if(process.env.NODE_ENV === 'production'){
		window.apiready = function(){
			new Vue({ render: h => h(App) }).$mount('#app');
		}
	} else {
		new Vue({ render: h => h(App) }).$mount('#app');
	}
	`;
}
//获取相对路径
function getRelativePath(filename) {
	let fsArr = filename.split('/');
	let f = '';
	for (var i = 1; i < fsArr.length; i++) {
		f += '../';
	}
	return f;
}

//创建目录，文件
function mkdirs(path, type) {
	if (!path) {
		return;
	}
	let tmpPathArr = path.split('/');
	let tmpFile = '';
	for (var i = 0; i < tmpPathArr.length; i++) {
		tmpFile = resolve(tmpFile, tmpPathArr[i]);
		let hasFile = fs.existsSync(tmpFile);
		if (hasFile)
			continue;
		if (type && tmpFile.lastIndexOf(type) > -1) {
			//创建文件
			fs.writeFileSync(tmpFile, '');
		} else {
			//创建目录
			fs.mkdirSync(tmpFile);
		}
	}
}

function resolve(tmpFile, dir) {
	return path.join(tmpFile, dir);
}
module.exports = config;
