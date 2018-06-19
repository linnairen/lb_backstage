<template>
	<section>
		<!--****************顶部***********新建************-->
		<el-row :span="24"  class="clearfix b">
			<h1 class="l">停车场认证列表</h1>		
		</el-row>	
		<!--筛选功能-->
		<el-row >
			<el-form style="width:100%; height:40px;padding-top:20px;">
				<!--停车场名称-->
				<el-form-item label="停车场名称" label-width="100px" style="width:30%" class="l">
				 	<el-input placeholder="停车场名称" suffix-icon="edit" style="width:200px;" v-model="filteringData.orgName"  @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
				</el-form-item> 
					<!--停车场名称-->
				<el-form-item label="停车场手机号" label-width="100px" style="width:30%" class="l">
				 	<el-input placeholder="停车场手机号" suffix-icon="edit" style="width:200px;" v-model="filteringData.mobile"  @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
				</el-form-item> 
					<!--还款时间-->
				<el-form-item label="认证时间" label-width="100px" style="width:30%;height:30px " class="l">
				 	<el-date-picker v-model="certificationTime" type="daterange"  range-separator="至" start-placeholder="开始日期"  end-placeholder="结束日期"  placeholder="开始日期-结束日期"  class="l"></el-date-picker>
				</el-form-item> 
				<!--搜索-->
				<el-form-item  style="width: 5%;padding-left:1%;"  class="r">
					<el-button type="primary" @click="handleCurrentChange()">搜索</el-button>
				</el-form-item>
			</el-form>
			<el-form style="width:100%; height:40px;padding-top:20px;">
				<!-- 认证状态 -->
				<el-form-item label="认证状态" label-width="100px" style="width:30%;" class="l">
					<el-select v-model="filteringData.state" placeholder="状态" style="width:180px;">
						<el-option v-for="state in certifiCation" :key="state.value" :label="state.label" :value="state.value"></el-option>
					</el-select>
				</el-form-item>
					<!--认证类型-->
				<el-form-item label="认证类型" label-width="100px" style="width:30%;height:30px " class="l">
				 	<el-select v-model="filteringData.parkAuthType" placeholder="全部" style="width:180px;">
						<el-option v-for="type in certifiType" :key="type.value" :label="type.label" :value="type.value"></el-option>
					</el-select>
				</el-form-item> 
				<el-form-item  style="width:30%" class="l"></el-form-item> 
				<!-- 重置按钮 -->
				<el-form-item  style="width: 5%;padding-left:1%;"  class="r">
					<el-button :plain="true" @click="resetInput()">重置</el-button>
				</el-form-item>
			</el-form>	
		</el-row>
		
		<!--停车认证列表-->
		<el-row >
			<div style="display: flex;justify-content: flex-end;">
				<p class="fp">全平台实时数据：</p>
				<p class="fp">停车场总量：<span class="fs">{{fullData.parkOrgAuthNum || 0}}个</span></p>
				<p class="fp">认证通过：<span class="fs">{{fullData.successNum || 0}}个</span></p>
				<p class="fp">认证中：<span class="fs">{{fullData.ingNum || 0}}个</span></p>
				<p class="fp">认证失败：<span class="fs">{{fullData.failNum || 0}}个</span></p>
				<p class="fp">未完成：<span class="fs">{{fullData.unFinishNum || 0}}个</span></p>
				<el-button style="height:24px;margin-top:8px;"  type="primary" size="small" @click="certificationFull()">刷新</el-button>
			</div>
			<el-table v-loading="loading" element-loading-text="拼命加载中" @row-dblclick='toDetails' :data="tableData" border style="width: 100%"  highlight-current-row>
				<el-table-column prop="parkAuthTypeText" label="认证类型" width="60" header-align="center" align="center"></el-table-column>
				<el-table-column prop="orgName" label="停车场名称" min-width="100" header-align="center" align="center"></el-table-column>
				<el-table-column prop="mobile" label="停车场手机" width="100" header-align="center" align="center"></el-table-column>
				<el-table-column prop="parkNumText" label="停车场规模"  header-align="center" align="center"></el-table-column>
				<el-table-column prop="parkFeeHoulyText" label="收费标准"  header-align="center" align="center"></el-table-column>
				<el-table-column prop="applyUserRealName" label="姓名"  header-align="center" align="center"></el-table-column>
				<el-table-column prop="companyName" label="公司名称"  header-align="center" align="center"></el-table-column>
				<el-table-column prop="legalName" label="公司法人" header-align="center" align="center"></el-table-column>
				<el-table-column prop="address" label="停车场详细地址" min-width="160" header-align="center" align="center"></el-table-column>
				<el-table-column prop="auditTimeText" label="审核时间" width="140" header-align="center" align="center"></el-table-column>					
				<el-table-column prop="state" label="认证状态" width="130" header-align="center" align="center">
					<template slot-scope="scope">
                        <el-tag :type="isType(scope.row.state)" close-transition>{{stateText(scope.row.state)}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column  label="操作"  fixed="right" width="100"  header-align="center" filter-placement="bottom-end">
      				<template slot-scope="scope">
						<div style="display: flex; justify-content: space-around;">
        					<el-button  type="text" size="small" v-if="scope.row.state == 0" @click="dialogData = scope.row;visible=true">认证</el-button>
							<el-button  type="text" size="small" v-if="scope.row.state == 0 || scope.row.state == -1 || scope.row.state == -9" @click="toDetail(scope.row)">编辑</el-button>
							<el-button  type="text" size="small" @click="toDetails(scope.row)">查看</el-button>
						</div>
			      	</template>
			    </el-table-column>
			</el-table>
			<!-- *********************分页部分******************** -->
			<el-pagination class="r mt" style="margin:20px 0" :current-page="filteringData.pageNo" @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
		</el-row>
		<el-dialog title="提示" :visible.sync="visible">
			<p><span class="ps">停车场手机：</span>{{dialogData.mobile}}</p>
			<p><span class="ps">认证类型：</span>{{dialogData.parkAuthTypeText}}</p>
			<p v-if="dialogData.parkNum"><span class="ps">停车位数量：</span>{{dialogData.parkNum || 0}}个</p>
			<p v-if="dialogData.parkFeeHoulyText"><span class="ps">停车费：</span>{{dialogData.parkFeeHoulyText}}</p>
			<p v-if="dialogData.registTimeText"><span class="ps">注册时间：</span>{{dialogData.registTimeText}}</p>
			<p v-if="dialogData.state == 1"><span class="ps">认证时间：</span>{{dialogData.createTimeText}}</p>
			<p class="pp">认证是否通过？</p>
			<span slot="footer" class="dialog-footer">
				<el-button @click="authAuditFail(dialogData)">失 败</el-button>
				<el-button type="primary" @click="lotStart(dialogData)">通 过</el-button>
			</span>
		</el-dialog>
	</section>
</template>

<script>
	
	import { mapGetters } from 'vuex'
    import { mapActions } from 'vuex'
	import util from '../../common/js/util'
	import localData from '../../common/js/localData'
	import type from '../../common/js/type'
	import {certificationList,authAuditPass,certificationFull,authAuditFail} from '../../api/api'
	import qs from 'qs'
	
	export default {
		data() {
			return {
				visible:false,
				dialogData: {},
				certificationTime: [],
				certifiCation: [],
				certifiType:[],
				tableData: [],
				filteringData: {
					pageNo: null,beginTime: null,endTime: null,parkAuthType: null,mobile: null
				},
				loading: false,
				total: null,
				fullData:{}
			}
		},
		created() {	
			this.certifiCation = localData.certifiCation; 
			this.certifiType = localData.certifiType;
			this.$store.state.btnPower = JSON.parse(localStorage.getItem('btnPower'));
			this.filteringData = JSON.parse(localStorage.getItem('invData')) || this.filteringData;
			localStorage.removeItem('timeData');
		},
		mounted() {	
			this.handleCurrentChange()
			this.certificationFull()
		},
		methods: {
			...mapActions([
				'passBtnPower',
				'passTid'
			]),
			lotStart($row) {
				authAuditPass({tid:$row.tid}).then( data => {
					data.code == 200 && this.certificationList()
					this.certificationFull()
				})
				this.visible = false
				this.dialogData = {}
			},
			authAuditFail($row) {
				authAuditFail({tid:$row.tid}).then( data => {
					data.code == 200 && this.certificationList()
					this.certificationFull()
				})
				this.visible = false
				this.dialogData = {}
			},
			certificationFull(){
				certificationFull().then( data => {
					data.code == 200 && (this.fullData = data.rs)
				})
			},
			certificationList(){				
				let filteringData = {};
				for(let key in this.filteringData){
					filteringData[key] = this.filteringData[key];
				}
				filteringData.beginTime = Date.parse(this.certificationTime[0]) / 1000 || null;
				filteringData.endTime = Date.parse(this.certificationTime[1]) / 1000 || null;	
				certificationList(filteringData).then(data => {
					if(data.code == 200){
						let tableData = {};
						this.total = data.rs.count;
						tableData = data.rs.pageList;
						for(let i = 0; i<tableData.length; i++){
							tableData[i].parkAuthTypeText = tableData[i].parkAuthType == 1 ? '公司' : '个人';
							tableData[i].auditTimeText = tableData[i].auditTime ? util.formatDate.format( new Date(tableData[i].auditTime * 1000),  "yyyy-MM-dd hh:mm:ss"  ) : null;
							tableData[i].parkNumText = (tableData[i].parkNum || 0) + '个';
							tableData[i].parkFeeHouly && (tableData[i].parkFeeHoulyText = tableData[i].parkFeeHouly + '元/小时');						
						}
						this.tableData = tableData;				
					}
				})
			},
			isType(state) {    //状态颜色参数
				switch(state){
					case -9: return 'danger';
					case -2: return 'primary';
					case -1: return 'warning';
					case 0: return 'warning'; 				
					case 1: return 'primary';
					case 2: return 'primary';					
					case 3: return 'success';
					case 5: return 'gray';
					case 6: return 'success';
				}
			},
			stateText(state) {
				for(var i = 0;i < this.certifiCation.length; i++){
					if(state == this.certifiCation[i].value) {
						return this.certifiCation[i].label;
					}
				}
			},
			resetInput() {   //清空筛选搜索框
				Object.keys(this.filteringData).forEach((key) => {
					this.filteringData[key] = null;
				})
				this.certificationTime = [];
				this.handleCurrentChange()
			},
			handleCurrentChange(val) {  //分页 
				this.filteringData.pageNo = val || this.filteringData.pageNo || 1;
				this.certificationList()
			},
			toDetail($row){
				localStorage.setItem('invData', JSON.stringify(this.filteringData));
				this.$router.push({
					name:'certificationDetail',
					params:{
						id:$row.tid,
						edit: true
					}
				})
			},
			toDetails($row){
				localStorage.setItem('invData', JSON.stringify(this.filteringData));
				this.$router.push({
					name: 'certificationDetail',
					params:{
						id: $row.tid
					}
				})
			},
			toCertificationDetail(){    //跳转到详情页
				let state = 1
				this.$router.push({
					name:"certificationDetaild", 
					params:{
						state:state
					}
				})
			},
			toCertificationDetaild(){   //跳转到详情页
				let state = 2
				this.$router.push({
					name:"certificationDetaild", 
					params:{
						state:state
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
.ps{
	width: 100px;
	display:inline-block;
	text-align:right;
	padding-right:15px;
}
.pp{
	width:100%;
	height:30px;
	text-align:center;
	line-height:50px;
	font-size:20px;
}
.fp{
	padding:10px;
	font-size: 14px;
}
.fs{
	color:#ffb500;
}
</style>