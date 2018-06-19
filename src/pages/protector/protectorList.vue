<template>
	<section>
		<!--****************顶部***********新建************-->
		<el-row :span="24"  class="clearfix b" >
			<h1 class="l">保安列表</h1>
			<!-- <a :href="exportXlsLink" class="export r">导出</a> -->
		</el-row>
		<!-- *************筛选功能******************* -->
		<el-row >
			<el-form  class="clearfix" style="width:100%; padding-top:20px;">
				<!--保安编号-->
				<!-- <el-form-item label="保安编号" label-width="100px" style="width:25%" class="l">
				 	<el-input placeholder="保安编号" suffix-icon="edit" style="width:200px;" v-model="searchData.orgName"  @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
				</el-form-item>  -->
				<!--保安昵称-->
				<el-form-item label="保安昵称" label-width="100px" style="width:30%;height:30px " class="l">
				 	<el-input placeholder="保安昵称" suffix-icon="edit" style="width:200px;" v-model="searchData.nickName"  @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
				</el-form-item> 
				<!--保安手机-->
				<el-form-item label="保安手机" label-width="100px" style="width:30%" class="l">
				 	<el-input placeholder="保安手机" suffix-icon="edit" style="width:200px;" v-model="searchData.telphone"  @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
				</el-form-item> 
				<!-- 角色 -->
				<el-form-item label="角色" label-width="100px" style="width:30%;" class="l">
					<el-select v-model="searchData.roleId" placeholder="角色" style="width:180px;">
						<el-option v-for="state in ptType" :key="state.value" :label="state.text" :value="state.value"></el-option>
					</el-select>
				</el-form-item>
				<!--搜索-->
				<el-form-item  style="width: 6%;"  class="r">
					<el-button type="primary" @click="handleCurrentChange()">搜索</el-button>
				</el-form-item>
			</el-form>
			<el-form class="clearfix"  style="width:100%;">
				<!--注册时间-->
				<el-form-item label="注册时间" label-width="100px" style="width:30%;height:30px " class="l">
				 	<el-date-picker v-model="defaultTime" type="daterange"  range-separator="至" start-placeholder="开始日期"  end-placeholder="结束日期"  placeholder="开始日期-结束日期"  class="l"></el-date-picker>
				</el-form-item> 
				<!-- 重置按钮 -->
				<el-form-item  style="width: 6%;"  class="r">
					<el-button :plain="true" @click="resetInput">重置</el-button>
				</el-form-item>
			</el-form>	
		</el-row>
		
		<el-row>
			<div class="total-box">
				<p class="fp">全平台实时数据：</p>
				<p class="fp">保安总数：<span class="fs">{{fullData.orgUserCnt || 0}}个</span></p>
				<p class="fp">奖励余额：<span class="fs">{{fullData.overAmount || 0}}元</span></p>
				<el-button type="primary" @click="getParkOrgUserData();handleCurrentChange()" icon="el-icon-refresh" style="padding: 5px;margin-left: 20px;">刷新</el-button>
			</div>
			<el-table v-loading="loading"  element-loading-text="拼命加载中" :data="parkingData" border style="width: 100%" @row-dblclick='toDetail' highlight-current-row>
    			<el-table-column prop="tid" label="保安编号" header-align="center" align="center"></el-table-column>
				<el-table-column prop="nickName" label="昵称" min-width="120" header-align="center" align="center"></el-table-column>
				<el-table-column prop="telPhone" label="保安手机" min-width="120"  header-align="center" align="center"></el-table-column>	
				<el-table-column prop="orgName" label="停车场名称" min-width="120" header-align="center" align="center"></el-table-column>
				<el-table-column label="注册时间" min-width="140" header-align="center" align="center">
					<template slot-scope="scope">
						<div>
							{{ changeTime(scope.row.createTime) }}
						</div>
			      	</template>
				</el-table-column>
				<el-table-column prop="rewardAmount" label="累计奖励" min-width="80" header-align="center" align="center"></el-table-column>
				<el-table-column prop="overAmount" label="余额" min-width="80" header-align="center" align="center"></el-table-column>
				<el-table-column label="角色"  header-align="center" align="center">
					<template slot-scope="scope">
						<div>
							{{ scope.row.roleId == 1 ? '管理员' : '接单员' }}
						</div>
			      	</template>
				</el-table-column>
				<!-- <el-table-column  label="操作" width="140" fixed="right"  header-align="center" filter-placement="bottom-end">
      				<template slot-scope="scope">
						<div style="text-align: center;">
							<el-button type="text" size="small" @click="toDetail(scope.row)">查看</el-button>
						</div>
			      	</template>
			    </el-table-column> -->
			</el-table>
			<div style="color: red;">备注：新增成员、删除成员等操作，请在成员管理（路径：停车场列表>>停车场详情>>团队成员）内进行操作。</div>
			<!-- *********************分页部分******************** -->
			<el-pagination :current-page="searchData.pageNo" @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total" class="r" style="margin-top:20px;"></el-pagination>
		</el-row>
	</section>
</template>

<script>
import { mapGetters,mapActions } from "vuex";
import util from "../../common/js/util";
import localData from "../../common/js/localData";
import type from "../../common/js/type";
import { findParkOrgUserList, getParkOrgUserData,parkOutput } from "../../api/api";
import qs from "qs";
import NProgress from "nprogress";

export default {
	data() {
		return {
			visible:false,
			dialogVisible:false,
			certificationTime: [],
			searchData: {
				pageNo: 1
			},
			certifiType: [],
			parkingData: [],
			defaultTime: [],
			total: null,
			loading: false,
			ptType: [],
			fullData: {}
		};
	},
	computed: {
		exportXlsLink () {
			return parkOutput(this.searchData)
		},
		...mapGetters(["getBtnPower", "getTid"])
	},
	created() {
		this.ptType = localData.ptType;
		this.certifiType = localData.certifiType;
		this.searchData = JSON.parse(localStorage.getItem("repData")) || this.searchData;
		this.defaultTime = JSON.parse(localStorage.getItem("timeData")) || this.defaultTime;
		localStorage.removeItem("repData");
		localStorage.removeItem("timeData");
	},
	mounted() {
		this.handleCurrentChange()
		this.getParkOrgUserData()
	},
	methods: {
		getParkOrgUserData(){
			getParkOrgUserData().then( data => {
				data.code == 200 && (this.fullData = data.rs)
			})
		},
		//获取停车场列表
		findParkOrgUserList() {	
			let searchData = {};
			for (let i in this.searchData) {
				searchData[i] = this.searchData[i];
			}
			searchData.beginTime = Date.parse(this.defaultTime[0]) / 1000 || null;
			searchData.endTime = Date.parse(this.defaultTime[1]) / 1000 || null;
			findParkOrgUserList(searchData).then(data => {
				if (data.code == 200) {
					this.total = data.rs.count;
					this.parkingData = data.rs.pageList;
				}
			});
		},
		//分页
		handleCurrentChange(val) {
			this.searchData.pageNo = val || this.searchData.pageNo || 1;
			this.findParkOrgUserList();
		},
		//清空筛选搜索框
		resetInput() {
			Object.keys(this.searchData).forEach(key => {
				this.searchData[key] = null;
				this.defaultTime = [];
				this.setMm();
			});
			this.msg = null;
			this.handleCurrentChange();
		},
		setMm() {
			this.mm = true;
			this.mm = false;
		},
		toParklotP($row){ 
			localStorage.setItem("repData", JSON.stringify(this.searchData));
			localStorage.setItem("timeData", JSON.stringify(this.defaultTime));
			this.$router.push({
				name: "protectorDetail",
				params: { tid: $row.tid,tabs: 'second' }
			});
		},
		toDetail($row) {
			localStorage.setItem("repData", JSON.stringify(this.searchData));
			localStorage.setItem("timeData", JSON.stringify(this.defaultTime));
			this.$router.push({ name: "protectorDetail", params: { tid: $row.tid } });
		},
		toCertificationDetail(){    //跳转到登记页
			let state = 1
			this.$router.push({
				name:"certificationDetaild", 
				params:{
					state:state
				}
			})
		},
		changeTime (time) { //转换时间格式
			return time ? util.formatDate.format(new Date(time * 1000),'yyyy-MM-dd hh:mm:ss') : ''
		},
		goCompile($row){
			localStorage.setItem("repData", JSON.stringify(this.searchData));
			localStorage.setItem("timeData", JSON.stringify(this.defaultTime));
			this.$router.push({ name: "protectorDetail", params: { tid: $row.tid } });
		}
	}
}
</script>

<style scoped lang="scss">
	.ps{
		width: 100px;display:inline-block;text-align:right;padding-right:15px;
	}
	.pp{
		width:100%;height:30px;text-align:center;line-height:50px;font-size:20px;
	}
	.fp{
		padding:10px;
		font-size: 14px;
	}
	.fs{
		color:#ffb500;
	}
</style>