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
{{date}}

{{date}}

{{date}}

{{date}}

{{date}}

{{date}}

{{date}}

{{date}}

{{date}}

{{date}}

{{date}}

{{date}}

{{date}}

		<div v-for="item in 10" id="test-echarts" style="width: 100%;height: 80px;">
			{{date}}{{item}}
		</div>
		<div id="test-echarts" style="width: 100%;height: 300px;">
		</div>
{{date}}

{{date}}

{{dt}}

{{dt}}

{{dt}}

{{dt}}

{{dt}}

{{dt}}

{{dt}}

{{dt}}

{{dt}}

{{dt}}

		<img src="../../../../public/image/img2.png"/>

	</div>
</template>

<script>
	export default {
		name: "about",
		data() {
			return {
				time: "",
				date:Date.now(),
				dt:new Date(),
			}
		},
		computed: {
		},
		created: function() {
			api.toast({
			    msg: '网络错误',
			    duration: 2000,
			    location: 'bottom'
			});
		},
		mounted: function() {},
		methods: {
			pageUrl:function(){
				alert(location.href)
			},
			getBaiDu: function() {
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
