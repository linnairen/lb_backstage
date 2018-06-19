<template>
	<section>
		<!--****************顶部***********新建************-->
		<div class="list-title">
			<h1>订单列表</h1>
			<div class="list-title-right">
				<a :href="exportXlsLink" class="export"><i class="el-icon-download"></i>导出</a>
			</div>
		</div>
		<!-- *************筛选功能******************* -->
		<el-row>
			<el-form style="width:100%; padding-top:20px;">
				<div class="clearfix">
					<!-- 已开通城市 -->
					<el-form-item label="已开通城市" label-width="120px" style="width:22%" class="l">
					 	<el-select v-model="orderData.cityName" placeholder="已开通城市" style="width:170px;">
							<el-option v-for="cityName in cityList" :key="cityName.value" :label="cityName.text" :value="cityName.value"></el-option>
						</el-select>
					</el-form-item>
					<!-- 订单编号输入框 -->
					<el-form-item label="订单编号" label-width="120px" style="width: 40%;" class="l">
						<el-input placeholder="订单编号" suffix-icon="el-icon-edit" style="width: 200px;" v-model="orderData.oderNo" ng-pattern="/[^a-zA-Z]|[^\u4E00-\u9FA5]/"  @keyup.enter.native="handleCurrentChange()"></el-input> 
					</el-form-item>
					<!-- 手机号码输入框 -->
					<el-form-item label="手机号码" label-width="120px" style="width:22%;" class="l">
						<el-input placeholder="手机号码" suffix-icon="el-icon-edit" style="width:170px;" v-model="orderData.mobile" @change="monitorTheNumber"
						onkeypress="return event.keyCode>=48&&event.keyCode<=57" ng-pattern="/[^a-zA-Z]|[^\u4E00-\u9FA5]/" :maxlength="11" @keyup.enter.native="handleCurrentChange()"></el-input>
					</el-form-item>
					<!--搜索按钮-->
					<el-form-item  style="width: 5%; padding: 0 2%" class="r">
						<el-button type="primary" @click="handleCurrentChange()">搜索</el-button>
					</el-form-item>
				</div>
				<div class="clearfix">
					<!-- 停车场名称 -->
					<el-form-item label="停车场名称" clearable label-width="120px" style="width:22%;" class="l">
						<el-input placeholder="接单停车场名称" suffix-icon="el-icon-edit" style="width:170px;" v-model="orderData.orgName"  @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
					</el-form-item>
					<!--支付时间-->
					<el-form-item label="支付时间" label-width="120px" style="width: 40% ;height:39px" class="l">
					 	<el-date-picker v-model="defaultTime"  type="datetimerange"  range-separator=" - " style="width:370px;" start-placeholder="开始时间"  end-placeholder="结束时间"  placeholder="开始时间-结束时间"  class="l"></el-date-picker>
					</el-form-item>	
					<!-- 订单状态 -->
					<el-form-item label="订单状态" label-width="120px" style="width:22%" class="l">
					 	<el-select v-model="orderData.state" placeholder="订单状态" style="width:170px;">
							<el-option v-for="state in orderState" :key="state.value" :label="state.text" :value="state.value"></el-option>
						</el-select>
					</el-form-item>
					<!--重置按钮-->
					<el-form-item  style="width:5%; padding: 0 2%" class="r">
						<el-button :plain="true" @click="resetInput">重置</el-button>
					</el-form-item>	
				</div>
				<div class="clearfix">
					<!-- 平台补贴 -->
					<el-form-item label="平台补贴" label-width="120px" style="width:22%" class="l">
					 	<el-select v-model="orderData.couponType" placeholder="平台补贴" style="width:170px;">
							<el-option v-for="couponType in couponTypes" :key="couponType.value" :label="couponType.text" :value="couponType.value"></el-option>
						</el-select>
					</el-form-item>
					<!-- 是否补券 -->
					<el-form-item label="是否补券" label-width="120px" style="width: 40%" class="l">
					 	<el-select v-model="orderData.ifCompensateCounpon" placeholder="是否补券" style="width: 200px;">
							<el-option v-for="ifCompensateCounpon in ifCompensateCounpons" :key="ifCompensateCounpon.value" :label="ifCompensateCounpon.text" :value="ifCompensateCounpon.value"></el-option>
						</el-select>
					</el-form-item>
					<!-- 是否退费 -->
					<el-form-item label="是否退费" label-width="120px" style="width:22%" class="l">
					 	<el-select v-model="orderData.ifRefundAmount" placeholder="是否退费" style="width:170px;">
							<el-option v-for="ifRefundAmount in ifRefundAmounts" :key="ifRefundAmount.value" :label="ifRefundAmount.text" :value="ifRefundAmount.value"></el-option>
						</el-select>
					</el-form-item>
				</div>
			</el-form>
		</el-row>

		<el-row>
			<div class="total-box">
				<p class="fp">全平台实时数据：</p>
				<p class="fp">总单量：<span class="fs">{{ totalData.allOrderNum }}单</span></p>
				<p class="fp">进行中：<span class="fs">{{totalData.orderingNum}}单</span></p>
				<p class="fp">已完成：<span class="fs">{{totalData.finishOrderNum }}单</span></p>
				<p class="fp">维权中：<span class="fs">{{totalData.appealOrderNum }}单</span></p>
				<p class="fp">已退费：<span class="fs">{{totalData.refundOrderNum }}单</span></p>
				<p class="fp">已补券：<span class="fs">{{totalData.compensateOrderNum }}单</span></p>
				<el-button type="primary" @click="getStatParkOrder" icon="el-icon-refresh" style="padding: 5px;margin-left: 20px;">刷新</el-button>
			</div>
		</el-row>
		<!-- ****************************列表显示**************************** -->
		<el-row>
			<el-table v-loading="loading"  element-loading-text="拼命加载中" :data="tableData" border style="width: 100%;font-size: 12px; overflow:auto;" @row-dblclick='toOrderDetail' highlight-current-row>
    			<!-- <el-table-column type="index" label="序号" width="65" header-align="center" align="center"></el-table-column> -->
				<el-table-column prop="oderNo" label="订单编号" min-width="180" header-align="center" align="center"></el-table-column>
				<el-table-column prop="userName" label="发单人姓名" min-width="100" header-align="center" align="center"></el-table-column>
				<el-table-column prop="mobile" label="手机号码" min-width="100" header-align="center" align="center"></el-table-column>
				<el-table-column prop="plateNumber" label="车牌号码" min-width="90" header-align="center" align="center"></el-table-column>
				<el-table-column prop="parkingName" label="停车场名称" min-width="180" header-align="center" align="center"></el-table-column>
				<el-table-column prop="grabUserName" label="接单人" min-width="120" header-align="center" align="center"></el-table-column>
				<el-table-column label="停车时间" width="260" header-align="center" align="center">
					<template slot-scope="scope">
						<div>{{changeTime(scope.row.parkStartTime)}}至{{changeTime(scope.row.parkEndTime)}}</div>
					</template>
				</el-table-column>
				<el-table-column label="时长" min-width="70" header-align="center" align="center">
					<template slot-scope="scope">
						<div>{{ dealTime(scope.row.parkEndTime - scope.row.parkStartTime) }}</div>
					</template>
				</el-table-column>
				<el-table-column label="支付时间" min-width="130" header-align="center" align="center">
					<template slot-scope="scope">
						<div>{{changeTime(scope.row.payTime)}}</div>
					</template>
				</el-table-column>
    			<!-- <el-table-column prop="lifeCycle" label="生命周期" width="120" header-align="center" align="center">
					<template slot-scope="scope">
						<el-tag :type="isType(scope.row.lifeCycle)" close-transition>{{lifeCycleText(scope.row.lifeCycle)}}</el-tag>
					</template>
				</el-table-column> -->
    			<el-table-column prop="state" label="订单状态" width="90" header-align="center" align="center">
					<template slot-scope="scope">
						<el-tag :type="isType(scope.row.state)" close-transition>{{stateText(scope.row.state)}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="收费标准" min-width="70" header-align="center" align="center">
					<template slot-scope="scope">
						<div>{{scope.row.parkFeeHourly}}元/小时</div>
					</template>
				</el-table-column>
				<el-table-column prop="parkAmount" label="订单费用" min-width="70" header-align="center" align="center"></el-table-column>
				<el-table-column prop="realPayAmount" label="平台收入(实际支付)" min-width="120" header-align="center" align="center"></el-table-column>
				<el-table-column label="优惠券" min-width="90" header-align="center" align="center">
					<template slot-scope="scope">
						<div style="color: red;">{{ scope.row.parkCouponAmount ? ((-scope.row.parkCouponAmount).toFixed(2) + '(停车)') : '' }}</div>
					</template>
				</el-table-column>
				<el-table-column label="折扣" min-width="90" header-align="center" align="center">
					<template slot-scope="scope">
						<div style="color: red;">{{ scope.row.discountAmount ? ((- scope.row.discountAmount).toFixed(2) + '(' + (scope.row.discount * 10) + '折)') : '' }}</div>
					</template>
				</el-table-column>
				<el-table-column prop="refundAmount" label="退费" min-width="80" header-align="center" align="center"></el-table-column>
				<el-table-column prop="compensateCouponAmount" label="补券" min-width="80" header-align="center" align="center"></el-table-column>
				<el-table-column  label="操作" width="120"  header-align="center" align="center" fixed="right" filter-placement="bottom-end">
      				<template slot-scope="scope">
      					<!-- <el-button v-if='scope.row.state == 1' type="text" size="small"  @click="showToastFun('cancel',scope.row)">取消</el-button> -->
        				<el-button type="text" size="small" v-if="!scope.row.compensateCouponAmount" @click="showToastFun('backCoupon',scope.row)">补券</el-button>
        				<el-button type="text" size="small" v-if="!scope.row.refundAmount" @click="showToastFun('backMoney',scope.row)">退费</el-button>
      					<!-- <el-button type="text" size="small" @click="toOrderDetail(scope.row)">查看</el-button> -->
			      	</template>
			    </el-table-column>
			</el-table>
			
			<!-- *********************分页部分******************** -->
			<el-pagination :current-page="orderData.pageNo" @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total" class="r" style="margin-top:20px;"></el-pagination>
		</el-row>
		<!-- 弹窗 -->
		<el-dialog :title="toastType == 'backMoney' ? '确认退费？' : (toastType == 'backCoupon' ? '确认补发优惠券？' : '确认取消订单？') " :visible.sync="showToast">
			<div class="form_box">
				<ul>
					<li><b>订单编号：</b><span>{{itemData.oderNo}}</span></li>
					<li><b>车牌号：</b><span>{{itemData.plateNumber}}</span></li>
					<li v-if="itemData.parkingName"><b>停车场名称：</b><span>{{itemData.parkingName}}</span></li>
					<li><b>停车时间：</b><span>{{changeTime(itemData.parkStartTime)}}至{{changeTime(itemData.parkEndTime)}}</span></li>
					<li><b>订单费用：</b><span>{{itemData.parkAmount}}</span></li>
					<li v-if="itemData.couponAmount"><b>平台补贴：</b><span>{{ itemData.parkCouponAmount || itemData.discountAmount || 0 }}</span></li>
					<li><b>平台收入：</b><span>{{ itemData.realPayAmount }}</span></li>
					<li v-if="toastType == 'backMoney'">
						<b>退费：</b>
						<el-input placeholder="退费金额" suffix-icon="el-icon-edit" style="width:150px;" v-model="backMoney"></el-input></li>
					<li v-if="toastType == 'backCoupon'">
						<b>补券类型：</b>
						<el-select v-model="backCoupon" placeholder="选择补券类型" style="width:170px;">
							<el-option v-for="(item,key) in couponList" :key="key" :label="item.couponTitle + ' ' + item.couponPrice +'元'" :value="item.tid" :title="item.couponDesc"></el-option>
						</el-select>
					</li>
					<li>
						<b>说明：</b><textarea v-model="content" cols="30" rows="5"></textarea>
					</li>
				</ul>
			</div>
			<div slot="footer" class="dialog-footer">
			    <el-button @click="clearToast">取 消</el-button>
			    <el-button type="primary" @click="toastComfirm" v-loading.fullscreen.lock="fullscreenLoading">确 定</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
 	import { mapGetters,mapActions } from 'vuex'
	import util from '../../common/js/util'
	import localData from '../../common/js/localData'
	import type from '../../common/js/type'
	import { getCityList,parkOrderList,refundAmount,getPayState,cancelOrder,sendCompensateCoupon,getCouponList,getStatParkOrder,parkOrderOutput } from '../../api/api'

	export default {
		data() {
			return {
				msg: false,
				loading: true,
				total: null,
				intoSource: [],
				tableData: [],
				typeList: [],
				orderData : {
					pageNo: null,
					// beginTime: null,endTime: null,mobile: '',applyMobile: '' ,state: null
				},
				orderState: [],
				states: [],
				lifeCycles: [],
				couponTypes: [{ text: '全部', value: 0 },{ text: '停车场折扣', value: 1 },{ text: '优惠券', value: 2 }],
				cityList: [],
				ifRefundAmounts: [{ text: '未退费', value: 0 },{ text: '已退费', value: 1 }],
				ifCompensateCounpons: [{ text: '未补偿', value: 0 },{ text: '已补偿', value: 1 }],
				defaultTime: [],
				mm: false,
				submited: false,
				showToast: false,
				toastType: '',
				itemData: {},
				couponList: [],
				backMoney: '',
				backCoupon: null,
				fullscreenLoading: false,
				totalData: {},
				content: ''
			}
		},
		computed: {
			exportXlsLink () {
				return parkOrderOutput(this.orderData)
			},
            ...mapGetters([
				'getBtnPower',
				'getTid'
            ])
        },
		created() {
			this.options = localData.options
			this.lifeCycles = localData.lifeCycle
			this.orderState = localData.orderState
			this.$store.state.btnPower = JSON.parse(localStorage.getItem('btnPower'))
			this.orderData = JSON.parse(localStorage.getItem('invData')) || this.orderData
			localStorage.removeItem('invData')
		},
		mounted() {
			this.handleCurrentChange()
			this.getCityList()
			this.getCouponList()
			this.getStatParkOrder()
		},
		methods: {
			...mapActions([
				'passBtnPower',
				'passTid'
			]),
			parkOrderList(){   //获取订单列表
				let orderData = {};
				for(let i in this.orderData){
					orderData[i] = this.orderData[i]
				}
				orderData.payBeginTime = Date.parse(this.defaultTime[0])/1000 || null
				orderData.payEndTime = Date.parse(this.defaultTime[1])/1000 || null
				parkOrderList(orderData).then( data => {
					if( data.code == 200){
						this.loading = false
						this.total = data.rs.count
						this.tableData = data.rs.pageList
					}
				})
			},
			getStatParkOrder () { //全平台数据
				getStatParkOrder().then(res => {
					if(res.code == 200){
						this.totalData = res.rs
					}
				})
			},
			changeTime (time) { //转换时间格式
				return time ? util.formatDate.format(new Date(time * 1000),'yyyy-MM-dd hh:mm:ss') : ''
			},
			dealTime (time) { //转换时间格式
				let hour = time ? ~~(time / 3600) : 0,
					minite = time ? ~~(time % 3600 / 60) : 0,
					second = time ? ~~(time % 60) : 0
				return ((hour + '').length == 1 ? '0' : '') + hour + ':' + ((minite + '').length == 1 ? '0' : '') + minite + ':' + ((second + '').length == 1 ? '0' : '') + second
			},
			getCityList () { //城市列表
				getCityList({
					type: 2
				}).then(res => {
					if(res.code == 200){
						for(let i = 0; i < res.rs.length; i ++){
							this.cityList.push({
								value: res.rs[i].name,
								text: res.rs[i].name
							})
						}
					}
				})
			},
			getCouponList () { //获取优惠券列表
				getCouponList ().then(res => {
					if(res.code == 200){
						res.rs.forEach(item =>{
							this.couponList.push(item)
						})
					}
				})
			},
			cancelOrder () { //取消订单
				cancelOrder ({
					orderNo: this.itemData.oderNo
				}).then(res => {
					if(res.code == 200){
						this.$message({
			            	type: 'success',
			            	message: '取消成功!'
			          	})
						this.parkOrderList()
						this.clearToast()
					}
				})
			},
			sendCompensateCoupon () { // 补券
				if(!this.backCoupon){
					this.$message({
		            	type: 'error',
		            	message: '请选择补券类型!'
		          	})
		          	return
				}
				sendCompensateCoupon ({
					orderNo: this.itemData.oderNo,
					couponId: this.backCoupon,
					content: this.content
				}).then(res => {
					if(res.code == 200){
						this.$message({
			            	type: 'success',
			            	message: '补券成功!'
			          	})
						this.parkOrderList()
						this.clearToast()
					}
				})
			},
			refundAmount () { // 退费
				if(this.backMoney == 0 || this.backMoney.match(/^\s*$/)){
					this.$message({
		            	type: 'error',
		            	message: '请输入退费金额!'
		          	})
		          	return
				}
				this.showToast = false
				this.fullscreenLoading = true
				refundAmount ({
					orderNo: this.itemData.oderNo,
					refundAmount: this.backMoney,
					content: this.content
				}).then(res => {
					if(res.code == 200){
						var i = 0
						var key = setInterval(() => {
							if(i >= 8){ //响应超时
								clearInterval(key)
								this.fullscreenLoading = false
								this.showToast = true
								this.$message.error('响应超时，请稍候刷新查看')
							}
							this.getPayState(res.rs,() => { //退款成功
								clearInterval(key)
								this.fullscreenLoading = false
							}, () => { //退款失败
								clearInterval(key)
								this.showToast = true
							})
							i ++
						},1000)
					}
				})
			},
			getPayState (orderNo,success,error) { // 退费状态
				return getPayState ({
					refundOrderNo: orderNo
				}).then(res => {
					if(res.code == 200){
						if(res.rs.state == 1){
							this.$message({
				            	type: 'success',
				            	message: '退费成功!'
				          	})
							this.clearToast()
							this.parkOrderList()
							success()
						}
						else if(res.rs.state == -1){
							this.$message({
				            	type: 'error',
				            	message: '退费失败!'
				          	})
				          	error()
						}
					}
				})
			},
			clearToast () {
				this.toastType = null
				this.itemData = {}
				this.backMoney = ''
				this.content = ''
				this.backCoupon = ''
				this.showToast = false
			},
			showToastFun (type,data) { //显示弹窗
				this.toastType = type
				this.itemData = data
				this.showToast = true
			},
			monitorTheNumber() {   //验证手机号正则 
				if(this.orderData.mobile.length == 11){
					if (/^1[3-9][0-9]{9}$/.test(this.orderData.mobile)){ 
						return true;  
					} else {
						this.$message({type: 'warning',message: '手机号码有误'})
						return false
					}
				} else if(isNaN(this.orderData.mobile)){
					this.$message({type: 'error',message: '手机号码只能为数字'})
					this.orderData.mobile = null
					return false
				}
			},
			onAssign(tid,auditName) {//打开指派弹窗
				this.assign = true
				this.assignPersonnel = auditName || '暂无'
				this.assignData.tid = tid
			},
			toastComfirm () { //弹窗确认按钮
				if(this.toastType == 'backMoney'){
					this.refundAmount()
				}
				else if(this.toastType == 'backCoupon'){
					this.sendCompensateCoupon()
				}
				else{
					this.cancelOrder()
				}
			},
			handleCurrentChange(val) {  //分页 
				this.orderData.pageNo = val || this.orderData.pageNo || 1
				this.parkOrderList()
			},
			stateText(state) {
				for(var i = 0;i < this.orderState.length; i++){
					if(state == this.orderState[i].value) return this.orderState[i].text
				}
			},
			lifeCycleText(lifeCycle) {
				for(var i = 0;i < this.lifeCycles.length; i++){
					if(lifeCycle == this.lifeCycles[i].value) return this.lifeCycles[i].text
				}
			},
			resetInput() {   //清空筛选搜索框
				Object.keys(this.orderData).forEach((key) => {
					this.orderData[key] = null
					this.defaultTime = []
				})
				this.msg = null
				this.handleCurrentChange()
			},
			toOrderDetail($row){   //前往订单详情  需要权限
				localStorage.setItem('invData', JSON.stringify(this.orderData))
				this.$router.push({name:"orderDetail",params:{orderNo:$row.oderNo}})
			},
			isType(state) {    //状态颜色参数
				switch(state){
					case -4: return 'danger' ;case -3: return 'danger' ;case -2: return 'primary' ;case -1: return 'warning' ;
					case 0: return 'warning' ;case 1: return 'gray' ;case 2: return 'primary' ;case 3: return 'success' ;
					case 4: return 'danger' ;case 5: return 'gray' ;case 6: return 'success' ;case 7: return 'danger' ;
					case 8: return 'gray' ;case 9: return 'success' ;
				}
			}
		}
	}

</script>
<style lang="scss" scoped>
	.form_box{
		li{
			font-size: 16px;
			display: flex;
			margin-top: 10px;
			b{
				display: inline-block;
				width: 100px;
				flex: 0 0 auto;
			}
			textarea{
				border-radius: 4px;
				border-color: #bfcbd9;
				line-height: 1.5;
			}
		}
	}
</style>