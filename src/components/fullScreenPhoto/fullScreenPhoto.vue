<template>
	<div class="shadow" v-show="imgData" @click="imgData = '';scaleNum = 1" @mousewheel="wheelFun">
		<img :src="imgData" alt="" :style="{ 'transform': 'scale(' + scaleNum + ')' }" />
	</div>
</template>
<script>
	import Vue from 'vue'
	export default {
		data () {
			return {
				imgData: "",
				scaleNum: 1
			}
		},
		created () {
			let that = this
			Vue.prototype.$showPhoto = function(data) {
				that.imgData = data || ''
			};
		},
		methods: {
			wheelFun (e) {
				console.log(e)
				if(e.deltaY > 0){
					this.scaleNum = this.scaleNum * 0.9 > 0.3 ? this.scaleNum * 0.9 : 0.3
				}
				else{
					this.scaleNum = this.scaleNum * 1.1 < 2 ? this.scaleNum * 1.1 : 2
				}
			}
		}
	}
</script>
<style scoped>
	.shadow{
		position: fixed;
		background: rgba(0,0,0,0.5);
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 88888;
	}
</style>