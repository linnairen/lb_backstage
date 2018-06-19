<template>
	<section>
		<!--****************顶部***********新建************-->
		<el-row :span="24"  class="clearfix b">
			<h1 class="l">车主管理</h1>
			<!--<el-button class="r" style="margin: 10px 20px 0 0;"  type="primary" icon="edit" @click="$router.push('/Neworder')"  v-if="$store.state.btnPower.LOAN_APPLY_SAVE_OR_UPDATE">新建订单</el-button>-->
			<a :href="exportXlsLink" style="padding: 6px 10px;background: #1786d7;color: #fff;font-size: 14px;float: right;border-radius: 5px;margin: 10px  10px 0 0;">导出</a>
		</el-row>
		<!-- *************筛选功能******************* -->
		<el-row>
			<el-form style="width:100%; padding-top:20px;">
				<div class="clearfix">
					<!-- 车主编号 -->
					<el-form-item label="车主编号" label-width="120px" style="width:32%;" class="l">
						<el-input placeholder="车主编号" suffix-icon="edit" style="width:220px;" v-model="carOwnerData.userId" onkeypress="return event.keyCode>=48&&event.keyCode<=57" ng-pattern="/[^a-zA-Z]|[^\u4E00-\u9FA5]/"  @keyup.enter.native="handleCurrentChange()"></el-input> 
					</el-form-item>
					<!-- 车主名称 -->
					<el-form-item label="车主名称" clearable label-width="120px" style="width:28%;" class="l">
						<el-input placeholder="车主名称" suffix-icon="edit" style="width:180px;" v-model="carOwnerData.realName"  @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
					</el-form-item>
					<!-- 车主手机 -->
					<el-form-item label="车主手机" clearable label-width="120px" style="width:28%;" class="l">
						<el-input placeholder="车主手机" suffix-icon="edit" style="width:180px;" v-model="carOwnerData.telphone"  @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
					</el-form-item>
					<!--搜索按钮-->
					<el-form-item  style="width: 5%; padding: 0 2%" class="r">
						<el-button type="primary" @click="handleCurrentChange()">搜索</el-button>
					</el-form-item>
				</div>
				<div class="clearfix">
					<!--注册时间-->
					<el-form-item label="注册时间" label-width="120px" style="width: 32% ;height:39px" class="l">
					 	<el-date-picker v-model="defaultTime"  type="datetimerange"  range-separator=" - " style="width:320px;" start-placeholder="开始时间"  end-placeholder="结束时间"  placeholder="开始时间-结束时间"  class="l"></el-date-picker>
					</el-form-item>
					<!--认证时间-->
					<!-- <el-form-item label="认证时间" label-width="120px" style="width: 32% ;height:39px" class="l">
					 	<el-date-picker v-model="defaultTime"  type="datetimerange"  range-separator=" - " style="width:350px;" start-placeholder="开始时间"  end-placeholder="结束时间"  placeholder="开始时间-结束时间"  class="l"></el-date-picker>
					</el-form-item> -->
					<!--使用状态-->
					<el-form-item label="使用状态" clearable label-width="120px" style="width:28%;" class="l">
					   	<el-select v-model="carOwnerData.state" placeholder="使用状态" style="width:180px;">
							<el-option v-for="state in useState" :key="state.value" :label="state.text" :value="state.value"></el-option>
						</el-select>
					</el-form-item>
					<!--重置按钮-->
					<el-form-item  style="width:5%; padding: 0 2%" class="r">
						<el-button :plain="true" @click="resetInput">重置</el-button>
					</el-form-item>	
				</div>
			</el-form>
		</el-row>
		
		<el-row>
			<div style="text-align: right">
				全平台实时数据：车主总量：<span style="color: #ff9938;font-weight: bold;">{{ totalData.userCount }}</span> 个 
				车主支出总额：<span style="color: #ff9938;font-weight: bold;">{{totalData.expendAmount}}</span> 元 
				停用中：<span style="color: #ff9938;font-weight: bold;">{{totalData.stopNum}}</span> 个 
				启用中：<span style="color: #ff9938;font-weight: bold;">{{totalData.startNum}}</span> 个 
				<el-button type="primary" @click="getStatCarUser" style="padding: 5px;margin-left: 20px;">刷新</el-button>
			</div>
		</el-row>
		<!-- ****************************列表显示**************************** -->
		<el-row>
			<el-table v-loading="loading"  element-loading-text="拼命加载中" :data="tableData" border style="width: 100%" @row-dblclick='toDetail'  max-height="600" highlight-current-row>
    			<!-- <el-table-column type="index" label="序号" width="65" header-align="center" align="center"></el-table-column> -->
				<el-table-column prop="userId" label="车主编号" min-width="70" header-align="center" align="center"></el-table-column>
				<el-table-column prop="nickName" label="车主昵称" min-width="70" header-align="center" align="center"></el-table-column>
				<el-table-column prop="telphone" label="车主手机" min-width="100" header-align="center" align="center"></el-table-column>
				<el-table-column prop="realName" label="真实姓名" min-width="70" header-align="center" align="center"></el-table-column>
				<el-table-column prop="cardNo" label="身份证" min-width="70" header-align="center" align="center"></el-table-column>
				<el-table-column prop="plateNo" label="车牌号（默认）" min-width="90" header-align="center" align="center"></el-table-column>
				<el-table-column prop="sendOderAll" label="发单总量" min-width="70" header-align="center" align="center"></el-table-column>
				<el-table-column prop="effectOderAll" label="有效单总量" min-width="90" header-align="center" align="center"></el-table-column>
				<el-table-column prop="rate" label="成单率" min-width="70" header-align="center" align="center"></el-table-column>
				<el-table-column prop="payRmount" label="支出总额" min-width="70" header-align="center" align="center"></el-table-column>
				<el-table-column prop="useCouponAmount" label="使用抵扣券" min-width="90" header-align="center" align="center"></el-table-column>
				<el-table-column prop="createTime" label="注册时间" min-width="70" header-align="center" align="center"></el-table-column>
				<!-- <el-table-column prop="remainingMoney" label="认证时间" min-width="100" header-align="center" align="center"></el-table-column> -->
				<el-table-column prop="state" label="使用状态" width="70" header-align="center" align="center">
					<template slot-scope="scope">
						<el-tag :type="isType(scope.row.state)" close-transition>{{ stateText(scope.row.state) }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column  label="操作" width="120"  header-align="center" align="center" fixed="right" filter-placement="bottom-end">
      				<template slot-scope="scope">
        				<el-button type="text" size="small" @click="showToastFun(scope.row)">{{ scope.row.state == 1 ? '停用' : '启用' }}</el-button>
      					<el-button type="text" size="small" @click="toDetail(scope.row)">查看</el-button>
      					<el-button type="text" size="small" @click="toDetail(scope.row)">编辑</el-button>
			      	</template>
			    </el-table-column>
			</el-table>
			
			<!-- <a :href="exportXlsLink">1111111111111111111111111111111111111</a> -->
			<!-- *********************分页部分******************** -->
			<el-pagination :current-page="carOwnerData.pageNo" @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total" class="r" style="margin-top:20px;"></el-pagination>
		</el-row>
		<!-- 弹窗 -->
		<el-dialog :title="itemData.state == 1 ? '确认停用？' : '确认启用？' " :visible.sync="showToast">
			<div class="form_box">
				<ul>
					<li><b>车主编号：</b><span>{{itemData.userId}}</span></li>
					<li><b>车主昵称：</b><span>{{itemData.nickName}}</span></li>
					<li><b>车主手机：</b><span>{{itemData.telphone}}</span></li>
					<li><b>车牌号：</b><span>{{itemData.plateNo}}</span></li>
					<li><b>注册时间：</b><span>{{itemData.createTime}}</span></li>
				</ul>
			</div>
			<div slot="footer" class="dialog-footer">
			    <el-button @click="clearToast">取 消</el-button>
			    <el-button type="primary" @click="toastComfirm">确 定</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
 	import { mapGetters,mapActions } from 'vuex'
	import util from '../../common/js/util'
	import localData from '../../common/js/localData'
	import { findCarOwnerList,getPlatformData,lockUser,startUser,getStatCarUser,carOwnerOutput } from '../../api/api'

	export default {
		data() {
			return {
				loading: true,
				total: null,
				tableData: [],
				carOwnerData : {
					pageNo: null
				},
				totalData: {},
				useState: [
					{ value: 1, text: '启用' },
					{ value: 3, text: '停用' }
				],
				states: [],
				defaultTime: [],
				totalLoading: false,
				showToast: false,
				itemData: {}
			}
		},
		computed: {
			exportXlsLink () {
				return carOwnerOutput(this.carOwnerData)
			},
            ...mapGetters([
				'getBtnPower',
				'getTid'
            ])
        },
		created() {
			this.$store.state.btnPower = JSON.parse(localStorage.getItem('btnPower'))
			this.carOwnerData = JSON.parse(localStorage.getItem('invData')) || this.carOwnerData
			localStorage.removeItem('invData')
		},
		mounted() {
			this.handleCurrentChange()
			this.getStatCarUser()
		},
		methods: {
			...mapActions([
				'passBtnPower',
				'passTid'
			]),
			findCarOwnerList(){   //获取订单列表
				let carOwnerData = {};
				for(let i in this.carOwnerData){
					carOwnerData[i] = this.carOwnerData[i]
				}
				if(this.defaultTime.length != 0){
					carOwnerData.beginTime = Date.parse(this.defaultTime[0])/1000 || null
					carOwnerData.endTime = Date.parse(this.defaultTime[1])/1000 || null
				}
				
				findCarOwnerList(carOwnerData).then( data => {
					if( data.code == 200){
						this.loading = false
						this.total = data.rs.count
						let tableData = data.rs.pageList
						for(let i=0; i< tableData.length; i++){
							tableData[i].createTime = util.formatDate.format(new Date(tableData[i].createTime * 1000),'yyyy-MM-dd hh:mm:ss')
							tableData[i].rate = (tableData[i].sendOderAll != 0 ? ((tableData[i].effectOderAll || 0) * 100 / tableData[i].sendOderAll).toFixed(2) : 0) + '%'
						}
						this.tableData = tableData
					}
				})
			},
			getStatCarUser () { //统计数据
				this.totalLoading = true
				getStatCarUser().then(res => {
					this.totalLoading = false
					if(res.code == 200){
						this.totalData = res.rs
					}
				})
			},
			clearToast () {
				this.showToast = false
				this.itemData = {}
			},
			showToastFun (data) { //显示弹窗
				this.showToast = true
				this.itemData = data
			},
			toastComfirm () {
				if(this.itemData.state == 1){
					this.lockUser()
				}
				else if(this.itemData.state == 3){
					this.startUser()
				}
			},
			startUser () { //启用用户
				startUser({
					userId: this.itemData.userId
				}).then(res => {
					if(res.code == 200){
						this.$message({
			            	type: 'success',
			            	message: '启用成功!'
			          	})
						this.handleCurrentChange()
						this.clearToast()
						this.getStatCarUser()
					}
				})
			},
			lockUser () { //停用用户
				lockUser({
					userId: this.itemData.userId
				}).then(res => {
					if(res.code == 200){
						this.$message({
			            	type: 'success',
			            	message: '停用成功!'
			          	})
						this.handleCurrentChange()
						this.clearToast()
						this.getStatCarUser()
					}
				})
			},
			stateText(state) { //状态文本
				for(var i = 0;i < this.useState.length; i++){
					if(state == this.useState[i].value) return this.useState[i].text
				}
			},
			handleCurrentChange(val) {  //分页 
				this.carOwnerData.pageNo = val || this.carOwnerData.pageNo || 1
				this.findCarOwnerList()
			},
			resetInput() {   //清空筛选搜索框
				Object.keys(this.carOwnerData).forEach((key) => {
					this.carOwnerData[key] = null
					this.defaultTime = []
				})
				this.handleCurrentChange()
			},
			isType(state) {    //状态颜色参数
				switch(state){
					case 0: return 'warning' ; case 1: return 'gray' ; case 2: return 'primary' ; case 3: return 'success' ;
				}
			},
			toDetail ($row) { //前往详情
				localStorage.setItem('invData', JSON.stringify(this.carOwnerData));
				this.$router.push({name:"carOwnerDetail",params:{userId:$row.userId}})
			}
		}
	}

</script>

<style scoped lang="scss">

</style>