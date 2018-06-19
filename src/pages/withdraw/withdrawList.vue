<template>
	<section>
		<!--****************顶部***********新建************-->
		<el-row :span="24"  class="clearfix b">
			<h1 class="l">提现列表</h1>
			<!--<el-button class="r" style="margin: 10px 20px 0 0;"  type="primary" suffix-icon="edit" @click="$router.push('/Neworder')"  v-if="$store.state.btnPower.LOAN_APPLY_SAVE_OR_UPDATE">新建订单</el-button>-->
		</el-row>
		<!-- *************筛选功能******************* -->
		<el-row>
			<el-form style="width:100%; padding-top:20px;">
				<div class="clearfix">
					<!-- 提现编号 -->
					<el-form-item label="提现编号" label-width="120px" style="width:22%;" class="l">
						<el-input placeholder="提现编号" suffix-icon="edit" style="width: 190px;" v-model="cashData.oderNo" @keyup.enter.native="handleCurrentChange()"></el-input> 
					</el-form-item>
					<!-- 认证类型 -->
					<el-form-item label="认证类型" label-width="120px" style="width: 32%" class="l">
					 	<el-select v-model="cashData.authType" placeholder="认证类型" style="width:150px;">
							<el-option v-for="authType in authTypes" :key="authType.value" :label="authType.text" :value="authType.value"></el-option>
						</el-select>
					</el-form-item>
					<!-- 停车场名称 -->
					<el-form-item label="停车场名称" clearable label-width="120px" style="width:28%;" class="l">
						<el-input placeholder="停车场名称" suffix-icon="edit" style="width:180px;" v-model="cashData.orgName"  @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
					</el-form-item>	
					<!--搜索按钮-->
					<el-form-item  style="width: 5%; padding: 0 2%" class="r">
						<el-button type="primary" @click="handleCurrentChange()">搜索</el-button>
					</el-form-item>
				</div>
				<div class="clearfix">
					<!-- 停车场手机号码 -->
					<el-form-item label="停车场手机号码" label-width="120px" style="width:22%;" class="l">
						<el-input placeholder="停车场手机号码" suffix-icon="edit" style="width: 190px;" v-model="cashData.mobile"
						onkeypress="return event.keyCode>=48&&event.keyCode<=57" ng-pattern="/[^a-zA-Z]|[^\u4E00-\u9FA5]/" :maxlength="11" @keyup.enter.native="handleCurrentChange()"></el-input>
					</el-form-item>
					<!--提现时间-->
					<el-form-item label="提现时间" label-width="120px" style="width: 32% ;height:39px" class="l">
					 	<el-date-picker v-model="defaultTime"  type="datetimerange"  range-separator=" - " style="width:320px;" start-placeholder="开始时间"  end-placeholder="结束时间"  placeholder="开始时间-结束时间"  class="l"></el-date-picker>
					</el-form-item>
					<!--提现状态-->
					<el-form-item label="提现状态" clearable label-width="120px" style="width:28%;" class="l">
					   	<el-select v-model="cashData.state" placeholder="提现状态" style="width:180px;">
							<el-option v-for="state in drawState" :key="state.value" :label="state.text" :value="state.value"></el-option>
						</el-select>
					</el-form-item>
					<!--重置按钮-->
					<el-form-item  style="width:5%; padding: 0 2%" class="r">
						<el-button :plain="true" @click="resetInput">重置</el-button>
					</el-form-item>	
				</div>
			</el-form>
		</el-row>

		<!-- ***************************数据统计*************************** -->
		<!-- <el-row>
			<div style="text-align: right; font-size: 18px;padding: 20px 0;">
				全平台实时数据：提现总额：{{ totalData.withdrawAll }} 元
				停车场提现：{{ totalData.company_withdraw }} 元
				保安提现：{{ totalData.person_withdraw }} 元
				手续费：{{ totalData.procedureChargeAll }} 元
				手工提现：{{ totalData.offWithdrawAll }} 元
				<el-button style="width: 100px;" type="primary" :loading="totalLoading" @click="getPlatformData">刷新</el-button>
			</div>
		</el-row> -->

		<!-- ****************************列表显示**************************** -->
		<el-row>
			<el-table v-loading="loading"  element-loading-text="拼命加载中" :data="tableData" border style="width: 100%" @row-dblclick='toDetail' highlight-current-row>
    			<!-- <el-table-column type="index" label="序号" width="65" header-align="center" align="center"></el-table-column> -->
				<el-table-column prop="oderNo" label="提现编号" min-width="100" header-align="center" align="center"></el-table-column>
				<el-table-column prop="orgName" label="停车场名称" min-width="125" header-align="center" align="center"></el-table-column>
				<el-table-column prop="realName" label="提现人姓名" min-width="90" header-align="center" align="center"></el-table-column>
				<el-table-column prop="telphone" label="提现人电话" min-width="90" header-align="center" align="center"></el-table-column>
				<el-table-column prop="authType" label="认证类型" width="80" header-align="center" align="center">
					<template slot-scope="scope">
						<el-tag :type="isType(scope.row.authType)" close-transition>{{dealText(scope.row.authType,authTypes)}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="amount" label="提现金额" min-width="90" header-align="center" align="center"></el-table-column>
				<el-table-column prop="remainingMoney" label="余额" min-width="90" header-align="center" align="center"></el-table-column>
				<el-table-column prop="procedureCharge" label="手续费用" min-width="90" header-align="center" align="center"></el-table-column>
    			<!-- <el-table-column prop="type" label="提现类型" width="150" header-align="center" align="center">
					<template slot-scope="scope">
						<el-tag :type="isType(scope.row.authType)" close-transition>{{authText(scope.row.authType)}}</el-tag>
					</template>
				</el-table-column> -->
				<el-table-column prop="createTime" label="提现时间" min-width="150" header-align="center" align="center"></el-table-column>
    			<el-table-column prop="state" label="提现状态" width="80" header-align="center" align="center">
					<template slot-scope="scope">
						<el-tag :type="isType(scope.row.state)" close-transition>{{dealText(scope.row.state,drawState)}}</el-tag>
					</template>
				</el-table-column>
    			<el-table-column prop="payChannel" label="提现通道" width="100" header-align="center" align="center">
					<template slot-scope="scope">
						<el-tag :type="isType(scope.row.payChannel)" close-transition>{{dealText(scope.row.payChannel,payChannels)}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="sysRemark" label="备注" min-width="100" header-align="center" align="center"></el-table-column>
				<el-table-column  label="操作" width="90"  header-align="center" align="center" fixed="right" filter-placement="bottom-end">
      				<template slot-scope="scope">
      					<el-button  v-if='scope.row.state == 1' type="text" size="small"  @click="toDetail(scope.row)">查看</el-button>
        				<el-button  v-if='scope.row.state == -1' type="text" size="small" @click="toDetail(scope.row)">手工提现</el-button>
			      	</template>
			    </el-table-column>
			</el-table>
			
			<!-- *********************分页部分******************** -->
			<el-pagination :current-page="cashData.pageNo" @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total" class="r" style="margin-top:20px;"></el-pagination>
		</el-row>
	</section>
</template>

<script>
 	import { mapGetters,mapActions } from 'vuex'
	import util from '../../common/js/util'
	import localData from '../../common/js/localData'
	import { userDrawCash,getPlatformData } from '../../api/api'

	export default {
		data() {
			return {
				loading: true,
				total: null,
				tableData: [],
				cashData : {
					pageNo: null,beginTime: null,endTime: null,mobile: '',realName: '' ,state: null,orgName: '',authType: null,oderNo: ''
				},
				totalData: {},
				payChannels: [],
				drawState: [],
				states: [],
				authTypes: [],
				defaultTime: [],
				totalLoading: false
			}
		},
		computed: {
            ...mapGetters([
				'getBtnPower',
				'getTid'
            ])
        },
		created() {	
			this.drawState = localData.drawState
			this.authTypes = localData.authType
			this.payChannels = localData.payChannels
			this.$store.state.btnPower = JSON.parse(localStorage.getItem('btnPower'))
			this.cashData = JSON.parse(localStorage.getItem('invData')) || this.cashData
			localStorage.removeItem('invData')
		},
		mounted() {
			this.handleCurrentChange()
			// this.getPlatformData()
		},
		methods: {
			...mapActions([
				'passBtnPower',
				'passTid'
			]),
			userDrawCash(){   //获取订单列表
				let cashData = {};
				for(let i in this.cashData){
					cashData[i] = this.cashData[i]
				}
				cashData.beginTime = Date.parse(this.defaultTime[0])/1000 || null
				cashData.endTime = Date.parse(this.defaultTime[1])/1000 || null
				userDrawCash(cashData).then( data => {
					if( data.code == 200){
						this.loading = false
						this.total = data.rs.count
						let tableData = data.rs.pageList
						for(let i=0; i< tableData.length; i++){
							tableData[i].createTime = util.formatDate.format(new Date(tableData[i].createTime * 1000),'yyyy-MM-dd hh:mm:ss')
						}
						this.tableData = tableData
					}
				})
			},
			// getPlatformData () { //统计数据
			// 	this.totalLoading = true
			// 	getPlatformData().then(res => {
			// 		this.totalLoading = false
			// 		if(res.code == 200){
			// 			this.totalData = res.rs
			// 		}
			// 	})
			// },
			isType(state) {    //状态颜色参数
				switch(state){
					case 0: return 'warning' ;
					case 1: return 'gray' ;	
					case 2: return 'primary' ;
					case 3: return 'success' ;
				}
			},
			dealText (value,list) { //文本处理器
				for(var i = 0;i < list.length; i++){
					if(value == list[i].value) return list[i].text
				}
			},
			handleCurrentChange(val) {  //分页 
				this.cashData.pageNo = val || this.cashData.pageNo || 1
				this.userDrawCash()
			},
			resetInput() {   //清空筛选搜索框
				Object.keys(this.cashData).forEach((key) => {
					this.cashData[key] = null
					this.defaultTime = []
				})
				this.handleCurrentChange()
			},
			toDetail ($row) { //前往详情
				localStorage.setItem('invData', JSON.stringify(this.cashData))
				this.$router.push({name:"withdrawDetail",params:{orderNo:$row.oderNo}})
			}
		}
	}

</script>

<style scoped lang="scss">

</style>