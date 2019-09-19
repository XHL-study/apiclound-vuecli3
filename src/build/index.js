//是否为相对路径打包 true:相对路径，false：绝对路径
var outRelativePath = true;

//项目根地址
var publicPath = '/apiclound-vuecli3';

//打包文件的输出目录
var outPath = 'dist' + publicPath;

//根据outRelativePath 设置项目根地址
publicPath =  outRelativePath ? './' : publicPath;

//调试模式端口地址
const devServer = {
	host: '192.168.3.138',//ip
	port: 8089, // 端口号
	https: false,//是否开启https
};

module.exports = {
	publicPath,
	outPath,
	devServer,
	outRelativePath
}
