<template>
	<div class="shadow" v-show="showMap">
		<div class="map_box">
			<div class="search_box">
				<el-select v-model="destinationInfo.city" slot="prepend" placeholder="请选择" style="width: 100px;"  @change='getSearch' :disabled = '!ifEdit'> 
			      	<el-option v-for="city in getCityList" :key="city.id" :label="city.name" :value="city"></el-option>
			    </el-select>
				<input type="text" id="tipinput" v-model="keyword" placeholder="请输入关键字：(选定后搜索)" :disabled="!ifEdit" />
			</div>
			<div id="container" tabindex="0"></div>
			<div class="btn">
				<el-button style="width:120px;" type="primary" @click="$mapConfirm" >确认</el-button>
				<el-button style="width:120px;" type="primary" @click="showMap = false;keyword = ''">取消</el-button>
			</div>
		</div>
	</div>
</template>
<script>
	import Vue from 'vue'
	import { mapGetters } from 'vuex'
	export default {
		data () {
			return {
				destinationInfo: {
					city: null,
					address: '',
					longitude: '120.076613',
					latitude: '30.28892'
				},
				showMap: false,
				ifEdit: false,
				keyword: ''
			}
		},
		created () {
			let that = this
			Vue.prototype.$mapConfirm = function(){}
			Vue.prototype.$getMapInfo = (ifEdit,obj,fun) => {
				this.showMap = true
				this.ifEdit = !!ifEdit
				this.destinationInfo = obj || {city: this.getCityList[0] || null, address: '', longitude:'120.076613', latitude:'30.28892'}
				this.preLoad()
				Vue.prototype.$mapConfirm = function() {
					if(!that.destinationInfo.city){
						that.$message.error('请选择城市')
						return
					}
					that.showMap = false
					that.keyword = ''
					fun && fun(that.destinationInfo)
				}
			};
		},
		computed: {
			...mapGetters([
				'getCityList'
			])
		},
		methods: {
			getSearch(){    //高德POI搜索	
				let that = this;
				var autoOptions = {
		        	city: this.destinationInfo.city ? this.destinationInfo.city.name : '', //城市，默认全国
			        input: "tipinput"
			    };	
				var auto = new AMap.Autocomplete(autoOptions);
			    var placeSearch = new AMap.PlaceSearch({
			        map: that.map
			    });  //构造地点查询类
			    AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
			    function select(e) {
			        placeSearch.setCity(e.poi.adcode);
			        placeSearch.search(e.poi.name);  //关键字查询查询
			        that.destinationInfo.address = e.poi.district + e.poi.address
			        that.destinationInfo.latitude = e.poi.location.lat
			        that.destinationInfo.longitude = e.poi.location.lng
			    }
			}, 
			getPositioning(){     //点击显示地址
				let that = this;
				AMap.plugin('AMap.Geocoder',function(){
			        var geocoder = new AMap.Geocoder({
			            city: "010"//城市，默认：“全国”
			        });
			        var marker = new AMap.Marker({
			            map: that.map,
			            bubble:true
			        })
			        if(that.ifEdit){
			        	that.map.on('click',function(e){
				            marker.setPosition(e.lnglat);
					        that.destinationInfo.latitude = e.lnglat.lat
					        that.destinationInfo.longitude = e.lnglat.lng
				            geocoder.getAddress(e.lnglat,function(status,result){
				              	if(status=='complete'){
				                	that.destinationInfo.address = result.regeocode.formattedAddress
			        				// console.log(result)
				              	}
				            })
				        })
			        }			
			    });
			},
			preLoad () {
				var that = this;
				that.map = new AMap.Map('container',{
		            resizeEnable: true,
		            mapStyle: 'amap://styles/normal',
		            zoom: 13,
		            center: [that.destinationInfo.longitude,that.destinationInfo.latitude],
		            keyboardEnable: false
		      	})
		      	this.getSearch();
		      	this.getPositioning();
			}
		}
	}
</script>
<style lang="scss" scoped>
	.shadow{
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 1000;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(0,0,0,0.3);
	}
	.map_box{
		width: 700px;
		height: 700px;
		background: #fff;
		border-radius: 20px;
		position: relative;
	}
	.search_box{
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 30px;
	}
	#tipinput{
		height: 32px;
		border-radius: 4px;
	}
	#container{
		height: 500px;
		top: 100px;
	}
	.btn{
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 30px;
		display: flex;
		justify-content: center;
	}
</style>