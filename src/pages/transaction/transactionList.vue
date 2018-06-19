<template>
	<section>
		<!--****************顶部***********新建************-->
		<el-row :span="24"  class="clearfix b">
			<h1 class="l">交易列表</h1>
			<a :href="exportXlsLink" style="padding: 6px 10px;background: #1786d7;color: #fff;font-size: 14px;float: right;border-radius: 5px;margin: 10px  10px 0 0;">导出</a>
		</el-row>
		<!-- *************筛选功能******************* -->
		<el-row>
			<el-form style="width:100%; padding-top:20px;">
				<div class="clearfix">
					<!-- 订单编号 -->
					<el-form-item label="订单编号" label-width="120px" style="width:32%;" class="l">
						<el-input placeholder="订单编号" suffix-icon="edit" style="width: 200px;" v-model="transactionData.oderNo" @keyup.enter.native="handleCurrentChange()"></el-input> 
					</el-form-item>
					<!-- 车主手机号码 -->
					<el-form-item label="车主手机号码" clearable label-width="120px" style="width:28%;" class="l">
						<el-input placeholder="车主手机号码" suffix-icon="edit" style="width:150px;" v-model="transactionData.telphone"  @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
					</el-form-item>	
					<!-- 停车场名称 -->
					<el-form-item label="停车场名称" clearable label-width="120px" style="width:28%;" class="l">
						<el-input placeholder="停车场名称" suffix-icon="edit" style="width:150px;" v-model="transactionData.orgName"  @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
					</el-form-item>	
					<!--搜索按钮-->
					<el-form-item  style="width: 5%; padding: 0 2%" class="r">
						<el-button type="primary" @click="handleCurrentChange()">搜索</el-button>
					</el-form-item>
				</div>
				<div class="clearfix">
					<!--发单时间-->
					<el-form-item label="发单时间" label-width="120px" style="width: 32% ;height:39px" class="l">
					 	<el-date-picker v-model="defaultTime"  type="datetimerange"  range-separator=" - " style="width:320px;" start-placeholder="开始时间"  end-placeholder="结束时间"  placeholder="开始时间-结束时间"  class="l"></el-date-picker>
					</el-form-item>
					<!--支付状态-->
					<el-form-item label="支付状态" clearable label-width="120px" style="width:28%;" class="l">
					   	<el-select v-model="transactionData.payState" placeholder="支付状态" style="width:150px;">
							<el-option v-for="payState in payStates" :key="payState.value" :label="payState.text" :value="payState.value"></el-option>
						</el-select>
					</el-form-item>
					<!--平台补贴-->
					<el-form-item label="平台补贴" clearable label-width="120px" style="width:28%;" class="l">
					   	<el-select v-model="transactionData.useWay" placeholder="平台补贴" style="width:150px;">
							<el-option v-for="useWay in useWays" :key="useWay.value" :label="useWay.text" :value="useWay.value"></el-option>
						</el-select>
					</el-form-item>
					<!--重置按钮-->
					<el-form-item  style="width:5%; padding: 0 2%" class="r">
						<el-button :plain="true" @click="resetInput">重置</el-button>
					</el-form-item>	
				</div>
			</el-form>
		</el-row>

		<!-- <el-row>
			<div style="text-align: right">全平台实时数据：提现总额：{{  }} 元    停车场提现：xx 元   保安提现：xx 元   手续费：xx 元   手工提现：xx 元</div>
		</el-row> -->
		<el-row>
			<div style="display: flex;justify-content: flex-end;">
				<table class="totalTable" cellpadding="0" cellspacing="0">
					<tr>
						<th>预约费总额</th>
						<!-- <th>退费总额</th> -->
						<!-- <th>补券总额</th> -->
						<th>平台补贴总额</th>
						<th>微信手续费总额</th>
						<th>总收入总额</th>
						<th>停车场奖励总额</th>
						<th>平台支出总额</th>
						<th>平台盈亏总额</th>
					</tr>
					<tr>
						<td>{{ statistics.appointmentAll }} 元</td>
						<!-- <td>{{ statistics.parkIncomeAll }} 元</td> -->
						<!-- <td>{{ -statistics.hangAccountsAll }} 元</td> -->
						<td>{{ -statistics.subsidyAll }} 元</td>
						<td>{{ -statistics.wxChargeAll }} 元</td>
						<td>{{ statistics.totalIncomeAll }} 元</td>
						<td>{{ statistics.parkOrgIncomeAll }} 元</td>
						<td>{{ statistics.platformExpendAll }} 元</td>
						<td>{{ statistics.platformLossAll }} 元</td>
					</tr>
				</table>
			</div>
		</el-row>
		<!-- ****************************列表显示**************************** -->
		<el-row>
			<el-table v-loading="loading"  element-loading-text="拼命加载中" :data="tableData" border style="width: 100%" @row-dblclick='toDetail'  highlight-current-row>
    			<!-- <el-table-column type="index" label="序号" width="65" header-align="center" align="center"></el-table-column> -->
				<el-table-column prop="oderNo" label="订单编号" min-width="100" header-align="center" align="center">
					<template slot-scope="scope">
						<router-link :to="'/orderDetail/'+ scope.row.oderNo">{{scope.row.oderNo}}</router-link>	
					</template>
				</el-table-column>
				<el-table-column prop="telphone" label="车主手机号" min-width="80" header-align="center" align="center">
					<template slot-scope="scope">
						<router-link :to="'/carOwnerDetail/'+ scope.row.oderSenderUserId">{{scope.row.telphone}}</router-link>	
					</template>
				</el-table-column>
				<el-table-column prop="plateNumber" label="车牌照" min-width="100" header-align="center" align="center"></el-table-column>
				<el-table-column prop="orgName" label="停车场名称" min-width="80" header-align="center" align="center"></el-table-column>
				<el-table-column prop="createTime" label="发单时间" min-width="100" header-align="center" align="center"></el-table-column>
				<el-table-column prop="ifOffRefund" label="支付状态" width="100" header-align="center" align="center">
					<template slot-scope="scope">
						<el-tag :type="isType(scope.row.ifOffRefund)" close-transition>{{ stateText(scope.row.ifOffRefund) }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="appointMoney" label="预约费" min-width="90" header-align="center" align="center"></el-table-column>
				<el-table-column prop="refundAmount" label="退费" min-width="90" header-align="center" align="center"></el-table-column>
				<el-table-column prop="compensateCouponAmount" label="补券" min-width="80" class-name="red" header-align="center" align="center"></el-table-column>
				<el-table-column prop="couponAmount" label="平台补贴" min-width="100" class-name="red" header-align="center" align="center"></el-table-column>
				<el-table-column prop="wxCharge" label="微信手续费" min-width="80" class-name="red" header-align="center" align="center"></el-table-column>
				<el-table-column prop="totalIncome" label="总收入" min-width="100" header-align="center" align="center"></el-table-column>
				<el-table-column prop="parkOrgIncome" label="停车场奖励" min-width="80" header-align="center" align="center"></el-table-column>
				<el-table-column prop="platformExpend" label="平台支出" min-width="100" header-align="center" align="center"></el-table-column>
				<el-table-column prop="platformLoss" label="平台盈亏" min-width="100" header-align="center" align="center"></el-table-column>
			</el-table>
			
			<!-- *********************分页部分******************** -->
			<el-pagination :current-page="transactionData.pageNo" @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total" class="r" style="margin-top:20px;"></el-pagination>
		</el-row>
	</section>
</template>

<script>
 	import { mapGetters,mapActions } from 'vuex'
	import util from '../../common/js/util'
	import localData from '../../common/js/localData'
	import type from '../../common/js/type'
	import { transaction,transactionOutput } from '../../api/api'
	import qs from 'qs'
	import NProgress from 'nprogress'

	export default {
		data() {
			return {
				loading: true,
				total: null,
				tableData: [],
				transactionData : {
					pageNo: null,
					// beginTime: null,endTime: null,telphone: '',useWay: '' ,payState: null,orgName: '',oderNo: ''
				},
				statistics: {
		            "appointmentAll": 0,            //预约费汇总
		            "hangAccountsAll": 0,           //挂账汇总
		            "parkIncomeAll": 0,             //停车费汇总
		            "parkOrgIncomeAll": 0,          //停车场收入汇总
		            "platformExpendAll": 0,         //平台支出汇总
		            "platformLossAll": 0,    		//平台盈亏汇总
		            "subsidyAll": 0,    			//补贴汇总
		            "totalIncomeAll": 0,           	//总收入汇总
		            "wxChargeAll": 0                //微信手续费汇总
		        },
				payStates: [],
				states: [],
				defaultTime: [],
				useWays: []
			}
		},
		computed: {
			exportXlsLink () {
				return transactionOutput(this.transactionData)
			},
            ...mapGetters([
				'getBtnPower',
				'getTid'
            ])
        },
		created() {
			this.payStates = localData.payStates
			this.useWays = localData.useWays
			this.$store.state.btnPower = JSON.parse(localStorage.getItem('btnPower'))
			this.transactionData = JSON.parse(localStorage.getItem('invData')) || this.transactionData
			localStorage.removeItem('invData')
		},
		mounted() {
			this.handleCurrentChange()
		},
		methods: {
			...mapActions([
				'passBtnPower',
				'passTid'
			]),
			transaction(){   //获取列表
				let transactionData = {};
				for(let i in this.transactionData){
					transactionData[i] = this.transactionData[i]
				}
				transactionData.beginTime = Date.parse(this.defaultTime[0])/1000 || null
				transactionData.endTime = Date.parse(this.defaultTime[1])/1000 || null
				transaction(transactionData).then( data => {
					if( data.code == 200){
						this.loading = false;
						this.total = data.rs.pager.count
						let tableData = data.rs.pager.pageList
						for(let i=0; i< tableData.length; i++){
							tableData[i].createTime = util.formatDate.format(new Date(tableData[i].createTime * 1000),'yyyy-MM-dd hh:mm:ss')
							tableData[i].appointMoney = tableData[i].appointmentMoney + ( tableData[i].delayMoney ?'+' + tableData[i].delayMoney + '(延)' : '') + (tableData[i].thankFee ? '+' + tableData[i].thankFee + '(急)' : '')
							tableData[i].couponAmount = ( tableData[i].appointCouponAmount ? '-' + tableData[i].appointCouponAmount + '(预约)' : '') + (tableData[i].parkCouponAmount ? ( tableData[i].appointCouponAmount ? '+ -' : '-') + tableData[i].parkCouponAmount + '(停车)' : '')
							tableData[i].wxCharge = tableData[i].wxCharge ? '-' + tableData[i].wxCharge : ''
						}
						this.tableData = tableData
						this.statistics = data.rs.statistics
					}
				})
			},
			isType(state) {    //状态颜色参数
				switch(state){
					case 0: return 'warning' ; case 1: return 'gray' ; case 2: return 'primary' ; case 3: return 'success' ;
				}
			},
			stateText(state) {
				for(var i = 0;i < this.payStates.length; i++){
					if(state == this.payStates[i].value) return this.payStates[i].text;
				}
			},
			handleCurrentChange(val) {  //分页 
				this.transactionData.pageNo = val || this.transactionData.pageNo || 1
				this.transaction()
			},
			resetInput() {   //清空筛选搜索框
				Object.keys(this.transactionData).forEach((key) => {
					this.transactionData[key] = null
					this.defaultTime = []
				})
				this.handleCurrentChange()
			},
			toDetail ($row) { //前往详情 
				localStorage.setItem('invData', JSON.stringify(this.transactionData))
				this.$router.push({name:"orderDetail",params:{orderNo:$row.oderNo}})
			},
			stop(e){   //取消默认事件
				window.event? window.event.cancelBubble = true : e.stopPropagation()
			}
		}
	}

</script>

<style scoped lang="scss">
	.totalTable{
		text-align: center;
		line-height: 2;
		border-left: 1px solid #dfe6ec;
		border-top: 1px solid #dfe6ec;
		tr{
		}
		th{
			font-weight: bold;
			background: #eef1f6;
		}
		td,th{
			padding: 0 10px;
			border-right: 1px solid #dfe6ec;
			border-bottom: 1px solid #dfe6ec;
		}
	}
</style>