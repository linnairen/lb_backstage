<template>
	<section>
		<!--头部-->
		<el-row class="clearfix b" style="margin-bottom:20px;">
			<h1 class="l">车主详情</h1>
		</el-row>
		<el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="车主信息" name="first" class="clearfix">
            	<div class="clearfix">
	                <div class="clearfix l" style="width:50%;">
	                    <div class="t_d"><strong>车主编号：</strong><span>{{carOwnerData.userId}}</span></div>
	                    <div class="t_d"><strong>车主手机：</strong><span>{{carOwnerData.telphone}}</span></div>
	                    <div class="t_d"><strong>昵称：</strong><span>{{carOwnerData.nickName}}</span></div>
	                    <div class="t_d"><strong>性别：</strong><el-select v-model="sex" placeholder="请选择性别" :disabled="show">
						    <el-option v-for="(item,index) in userSex" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select></div>
	                    <div class="t_d"><strong>年龄段：</strong><el-select v-model="age" placeholder="请选择年龄" :disabled="show">
						    <el-option v-for="(item,index) in userAge" :key="index" :label="item.label" :value="item.value"></el-option>
						</el-select></div>
	                    <div class="t_d"><strong>邀请人昵称：</strong><span @click="toDetail">{{carOwnerData.inviteName}}</span></div>
	                </div>
	                <div class="clearfix l" style="width:50%;">
	                    <div style="text-align: center"><img :src="carOwnerData.headUrl || require('../../assets/u210.png')" style="max-height: 200px;max-width: 200px;"></div>
	                </div>
            	</div>
            	<div class="editUser">
		            <el-button v-show="show" style="width:120px;" type="primary" icon="edit" @click="show = !show">编辑</el-button>
		            <el-button v-show="!show" style="width:120px;" type="primary" @click="updateUserInfo();show = !show;sex = carOwnerData.sex || null;age = carOwnerData.age || null">保存</el-button>
		            <el-button v-show="!show" style="width:120px;" type="primary" @click="show = !show;sex = carOwnerData.sex;age = carOwnerData.age === 0 ? '00' : (carOwnerData.age || null)">取消</el-button>
            	</div>
            </el-tab-pane>
            <el-tab-pane label="实名" name="second">
            	<div class="l" style="width:50%;" v-show="authData.ifIdentity">
                    <div class="t_d"><strong>身份证号码：</strong><span>{{authData.idCardNo}}</span></div>
            	</div>
            	<div class="l" style="width:50%;" v-show="authData.ifIdentity">
                    <div class="t_d"><strong>姓名：</strong><span>{{authData.realName}}</span></div>
            	</div>
            	<div class="l" style="width:100%;" v-show="!authData.ifIdentity">
                    <div class="t_d"><b>未实名</b></div>
            	</div>
            </el-tab-pane>
            <el-tab-pane label="车辆信息" name="third">
            	<div class="carItem">
            		<div class="item">
	                    <div class="t_d"><strong>车牌号：</strong><el-input style="width: 190px;" v-model="addData.plateNo"  placeholder="请输入车牌号" :disabled="!addCar"></el-input></div>
	                    <div class="t_d"><strong>颜色（选）：</strong><el-input style="width: 190px;" v-model="addData.carColor" placeholder="请输入颜色" :disabled="!addCar"></el-input></div>
	                    <div class="t_d"><strong>品牌（选）：</strong><el-input style="width: 190px;" v-model="addData.carModel" placeholder="请输入品牌" :disabled="!addCar"></el-input></div>
	                    <div class="t_d"><strong>车型（选）：</strong><el-input style="width: 190px;" v-model="addData.carType" placeholder="请输入车型" :disabled="!addCar"></el-input></div>
	                </div>
	                <div class="btn">
	                	<div><el-button style="width: 120px;" type="primary" @click="appendCar" v-show="addCar">保存</el-button></div>
	                	<div><el-button style="width: 120px;" type="primary" @click="addCar = !addCar;addData = {}" v-show="addCar">取消</el-button></div>
	                </div>
	                <div class="addCar" v-show="!addCar">
	                	<el-button style="width: 120px;" @click="addCar = !addCar">添加车辆</el-button>
	                </div>
            	</div>
            	<div v-for="(car,key) in carsData" class="carItem">
            		<div class="selected" v-show="car.isChecked == 1">默认车辆</div>
            		<div class="item">
	                    <div class="t_d"><strong>车牌号：</strong><el-input style="width: 190px;" v-model="car.plateNo"  placeholder="请输入车牌号" :disabled="car.show"></el-input></div>
	                    <div class="t_d"><strong>颜色（选）：</strong><el-input style="width: 190px;" v-model="car.carColor" placeholder="请输入颜色" :disabled="car.show"></el-input></div>
	                    <div class="t_d"><strong>品牌（选）：</strong><el-input style="width: 190px;" v-model="car.carModel" placeholder="请输入品牌" :disabled="car.show"></el-input></div>
	                    <div class="t_d"><strong>车型（选）：</strong><el-input style="width: 190px;" v-model="car.carType" placeholder="请输入车型" :disabled="car.show"></el-input></div>
	                </div>
	                <div class="item" v-show="car.isChecked == 1 && drivingLicense">
	                    <div style="text-align: center"><img :src="drivingLicense" style="max-height: 200px;max-width: 200px;"></div>
	                </div>
	                <div class="btn">
	                	<div v-show="car.show"><el-button style="width: 120px;" type="primary" @click="car.show = !car.show">编辑</el-button></div>
	                	<div v-show="car.show"><el-button style="width: 120px;" type="primary" @click="deleteCar(car.tid)">删除车辆</el-button></div>
	                	<!-- <div v-show="car.show && car.isChecked != 1"><el-button type="primary" style="width: 120px;" @click="car.show = !car.show">设为默认车辆</el-button></div> -->
	                	<div v-show="!car.show"><el-button style="width: 120px;" type="primary" @click="editCar(car)">保存</el-button></div>
	                	<div v-show="!car.show"><el-button style="width: 120px;" type="primary" @click="car.show = !car.show">取消</el-button></div>
	                </div>
            	</div>
            </el-tab-pane>
            <el-tab-pane label="统计信息" name="forth">
                <div class="clearfix l" style="width:50%;">
                    <div class="t_d"><strong>发单总量：</strong><span>{{carOwnerData.sendOderAll || 0}}单</span></div>
                    <div class="t_d"><strong>成单率：</strong><span>{{ (carOwnerData.effectOderAll * 100/carOwnerData.sendOderAll).toFixed(2) + '%' }}</span></div>
                    <div class="t_d"><strong>领取抵扣券总额：</strong><span>{{carOwnerData.couponAmountAll || 0 }}元</span></div>
                    <!-- <div class="t_d"><strong>领取抵扣券（预约）：</strong><span>{{carOwnerData.userId}}</span></div>
                    <div class="t_d"><strong>领取抵扣券（停车）：</strong><span>{{carOwnerData.telphone}}</span></div> -->
                    <div class="t_d"><strong>领取抵扣券总量：</strong><span>{{carOwnerData.couponNumAll || 0 }}个</span></div>
                </div>
                <div class="clearfix l" style="width:50%;">
                    <div class="t_d"><strong>有效单总量：</strong><span>{{carOwnerData.effectOderAll || 0 }}单</span></div>
                    <div class="t_d"><strong>支出总额：</strong><span>{{carOwnerData.payRmount || 0 }}元</span></div>
                    <div class="t_d"><strong>使用抵扣券总额：</strong><span>{{carOwnerData.useCouponAmount || 0 }}元</span></div>
                   <!--  <div class="t_d"><strong>使用抵扣券（预约）：</strong><span>{{carOwnerData.nickName}}</span></div>
                    <div class="t_d"><strong>使用抵扣券（停车）：</strong><span>{{carOwnerData.nickName}}</span></div> -->
                    <div class="t_d"><strong>使用抵扣券总量：</strong><span>{{carOwnerData.useCouponNum || 0 }}个</span></div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <!--返回-->       
        <el-row class="clearfix r "  style="padding-top: 20px;">
            <el-button style="width:120px;" icon="el-icon-back" @click="$router.go(-1);">返回</el-button>
        </el-row>
	</section>
</template>

<script>
	import { mapGetters,mapActions } from 'vuex'
	import util from '../../common/js/util'
	import localData from '../../common/js/localData'
	import { findCarOwnerInfo,getAppUserCarMsg,authIdentityInfo,delCar,insertPlateNo,updateCar,updateUserInfo } from '../../api/api'

	export default {
		data() {
			return {
				userId: null,
				activeName: 'first',
				carOwnerData: {},
				carsData: [],
				show: true,
				sex: null,
				age: null,
				userSex: [],
				userAge: [],
				sureList: [{ value: 1,label: '是' },{ value: 0,label: '否' }],
				total: 0,
				drivingLicense: '',
				authData: {},
				addCar: false,
				addData: {
					plateNo: '',
					carColor: '',
					carModel: '',
					carType: ''
				}
			}
		},
		created() {
			this.userId = this.$route.params.userId
			this.userSex = [...localData.userSex]
			this.userAge = [...localData.userAge]
		},
		mounted() {
			this.findCarOwnerInfo()
			this.getAppUserCarMsg()
			this.authIdentityInfo()
		},
		watch: {
			'$route': function () {
				this.userId = this.$route.params.userId
				this.findCarOwnerInfo()
				this.getAppUserCarMsg()
				this.authIdentityInfo()
			}
		},
		methods: {
			findCarOwnerInfo() { //获取车主信息
				findCarOwnerInfo({
					userId: this.userId
				}).then( data => {
					if(data.code == 200){						
						this.carOwnerData = data.rs
						this.sex = this.carOwnerData.sex
						this.age = this.carOwnerData.age === 0 ? '00' : this.carOwnerData.age
					}
				})
			},
			getAppUserCarMsg () { //获取车辆信息
				getAppUserCarMsg({
					userId: this.userId
				}).then(res => {
					if(res.code == 200){
						this.carsData = []
						if(res.rs && res.rs.list){
							res.rs.list.forEach((item,index) => {
								item.show = true
								this.carsData.push(item)
							})
						}
						res.rs && (this.drivingLicense = res.rs.drivingLicense)
					}
				})
			},
			authIdentityInfo () { // 认证信息
				authIdentityInfo({
					userId: this.userId
				}).then(res => {
					if(res.code == 200){
						this.authData = res.rs
					}
				})
			},
			onState(list,item){    // 状态转换文本
				for(var i = 0;i< list.length; i++){
					if (item == list[i].value) return list[i].text
				}
			},
			handleClick () {

			},
			deleteCar (tid) { // 删除车辆
				this.$confirm('确认删除该车辆?', '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
			        delCar({
						tid: tid
					}).then(res => {
						if(res.code == 200){
							this.$message({
				            	type: 'success',
				            	message: '删除成功!'
				          	})
							this.getAppUserCarMsg()
						}
					})
		        })
			},
			appendCar () { //添加车辆
				if(!this.addData.plateNo || this.addData.plateNo.length < 7 || this.addData.plateNo.length > 8){
					this.$message({
		            	type: 'error',
		            	message: '车牌号长度不正确!'
		          	})
		          	return
				}
				if(this.addData.plateNo.length == 7){
					this.addData.type = 1
				}
				else if(this.addData.plateNo.length == 8){
					this.addData.type = 2
				}
				else{
					return
				}
				this.addData.userId = this.userId
				insertPlateNo(this.addData).then(res => {
					if(res.code == 200){
						this.$message({
			            	type: 'success',
			            	message: '添加成功!'
			          	})
						this.getAppUserCarMsg()
						this.addData = {}
						this.addCar = false
					}
				})
			},
			editCar (car) { //修改车辆信息
				if(!car.plateNo || car.plateNo.length < 7 || car.plateNo.length > 8){
					this.$message({
		            	type: 'error',
		            	message: '车牌号长度不正确!'
		          	})
		          	return
				}
				if(car.plateNo.length == 7){
					car.type = 1
				}
				else if(car.plateNo.length == 8){
					car.type = 2
				}
				else{
					return
				}
				updateCar (car).then(res => {
					if(res.code == 200){
						this.$message({
			            	type: 'success',
			            	message: '修改成功!'
			          	})
						this.getAppUserCarMsg()
					}
				})
			},
			getAge (value) {
				for (var i = 0; i < this.userAge.length; i++) {
					if(this.userAge[i].value == value){
						return this.userAge[i].label
					}
				}
			},
			updateUserInfo () { // 修改用户信息
				updateUserInfo({
					userId: this.userId,
					sex: this.sex,
					age: this.getAge(this.age)
				}).then(res => {
					if(res.code == 200){
						this.findCarOwnerInfo()
						this.$message({
			            	type: 'success',
			            	message: '修改成功!'
			          	})
					}
				})
			},
			toDetail () { //前往邀请人详情
				this.$router.push({name:'carOwnerDetail',params:{userId: this.carOwnerData.investUserId}})
			}
		}
	}
</script>

<style scoped lang="scss">
	.editUser {
		display: flex;
		justify-content: center;
		margin-top: 100px;
	}
	.t_d{
		line-height: 1.5;
		padding: 1em 0;
		strong{
			display: inline-block;
			width: 40%;
			text-align: right;
			vertical-align: middle;
		}
		span{
			display: inline-block;
			width: 60%;
			text-align: left;
			white-space: pre-wrap;
			word-wrap: normal;
			vertical-align: middle;
		}
	}
	.inp{
		line-height: 1.5;
		padding: 2px;
		vertical-align: middle;
		border: 1px solid #aaa;
		border-radius: 5px;
		outline: none;
	}
	.ta{
		display: inline-block;
		vertical-align: top;
		line-height: 1.5;
		border: 1px solid #aaa;
		border-radius: 5px;
		height: 100px;
		width: 260px;
		outline: none;
	}
	.carItem{
		margin-bottom: 50px;
		margin-right: 50px;
		background: #f6f6f6;
		border-radius: 10px;
		display: inline-flex;
		overflow: hidden;
		position: relative;
		.item{
			flex: 1;
			width: 350px;
		}
		.addCar{
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			background: rgba(0,0,0,0.2);
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.btn{
			padding: 20px;
			width: 120px;
			display: flex;
			flex-direction: column;
			.el-button{
				margin-bottom: 20px;
				color: #fff;
			}
		}
		.selected{
			position: absolute;
			font-size: 12px;
			left: -40px;
			top: 20px;
			height: 2em;
			line-height: 2;
			background: #ff8a1b;
			width: 140px;
			text-align: center;
			transform: rotate(-45deg);
		}
	}
</style>