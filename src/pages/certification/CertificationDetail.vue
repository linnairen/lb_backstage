<template>
	<section>
		<el-row v-loading="loading" element-loading-text="拼命加载中">
			<!--实名信息-->
			<el-row>
				<el-row class="clearfix caption">
					<h2 class="l">停车场信息</h2>
				</el-row>
				<el-row  class="clearfix" style="padding-top:20px;">
					<el-form style="width:100%;margin: auto;" class="clearfix" >
						<el-form-item label="管理员手机号码" label-width="120px"  style="width:33%;" class="l">
							 <!-- <router-link :to="{name:'userdetails',params:{id:detailInfo.userId}}">{{detailInfo.mobile}}</router-link> -->
							<el-input v-model="detailInfo.mobile" placeholder="手机号码" style="width:200px;" :maxlength="11" :disabled="show"  @keydown.space.native="$event.returnValue = false"></el-input>
						</el-form-item>
					</el-form>
					<el-form style="width:100%;margin: auto;" class="clearfix" >
						<el-form-item label="认证类型" label-width="120px" style="width:33%;height:30px " class="l">
							<el-select v-model="detailInfo.parkAuthType" placeholder="类型" style="width: 200px;" :disabled="show">
								<el-option v-for="type in certifiType" :key="type.value" :label="type.label" :value="type.value"></el-option>
							</el-select>
						</el-form-item> 
					</el-form>
					<el-form style="width:100%;margin: auto;" class="clearfix" v-if="detailInfo.parkAuthType == 1">
						<el-form-item label="公司名称" label-width="120px"  style="width:33%;" class="l"  v-if="detailInfo.parkAuthType == 1">
							<el-input v-model="detailInfo.companyName" placeholder="名称" style="width: 200px;" :disabled="show" @keydown.space.native="$event.returnValue = false"></el-input>
						</el-form-item>
						<el-form-item label="法人姓名" label-width="120px"  style="width:33%;" class="l"  v-if="detailInfo.parkAuthType == 1">
							<el-input v-model="detailInfo.legalName" placeholder="法人姓名" style="width: 200px;" :disabled="show" @keydown.space.native="$event.returnValue = false"></el-input>
						</el-form-item>		
					</el-form>
					<el-form style="width:100%;margin: auto;" class="clearfix" v-if="detailInfo.parkAuthType == 2">
						<el-form-item label="用户姓名" label-width="120px"  style="width:33%;" class="l">
							<el-input v-model="detailInfo.applyUserRealName" placeholder="用户姓名" style="width: 200px;" :disabled="show"  @keydown.space.native="$event.returnValue = false"></el-input>
						</el-form-item>
						<el-form-item label="身份证号" label-width="120px"  style="width:33%;" class="l">
							<el-input v-model="detailInfo.identificationCard" placeholder="身份证号" :maxlength="18" style="width: 200px;" :disabled="show" @keydown.space.native="$event.returnValue = false"></el-input>
						</el-form-item>
					</el-form>
					<el-form style="width:100%;" class="clearfix" >	
						<el-form-item label="停车场名称" label-width="120px"  style="width:33%;" class="l">
							<el-input v-model="detailInfo.orgName" placeholder="停车场名称" style="width:250px;" :disabled="show"  @keydown.space.native="$event.returnValue = false"></el-input>
						</el-form-item>
						<el-form-item label="停车场联系电话" label-width="120px"  style="width:33%;" class="l">
							 <!-- <router-link :to="{name:'userdetails',params:{id:detailInfo.userId}}">{{detailInfo.mobile}}</router-link> -->
							<el-input v-model="detailInfo.telPhone" placeholder="手机号码" style="width:200px;" :maxlength="11" :disabled="show"  @keydown.space.native="$event.returnValue = false"></el-input>
						</el-form-item>
					</el-form>
					<el-form style="width:100%;" class="clearfix" >	
						<el-form-item label="详细地址" label-width="120px"  style="width: 50%;" class="l">
							<el-input  v-model="detailInfo.address" style="width: 400px;text-align: center;" type="textarea" :rows="2" placeholder="请点击右侧选择地址" disabled="disabled" @keydown.space.native="$event.returnValue = false" resize="none"></el-input>
						</el-form-item>
						<el-button class="l" style="width:120px;" type="primary" @click="getAddress">选择地址</el-button>
					</el-form>
					<el-form style="width:100%;" class="clearfix" >				
						<el-form-item label="停车场规模" label-width="120px"  style="width:33%;" class="l">
							<el-input v-model="detailInfo.parkNum" placeholder="规模" style="width: 200px;" :disabled="show"  @keydown.space.native="$event.returnValue = false">
								 <i slot="append">个</i>
							</el-input>
						</el-form-item>
						<el-form-item label="停车场收费标准" label-width="120px"  style="width:66%;position: relative;" class="l">
							<el-input v-model="detailInfo.parkFeeHouly" placeholder="标准" style="width: 200px;" :disabled="show"  @keydown.space.native="$event.returnValue = false"> <i slot="append">元/小时</i></el-input>
						</el-form-item>
					</el-form>
					<el-form style="width:100%;" class="clearfix" >				
						<el-form-item label="营业时间(选)" label-width="120px"  style="width:33%;" class="l">
							<el-time-select style="width:120px;"
								placeholder="起始时间" :disabled="show"
								v-model="detailInfo.businessStart"
								:picker-options="{
								start: '00:00',
								step: '01:00',
								end: '23:30'
								}">
							</el-time-select>
							<el-time-select style="width:120px;"
								placeholder="结束时间" :disabled="show"
								v-model="detailInfo.businessEnd"
								:picker-options="{
								start: '00:00',
								step: '01:00',
								end: '23:30'
								}">
							</el-time-select>
						</el-form-item>
						<el-form-item label="平台折扣率" label-width="120px"  style="width:33%;position: relative;" class="l">
							<el-input v-model="detailInfo.discount"
							 placeholder="平台折扣率" style="width: 200px;" :disabled="show"  @keydown.space.native="$event.returnValue = false;">
							 <i slot="append">折</i></el-input>
						</el-form-item>
					</el-form>
					<el-form style="width:100%;" class="clearfix" >
						<!-- <el-form-item label="最高收费(选)" label-width="120px"  style="width:34%;position: relative;" class="l">
							<el-input v-model="detailInfo.highParkFeeHouly"
							 placeholder="最高" style="width:120px;" :disabled="show"  @keydown.space.native="$event.returnValue = false;">
							 <i slot="append">元/天</i></el-input>
						</el-form-item> -->
						<!-- <el-form-item label="免停时间(选)" label-width="120px"  style="width:33%;position: relative;" class="l">
							<el-input v-model="detailInfo.freeParkTime"
							 placeholder="免停" style="width:120px;" :disabled="show"  @keydown.space.native="$event.returnValue = false;">
							 <i slot="append">分钟</i></el-input>
						</el-form-item> -->
					</el-form>
				</el-row>
			</el-row>		
			<!--认证照片-->
			<el-row class="clearfix caption" >
				<h2 class="l">认证照片</h2>
			</el-row>
			<el-row>
				<div class="picture clearfix">
					<!-- <div class="picture-card" v-if="parkPersonnel.length">
						<img :src=" (item.imgUrl.indexOf('http') == -1 ? imgAddress : '') + item.imgUrl " :key="index" v-for="(item,index) in parkPersonnel" @click="addIdePic(parkPersonnel,item)"/>
						<p>与工作人员合照</p>
					</div>
					<div class="picture-card" v-if="!parkPersonnel.length && !show" @click="addIdePic(parkPersonnel)">
						<img src="../../assets/pic.jpg"/>
						<p>与工作人员合照</p>
					</div> -->
					<div class="picture-card" v-if="parkEntrance.length">
						<!--<img :src="item.imgUrl"  :key="index" v-for="(item,index) in parkEntrance" @click="addIdePic(parkEntrance,item)"/>-->
						<img :src=" (item.imgUrl.indexOf('http') == -1 ? imgAddress : '') + item.imgUrl " :key="index" v-for="(item,index) in parkEntrance" @click="addIdePic(parkEntrance,item)"/>
						<p>停车场入口照片</p>
					</div>
					<div class="picture-card" v-if="!parkEntrance.length && !show" @click="addIdePic(parkEntrance)">
						<img src="../../assets/pic.jpg"/>
						<p>停车场入口照片</p>
					</div>			
				</div>
			</el-row>		
			<!--资质信息-->
			<el-row>			
				<div class="picture clearfix">
					<div v-if="parkInfo.length">
						<div class="picture-card" :key="index" v-for="(items,index) in parkInfo" @click="addIdePic(parkInfo,items)">
							<!--<img :src="items.imgUrl" :alt="items.tid"/><p>资质信息</p>-->						
							<img :src=" (items.imgUrl.indexOf('http') == -1 ? imgAddress : '') + items.imgUrl "  :alt="items.tid"/><p>资质信息</p>
						</div>
					</div>
					<div class="picture-card" v-if="!show" @click="addIdePic(parkInfo)">
						<img src="../../assets/pic.jpg"/><p>资质信息</p>
					</div>
				</div>	
			</el-row>		
		</el-row>	
		<!--保存修改按钮-->
		<el-row style="width:250px;margin:100px auto;">
			<div class="r">	
				<el-button class="l" style="width:120px;" icon="el-icon-upload" type="primary" :loading="uploadingP" @click="certificationUpdate">{{uploadingP?'上传中':'保存'}}</el-button>
				<el-button class="l" style="width:120px;" type="primary" @click="$router.go(-1);">取消</el-button>
			</div>
		</el-row>
		<!-- 图片编辑和查看弹窗 -->
			<el-row v-if="addPic" class="sbe" @click.native="shut">
				<img v-if="bigPic.imgUrl" :src="(bigPic.imgUrl.indexOf('http') == -1 ? imgAddress : '') + bigPic.imgUrl" class="bg">
				<div class="exa">
					<div class="pic">
						<img class="rotate0" style="height:480px;" src="../../assets/pic.jpg" v-if="!bigPic.imgUrl"/>
						<el-button class="img" v-if="uploadingP" :loading="uploadingP"></el-button>
						<!--<img :class="sotate" :src="bigPic.imgUrl" v-if="bigPic.imgUrl"/>-->
						<img :class="sotate" :src="(bigPic.imgUrl.indexOf('http') == -1 ? imgAddress : '') + bigPic.imgUrl" v-if="bigPic.imgUrl"/>
					</div>
					<div class="btn2" v-if="!bigPic.imgUrl && !show">
						<el-button style="width:120px;position: relative;" icon="el-icon-upload2" type="primary" @click="stop($event)" :loading="uploadingP">{{uploadingP?'上传中':'选择上传'}}<input type="file" @change='addUpFile($event.target)' ref='add'></el-button>
						<el-button style="width:120px;" type="primary">确定</el-button>
					</div>
					<div class="btn4" v-if="bigPic.imgUrl && !show">
						<a class="el-button" style="width:100px;" :href="bigPic.imgUrl" :download="bigPic.imgUrl"><span>点击下载</span></a>
						<el-button style="width:100px;position: relative;" icon="el-icon-upload2" type="primary" @click="stop($event)" :loading="uploadingP">{{uploadingP ? '上传中' : '选择上传'}}<input type="file" @change='addUpFile($event.target)' ref='add'></el-button>
						<el-button style="width:100px;" icon="el-icon-delete" type="primary" @click="bigPicList.remove(bigPic)">删除照片</el-button>
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
	</section>
</template>

<script>
	import { mapGetters,mapActions } from 'vuex'
	import util from '../../common/js/util'
	import localData from '../../common/js/localData'
	import { certificationDetail,getQiniuToken,getPic,easykp_config,insertParkOrganization,getCityList } from '../../api/api'
	
	export default {
		data (){
			return {
				imgAddress: '', 
				certifiCation: [],
				detailInfo: {
					orgName:null,address:null,parkNum:null,freeParkTime:null,highParkFeeHouly:null,parkAuthType: 1,
				},
				parkPersonnel: [],	
				parkEntrance: [],
				parkInfo: [],
				parkOrgApplyMobile: null,
				audit: false,
				loading: false,
				show: false,
				uploadingP: false,
				uploading: false,
				addPic: false,
				notThrough: false,
				sotate: 'rotate0',
				edit: false,
				certifiType: [],
				destinationInfo: null
			}
		},
		created() {	
			this.show = this.$route.params.state ? false : true;
			this.edit = !!this.$route.params.state;
			this.imgAddress = easykp_config.imgAddress;
			this.certifiCation = localData.certifiCation;
			this.certifiType = localData.certifiType;
			this.$store.state.btnPower = JSON.parse(localStorage.getItem('btnPower'));
		},
		mounted() {
			this.getState()
			this.getQiniuToken()
			
		},
		methods: {
			...mapActions([
				'passBtnPower',
				'passTid'
			]),
			getAddress () {
				this.$getMapInfo(true,this.destinationInfo,obj => {
					this.destinationInfo = obj
					this.detailInfo.gaodeLng = obj.longitude
					this.detailInfo.gaodeLat = obj.latitude
					this.detailInfo.address = obj.address
					this.detailInfo.cityId = obj.city.id
					this.detailInfo.cityName = obj.city.name
				})
			},
			getState(){
				if(this.$route.params.state == 1){
					this.detailInfo.parkAuthType  = 1;
				}else{
					this.detailInfo.parkAuthType  = 2;
				}
			},
			isInArray (arr,val) {
				for(let i = 0; i < arr.length; i ++){
					if(arr[i] == val) return true
				}
				return false
			},
			certificationUpdate(){     //保存修改停车场信息
				const reg = /^\d*$/,
					keyArr = ['mobile','parkAuthType','orgName','telPhone','address','parkNum','parkFeeHouly','businessStart','businessEnd','discount'],
					textArr = ['管理员手机号码','认证类型','停车场名称','停车场联系电话','停车场地址','车位数量','收费标准','营业开始时间','营业结束时间','平台折扣率']
				let detailInfo = {};
				keyArr.forEach((item,index) =>{
					detailInfo[item] = this.detailInfo[item] || '';
				})
				if( this.detailInfo.parkAuthType == 1){
					detailInfo.companyName = this.detailInfo.companyName || '';
					detailInfo.legalName = this.detailInfo.legalName || '';
				}
				else{
					detailInfo.identificationCard = this.detailInfo.identificationCard || ''
					detailInfo.applyUserRealName = this.detailInfo.applyUserRealName || ''
				}
				detailInfo.businessStart = this.detailInfo.businessStart ? parseInt(this.detailInfo.businessStart) : '';
				detailInfo.businessEnd = this.detailInfo.businessEnd ? parseInt(this.detailInfo.businessEnd) : '';
				detailInfo.freeParkTime = this.detailInfo.freeParkTime || '';
				
				for(let j in keyArr){
					if(String(detailInfo[keyArr[j]]).match(/^\s*$/) && !this.isInArray(['freeParkTime','highParkFeeHouly'],keyArr[j])){
						this.$message.error(textArr[j] + '不能为空');
						return
					}
					if(this.isInArray(['parkNum'],keyArr[j]) && !reg.test(detailInfo[keyArr[j]])){
						this.$message.error(textArr[j] + '填写不正确');
						return
					}
				}
				detailInfo.discount /= 10
				detailInfo.gaodeLat = this.detailInfo.gaodeLat
				detailInfo.gaodeLng = this.detailInfo.gaodeLng
				detailInfo.cityId = this.detailInfo.cityId
				detailInfo.cityName = this.detailInfo.cityName
				
				if(!this.detailInfo.applyUserRealName && this.detailInfo.identificationCard) {return this.$message.error('请填写姓名') }
				else{ detailInfo.identificationCard = this.detailInfo.identificationCard}
				if(!this.detailInfo.identificationCard && this.detailInfo.applyUserRealName) {return this.$message.error('请填写身份证号') }
				else{ detailInfo.applyUserRealName = this.detailInfo.applyUserRealName}

				
				// for(let i=0;i<this.parkPersonnel.length;i++){
				// 	detailInfo.groupPhotoFile = this.parkPersonnel[i].imgUrl || null
				// }
				for(let i=0;i<this.parkEntrance.length;i++){
					detailInfo.parkingRoadFile = this.parkEntrance[i].imgUrl || null
				}
				let othersPhoto = [];
				for(let i=0;i<this.parkInfo.length;i++){
					othersPhoto.push(this.parkInfo[i].imgUrl)
				}				
				detailInfo.othersPhoto = othersPhoto.join(',')

				// if(detailInfo.groupPhotoFile == null || detailInfo.groupPhotoFile.match(/^\s*$/)){
				// 	this.$message.error('请选择与工作人员合照');
				// 	return
				// }
				if(detailInfo.parkingRoadFile == null || detailInfo.parkingRoadFile.match(/^\s*$/)){
					this.$message.error('请选择停车场路口照片');
					return
				}
				insertParkOrganization(detailInfo).then( data => {
					if(data.code == 200){
						this.$notify.success('添加成功');
						this.$router.go(-1)
					}
				})
			},
			changeShow(){
				this.show = false;
			},
			getQiniuToken(){  //获取七牛私有token
				!this.show && getQiniuToken({type: 1}).then(data => { 
					data.code == 200 && (this.token = data.rs)
				})
			},
			getQiniuToken() {  //获取七牛私有token
				if(!this.show){
					getQiniuToken({type: 1}).then(data => { if ( data.code == 200 ) this.token = data.rs })
				}
			},
			stop(e) {
				window.event ? window.event.cancelBubble = true : e.stopPropagation();
			},
			addIdePic($bigPicList,$img) { //身份信息图片
				this.addPic = true;
				this.bigPicList = $bigPicList;
				this.bigPic = $img || {tid: "",imgUrl: null};
			},
			addUpFile(obj) {
				if (!obj.files.length) return;
				let files = Array.prototype.slice.call(obj.files);
				files.forEach((file) => { this.addHandleUpload(file)});
			},
			addHandleUpload(file) {
				this.uploadingP = true;
				let qiniuKey = new Date().getTime() + Math.floor(9000 * Math.random() + 1000);
				if(/\/(?:jpeg|png|gif|bmp|jpg)/i.test(file.type)){
					util.chooseAllFile(file,this.token,this.addUploadCallBack,qiniuKey + '.' + file.type.split('/')[1]);
				}else{
					this.uploadingP = false;
					this.$message.error('请选择图片');
				}
			},
			addUploadCallBack(res) {
				if(this.bigPic.imgUrl){
					this.bigPic.imgUrl = res.key ;
				}else{
					this.bigPic.imgUrl = res.key ;
					this.bigPicList.push(this.bigPic);
				}
				this.uploadingP = false;
				this.sotate = 'rotate0';
			},

			setSotate(e){   //图片旋转
				this.stop(e);
				switch(this.sotate){
					case 'rotate0': this.sotate = 'rotate90'; 
						return;
					case 'rotate90': this.sotate = 'rotate180'; 
						return;
					case 'rotate180': this.sotate = 'rotate270'; 
						return;
					case 'rotate270': this.sotate = 'rotate360';
						return setTimeout(() => {
							this.sotate = 'rotate0';
						},600);
				}
			},
			callSet(){
				this.show = true;
				this.trialOver = true;
				this.certificationDetail()
//				this.packaging()
			},
			shut(){  // 照片上传中不能其他操作
				if(!this.uploadingP){
					this.addPic = false;
				}else{
					this.$message.error("照片上传中")
				}
			},
			stop(e){   //阻止冒泡
				window.event? window.event.cancelBubble = true : e.stopPropagation()
			},
		}
	}
</script>

<style scoped lang="scss">
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
</style>