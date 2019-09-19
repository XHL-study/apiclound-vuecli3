<template>
	<div class="home">
		<div style="height: 400px;overflow: auto;">
			<div style="margin-top: 900px;"></div>
			<!-- <img alt="Vue logo" src="../../assets/logo.png"> -->
			<br />
			<van-button type="default" @click="openAbout">openAbout</van-button>
			<br />
		</div>

	</div>
</template>

<script>

	export default {
		name: 'home',
		data() {
			return {

			}
		},
		computed: {
		},
		components: {

		},
		created: function() {
		},
		methods: {
			openAbout: function() {
				
			},
		}
	}
</script>
<style scoped>
	.home {
		background: #f3f3f3;
	}
</style>
