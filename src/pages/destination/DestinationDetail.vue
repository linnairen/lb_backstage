<template>
	<section>
		<!--头部-->
		<el-row class="clearfix b" style="margin-bottom:20px;">
			<h1 class="l">目的地详情</h1>	
		</el-row>
		<!--基本信息-->
		<el-row v-loading="loading" element-loading-text="拼命加载中">
			<el-row >
				<el-row class="clearfix caption">
					<h2 class="l">基本信息</h2>
				</el-row>
				<el-row  class="clearfix" style="padding-top:20px;">
					<el-form style="width:97.5%;margin: auto;" class="clearfix" >
						<el-form-item label="目的地名称" label-width="120px"  style="width:50%;" class="l">
							<el-input v-model="destinationInfo.detailName" placeholder="目的地名称" style="width:250px;" :disabled = 'show'  size="small" @keydown.space.native="$event.returnValue = false"></el-input>
						</el-form-item>
						<el-form-item label="目的地类型" clearable label-width="120px" style="width:50%;" class="l">
							<el-select v-model="destinationInfo.typeId" placeholder="目的地类型" style="width:120px;" :disabled = 'show'>
								<el-option v-for="classifi in classification" :key="classifi.tid" :label="classifi.name" :value="classifi.tid"></el-option>
							</el-select>
						</el-form-item>
						
					</el-form>
					
					<div class="picture clearfix">
						<div class="picture-card" v-if="parkinglotImg.length">
							<!--<img :src=" item.imgUrl " :key="index" v-for="(item,index) in parkinglotImg" @click="addIdePic(parkinglotImg,item)"/>-->
							<img :src=" (item.imgUrl.indexOf('http') == -1 ? imgAddress : '') + item.imgUrl " :key="index" v-for="(item,index) in parkinglotImg" @click="addIdePic(parkinglotImg,item)"/>
							<p>停车场照片</p>
						</div>
						<div class="picture-card" v-if="!parkinglotImg.length && !show" @click="addIdePic(parkinglotImg)">
							<img src="../../assets/pic.jpg"/>
							<p>停车场照片</p>
						</div>
					</div>	
					
				</el-row>
			</el-row>
		</el-row>
		<!--地图-->
		<el-row >
			<el-row class="clearfix caption">
				<h2 class="l">地图信息</h2>
			</el-row>
			<div style="width: 100%;height:30px;margin:20px 0 ;">
				<b class="fontSize">详细地址:</b>
				<el-input v-model="destinationInfo.address" placeholder="详细地址" style="width: 40%;" disabled   @keydown.space.native="$event.returnValue = false"></el-input>
			</div>
			<el-row class="index">
				<div class="searchBox">				
				    <el-select v-model="destinationInfo.cityName" slot="prepend" placeholder="请选择" style="width: 100px;"  @change='getSearch' :disabled = 'show'> 
				      	<el-option v-for="city in cityList" :key="city.id" :label="city.name" :value="city.name"></el-option>
				    </el-select>
				    <input type="text" name="" id="tipinput"  value="请输入关键字：(选定后搜索)" onfocus='this.value=""' class="search"  :disabled = 'show'/>
					</el-input>
				</div>				
				
				<div id="container" tabindex="0">
										
				</div>					
				
			</el-row>
			
		</el-row>
		<!-- 图片编辑和查看弹窗 -->
			<el-row v-if="addPic" class="sbe" @click.native="shut">
				<img v-if="bigPic.imgUrl" :src="(bigPic.imgUrl.indexOf('http') == -1 ? imgAddress : '') + bigPic.imgUrl" class="bg">
				<div class="exa">
					<div class="pic">
						<img class="rotate0" style="height:480px;" src="../../assets/pic.jpg" v-if="!bigPic.imgUrl"/>
						<el-button class="img" v-if="uploadingP" :loading="uploadingP"></el-button>
<!--					<img :class="sotate" :src="bigPic.imgUrl" v-if="bigPic.imgUrl"/>-->					
						<img :class="sotate" :src="(bigPic.imgUrl.indexOf('http') == -1 ? imgAddress : '') + bigPic.imgUrl" v-if="bigPic.imgUrl"/>
					</div>
					<div class="btn2" v-if="!bigPic.imgUrl &&! show">
						<el-button style="width:120px;position: relative;" icon="upload" type="primary" @click="stop($event)" :loading="uploadingP"></i>{{uploadingP?'上传中':'选择上传'}}<input type="file" @change='addUpFile($event.target)' ref='add'></el-button>
						<el-button style="width:120px;" type="primary">确定</el-button>
					</div>
					<div class="btn4" v-if="bigPic.imgUrl && !show">
						<a class="el-button" style="width:100px;" :href="bigPic.imgUrl" :download="bigPic.imgUrl"><span>点击下载</span></a>
						<el-button style="width:100px;position: relative;" icon="upload" type="primary" @click="stop($event)" :loading="uploadingP">{{uploadingP ? '上传中' : '选择上传'}}<input type="file" @change='addUpFile($event.target)' ref='add'></el-button>
						<el-button style="width:100px;" icon="delete2" type="primary" @click="bigPicList.remove(bigPic)">删除照片</el-button>
						<el-button type="primary" style="width:100px;" @click="setSotate($event)">旋转</el-button>
						<el-button style="width:100px;" type="primary">确定</el-button>
					</div>
					<div class="btn3" v-if="show">
						<a class="el-button" :href="bigPic.imgUrl" :download="bigPic.imgUrl"><span>点击下载</span></a>
						<el-button type="primary" style="width:120px;" @click="setSotate($event)">旋转</el-button>
						<el-button type="primary" style="width:120px;">关闭</el-button>
					</div>
				</div>
			</el-row>	
			<!--保存按钮-->
			<el-row style="width:250px;margin:100px auto;"  >
				<div v-if="show" >
					<el-button icon="upload" type="primary" @click="changeShow">编辑</el-button>
				</div>
				<div class="r" v-if="!show">	
					<el-button   class="l" style="width:120px;" icon="upload" type="primary" :loading="uploading" @click="destDetailsaveOrUpdate">{{uploading?'上传中':'保存'}}</el-button>
					<!--<el-button v-if="!showbtn && $store.state.btnPower.LOAN_APPLY_SAVE_OR_UPDATE_BANKCARD_AGAIN"  class="l" style="width:120px;" icon="upload" type="primary" :loading="uploading" @click="saveOrUpdateBankCardMsgAgain">继续保存</el-button>-->
					<el-button class="l" style="width:120px;" type="primary" @click="callSet">取消</el-button>
				</div>

			</el-row>
			
			<el-row class="clearfix r "  style="padding-top: 20px;width: 120px;">
				<el-button   style="width:120px;"  type="primary"  @click="destDetaildel" >删除</el-button>
            	<el-button style="width:120px;margin-left: 0;margin-top: 20px;" icon="el-icon-back" @click="$router.go(-1);">返回</el-button>
			</el-row>
	</section>	
</template>

<script>
	
	import { mapGetters } from 'vuex'
    import { mapActions } from 'vuex'
	import util from '../../common/js/util'
	import localData from '../../common/js/localData'
	import type from '../../common/js/type'
	import { getCityList,classList,destDetailInfo,destDetailsaveOrUpdate,destDetaildel,getQiniuToken,addPic,getPic,easykp_config } from '../../api/api'
	import qs from 'qs'
	import NProgress from 'nprogress'
	
	var map
	export default {
		data() {
			return {
//				imgAddress: 'http://ovr04x0lk.bkt.clouddn.com/',    //测试地址
				imgAddress : 'http://img.cheweiditu.com/',      //线上地址
				marker: null,
				content: '',
				destinationInfo: {
					cityId: null, address: '', longitude:'120.076613', latitude:'30.28892'
				},
				classification: [],
				cityList: [],
				parkinglotImg: [],
				address: '',
				content: '',
				tid: '',
				sotate: 'rotate0',
				loading: false,
				uploading: false,
				show: false,
				addPic: false,
				uploadingP: false
			}
		},
		created() {
			this.classList()
			this.getCityList()
			this.imgAddress = easykp_config.imgAddress
		},
		mounted(){		
			this.getTid()			
		},
		methods: {
			getTid(){    //获取tid
				if(this.$route.params.tid == null){
					this.tid = null;
					this.init()
					return;
				}else{
					this.tid = this.$route.params.tid;
					this.destDetailInfo()
					.then( () =>this.init() )
				}
			},						
			init () {
				var that = this;
				map = new AMap.Map('container',{
		            resizeEnable: true,
		            mapStyle: 'amap://styles/normal',
		            zoom: 13,
		            center: [that.destinationInfo.longitude,that.destinationInfo.latitude],
		            keyboardEnable: false
		      	});		
		      	this.getSearch();
		      	this.getPositioning();						
			},
			getSearch(){    //高德POI搜索	
				let that = this;
				var autoOptions = {
		        	city: this.destinationInfo.cityName, //城市，默认全国
			        input: "tipinput"
			    };	
				var auto = new AMap.Autocomplete(autoOptions);
			    var placeSearch = new AMap.PlaceSearch({
			        map: map
			    });  //构造地点查询类
			    AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
			    function select(e) {
			        placeSearch.setCity(e.poi.adcode);
			        placeSearch.search(e.poi.name);  //关键字查询查询
			        console.log(e)
			        that.destinationInfo.address = e.poi.district + e.poi.address
			    }
			}, 
			getPositioning(){     //点击显示地址
				let that = this;
				 AMap.plugin('AMap.Geocoder',function(){
			        var geocoder = new AMap.Geocoder({
			            city: "010"//城市，默认：“全国”
			        });
			        var marker = new AMap.Marker({
			            map:map,
			            bubble:true
			        })
			        if(!that.show){
			        	map.on('click',function(e){
				            marker.setPosition(e.lnglat);
				            geocoder.getAddress(e.lnglat,function(status,result){
				              if(status=='complete'){
				                 that.destinationInfo.address = result.regeocode.formattedAddress
				              }
				            })
				        })
			        }			
			    });
			},
			classList(){   //获取所有分类
				classList().then( data => {
					this.classification = data.rs
				})
			},
			getCityList() {   //获取城市
				getCityList({type:2}).then( data => {
					this.cityList = data.rs ;					
				})
			},
			destDetailInfo() {   //获取详细信息
				return destDetailInfo({tid:this.tid}).then( data => {
					if(data.code == 200){
						for(let i in data.rs){
							this.destinationInfo[i]  =  data.rs[i]
						}
						this.parkinglotImg = [];
						this.parkinglotImg.push({imgUrl:this.destinationInfo.imgUrl})
						this.show = true;
					}
				})
			},
			destDetailsaveOrUpdate(){   //保存
				let destinationInfo = {};			
				for(let i in this.destinationInfo){
					if(this.destinationInfo[i] == '' ){
						this.$message.error('信息填写不完整');
						return;
					}else{
						destinationInfo[i] = this.destinationInfo[i]
					}
				}
										
				if(this.parkinglotImg.length == 0){
					this.$message.error('信息填写不完整');
					return;
				}else{
					for(let i=0;i<this.parkinglotImg.length;i++){
						destinationInfo.imgUrl = this.parkinglotImg[i].imgUrl
					}
				}					
				for(let i=0; i< this.cityList.length; i++){
					if(destinationInfo.cityName == this.cityList[i].name){
						destinationInfo.cityId = this.cityList[i].id;
					}
				}
				destDetailsaveOrUpdate(destinationInfo).then( data=> {
					if(data.code == 200){
						this.show = true;
						this.$notify.success('保存成功');
						this.$router.go(-1)
					}
				})
			},
			destDetaildel(){    //删除
				this.$confirm('确定删除', '提示', {confirmButtonText: '确定', cancelButtonText: '取消'}).then(() => {
					destDetaildel({tid:this.tid}).then( data => {
						if(data.code == 200){
							this.$notify.success('删除成功');
							this.$router.go(-1)
						}
					})
				});	
			},
			changeShow(){   //编辑
				this.show = false;
				this.trialOver = false;
				this.init()
			},
			setSotate(e) {   //图片旋转
				this.stop(e);
				switch(this.sotate){
					case 'rotate0': this.sotate = 'rotate90'; return;
					case 'rotate90': this.sotate = 'rotate180'; return;
					case 'rotate180': this.sotate = 'rotate270'; return;
					case 'rotate270': this.sotate = 'rotate360';setTimeout(() => {this.sotate = 'rotate0'},600);return;
				}
			},
			setMm() { this.mm = true;this.mm = false; },	//解决无法change的选择器
			shut() {  // 照片上传中不能其他操作
				if(!this.uploadingP){
					this.addPic = false;
				}else{
					this.$message.error("照片上传中");
				}
			},		
			getQiniuToken() {  //获取七牛私有token
				if(!this.show){
					getQiniuToken({type: 1}).then(data => { if(data.code == 200) this.token = data.rs })
				}	
			},
			compile() {   //
				if(this.inForMation.state == 2) return;
				this.show = false;
			},
			stop(e) {   //阻止冒泡
				window.event? window.event.cancelBubble = true : e.stopPropagation()
			},
			addIdePic($bigPicList,$img) {   //身份信息图片
				this.sotate = 'rotate0';
				this.addPic = true;
				this.bigPicList = $bigPicList;
				this.bigPic = $img || {tid: "",imgUrl: null};
				this.getQiniuToken()
			},
			addUpFile(obj) {
				if (!obj.files.length) return;
				let files = Array.prototype.slice.call(obj.files);
				files.forEach(file => { this.addHandleUpload(file) });
			},
			addHandleUpload(file){
				this.uploadingP = true;
				let qiniuKey = new Date().getTime()  + Math.floor(9000 * Math.random() + 1000);
				if(/\/(?:jpeg|png|gif|bmp|jpg)/i.test(file.type)){
					util.chooseAllFile(file,this.token,this.addUploadCallBack,qiniuKey + '.' + file.type.split('/')[1]);
				}else{
					this.$message.error('请选择图片');
					this.uploadingP = false;
				}
			},
			addUploadCallBack(res){
				if(this.bigPic.imgUrl){
					this.bigPic.imgUrl = res.key ;
				}else{
					this.bigPic.imgUrl = res.key ;
					this.bigPicList.push(this.bigPic);
				}
				this.uploadingP = false;
				this.sotate = 'rotate0';
			},
			callSet(){
				this.show = true;
				this.trialOver = true;
				this.init()
				this.destDetailInfo()
			},
		}
	}
</script>

<style scoped lang="scss">
	
	.index{
		position: relative;
		width:50%;
		height: 600px;
		/*margin: auto;*/
	}
	
	#container{
		position: absolute;
        height: 100%;
		width: 100%;
     }
     
    .searchBox{
    	position: absolute;
    	z-index: 888;
    	right:5px;
    	top: 10px;
    }
     
	.picture{
		padding: 30px 20px 0 20px;
		.picture-card{
			position: relative;
			width: 16.6666666%;
			float: left;
			img{
				display: block;
				width: 150px;
				height: 100px;
				border-radius: 10px;
				margin: 0 auto;
				-webkit-box-shadow: #ccc 0 5px 15px;  
				-moz-box-shadow: #ccc 0 5px 15px; 
				-o-box-shadow: #ccc 0 5px 15px;  
				box-shadow: #ccc 0 5px 15px; 
			}
			p{
				width: 100%;
				text-align: center;
				height: 40px;
				line-height: 40px;
				padding: 0;
			}
			input{
				display: block;
				position: absolute;
				top: 0px;
				left: 0px;
				width: 100%;
				height: 100%;
				z-index: 99;
				opacity: 0;
			}
		}
		.picture-card:hover img{
			border: 1px solid rgb(32,160,255);
			width: 148px;
			height: 98px;
		}
	}
	
	.search{
		padding-left:10px ;
		width:200px;
		height:34px;
		border-radius:5px 5px 5px 5px;
		outline:none;
	}
	.fontSize {
		font-size: 20px;
	}
		
	
</style>