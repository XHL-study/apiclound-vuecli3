<template>
	<div class="about">
		<h1>测试 http-https 哦 hehe</h1>
		<van-button type="default">默认按钮</van-button>
		<br />
		<van-button type="primary">主要按钮</van-button>
		<br />
		<van-button type="primary">主要按钮</van-button>
		<br />

		<van-button type="primary">页面地址</van-button>
		<br />


		<div id="test-echarts" style="width: 100%;height: 300px;">
		</div>
		<img src="../../../../public/image/img2.png"/>

		store count: {{count}}
	</div>
</template>

<script>
	export default {
		name: "about",
		data() {
			return {
				time: "",
			}
		},
		computed: {
		},
		created: function() {
		},
		mounted: function() {},
		methods: {
			pageUrl:function(){
				alert(location.href)
			},
			getBaiDu: function() {
				this.$http({
					url: this.$api.weatherUrl,
					data: {
						appKey: "7493be352c174e1f9ff2642f5cdbe22a"
					}
				}).then((dt) => {
					console.log("成功：", dt);
				}).catch((dt) => {
					console.log("错误：", dt);
				})
			},

		}
	}
</script>
<style scoped>
	.about {
		background: #2C3E50;
		background: url(../../../assets/image/img2.png);
	}
</style>
