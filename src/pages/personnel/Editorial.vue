<template>
	<section>
		<!--****************顶部***********放款详情************-->
		<el-row :span="24"  class="clearfix b">
			<h1 class="l">人员设置</h1>
		</el-row>
		<!--*******************主体内容***********************-->
		<el-row class="per">
			<div class="per-inf clearfix">
				<div class="per-inf-pic l" @click="getToken">
					<img src="../../assets/pic.jpg" v-if="!filteringData.headUrl"/>
					<el-button class="img" :loading="uploading" v-if="uploading"></el-button>
					<img :src="filteringData.headUrl" v-if="filteringData.headUrl"/>
					<input type="file" @change='upFile($event.target)' ref='add' accept="image/*" :disabled="show">
				</div>	
				<div class="per-inf-inp l">
					<div class="per-inf-inp-item">
						<span>姓名</span><el-input v-model="filteringData.realName" size="mini" placeholder="姓名(必填项)" style="width:180px;" :disabled="show" @keydown.space.native="$event.returnValue = false"></el-input>
					</div>
					<div class="per-inf-inp-item">
						<span>手机号码</span><el-input v-model="filteringData.telphone" size="mini" placeholder="手机号码(必填项)" style="width:180px;"   :maxlength="11" :disabled="show" @keydown.space.native="$event.returnValue = false"></el-input>
					</div>
					<div class="per-inf-inp-item">
						<span>部门</span>
						<el-select class="sele" v-model="filteringData.orgId" size="mini" placeholder="部门(必填项)" style="width:180px;" :disabled="show">
							<el-option v-for="(item,index) in secList" :key="index" :label="item.name" :value="item.tid"></el-option>
						</el-select>
					</div>
					<div class="per-inf-inp-item">
						<span>职位</span><el-input v-model="filteringData.position" size="mini" placeholder="职位(必填项)" style="width:180px;" :disabled="show" @keydown.space.native="$event.returnValue = false"></el-input>
					</div>
					<div class="per-inf-inp-item" v-if="!filteringData.tid">
						<span>初始密码</span><el-input v-model="filteringData.password" size="mini" placeholder="密码(必填项)" style="width:180px;" :disabled="show"></el-input>
					</div>
					<div class="per-inf-inp-item">
						<span>角色</span>
						<el-select class="sele" v-model="filteringData.roleId" size="mini" placeholder="角色(必填项)" style="width:180px;" :disabled="show">
							<el-option v-for="(item,index) in roleList" :key="index" :label="item.name" :value="item.tid"></el-option>
						</el-select>
					</div>
					<div class="per-inf-inp-item">
						<span>邮箱</span><el-input v-model="filteringData.email" size="mini" placeholder="邮箱(选填项)" style="width:180px;" :disabled="show" @keydown.space.native="$event.returnValue = false"></el-input>
					</div>
					<div class="per-inf-inp-item">
						<span>工号</span><el-input v-model="filteringData.jobNumber" size="mini" placeholder="工号(必填项)" style="width:180px;" :disabled="show" @keydown.space.native="$event.returnValue = false"></el-input>
					</div>
				</div>	
			</div>
			<!-- <div class="per-acc clearfix">
				<h2>用户权限设置</h2>
				<div class="per-acc-item l">
					<p>菜单权限控制</p>
					<el-card class="box-card">
						<el-checkbox-group v-model="aa">
							<el-checkbox v-for="item in ideInfors" :label="item.value" :key="item.value">{{item.text}}</el-checkbox>
						</el-checkbox-group>
					</el-card>
				</div>	
				<div class="per-acc-item l">
					<p>按钮权限控制</p>
					<el-card class="box-card">
						<el-checkbox-group v-model="aa">
							<el-checkbox v-for="item in ideInfors" :label="item.value" :key="item.value">{{item.text}}</el-checkbox>
						</el-checkbox-group>
					</el-card>
				</div>	
			</div> -->
			<div class="btn2" v-if="show">
				<el-button style="width:22%;" type="primary" suffix-icon="edit" @click="show = false">编辑</el-button>
				<el-button style="width:22%;" type="primary" @click="setPerPass">重置密码</el-button>
				<el-button style="width:22%;" type="primary" suffix-icon="delete2" @click="setDelPer">删除</el-button>
				<el-button style="width:22%;" suffix-icon="arrow-left" @click="$router.go(-1)">返回</el-button>
			</div>
			<div class="btn" v-if="!show">
				<el-button style="width:44%;" type="primary" suffix-icon="upload" @click="setChaPer">保存</el-button>
				<el-button style="width:44%;" v-if="!isNew" type="primary" @click="callSet">取消</el-button>
				<el-button style="width:44%;" suffix-icon="arrow-left" v-if="isNew" @click="$router.go(-1)">返回</el-button>
			</div>
		</el-row>	
	</section>
</template>

<script>
	import { mapGetters } from 'vuex'
    import { mapActions } from 'vuex'
	import util from '../../common/js/util'
	import type from '../../common/js/type'
	import {getGoAddPer,getDepSur,getMember,getQiniuToken,easykp_config,setChaPer,setDelPer,setPerPass} from '../../api/api'
	import NProgress from 'nprogress'
	import qs from 'qs'

	export default {
		data() {
			return {
				filteringData:{
					tid: null,realName:null,jobNumber: null,headUrl: null,orgId: null,roleId: null,
					position: null,telphone: null,email: null,password: null
				},
				secList: [],
				roleList: [],
				token: null,
				show: false,
				uploading: false,
				isNew: true
			}
		},
		created() {
			this.getMember()
			this.getDepSur()
			this.filteringData.password = util.randomWord()
			this.$store.state.btnPower = JSON.parse(localStorage.getItem('btnPower'));
			if(this.$route.params.id == undefined){
				this.filteringData.tid = null;
				return;
			}else{
				this.filteringData.tid = this.$route.params.id
				this.getGoAddPer()
			}
		},
		computed: {
            ...mapGetters([
                'getBtnPower',
				'getTid'
            ])
		},
		methods: {
			...mapActions([
                'passBtnPower',
				'passTid'
			]),
			getGoAddPer() {
				getGoAddPer({tid: this.filteringData.tid}).then(data => {
					if(data.code == 200){
						this.filteringData = data.rs;
						this.show = true;
						this.isNew = false;
					}
				})
			},
			getDepSur() {  //获取部门列表
				getDepSur().then(data =>{ if(data.code == 200) this.secList = data.rs })
			},
			getMember() {  //获取角色列表
				getMember().then(data =>{ if(data.code == 200) this.roleList = data.rs })
			},
			setChaPer() {  //修改和保存
				if(!this.uploading){
					for(var key in this.filteringData){
						if(key != 'tid' && key != 'email' && key != 'headUrl' && key != 'password'){
							if(!this.filteringData[key]){
								this.$message.error('必填项不能为空');
								return;
							}
						}
					}
					if(this.filteringData.tid) {
						this.filteringData.password = null
					}else{
						if(this.filteringData.password){
							this.filteringData.password = this.filteringData.password;
						}else{
							this.$message.error('密码不能为空');
							return;
						}	
					}
					setChaPer(qs.stringify(this.filteringData)).then(data => {
						if(data.code == 200){
							this.filteringData.tid = data.rs;
							this.passTid(data.rs);
							this.$notify.success('已保存');
							this.show = true;
							this.isNew = false;
							this.getGoAddPer()
						}
					})
				}else{
					this.$message.error("正在上传头像");
				}
			},
			setDelPer(){  //删除人员
				this.$confirm('确定删除该人员吗?', '提示', {confirmButtonfailRemark: '确定',cancelButtonfailRemark: '取消',type: 'warning'}).then(() => {
					setDelPer({userId: this.filteringData.userId,roleId: this.filteringData.roleId}).then(data => {
						if(data.code == 200){
							this.$message.success('该人员已删除');
							this.$router.go(-1);
						}
					})		
				})
			},
			setPerPass() {
				this.$confirm('确定重置密码为:  123456  吗?', '提示', {confirmButtonfailRemark: '确定',cancelButtonfailRemark: '取消',type: 'info'}).then(() => {
					setPerPass({telphone: this.filteringData.telphone}).then(data => {
						if(data.code == 200){
							this.$message.success('密码已重置为: 123456');
							this.getGoAddPer()
						}
					})		
				})
			},
			callSet() {
				this.show = true;
				this.uploading = false;
				this.getGoAddPer()
			},
			getToken() {
				getQiniuToken({type: 1}).then(data => {
					if(data.code == 200){this.token = data.rs}
				})
			},
			handleUpload(file) {
				this.uploading = true;
				let qiniuKey=new Date().getTime()+Math.floor(9000*Math.random()+1000);
				if(/\/(?:jpeg|png|gif|bmp|jpg)/i.test(file.type)){
					util.chooseAllFile(file,this.token,this.uploadCallBack,qiniuKey+'.'+file.type.split('/')[1]);
				}else{
					this.uploading = false;
					this.$message.error('请选择图片');
				}
			},
			upFile(obj) {
				if (!obj.files.length) return;
				let files = Array.prototype.slice.call(obj.files);
				files.forEach((file)=>{this.handleUpload(file)});
			},
			uploadCallBack(res) {
				this.filteringData.headUrl = easykp_config.imgAddress + res.key;  //线上公有图片地址
				this.uploading = false;
			}
		}
	}

</script>

<style scoped lang="scss">

	.per{
		.per-inf{
			width: 650px;
			margin: 50px auto;
			.per-inf-inp{
				.per-inf-inp-item{
					margin: 18px 50px;
					span{
						display: inline-block;
						width: 65px;
					}
				}
			}
			.per-inf-pic{
				width: 282px;
				height: 282px;
				border-radius: 50%;
				position: relative;
				-webkit-box-shadow: #aaa 0 0 20px;  
				-moz-box-shadow: #aaa 0 0 20px;  
				box-shadow: #aaa 0 0 20px; 
				img{
					width: 282px;
					height: 282px;
					border-radius: 50%;
				}
				.img{
					width: 100%;
					height: 100%;
					position: absolute;
					top: 0;
					left: 0;
					border-radius: 50%;
					background-color: rgba(0,0,0,0);
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
			.per-inf-pic:hover img{
				width: 280px;
				height: 280px;
				border: 1px solid rgb(32,160,255);
			}
		}
		.per-acc{
			width: 1000px;
			margin: 20px auto;
			h2{
				font-size:16px;
			}
			.per-acc-item{
				margin: 20px;
				width: 460px;
				p{
					margin: 0 0 10px 0;
				}
			}
		}
		.el-checkbox{
			margin: 10px;
		}
		.sele{
			margin-left: -3px;
		}
		.btn{
			width: 200px;
			margin: 0 auto;
		}
		.btn2{
			width: 400px;
			margin: 0 auto;
		}
	}
</style>