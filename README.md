多页模板
# 请注意注意  
请使用npm run build-clean来初始化项目，后续使用npm run build

### 特殊文件说明
src/build/views/views.js ：包含构建多页核心代码  
src/build/index.js ：包含打包、调试配置  

src/config：公共资源配置  
src/config/entrys：初始运行npm run dev/build，生成的目录，里面包含每个单页面的生成初始化配置（相当于vue单页项目的main.js），每个js文件路径与views内的.vue文件一一对应。
使用时多看注释
