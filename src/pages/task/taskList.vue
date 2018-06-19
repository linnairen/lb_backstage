<template>
	<section>
		<!--****************顶部***********新建************-->
		<el-row :span="24"  class="clearfix b">
			<h1 class="l">任务管理</h1>
			<el-button class="r" style="margin: 10px 20px 0 0;"  type="primary" @click="showMore">批量发奖</el-button>
		</el-row>
		<el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="时长任务" name="1" class="clearfix"></el-tab-pane>
            <el-tab-pane label="成单任务" name="2" class="clearfix"></el-tab-pane>
            <el-tab-pane label="推新任务" name="3" class="clearfix"></el-tab-pane>
        </el-tabs>
		<!-- *************筛选功能******************* -->
		<el-row>
			<el-form style="width:100%; padding-top:20px;">
				<div class="clearfix">
					<!-- 停车场编号 -->
<!-- 					<el-form-item label="停车场编号" label-width="120px" style="width:22%;" class="l">
						<el-input placeholder="停车场编号" suffix-icon="edit" style="width:220px;" v-model="taskData.oderNo"
						onkeypress="return event.keyCode>=48&&event.keyCode<=57" ng-pattern="/[^a-zA-Z]|[^\u4E00-\u9FA5]/"  
						 @keyup.enter.native="handleCurrentChange()"></el-input> 
					</el-form-item> -->
					<!-- 停车场名称 -->
					<el-form-item label="停车场名称" clearable label-width="120px" style="width:28%;" class="l">
						<el-input placeholder="停车场名称" suffix-icon="edit" style="width:180px;" v-model="taskData.orgName"  @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
					</el-form-item>	
					<!-- 保安手机 -->
					<el-form-item label="保安手机" label-width="120px" style="width: 28%" class="l">
					 	<el-input placeholder="保安手机" suffix-icon="edit" style="width:180px;" v-model="taskData.mobile"  @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
					</el-form-item>
					<!--搜索按钮-->
					<el-form-item  style="width: 5%; padding: 0 2%" class="r">
						<el-button type="primary" @click="handleCurrentChange()">搜索</el-button>
					</el-form-item>
				</div>
				<div class="clearfix">
					<!--任务时间-->
					<el-form-item label="任务时间" label-width="120px" style="width: 28% ;height:39px" class="l">
					 	<el-date-picker v-model="defaultTime"  type="date" style="width: 200px;" placeholder="任务时间"  class="l"></el-date-picker>
					</el-form-item>
					<!--任务状态-->
					<el-form-item label="任务状态" clearable label-width="120px" style="width:28%;" class="l">
					   	<el-select v-model="taskData.taskState" placeholder="任务状态" style="width:180px;">
							<el-option v-for="state in taskState" :key="state.value" :label="state.text" :value="state.value"></el-option>
						</el-select>
					</el-form-item>
					<!--奖励状态-->
					<el-form-item label="奖励状态" clearable label-width="120px" style="width:28%;" class="l">
					   	<el-select v-model="taskData.ifHavAward" placeholder="奖励状态" style="width:180px;">
							<el-option v-for="ifHavAward in ifHavAwards" :key="ifHavAward.value" :label="ifHavAward.text" :value="ifHavAward.value"></el-option>
						</el-select>
					</el-form-item>
					<!--重置按钮-->
					<el-form-item  style="width:5%; padding: 0 2%" class="r">
						<el-button :plain="true" @click="resetInput">重置</el-button>
					</el-form-item>	
				</div>
			</el-form>
		</el-row>

		<!-- ****************************列表显示**************************** -->
		<el-row>
			<el-table v-loading="loading"  element-loading-text="拼命加载中" ref="multipleTable" :data="tableData" border style="width: 100%;" @row-dblclick='toDetail' highlight-current-row @selection-change="handleSelectionChange">
    			<!-- <el-table-column type="index" label="序号" width="65" header-align="center" align="center"></el-table-column> -->
    			<el-table-column type="selection" width="50" header-align="center" align="center" :selectable="canSel"></el-table-column>
				<!-- <el-table-column prop="orgId" label="停车场编号" min-width="110" header-align="center" align="center"></el-table-column> -->
				<el-table-column prop="orgName" label="停车场名称" min-width="90" header-align="center" align="center"></el-table-column>
				<el-table-column prop="realName" label="姓名（保安）" min-width="80" header-align="center" align="center"></el-table-column>
				<el-table-column prop="telphone" label="保安手机" min-width="80" header-align="center" align="center"></el-table-column>
				<el-table-column :label="time ? (time[0] + ' 至 ' + time[1]) : ''" header-align="center">
					<el-table-column prop="totalOnlineTimeDay1" label="周一" min-width="70" header-align="center" align="center"></el-table-column>
					<el-table-column prop="totalOnlineTimeDay2" label="周二" min-width="70" header-align="center" align="center"></el-table-column>
					<el-table-column prop="totalOnlineTimeDay3" label="周三" min-width="70" header-align="center" align="center"></el-table-column>
					<el-table-column prop="totalOnlineTimeDay4" label="周四" min-width="70" header-align="center" align="center"></el-table-column>
					<el-table-column prop="totalOnlineTimeDay5" label="周五" min-width="70" header-align="center" align="center"></el-table-column>
					<el-table-column prop="totalOnlineTimeDay6" label="周六" min-width="70" header-align="center" align="center"></el-table-column>
					<el-table-column prop="totalOnlineTimeDay7" label="周日" min-width="70" header-align="center" align="center"></el-table-column>
				</el-table-column>
				<el-table-column prop="completeDayNum" v-if="activeName != 3" :label=" activeName == 1 ? '本周达标天数' : (activeName == 2 ? '接单量' : '推荐人数') " min-width="90" header-align="center" align="center"></el-table-column>
				<el-table-column prop="weekTotalOnlineTime" :label=" activeName == 1 ? '本周总时长' : (activeName == 2 ? '有效单' : '成功推荐人数') " min-width="90" header-align="center" align="center"></el-table-column>
				<el-table-column prop="rate" v-if="activeName == 2" :label=" activeName == 2 ? '成单率' : '成功率' " header-align="center" align="center"></el-table-column>
    			<el-table-column prop="ifTaskSuccess" label="任务状态" width="75" header-align="center" align="center">
					<template slot-scope="scope">
						<el-tag :type="isType(scope.row.ifTaskSuccess)" close-transition>{{stateText(scope.row.ifTaskSuccess)}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="rewardMoney" label="奖励" min-width="55" header-align="center" align="center"></el-table-column>
				<el-table-column  label="操作" width="80"  header-align="center" align="center" fixed="right" filter-placement="bottom-end">
      				<template slot-scope="scope">
      					<el-button  v-if='scope.row.ifHavAward == 2 && scope.row.ifTaskSuccess != 0' type="text" size="small"  @click="showSimgle(scope.row)">发奖</el-button>
      					<span v-if='scope.row.ifHavAward == 1'>已发奖</span>
			      	</template>
			    </el-table-column>
			</el-table>
			
			<!-- *********************分页部分******************** -->
			<el-pagination :current-page="taskData.pageNo" @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total" class="r" style="margin-top:20px;"></el-pagination>
		</el-row>
		<!-- 单个发奖 -->
		<el-dialog title="确认发奖？" :visible.sync="showSimgleDialog">
			<div class="form_box">
				<ul>
					<li><b>停车场名称：</b><span>{{itemData.orgName}}</span></li>
					<li><b>保安姓名：</b><span>{{itemData.realName}}</span></li>
					<li><b>任务周期：</b><span>{{time ? (time[0] + ' 至 ' + time[1]) : ''}}</span></li>
					<li><b>{{ activeName == 1 ? '本周总时长' : (activeName == 2 ? '有效单' : '成功推荐人数') }}</b><span>{{itemData.weekTotalOnlineTime}}</span></li>
					<li v-if="activeName != 3"><b>{{ activeName == 1 ? '本周达标天数' : (activeName == 2 ? '接单量' : '推荐人数') }}</b><span>{{itemData.completeDayNum}}</span></li>
					<li><b>奖励（元）：</b><span>{{itemData.rewardMoney}}</span></li>
				</ul>
			</div>
			<div slot="footer" class="dialog-footer">
			    <el-button @click="showSimgleDialog = false">取 消</el-button>
			    <el-button type="primary" @click="simgleComfirm">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 批量发奖 -->
		<el-dialog title="确认批量发奖？" :visible.sync="showMoreDialog">
			<div class="form_box">
				<ul>
					<li><b>任务名称：</b><span>{{ activeName == '1' ? '时长任务' : (activeName == '2' ? '成单任务' : '推新任务') }}</span></li>
					<li><b>任务周期：</b><span>{{time ? (time[0] + ' 至 ' + time[1]) : ''}}</span></li>
					<li><b>发奖人数：</b><span>{{moreData.personNum}}</span></li>
					<li><b>奖励总额：</b><span>{{moreData.moneyCount}}</span></li>
				</ul>
			</div>
			<div slot="footer" class="dialog-footer">
			    <el-button @click="showMoreDialog = false">取 消</el-button>
			    <el-button type="primary" @click="moreComfirm">确 定</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
 	import { mapGetters,mapActions } from 'vuex'
	import util from '../../common/js/util'
	import localData from '../../common/js/localData'
	import { getParkTaskList,batchSendAward } from '../../api/api'

	export default {
		data() {
			return {
				loading: true,
				total: null,
				activeName: '1',
				tableData: [],
				taskData : {
					pageNo: null,
					weekNum: Math.floor((new Date()).getTime()/1000),
					// mobile: '',taskState: '',orgName: '',ifHavAward: ''
				},
				taskState: [
					{ value: 0, text: '进行中' },
					{ value: 1, text: '已完成' },
					{ value: 2, text: '未完成' }
				],
				ifHavAwards: [
					{ value: 1, text: '已发放' },
					{ value: 2, text: '未发放' }
				],
				time: [],
				defaultTime: '',
				totalLoading: false,
				showSimgleDialog: false,
				showMoreDialog: false,
				itemData: {
					orgName: '',realName: '',weekTotalOnlineTime: '',completeDayNum: '',rewardMoney: '',tid: ''
				},
				moreData: {
					personNum: 0,moneyCount: 0,tids: ''
				},
				pageDatas: [],
				onpageChange: false, // 监听页面变化
			}
		},
		computed: {
            ...mapGetters([
				'getBtnPower',
				'getTid'
            ])
        },
		created() {
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
			getParkTaskList(fun){   //获取订单列表
				let taskData = {}
				for(let i in this.taskData){
					taskData[i] = this.taskData[i]
				}
				taskData.type = parseInt(this.activeName)
				taskData.weekNum = this.defaultTime ? ( Date.parse(this.defaultTime)/1000) : Math.floor((new Date()).getTime()/1000)
				getParkTaskList(taskData).then( data => {
					if( data.code == 200){
						this.loading = false
						this.total = data.rs.pager.count
						this.time = data.rs.time
						let tableData = data.rs.pager.pageList
						for(let i=0; i< tableData.length; i++){
							tableData[i].completeDayNum = tableData[i].completeDayNum || 0
							if(this.activeName == 1){
								tableData[i].weekTotalOnlineTime = this.dealTime(tableData[i].weekTotalOnlineTime)
							}
							else if(this.activeName == 2){
								tableData[i].rate = tableData[i].weekTotalOnlineTime ? tableData[i].completeDayNum / tableData[i].weekTotalOnlineTime : 0
								tableData[i].weekTotalOnlineTime = (tableData[i].weekTotalOnlineTime || 0) + '单'
							}
							else if(this.activeName == 3){
								tableData[i].weekTotalOnlineTime = (tableData[i].weekTotalOnlineTime || 0) + '人'
							}
							for(let j = 1; j < 8; j ++){
								if(this.activeName == 1){
									tableData[i]['totalOnlineTimeDay' + j] = this.dealTime(tableData[i]['totalOnlineTimeDay' + j])
								}
								else if(this.activeName == 2){
									tableData[i]['totalOnlineTimeDay' + j] = (tableData[i]['totalOnlineTimeDay' + j] || 0) + '单'
								}
								else if(this.activeName == 3){
									tableData[i]['totalOnlineTimeDay' + j] = (tableData[i]['totalOnlineTimeDay' + j] || 0) + '人'
								}
							}
							tableData[i].index = i
						}
						this.onpageChange = true
						this.tableData = tableData
						fun()
					}
				})
			},
			dealTime (time) { //时间格式转换
				if(time){
					var hour = ~~(time / 3600)
					var minite = ~~((time % 3600) / 60)
					return hour + ':' + ((minite + '').length > 1 ? '' : '0') + minite
				}
				else {
					return '0:00'
				}
			},
			canSel (row,index){ //判断行是否可选
				return row.ifHavAward == 2 && row.ifTaskSuccess != 0
			},			
			stateText(state) { //状态文本
				for(var i = 0;i < this.taskState.length; i++){
					if(state == this.taskState[i].value) return this.taskState[i].text
				}
			},
			handleClick (mm,kk) {  // 点击tab
				this.pageDatas = []
				this.handleCurrentChange(1)
			},
			handleCurrentChange(val) {  //分页 
				function back() {}
				this.taskData.pageNo = val || this.taskData.pageNo || 1
				if(!val){
					this.pageDatas = []
				}
				else{
					let that = this
					back = function () {
						setTimeout(function() {
							if(that.pageDatas[val - 1] && that.pageDatas[val - 1].length != 0){
								let arr = []
								for(let i = 0; i < that.pageDatas[val - 1].length; i ++){
									arr.push(that.tableData[that.pageDatas[val - 1][i].index])
								}
								that.toggleSelection(arr)
							}
							that.onpageChange = false
						}, 100)
					}
				}
				this.getParkTaskList(back)
			},
			resetInput() {   //清空筛选搜索框
				Object.keys(this.taskData).forEach((key) => {
					this.taskData[key] = null
					this.defaultTime = ''
				})
				this.handleCurrentChange()
			},
			batchSendAward (str) { //多个发奖
				batchSendAward({ tids: str }).then(res => {
					if(res.code == 200){
						this.$message.success('发奖成功')
						this.handleCurrentChange()
					}
				})
			},
			showSimgle ($row) { //显示单个发奖
				for(let i in this.itemData){
					this.itemData[i] = $row[i]
				}
				this.showSimgleDialog = true
			},
			simgleComfirm () { //确认单个发奖
				this.batchSendAward(this.itemData.tid)
				this.showSimgleDialog = false
			},
			showMore () { //显示批量发奖
				let num = 0
				for(let k = 0; k < this.pageDatas.length; k ++){
					num += this.pageDatas[k] ? this.pageDatas[k].length : 0
				}

				if(num == 0){
					this.$message.error('请选择发奖保安')
					return
				}
				this.moreData.re = this.tableData[0].re
				this.moreData.tids = ''
				this.moreData.personNum = 0
				this.moreData.moneyCount = 0
				// console.log(this.pageDatas)
				for(let i = 0; i < this.pageDatas.length; i ++){
					this.moreData.personNum += this.pageDatas[i] ? this.pageDatas[i].length : 0
					if(this.pageDatas[i] != null){
						for(let j = 0; j < this.pageDatas[i].length; j ++){
							// console.log(this.pageDatas[i][j].tid)
							this.moreData.tids += (j == 0 ? '' : ',') + this.pageDatas[i][j].tid
							this.moreData.moneyCount += this.pageDatas[i][j].money
						}
					}
					
				}
				this.showMoreDialog = true
			},
			moreComfirm () { //确认批量发奖
				// console.log(this.moreData)
				this.batchSendAward(this.moreData.tids)
				this.showMoreDialog = false
			},
			handleSelectionChange (row) { //收集tid
				let arr = []
				for(let i = 0; i < row.length; i++){
					arr.push({
						index: row[i].index,
						tid: row[i].tid,
						money: row[i].rewardMoney
					})
				}
				if(arr.length > 0 ) { 
					this.pageDatas[this.taskData.pageNo - 1] = arr
				} 
				else if(this.onpageChange) {
					// console.log(1)
				}
				else{
					this.pageDatas.splice(this.taskData.pageNo - 1,1)
				}
				// console.log(row,this.pageDatas)
			},
			toggleSelection(rows) { //设置选中项
		        if (rows) {
		          	rows.forEach(row => {
		            	this.$refs.multipleTable.toggleRowSelection(row)
		          	});
		        } else {
		          	this.$refs.multipleTable.clearSelection()
		        }
		    },
			isType(state) {    //状态颜色参数
				switch(state){ case 0: return 'warning' ; case 1: return 'gray' ; case 2: return 'primary' ; case 3: return 'success' ; }
			},
			toDetail ($row) {
				if(this.activeName == 3){
					this.$router.push({name: 'taskDetail',params: {userId: $row.userId}})
				}
			}
		}
	}

</script>

<style scoped lang="scss">
	.form_box{
		font-size: 14px;
		b{
			display: inline-block;
			width: 180px;
			color: #444;
		}
	}
</style>