<template>
	<section>
		<!--****************顶部***********新建************-->
		<el-row :span="24"  class="clearfix b">
			<h1 class="l">用户列表</h1>
			<!--<el-button class="r" style="margin: 10px 20px 0 0;"  type="primary" suffix-icon="plus"  @click="todetails">添加用户</el-button>-->
		</el-row>
		<!-- *************筛选功能******************* -->
		<el-row>
			<el-form style="width:100%; padding-top:20px;">	
				<div class="clearfix">
					<!-- 客户姓名输入框 -->
					<el-form-item label="客户姓名" label-width="100px" style="width:43.7%;" class="l">
						<el-input placeholder="客户姓名" suffix-icon="edit" style="width:150px;" v-model="filteringData.realName"  @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
					</el-form-item>
				  	<!-- 手机号码输入框 -->
					<el-form-item label="手机号码" label-width="100px" style="width:45%;" class="l">
						<el-input placeholder="手机号码" suffix-icon="edit" style="width:190px;" v-model="filteringData.telphone" @change="monitorTheNumber"
						onkeypress="return event.keyCode>=48&&event.keyCode<=57" ng-pattern="/[^a-zA-Z]|[^\u4E00-\u9FA5]/" :maxlength="11" @keyup.enter.native="handleCurrentChange()"></el-input>
					</el-form-item>
					<!-- 确认按钮 -->
					<el-form-item  style="width: 5%;padding-left:1%;"  class="r">
						<el-button type="primary" @click="handleCurrentChange()">搜索</el-button>
					</el-form-item>
				</div>
				<div class="clearfix">
					<!--注册时间-->
					<el-form-item label="注册时间" label-width="100px" style="width:45%;" class="l">
					 	<el-date-picker v-model="defaultTime" type="daterange" range-separator="至" start-placeholder="开始日期"  end-placeholder="结束日期"  placeholder="开始日期-结束日期" ></el-date-picker>
					</el-form-item> 
					<!-- 注册来源 -->
					<el-form-item label="注册来源" label-width="80px" style="width:45%;" class="l">
						<el-select v-model="filteringData.registSource" placeholder="来源" style="width:190px;">
							<el-option v-for="item in userSource" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<!-- 重置按钮 -->
					<el-form-item  style="width: 5%;padding-left:1%;"  class="r">
						<el-button :plain="true" @click="resetInput">重置</el-button>
					</el-form-item>
				</div>
			</el-form>
			
		</el-row>
		
		<!-- ****************************列表显示**************************** -->
		<el-row>
			<el-table v-loading="loading" element-loading-text="拼命加载中" :data="tableData" border style="width: 100%" @row-dblclick='todetails'  max-height="600" highlight-current-row>
    			<el-table-column type="index" label="序号" width="65" header-align="center" align="center"></el-table-column>
				<el-table-column prop="realName" label="用户姓名" min-width="100" header-align="center" align="center"></el-table-column>
				<el-table-column prop="sex" label="性别" min-width="70" header-align="center" align="center"></el-table-column>
				<el-table-column prop="age" label="年龄段" min-width="100" header-align="center" align="center"></el-table-column>
				<el-table-column prop="telphone" label="手机号码" min-width="125" header-align="center" align="center"></el-table-column>
				<el-table-column prop="userSign" label="邀请码" min-width="100" header-align="center" align="center"></el-table-column>
				<el-table-column prop="nickname" label="用户昵称" min-width="100" header-align="center" align="center"></el-table-column>
				<el-table-column prop="cardNo" label="身份证号" min-width="180" header-align="center" align="center"></el-table-column>
				<el-table-column prop="registSource" label="注册来源" min-width="140" header-align="center" align="center"></el-table-column>
				<el-table-column prop="ifLoan" label="是否贷款" min-width="100" header-align="center" align="center"></el-table-column>
				<el-table-column prop="state" label="登录状态" width="100" header-align="center" align="center">
					<template slot-scope="scope">
						<el-tag :type="isType(scope.row.state)" close-transition>{{stateText(scope.row.state)}}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="createTime" label="注册日期" min-width="180" header-align="center" align="center"></el-table-column>
				<el-table-column    label="操作"  width="80"  header-align="center" filter-placement="bottom-end" >
				    <template slot-scope="scope">
				       <el-button class="l" @click="todetails(scope.row)" type="primary" size="small">查看</el-button>
				       <!--<el-button class="l" @click="" type="primary" size="small">删除</el-button>
				       <el-button class="l" @click="" type="primary" size="small">锁定</el-button>-->
				    </template>
			    </el-table-column>
    			
			</el-table>
			<el-pagination :current-page="filteringData.pageNo" @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total" class="r" style="margin-top:20px;"></el-pagination>
		</el-row>
		
	</section>
</template>

<script>
	
	import { mapGetters } from 'vuex'
    import { mapActions } from 'vuex'
	import util from '../../common/js/util'
	import localData from '../../common/js/localData'
	import type from '../../common/js/type'
	import {getUserInfoList} from '../../api/api'
	import qs from 'qs'
	import NProgress from 'nprogress'
	
	export default {
		data() {
			return {
				loading: false,
				total: null,
				userInfo: {},
				filteringData : {
					pageNo: null,telphone:null,realName:null,cardNo:null,telphone:null,state:null
				},
				tableData: [],
				defaultTime: [],
				userSource: [],
				invState:[
					{value:1,text:'正常'},
					{value:3,text:'锁定'}
				],
				userField: false
			}
		},
		computed: {
            ...mapGetters([
				'getBtnPower',
				'getTid'
            ])
        },
		created() {
			this.userSource = localData.userSource;
			this.filteringData = JSON.parse(localStorage.getItem('invData')) || this.filteringData;
			this.defaultTime = JSON.parse(localStorage.getItem('timeData')) || this.defaultTime;
			localStorage.removeItem('invData');		
			localStorage.removeItem('timeData');
			this.$store.state.btnPower = JSON.parse(localStorage.getItem('btnPower'));
		},
		mounted() {
			this.handleCurrentChange()
		},
		methods:{
			getUserInfoList(){      //获取用户列表
				let filteringData = {};
				for(let i in this.filteringData){
					filteringData[i] = this.filteringData[i]
				}
				filteringData.beginTime = Date.parse(this.defaultTime[0])/1000 || null;
				filteringData.endTime = Date.parse(this.defaultTime[1])/1000 || null;				
				getUserInfoList(filteringData).then(data => {
					if(data.code == 200){
						this.total = data.rs.count;
						let tableData = data.rs.pageList;
						for(let i = 0; i < tableData.length;i++){
							tableData[i].createTime = util.formatDate.format(new Date(tableData[i].createTime * 1000),'yyyy-MM-dd hh:mm:ss');
							tableData[i].ifLoan = tableData[i].ifLoan == 0 ? '未贷款' : '已贷款';
							tableData[i].sex = tableData[i].sex == 0 ? '男' : '女';
							if(tableData[i].age) {tableData[i].age = tableData[i].age  + '后'};
							for(let key in this.userSource){
								if(this.userSource[key].value == tableData[i].registSource){
									tableData[i].registSource = this.userSource[key].label
								}
							}
						}
						this.tableData = tableData;
						this.loading = false;
					}
				})
			},
			handleCurrentChange(val) {  //分页 
				this.filteringData.pageNo = val || this.filteringData.pageNo || 1;
				this.getUserInfoList()
			},
			resetInput() {   //清空筛选搜索框
				Object.keys(this.filteringData).forEach((key) => {
					this.filteringData[key] = null
				})
				this.defaultTime = [];
				this.handleCurrentChange()
			},
			addField(){   //确定新增
				
			},
			monitorTheNumber() {   //验证手机号正则 
				if(this.filteringData.applyMobile.length == 11){
					if (/^[1][3,4,5,7,8][0-9]{9}$/.test(this.filteringData.applyMobile)){ 
						return true;  
					} else {
						this.$message({type: 'warning',message: '手机号码有误'});
						return false;
					}
				} else if(isNaN(this.filteringData.applyMobile)){
					this.$message({type: 'error',message: '手机号码只能为数字'});
					this.filteringData.applyMobile = null;
					return false;
				}
			},
			todetails($row){//前往订单详情  需要权限 
				console.log($row)
				if(this.$store.state.btnPower.LOAN_APPLY_DETAIL){
					localStorage.setItem('invData', JSON.stringify(this.filteringData));
					localStorage.setItem('timeData', JSON.stringify(this.defaultTime));
//					this.passTid($row.tid);
//					this.$router.push('/order');
					this.$router.push({name:"userdetails",params:{id:$row.userId}})
				}else{
					this.$message.error('没有权限');
				}
			},
			isType(state) {    //状态颜色参数
				switch(state){
					case -9: return 'danger' ;
					case -2: return 'primary' ;
					case -1: return 'warning' ;
					case 0: return 'warning' ; 				
					case 1: return 'primary' ;	
					case 2: return 'primary' ;					
					case 3: return 'success' ;
					case 5: return 'gray' ;
					case 6: return 'success' ;
				}
			},
			stateText(state) {
				for(var i = 0;i < this.invState.length; i++){
					if(state == this.invState[i].value) return this.invState[i].text;
				}
			},
		}
	}
	
</script>

<style  scoped lang="scss">
</style>