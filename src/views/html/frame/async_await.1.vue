<template>
	<div style="padding: 10px;">
		<h2 style="color: deepskyblue;text-align: center;">async/await study</h2>
		<!-- 测试 es7语法 async/await -->

		<!-- 顶部菜单 -->
		<div>
			<h3 style="color: deepskyblue;">顶部菜单</h3>
			<van-button type="primary" v-show="item.type !=1" @click="funcSelectTopMenu(index)" style="margin-right: 10px;" v-for="item,index in topMenu">{{index+1}}.{{item.name}}</van-button>

			<h3 style="color: deepskyblue;">第{{topMenuIndex+1}}个菜单下的消耗品描述信息：{{ selectTopMenu.name }}</h3>
			<span style="margin-right: 10px;" v-for="item,index in tMenuCOne">{{index+1}}.{{item.name}}</span>

			<h3 style="color: deepskyblue;">第{{topMenuIndex+1}}个菜单下的消耗品列表：{{ selectTopMenu.name }}</h3>
			<span style="margin-right: 10px;" v-for="item,index in itemList">{{index+1}}.{{item.name}}</span>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'async_await',
		data() {
			return {
				//顶部菜单
				topMenu: [],
				//选中的顶部菜单的下标
				topMenuIndex: 0,
				//选中的顶部菜单的信息
				selectTopMenu: {},

				//第几个菜单的下的消耗品信息
				tMenuCOne: [],
				//消耗品列表
				itemList: [],

				//缓存选项列表 根据id存取
				selectData: {}
			}
		},
		created: function() {
			this.getTopMenu();
		},
		methods: {
			//顶部菜单
			getTopMenu: async function() {
				let tMenu;
				try {
					//顶部标题
					 tMenu = await this.getMenu("顶部菜单", 0);
					if (tMenu.code != 200)
						return this.$toast(tMenu.message || "");
					if (!tMenu)
						return this.$toast("暂时没有顶部菜单，请联系管理员添加");
					this.topMenu = tMenu.data || [];


					if (this.topMenu.length > 0) {
						this.funcSelectTopMenu(0);
					}

				} catch (e) {
					console.log("错误：", "顶部菜单", "：", e,tMenu);
					//TODO handle the exception
					return null;
				}
			},
			//消耗品描述信息
			funcSelectTopMenu: async function(index) {
				try {
					this.topMenuIndex = index || 0;
					this.selectTopMenu = this.topMenu[this.topMenuIndex];

					//如果缓存内有数据则不走请求获取
					let id = this.selectTopMenu.id;
					let hasList = this.selectData[id];
					if (hasList && hasList.length > 0) {
						this.tMenuCOne = hasList;
						//加载消耗品列表
						this.funcGetItemList();
						return;
					}

					//第一个顶部标题类型下的消耗品
					const tMenuCOne = await this.getMenu(`第${this.topMenuIndex+1}个菜单下的消耗品信息`, id);

					if (tMenuCOne.code != 200)
						return this.$toast(tMenuCOne.message || "");
					if (!tMenuCOne)
						return this.$toast("暂时没有消耗品描述信息，请联系管理员添加");

					//缓存数据
					this.selectData[id] = tMenuCOne.data || [];
					//设置默认数据
					this.tMenuCOne = this.selectData[id];
					//加载消耗品列表
					this.funcGetItemList();
				} catch (e) {
					console.log("错误：", `第${this.topMenuIndex+1}个菜单下的消耗品信息`, "：", e);
					//TODO handle the exception
					return null;
				}
			},
			//消耗品列表
			funcGetItemList: async function() {
				try {
					//如果缓存内有数据则不走请求获取
					let id = this.tMenuCOne[1].id;
					console.log(id)
					let hasList = this.selectData[id];
					if (hasList && hasList.length > 0)
						return this.itemList = hasList;

					//获取消耗品列表
					const itemList = await this.getMenu(`第${this.topMenuIndex+1}个菜单下的消耗品列表`, id);
					if (itemList.code != 200)
						return this.$toast(itemList.message || "");
					if (!itemList)
						return this.$toast("暂时没有消耗品列表数据，请联系管理员添加");
					//缓存数据
					this.selectData[id] = itemList.data || [];
					//设置默认数据
					this.itemList = this.selectData[id];
				} catch (e) {
					console.log("错误：", `第${this.topMenuIndex+1}个菜单下的消耗品列表`, "：", e);
					//TODO handle the exception
					return null;
				}
			},
			//公共的数据请求接口
			getMenu: async function(description, pid) {
				let res;
				try {
					res = await this.$http({
						url: this.$api.healthUrl + '/hdcatagory/getByParentId',
						// url: '/babyHealthDiaryApi/hdcatagory/getByParentId',
						methodType: "get",
						data: {
							pid: pid || 0,
							contactChild: false,
						}
					});
					console.log(description, "：", res);
					return res;
				} catch (e) {
					console.log("错误：", description, "：", e);
					//TODO handle the exception
					return null;
				}
			}
		}
	}
</script>

<style>
</style>
