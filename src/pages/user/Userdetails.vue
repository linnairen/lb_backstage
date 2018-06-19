<template>
	<section>
		<!--头部-->
		<el-row class="clearfix b" style="margin-bottom:20px;">
			<h1 class="l">用户详情</h1>	
		</el-row>
		<el-row class="main" v-loading="loading" element-loading-text="拼命加载中">
			<el-tabs v-model="activeName"  type="card"   @tab-click="handleClick">
				
			    <el-tab-pane label="基本信息" name="first"  class="tab-item">
			    	<el-row class="clearfix caption">
						<h2 class="l">基本信息</h2>
					</el-row>	
			   		<!--基本信息内容-->
					<el-row class="clearfix" style="padding-top:20px;" >
						<el-form style="width:50%;" class="clearfix l"  >
							<!-- 手机号码 -->
							<el-form-item label="手机号码" label-width="100px"  style="width:100%;">
								<el-input v-model="userInfo.telphone"  placeholder="手机号码" style="width:120px;" disabled  size="small" @keydown.space.native="$event.returnValue = false"></el-input>
							</el-form-item>
							<!-- 性别-->
							<el-form-item label="性别" label-width="100px"  style="width:100%;">
								<el-select v-model="userInfo.sex" placeholder="请选择" style="width:100px;" size="small"  :disabled="show">
								    <el-option v-for="item in userSex"  :key="item.value"  :label="item.label"  :value="item.value"  ></el-option>
								 </el-select>							
							</el-form-item>
							<!-- 邀请码-->
							<el-form-item label="邀请码" label-width="100px"  style="width:100%;">
								<el-input v-model="userInfo.userSign"  placeholder="邀请码" style="width:100px;" :disabled="show"  size="small" @keydown.space.native="$event.returnValue = false"></el-input>				
							</el-form-item>							
							<!--昵称-->
							<el-form-item label="昵称" label-width="100px"  style="width:100%;">
								<el-input v-model="userInfo.nickName" placeholder="昵称" style="width:120px;" :disabled="show"  size="small" @keydown.space.native="$event.returnValue = false"></el-input>
							</el-form-item>
							<!-- 年龄段-->
							<el-form-item label="年龄段" label-width="100px"  style="width:100%;">
								<el-select v-model="userInfo.age" placeholder="请选择"  style="width:100px;" size="small"  :disabled="show">
								    <el-option v-for="item in userAge"  :key="item.value"  :label="item.label"  :value="item.label"  ></el-option>								    
								 </el-select>
								 <span>后</span>
							</el-form-item>	 
							<!-- 注册来源-->
							<el-form-item label="注册来源" label-width="100px" style="width:100%;" >
								<el-select v-model="userInfo.registSource" placeholder="来源" style="width:150px;" size="small"  disabled >
									<el-option v-for="item in userSource" :key="item.value" :label="item.label" :value="item.value"></el-option>
								</el-select>
							</el-form-item>
							<!--注册日期-->
							<el-form-item label="注册日期" label-width="100px"  style="width:100%;">
								<span>{{userInfo.createTime}}</span>
							</el-form-item>
						</el-form>
						
						<div class="clearfix r" style="width: 50%;">
							<div class="picture-card" v-if="imgIdCard.length">
								<img :src="item.imgUrl" :alt="item.tid" :key="index" v-for="(item,index) in imgIdCard" @click="addIdePic(imgIdCard,item)"/>
								<p>头像信息</p>
							</div>
							<div class="picture-card" v-if="!imgIdCard.length && !show" @click="addIdePic(imgIdCard)">
								<img src="../../assets/pic.jpg"/>
								<p>头像信息</p>
							</div>
						</div>
						
					</el-row>	
					
					
					<!--  保存修改按钮  -->
					<el-row style="width:250px;margin: 100px auto;"  >
						<div v-if="show" >
							<el-button  suffix-icon="edit" type="primary"  @click="changeShow">编辑</el-button>
						</div>
						<div  v-if="!show">	
							<el-button class="l" style="width:120px;" suffix-icon="upload" type="primary" :loading="uploading" @click="updateUserInfo">{{uploading?'上传中':'保存'}}</el-button>
							<el-button class="l"  style="width:120px;" type="primary" @click="callSet">取消</el-button>
						</div>
					</el-row>
					
			    </el-tab-pane>
			    
			    
			    <el-tab-pane label="实名信息和重要联系人" name="second"  class="tab-item" v-if="userid">
			    	<el-row class="clearfix caption">
						<h2 class="l">实名认证信息</h2>
					</el-row>
					
					<el-row  class="clearfix" style="padding-top:20px;padding-bottom: 50px;">
						<el-form style="width:100%;" class="clearfix "  >
							<el-form-item label="客户姓名" label-width="100px"  style="width:33%;" class="l">
								<el-input v-model="realNameInfo.realName"  placeholder="客户姓名" style="width:120px;" :disabled="show"  size="small" @keydown.space.native="$event.returnValue = false"></el-input>								
							</el-form-item>
							<el-form-item label="身份证号码" label-width="100px"  style="width:33%;"  class="l">
								<el-input v-model="realNameInfo.idCardNo"  placeholder="身份证号码" style="width:180px;" :disabled="show"  size="small" @keydown.space.native="$event.returnValue = false"></el-input>								
							</el-form-item>			
							<el-form-item label="是否实名认证" label-width="100px"  style="width:33%;"  class="l">
								<el-checkbox v-model="realNameInfo.ifIdentity" ></el-checkbox>
							</el-form-item>																						
						</el-form>	
					</el-row>
					
					<el-row class="clearfix caption" >
						<h2 class="l">重要联系人信息</h2>
					</el-row>
					
					<!--<el-row  class="clearfix" style="padding-top:20px;">
						<el-table v-loading="loading" element-loading-text="拼命加载中" :data="contactsList" stripe max-height="800"  border style="width: 100%" highlight-current-row  >
			    			<el-table-column prop="index" label="序号" width="65" header-align="center" align="center"></el-table-column>
							<el-table-column prop="name" label="姓名" min-width="150" header-align="center" align="center"></el-table-column>
							<el-table-column prop="moblie" label="手机号码" min-width="150" header-align="center" align="center"></el-table-column>
							<el-table-column prop="relation" label="关系" min-width="150" header-align="center" align="center"></el-table-column>							
							<el-table-column    label="操作"  width="140"  header-align="center"    filter-placement="bottom-end" >
						      <template scope="scope">
						      	<el-button   class="l" @click="ModifyContact = true" type="primary" size="small">修改</el-button>
						        <el-button   class="l" @click="handleDelete(scope.row)" type="primary" size="small">删除</el-button>					        
						      </template>
						  </el-table-column> 														
						</el-table>
					</el-row>				-->
			    </el-tab-pane>
			    
			    <el-tab-pane  label="银行卡信息" name="third"  class="tab-item" v-if="userid">
			    	<el-row class="clearfix caption">
						<h2 class="l">银行卡信息</h2>					
					</el-row>
			    	<el-row v-loading="loading" element-loading-text="拼命加载中">
				 		<el-table  :data="bankInfo"  style="width: 100%" border>
				 			 <el-table-column  prop="userName"  label="姓名"   min-width="300"> </el-table-column>
				 			 <el-table-column  prop="cardNo"  label="银行卡号"   min-width="300"> </el-table-column>
				 			 <el-table-column  prop="bankName"  label="银行卡名称"   min-width="300"> </el-table-column>
				 		</el-table>
				 	</el-row>
			    </el-tab-pane>
			    
			    <el-tab-pane  label="用户车辆信息" name="fourth"  class="tab-item" v-if="userid">
			    	<el-form style="width:100%;" class="clearfix"  v-for="(item,index) in carInfo" :key="index">
			    		<div class="clearfix">
			    			<el-button type="primary" v-if="!show" class="r" suffix-icon="delete2"  @click="carInfo.remove(item)"><span>删除</span></el-button>
			    			<!-- 车辆号 -->
							<el-form-item label="车牌号" label-width="80px" style="width:33%;" class="l">
								<el-input placeholder="车牌号" size='small' style="width:150px;" v-model="item.plateNo"   :disabled="show"   @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
							</el-form-item>
							<!-- 车辆型号 -->
							<el-form-item label="车辆型号" label-width="80px" style="width:33%;" class="l">
								<el-input placeholder="车辆型号" size='small' style="width:150px;" v-model="item.carType"  :disabled="show"   @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
							</el-form-item>
							<!-- 车辆品牌 -->
							<el-form-item label="车辆品牌" label-width="80px" style="width:33%;" class="l">
								<el-input placeholder="车辆品牌" size='small' style="width:150px;" v-model="item.carModel"  :disabled="show"   @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
							</el-form-item>
			    		</div>
			    		<div class="clearfix">
			    			<!-- 车辆颜色 -->
							<el-form-item label="车辆颜色" label-width="80px" style="width:33%;" class="l">
								<el-input placeholder="车辆颜色" size='small' style="width:150px;" v-model="item.carColor"  :disabled="show"   @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
							</el-form-item>
			    		</div>
			    	</el-form>
			    </el-tab-pane>
			    
			    
			    <el-tab-pane label="用户停车场信息" name="fifth"  class="tab-item" v-if="userid">
			    	<el-form style="width:100%;" class="clearfix "  >
						<el-form style="width:50%;" class="clearfix l"  >
							<el-form-item label="公司信息" label-width="100px"  style="width:100%;">
								<el-button type="text" >文字按钮</el-button>						
							</el-form-item>
						</el-form>	
						<el-form style="width:50%;" class="clearfix l"  >
							<el-form-item label="停车场信息" label-width="100px"  style="width:100%;">
								<el-button type="text" >文字按钮</el-button>							
							</el-form-item>
						</el-form>	
					</el-form>	
			    	
			    </el-tab-pane>
			    <el-tab-pane label="业务信息" name="sixth"  class="tab-item"  v-if="userid">
			    	
			    	
			    </el-tab-pane>
			</el-tabs>
		</el-row>
		<!-- 图片编辑和查看弹窗 -->
		<el-row v-if="addPic" class="sbe" @click.native="shut">
			<img v-if="bigPic.imgUrl" :src="bigPic.imgUrl" class="bg">
			<div class="exa">
				<div class="pic">
					<img class="rotate0" style="height:480px;" src="../../assets/pic.jpg" v-if="!bigPic.imgUrl"/>
					<el-button class="img" v-if="uploadingP" :loading="uploadingP"></el-button>
					<img class="rotate0" :src="bigPic.imgUrl" v-if="bigPic.imgUrl"/>
				</div>
				<div class="btn2" v-if="!bigPic.imgUrl&&!show">
					<el-button style="width:120px;position: relative;" @click="stop" suffix-icon="upload" type="primary" :loading="uploadingP"></i>{{uploadingP?'上传中':'选择上传'}}<input type="file" @change='addUpFile($event.target)' ref='add'></el-button>
					<el-button style="width:120px;" type="primary">确定</el-button>
				</div>
				<div class="btn3" v-if="show">
					<a class="el-button" :href="bigPic.imgUrl" :download="bigPic.imgUrl"><span>点击下载</span></a>
					<el-button type="primary" style="width:120px;" @click="setSotate($event)">旋转</el-button>
					<el-button type="primary" style="width:120px;">关闭</el-button>
				</div>
				<div class="btn4" v-if="bigPic.imgUrl && !show">
					<a class="el-button" style="width:100px;" :href="bigPic.imgUrl" :download="bigPic.imgUrl"><span>点击下载</span></a>
					<el-button style="width:100px;position: relative;" suffix-icon="upload" type="primary" @click="stop($event)" :loading="uploadingP">{{uploadingP ? '上传中' : '选择上传'}}<input type="file" @change='addUpFile($event.target)' ref='add'></el-button>
					<el-button style="width:100px;" suffix-icon="delete2" type="primary" @click="bigPicList.remove(bigPic)">删除照片</el-button>
					<el-button type="primary" style="width:100px;" @click="setSotate($event)">旋转</el-button>
					<el-button style="width:100px;" type="primary">确定</el-button>
				</div>
			</div>
		</el-row>
		
		<!--重要联系人修改弹出框-->
		<el-dialog title="重要联系人修改"  :visible.sync="ModifyContact"  top="30%"  style="minWidth:1580px;">
			<el-form style="width: 100%;margin: 0 auto;"  class="clearfix" >
				<el-form-item label="姓名" label-width="100px"  style="width:100%;">
					<el-input v-model="userInfo.user"  placeholder="姓名" style="width:200px;" :disabled="show"   @keydown.space.native="$event.returnValue = false"></el-input>								
				</el-form-item>
				<el-form-item label="手机号码" label-width="100px"  style="width:100%;">
					<el-input v-model="userInfo.user"  placeholder="手机号码" style="width:200px;" :disabled="show"   @keydown.space.native="$event.returnValue = false"></el-input>								
				</el-form-item>
				<el-form-item label="关系" label-width="100px"  style="width:100%;">
					<el-input v-model="userInfo.relation"  placeholder="关系" style="width:200px;" :disabled="show"   @keydown.space.native="$event.returnValue = false"></el-input>								
				</el-form-item>
			</el-form>
			
		  	<div slot="footer" class="dialog-footer">
			    <el-button @click="ModifyContact = false">取 消</el-button>
			    <el-button type="primary" @click="riskevaluate">确 定</el-button>
		  	</div>
		</el-dialog>
		<el-row class="clearfix r "  style="padding-top: 30px;">
			<el-button   style="width:120px;" suffix-icon="arrow-left" @click="$router.go(-1);">返回</el-button>
		</el-row>
				
	</section>
</template>

<script>
	
	import { mapGetters } from 'vuex'
    import { mapActions } from 'vuex'
	import util from '../../common/js/util'
	import localData from '../../common/js/localData'
	import type from '../../common/js/type'
	import {getQiniuToken,getPic,getAppUserInfo,authIdentityInfo,getAppUserBankMsg,getAppUserCarMsg,updateUserInfo} from '../../api/api'
	import qs from 'qs'
	import NProgress from 'nprogress'
	
	export default {
		data() {
			return {
				userid: null,
				activeName: 'first',
				userInfo: {   //用户详情
					sex: '', userSign: '' ,age: ''
				},
				realNameInfo: {},   //实名信息
				bankInfo: [],    //银行卡信息
				carInfo: [],     //用户车辆信息
				show: false,
				uploading: false,
				loading: false,
				uploadingP: false,
				total: null,
				tableData: [],
				contactsList: [
					{
						index:1,
						tid:1,
						name:'蛇皮',
						moblie: '18512312352',
						relation: '父子'
					},
					{
						index:2,
						tid:2,
						name:'瓜皮',
						moblie: '18806514743',
						relation: '母子'
					},
				],
				userSex: [],
				userSource: [],
				userAge: [], 
				bankState: [],
				show: false,
				imgIdCard: [],
				addPic: false,
				ModifyContact: false
			}
		},
		computed: {
            ...mapGetters([
				'getBtnPower',
				'getTid'
            ])
        },
		created() {
			this.userAge = localData.userAge;
			this.userSex = localData.userSex;
			this.bankState = localData.bankState;
			this.userSource = localData.userSource;
			
		},
		mounted() {
			this.getUserId()
		},
		methods:{
			getUserId(){
				if(this.$route.params.id == null){
					this.userid = null;
					return;
				}else{
					this.userid = this.$route.params.id
					this.getAppUserInfo()
					this.authIdentityInfo()
					this.getAppUserBankMsg()
					this.getAppUserCarMsg()
				}
			},
			getAppUserInfo(){    //用户详情
				getAppUserInfo({userId:this.userid}).then(data => {
					if(data.code == 200){
						this.userInfo = data.rs;
						this.show = true;
						this.imgIdCard = [];
						this.imgIdCard.push({imgUrl:this.userInfo.headUrl});
						
						for(let i=0;i< this.userSex.length; i++){
							if(this.userInfo.sex == this.userSex[i].value){
								this.userInfo.sex = this.userSex[i].value;
							}
						}
						for(let i=0; i< this.userSource.length; i++){
							if(this.userInfo.registSource == this.userSource[i].value){
								this.userInfo.registSource = this.userSource[i].label
							}
						}
						if(this.userInfo.age != null){
							for(let i=0; i< this.userAge.length; i++){
								if(this.userInfo.age == this.userAge[i].value){
									this.userInfo.age = this.userAge[i].label
								}
							}
						}						
						this.userInfo.createTime = util.formatDate.format(new Date(this.userInfo.createTime * 1000),'yyyy-MM-dd hh:mm:ss');
					}
				})
			},
			updateUserInfo(){          //修改用户信息
				let userInfoList = ['nickName','userSign','sex','age'];				
				let userInfo = {};
				userInfoList.forEach((item) => { userInfo[item] = this.userInfo[item] || '' })
//				userInfo.age = userInfo.age.substr(0,2) || '';
				for( let i=0;i<this.imgIdCard.length; i++){
					userInfo.headUrl = this.imgIdCard[i].imgUrl;
				}
				userInfo.userId = this.userid;
				console.log(userInfo)
				updateUserInfo(userInfo).then( data => {
					if(data.code == 200){
						this.$notify.success('用户信息修改成功');
						this.show = true;
					}
				})
			},
			authIdentityInfo(){    //获取实名认证信息
				authIdentityInfo({userId:this.userid}).then( data => {
					if(data.code == 200){
						this.realNameInfo = data.rs;
					}
				})
			},
			getAppUserBankMsg(){    //银行卡信息
				 getAppUserBankMsg({userId:this.userid,type:2}).then(data => {
				 	if(data.code == 200){
				 		this.bankInfo = data.rs;
				 	}
				 })
			},
			getAppUserCarMsg(){    //用户车辆信息
				getAppUserCarMsg({userId:this.userid}).then(data => {
					if(data.code == 200){
						this.carInfo = data.rs;
					}
				})
			},
			addIdePic($bigPicList,$img) {//身份信息图片
				this.addPic = true;
				this.bigPicList = $bigPicList;
				this.bigPic = $img || {tid: "",imgUrl: null};
				this.getQiniuToken()
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
				getPic({imgUrl: res.key}).then(data => {
					if(data.code == 200){
						if(this.bigPic.imgUrl){
							this.bigPic.imgUrl = data.rs;
						}else{
							this.bigPic.imgUrl = data.rs;
							this.bigPicList.push(this.bigPic);
						}
					}	
				});
				this.uploadingP = false;
			},
			getQiniuToken() {  //获取七牛私有token
				if(!this.show){
					getQiniuToken({type: 2}).then(data => { if ( data.code == 200 ) this.token = data.rs })
				}
			},
			riskevaluate(){
				
			},
			shut() {
				if (!this.uploadingP) {
					this.addPic = false;
				} else {
					this.$message.error("照片上传中");
				}
			},	
			stop(e){   //阻止冒泡
				window.event? window.event.cancelBubble = true : e.stopPropagation()
			},
			monitorTheNumber() {   //验证手机号正则 
				if(this.filteringData.applyMobile.length == 11){
					if (/^[1][3,4,5,7,8][0-9]{9}$/.test(this.filteringData.applyMobile)){ 
						return true;  
					} else {
						this.$message({type: 'warning',message: '手机号码有误'});
						return false;
					}
				} else if(isNaN(this.filteringData.applyMobile)){
					this.$message({type: 'error',message: '手机号码只能为数字'});
					this.filteringData.applyMobile = null;
					return false;
				}
			},
			toOrder($row){   //前往订单详情  需要权限
				if(this.$store.state.btnPower.LOAN_APPLY_DETAIL){
					localStorage.setItem('invData', JSON.stringify(this.filteringData));
//					this.passTid($row.tid);
//					this.$router.push('/order');
					this.$router.push({name:"order",params:{id:$row.tid}})
				}else{
					this.$message.error('没有权限');
				}
			},
			callSet(){
				this.show = true;
				this.trialOver = true;
//				this.packaging()
			},
			changeShow(){
				this.show = false;
				this.trialOver = false
			},
			handleDelete(row){
				console.log(row)
			},
			handleClick(val){
				
			}
		}
		
	}
	
</script>

<style  scoped lang="scss">
	.picture-card{
			position: absolute;
			width: 50%;
			bottom: 0;
			left:25%;
			img{
				display: block;
				width: 200px;
				height: 150px;
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
			width: 198px;
			height: 148px;
		}
	
</style>