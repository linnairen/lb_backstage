<template>
	<section>
		<!--****************顶部***********新建************-->
		<el-row :span="24"  class="clearfix b">
			<h1 class="l">短信发送列表</h1>
			<!--<el-button class="r" style="margin: 10px 20px 0 0;"  type="primary" suffix-icon="edit" @click="$router.push('/Neworder')"  v-if="$store.state.btnPower.LOAN_APPLY_SAVE_OR_UPDATE">新建订单</el-button>-->
		</el-row>
		<!-- *************筛选功能******************* -->
		<el-row>
			<el-form style="width:100%; padding-top:20px;">
				<div class="clearfix">
					<!-- 手机号码输入框 -->
					<el-form-item label="手机号码" label-width="120px" style="width:23%;" class="l">
						<el-input placeholder="手机号码" suffix-icon="edit" style="width:150px;" v-model="messageData.mobile" @change="monitorTheNumber"
						onkeypress="return event.keyCode>=48&&event.keyCode<=57" ng-pattern="/[^a-zA-Z]|[^\u4E00-\u9FA5]/" :maxlength="11" @keyup.enter.native="handleCurrentChange()"></el-input>
					</el-form-item>
					<!-- 发送渠道 -->
					<el-form-item label="发送渠道" label-width="120px" style="width:22%" class="l">
					 	<el-select v-model="messageData.smsChannel" placeholder="发送渠道" style="width:150px;" @change="handleChange">
							<el-option v-for="smsChannel in channelList" :key="smsChannel.value" :label="smsChannel.text" :value="smsChannel.value"></el-option>
						</el-select>
					</el-form-item>
					<!--重置按钮-->
					<el-form-item  style="width:5%; padding: 0 2%" class="l">
						<el-button :plain="true" @click="resetInput">重置</el-button>
					</el-form-item>	
					<!--搜索按钮-->
					<el-form-item  style="width: 5%; padding: 0 2%" class="l">
						<el-button type="primary" @click="handleCurrentChange()">搜索</el-button>
					</el-form-item>
				</div>
			</el-form>
		</el-row>
		<!-- ****************************列表显示**************************** -->
		<el-row>
			<el-table v-loading="loading"  element-loading-text="拼命加载中" :data="tableData" border style="width: 100%" @row-dblclick='toOrderDetail'  highlight-current-row>
    			<!-- <el-table-column type="index" label="序号" width="65" header-align="center" align="center"></el-table-column> -->
				<el-table-column prop="smsId" label="主键" min-width="60" header-align="center" align="center"></el-table-column>
				<el-table-column prop="mobile" label="手机号码" min-width="130" header-align="center" align="center"></el-table-column>
				<el-table-column prop="code" label="短信验证码" min-width="80" header-align="center" align="center"></el-table-column>
				<el-table-column prop="msgId" label="短信发送id" min-width="180" header-align="center" align="center"></el-table-column>
				<el-table-column prop="failReason" label="失败原因" min-width="170" header-align="center" align="center"></el-table-column>
				<el-table-column prop="sendTime" label="发送时间" min-width="180" header-align="center" align="center"></el-table-column>
				<el-table-column prop="updateTime" label="修改时间" min-width="180" header-align="center" align="center"></el-table-column>
    			<el-table-column prop="smsChannel" label="发送渠道" width="100" header-align="center" align="center">
					<template slot-scope="scope">
						<el-tag :type="isType(scope.row.smsChannel)" close-transition>{{channelText(scope.row.smsChannel) || '无'}}</el-tag>
					</template>
				</el-table-column>
    			<el-table-column prop="sendResult" label="发送结果" width="100" header-align="center" align="center">
					<template slot-scope="scope">
						<el-tag :type="isType(scope.row.sendResult)" close-transition>{{resultText(scope.row.sendResult)}}</el-tag>
					</template>
				</el-table-column>
			</el-table>
			
			<!-- *********************分页部分******************** -->
			<el-pagination :current-page="messageData.pageNo" @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total" class="r" style="margin-top:20px;"></el-pagination>
		</el-row>
	</section>
</template>

<script>
 	import { mapGetters,mapActions } from 'vuex'
	import util from '../../common/js/util'
	import localData from '../../common/js/localData'
	import type from '../../common/js/type'
	import {getCityList,parkOrderList,getPageList} from '../../api/api'
	import qs from 'qs'
	import NProgress from 'nprogress'

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
					pageNo: null,beginTime: null,endTime: null
				},
				messageData: {
					pageNo: 1,mobile: null,smsChannel: null
				},
				orderState: [],
				states: [],
				lifeCycles: [],
				personApproving: [],
				cityList: [],
				auditList: [],
				defaultTime: [],
				preArrivalTime: [],
				mm: false,
				submited:false,
				resultList: [
					{
						value: 1,
						text: '成功'
					},
					{
						value: 2,
						text: '失败'
					}
				],
				channelList: []
			}
		},
		computed: {
            ...mapGetters([
				'getBtnPower',
				'getTid'
            ])
        },
		created() {	
			this.options = localData.options
			this.orderState = localData.orderState
			this.lifeCycles = localData.lifeCycle
			this.channelList = localData.channelList
			this.$store.state.btnPower = JSON.parse(localStorage.getItem('btnPower'))
			localStorage.removeItem('invData')
		},
		mounted() {
			this.handleCurrentChange()
			// this.getPageList()
		},
		methods: {
			...mapActions([
				'passBtnPower',
				'passTid'
			]),
			handleChange(values) {
				for(let i in this.linkState){
					if(values == this.linkState[i].value){
						for(let j = 0; j < this.linkState[i].list.length; j++){
							this.states.push(this.linkState[i].list[j])
						}
					}
				}
				this.orderData.state = ''
		    },
		    getPageList () {
		    	let messageData = {}
		    	for(let i in this.messageData){
		    		messageData[i] = this.messageData[i]
		    	}
		    	getPageList(messageData).then(res => {
		    		if( res.code == 200){
						this.loading = false
						this.total = res.rs.count

						let tableData = res.rs.pageList
						for(let i=0; i< tableData.length; i++){
							tableData[i].sendTime = util.formatDate.format(new Date(tableData[i].sendTime ),'yyyy-MM-dd hh:mm:ss')
							tableData[i].updateTime = tableData[i].updateTime ? util.formatDate.format(new Date(tableData[i].updateTime ),'yyyy-MM-dd hh:mm:ss') : ''
						}
						this.tableData = tableData
					}
		    	})
		    },
			isType(state) {    //状态颜色参数
				switch(state){
					case -4: return 'danger' ;
					case -3: return 'danger' ;
					case -2: return 'primary' ;
					case -1: return 'warning' ;
					case 0: return 'warning' ;
					case 1: return 'gray' ;	
					case 2: return 'primary' ;
					case 3: return 'success' ;
					case 4: return 'danger' ;
					case 5: return 'gray' ;
					case 6: return 'success' ;
					case 7: return 'danger' ;
					case 8: return 'gray' ;
					case 9: return 'success' ;
				}
			},
			//结果文字
			resultText(result) {
				for(var i = 0;i < this.resultList.length; i++){
					if(result == this.resultList[i].value) return this.resultList[i].text
				}
			},
			//渠道文字
			channelText(channel) {
				for(var i = 0;i < this.channelList.length; i++){
					if(channel == this.channelList[i].value) return this.channelList[i].text
				}
			},
			monitorTheNumber() {   //验证手机号正则 
				if(this.messageData.mobile.length == 11){
					if (/^1[3456789][0-9]{9}$/.test(this.messageData.mobile)){ 
						return true
					} else {
						this.$message({type: 'warning',message: '手机号码有误'})
						return false
					}
				} else if(isNaN(this.messageData.mobile)){
					this.$message({type: 'error',message: '手机号码只能为数字'})
					this.messageData.mobile = null
					return false
				}
			},
			onAssign(tid,auditName) {//打开指派弹窗
				this.assign = true
				this.assignPersonnel = auditName || '暂无'
				this.assignData.tid = tid
			},
			
			handleCurrentChange(val) {  //分页 
				this.messageData.pageNo = val || 1
				this.getPageList()
			},
			resetInput() {   //清空筛选搜索框
				Object.keys(this.messageData).forEach((key) => {
					this.messageData[key] = null
					this.defaultTime = []
					this.preArrivalTime = []
				})
				this.msg = null
				this.handleCurrentChange()
			},
			toOrderDetail($row){   //前往订单详情  需要权限
				
			},
			deleteRow(id,e){
				this.$confirm('是否确认删除','删除', {confirmButtonfailRemark: '确定',cancelButtonfailRemark: '取消',type: 'info'}).then(() => {	
					
				})
			},
			stop(e){   //取消默认事件
				window.event? window.event.cancelBubble = true : e.stopPropagation()
			}
		}
	}

</script>

<style scoped lang="scss">

</style>