<template>
	<section>
		<!--头部-->
		<el-row class="clearfix b" style="margin-bottom:20px;">
			<h1 class="l">提现详情</h1>
		</el-row>
		<el-row class="main" v-loading="loading" element-loading-text="拼命加载中">
			<el-row class="clearfix caption">
				<h2 class="l">提现信息</h2>
			</el-row>
		</el-row>	
		<el-row class="clearfix" style="padding-top:20px;" >
			<el-form  class="clearfix" >				
				<div class="clearfix l" style="width:50%;">
					<div class="t_d"><strong>提现编号：</strong><span>{{orderDetail.oderNo}}</span></div>
					<div class="t_d"><strong>停车场名称：</strong><span>{{orderDetail.orgName}}</span></div>
					<div class="t_d"><strong>预留手机号：</strong><span>{{orderDetail.bankCardMobile}}</span></div>
					<div class="t_d"><strong>银行卡类型：</strong><span>{{orderDetail.banCardType}}</span></div>
					<div class="t_d"><strong>提现金额：</strong><span>{{orderDetail.amount}}元</span></div>
					<div class="t_d"><strong>余额：</strong><span>{{orderDetail.remainingMoney}}元</span></div>
				</div>
				<div class="clearfix l" style="width:50%;">
					<div class="t_d"><strong>交易单号：</strong><span>{{orderDetail.tradeNo}}</span></div>
					<div class="t_d"><strong>认证类型：</strong><span>{{onState(authTypes,orderDetail.authType)}}</span></div>
					<div class="t_d"><strong>开户行：</strong><span>{{orderDetail.bankCardName}}</span></div>
					<div class="t_d"><strong>银行卡：</strong><span>{{orderDetail.bankCardNo}}</span></div>
					<div class="t_d"><strong>通道手续费：</strong><span v-if="show">{{orderDetail.procedureCharge || 0}}元</span><input type="number" class="inp" v-model="procedureCharge" v-if="!show" placeholder="0.01元"></div>
				</div>
			</el-form>
		</el-row>
		<el-row class="main" v-loading="loading" element-loading-text="拼命加载中">
			<el-row class="clearfix caption">
				<h2 class="l">操作信息</h2>
			</el-row>
		</el-row>	
		<el-row class="clearfix" style="padding-top:20px;" >
			<el-form  class="clearfix" >				
				<div class="clearfix l" style="width:50%;">
					<div class="t_d"><strong>提现时间：</strong><span>{{orderDetail.createTime}}</span></div>
					<div class="t_d" v-show="orderDetail.ifOffWithdrawal"><strong>提现时间（手工）：</strong><span>{{orderDetail.offWithdrawalTime}}</span></div>
					<div class="t_d"><strong>备注：</strong><span v-if="show">{{orderDetail.sysRemark || '无'}}</span><textarea class="ta" v-if="!show" v-model="sysRemark"></textarea></div>
				</div>
				<div class="clearfix l" style="width:50%;">
					<div class="t_d"><strong>提现状态：</strong><span>{{onState(drawState,orderDetail.state) + (orderDetail.ifOffWithdrawal ? '(手工提现)' : '' )}}</span></div>
				</div>
			</el-form>
		</el-row>
		<!-- 手工提现 -->
		<el-row class="clearfix btn">
			<el-button style="width:180px;line-height:1.5" class="el-button--primary" @click="show = false" v-if="orderDetail.state == -1 && show">手工提现</el-button>
			<el-button style="width:120px" class="el-button--primary" @click="offDrawCash" v-if="!show">提交</el-button>
			<el-button style="width:120px" class="el-button--primary" @click="show = true" v-if="!show">取消</el-button>
		</el-row>
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
	import { userDrawCashDetail,offDrawCash } from '../../api/api'

	export default {
		data() {
			return {
				orderNo: null,
				orderDetail: {
					oderNo: '',
					orgName: '',
					bankCardMobile:'',
					banCardType: '',
					amount: '',
					remainingMoney: '',
					tradeNo:'',
					authType: '',
					bankCardName: '',
					bankCardNo: '',
					procedureCharge:'',

					createTime:'',
					offWithdrawalTime: '',
					sysRemark: '',
					state: ''
				},
				procedureCharge: '',
				sysRemark: '',
				parksData: [],
				pageNo: 1,
				loading: false,
				show: true,
				authTypes: [],
				drawState: [],
				total: 0
			}
		},
		created() {
			this.orderNo = this.$route.params.orderNo
			this.authTypes = localData.authType
			this.drawState = localData.drawState
		},
		mounted() {
			this.userDrawCashDetail()
		},
		methods: {
			userDrawCashDetail() {
				userDrawCashDetail({
					oderNo:this.orderNo
				}).then( data => {
					if(data.code == 200){						
						this.orderDetail = data.rs
						this.orderDetail.offWithdrawalTime = this.orderDetail.offWithdrawalTime ? util.formatDate.format(new Date(this.orderDetail.offWithdrawalTime * 1000),'yyyy-MM-dd hh:mm:ss') : ''
						this.orderDetail.createTime = this.orderDetail.createTime ? util.formatDate.format(new Date(this.orderDetail.createTime * 1000),'yyyy-MM-dd hh:mm:ss') : ''
					}
				})
			},
			offDrawCash () {
				if(this.procedureCharge.match(/^\s*$/)){
					this.procedureCharge = 0.01
				}
				if(this.procedureCharge < 0.01 || this.procedureCharge > 999){
					this.$message.error('请输入0.01-999的手续费')
					return
				}
				offDrawCash({
					oderNo: this.orderNo,
					procedureCharge: this.procedureCharge,
					sysRemark: this.sysRemark
				}).then(res => {
					if(res.code == 200){
						this.$message.success('提交成功')
						this.userDrawCashDetail()
						this.show = true
					}
				})
			},
			onState(list,item){    // 状态转换文本
				for(var i = 0;i< list.length; i++){
					if (item == list[i].value) return list[i].text
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.t_d{
		line-height: 1.5;
		padding: 1em 0;
		strong{
			display: inline-block;
			width: 50%;
			text-align: right;
			vertical-align: top;
		}
		span{
			display: inline-block;
			width: 50%;
			text-align: left;
			white-space: pre-wrap;
			word-wrap: normal;
		}
	}
	.btn{
		padding-top: 20px;
		display: flex;
		justify-content: space-around;
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
</style>