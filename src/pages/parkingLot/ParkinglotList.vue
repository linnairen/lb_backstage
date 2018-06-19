<template>
	<section>
		<!--****************顶部***********新建************-->
		<div class="list-title">
			<h1 class="l">停车场列表</h1>
			<div class="list-title-right">
				<el-button class="export" type="primary" icon="el-icon-edit" @click="toCertificationDetail" style="margin-right: 20px;">登记</el-button>
				<a :href="exportXlsLink" class="export"><i class="el-icon-download"></i>导出</a>
			</div>
		</div>
		<!-- *************筛选功能******************* -->
		<!--筛选功能-->
		<el-row >
			<el-form  class="clearfix" style="width:100%; padding-top:20px;">
				<!--停车场名称-->
				<el-form-item label="停车场名称" label-width="100px" style="width:23%" class="l">
				 	<el-input placeholder="停车场名称" suffix-icon="el-icon-edit" style="width:200px;" v-model="filteringData.orgName"  @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
				</el-form-item> 
				<!--注册时间-->
				<el-form-item label="注册时间" label-width="100px" style="width:35%;height:30px " class="l">
				 	<el-date-picker v-model="defaultTime" type="daterange"  range-separator="至" start-placeholder="开始日期"  end-placeholder="结束日期"  placeholder="开始日期-结束日期"  class="l"></el-date-picker>
				</el-form-item> 
				<!--停车场手机号-->
				<!-- <el-form-item label="停车场手机号" label-width="100px" style="width:30%" class="l">
				 	<el-input placeholder="停车场手机号" suffix-icon="el-icon-edit" style="width:200px;" v-model="filteringData.mobile"  @keydown.space.native="$event.returnValue = false" @keyup.enter.native="handleCurrentChange()"></el-input>
				</el-form-item>  -->
				<!--搜索-->
				<el-form-item label="使用状态" label-width="100px" style="width: 25%;" class="l">
					<el-select v-model="filteringData.state" placeholder="状态" style="width:180px;">
						<el-option v-for="state in useData" :key="state.value" :label="state.label" :value="state.value"></el-option>
					</el-select>
				</el-form-item>
				<!-- 认证状态 -->
				<el-form-item  style="width: 6%;"  class="r">
					<el-button type="primary" @click="handleCurrentChange()">搜索</el-button>
				</el-form-item>
				<!-- 重置按钮 -->
				<el-form-item  style="width: 6%;"  class="r">
					<el-button :plain="true" @click="resetInput">重置</el-button>
				</el-form-item>
			</el-form>
			<el-form class="clearfix"  style="width:100%;">
				<!--认证类型-->
				<!-- <el-form-item label="认证类型" label-width="100px" style="width:30%;height:30px " class="l">
				 	<el-select v-model="filteringData.authType" placeholder="全部" style="width:180px;">
						<el-option v-for="type in certifiType" :key="type.value" :label="type.label" :value="type.value"></el-option>
					</el-select>
				</el-form-item>  -->
			</el-form>	
		</el-row>
		
		<el-row>
			<div class="total-box">
				<p class="fp">全平台实时数据：</p>
				<p class="fp">停车场：<span class="fs">{{fullData.allCnt  || 0}}个</span></p>
				<p class="fp">停车费（原价）合计：<span class="fs">{{fullData.parkAmount || 0}}元</span></p>
				<p class="fp">停车费（实收）合计：<span class="fs">{{fullData.realPayAmount || 0}}元</span></p>
				<p class="fp">启用中：<span class="fs">{{fullData.openCnt || 0}}个</span></p>
				<p class="fp">停用中：<span class="fs">{{fullData.closeCnt || 0}}个</span></p>
				<el-button type="primary" @click="parkinglotFull" icon="el-icon-refresh" style="padding: 5px;margin-left: 20px;">刷新</el-button>
			</div>
			<el-table v-loading="loading"  element-loading-text="拼命加载中" :data="parkingData" border style="width: 100%" @row-dblclick='toParklotDetail' highlight-current-row>
    			<el-table-column prop="tid" label="停车场编号"  header-align="center" align="center"></el-table-column>
				<el-table-column prop="orgName" label="停车场名称" min-width="120" header-align="center" align="center"></el-table-column>
				<!-- <el-table-column prop="telphone" label="停车场手机" width="100" header-align="center" align="center"></el-table-column> -->
				<el-table-column prop="parkNumText" label="停车位规模"  header-align="center" align="center"></el-table-column>	
				<el-table-column prop="parkFeeHoulyText" label="收费标准"  header-align="center" align="center"></el-table-column>
				<el-table-column prop="parkAmountText" label="停车费合计（原价）" min-width="150" header-align="center" align="center"></el-table-column>
				<el-table-column prop="realPayAmountText" label="停车费合计（实收）【平台收入】" min-width="210" header-align="center" align="center"></el-table-column>
				<el-table-column prop="effectiveOderCountText" label="订单总数"  header-align="center" align="center"></el-table-column>
				<el-table-column prop="dayAverageOrderText" label="平均日单量"  header-align="center" align="center"></el-table-column>
				<el-table-column prop="registTimeText" label="注册时间" width="140" header-align="center" align="center"></el-table-column>
				<el-table-column prop="createTimeText" label="认证时间" width="140" header-align="center" align="center"></el-table-column>
				<el-table-column prop="stateText" label="使用状态"  header-align="center" align="center"></el-table-column>
				<el-table-column  label="操作" width="220" fixed="right"  header-align="center" filter-placement="bottom-end">
      				<template slot-scope="scope">
						<div class="handle-list">
							<el-button v-if="scope.row.state == 1"  type="text" size="small" @click="goCompile(scope.row)">编辑</el-button>
							<el-button v-if="scope.row.state == 1" type="text" size="small" @click="toParklotP(scope.row,'second')">管理成员</el-button>	
							<el-button v-if="scope.row.state == 1" type="text" size="small" @click="toParklotP(scope.row,'third')">优惠配置</el-button>	
							<el-button  type="text" size="small" @click="dialogVisible = scope.row;visible=true">{{scope.row.state == 1 ? '停用' : '启用'}}</el-button>
						</div>
			      	</template>
			    </el-table-column>
			</el-table>
			
		<!-- *********************分页部分******************** -->
		<el-pagination :current-page="filteringData.pageNo" @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total" class="r" style="margin-top:20px;"></el-pagination>
		</el-row>	
		<el-dialog title="提示" :visible.sync="visible">
			<p><span class="ps">停车场编号：</span>{{dialogVisible.tid}}</p>
			<p><span class="ps">停车场手机：</span>{{dialogVisible.telphone}}</p>
			<p><span class="ps">认证类型：</span>{{dialogVisible.authTypeText}}</p>
			<p><span class="ps">停车位数量：</span>{{(dialogVisible.parkNum || 0 ) + '个'}}</p>
			<p><span class="ps">停车费：</span>{{(dialogVisible.parkFeeHouly || 0) + '元/小时'}}</p>
			<p><span class="ps">注册时间：</span>{{dialogVisible.registTimeText || ''}}</p>
			<p><span class="ps">认证时间：</span>{{dialogVisible.createTimeText || ''}}</p>
			<p class="pp">确定{{dialogVisible.state == 1 ? '停用' : '启用'}}吗？</p>
			<span slot="footer" class="dialog-footer">
				<el-button @click="visible = false">取 消</el-button>
				<el-button type="primary" @click="lotStart(dialogVisible)">{{dialogVisible.state == 1 ? '停 用' : '启 用'}}</el-button>
			</span>
		</el-dialog>
	</section>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import util from "../../common/js/util";
import localData from "../../common/js/localData";
import type from "../../common/js/type";
import { parkinglotList, getParkingLot, getParkingStart ,parkinglotFull,parkOutput } from "../../api/api";
import qs from "qs";
import NProgress from "nprogress";

export default {
	data() {
		return {
			visible:false,
			dialogVisible:false,
			certificationTime: [],
			filteringData: {
				pageNo: 1
			},
			certifiType: [],
			parkingData: [],
			defaultTime: [],
			total: null,
			loading: false,
			useData: [],
			fullData: {}
		};
	},
	computed: {
		exportXlsLink () {
			return parkOutput(this.filteringData)
		},
		...mapGetters(["getBtnPower", "getTid"])
	},
	created() {
		this.useData = localData.useData;
		this.certifiType = localData.certifiType;
		this.filteringData = JSON.parse(localStorage.getItem("repData")) || this.filteringData;
		this.defaultTime = JSON.parse(localStorage.getItem("timeData")) || this.defaultTime;
		localStorage.removeItem("repData");
		localStorage.removeItem("timeData");
	},
	mounted() {
		this.handleCurrentChange()
		this.parkinglotFull()
	},
	methods: {
		parkinglotFull(){
			parkinglotFull().then( data => {
				data.code == 200 && (this.fullData = data.rs)
			})
		},
		lotStart($row) {
			if($row.state == 1){
				getParkingLot({tid:$row.tid}).then(data => {
					if(data.code == 200){
						this. parkinglotList()
						this.$message.success('停用成功')
						this.parkinglotFull()
					}
				})
			}else{
				getParkingStart({tid:$row.tid}).then(data => {
					if(data.code == 200){
						this. parkinglotList() 
						this.$message.success('启用成功')
						this.parkinglotFull()
					}
				}) 
			}
			this.visible = false;
			this.dialogVisible = false;
		},
		//获取停车场列表
		parkinglotList() {	
			let filteringData = {};
			for (let i in this.filteringData) {
				filteringData[i] = this.filteringData[i];
			}
			filteringData.beginTime = Date.parse(this.defaultTime[0]) / 1000 || null;
			filteringData.endTime = Date.parse(this.defaultTime[1]) / 1000 || null;
			parkinglotList(filteringData).then(data => {
				if (data.code == 200) {
					this.total = data.rs.count;
					let parkingData = data.rs.pageList;
					for (let i = 0; i < parkingData.length; i++) {
						parkingData[i].parkNumText = (parkingData[i].parkNum || 0) + "个";
						parkingData[i].parkFeeHouly && (parkingData[i].parkFeeHoulyText = parkingData[i].parkFeeHouly + "元/每小时");
						parkingData[i].dayAverageOrderText = (parkingData[i].dayAverageOrder || 0) + "单";
						parkingData[i].effectiveOderCountText = (parkingData[i].effectiveOderCount || 0) + "单";
						parkingData[i].registTimeText = parkingData[i].registTime ? util.formatDate.format( new Date(parkingData[i].registTime * 1000),"yyyy-MM-dd hh:mm:ss") : '';
						parkingData[i].createTimeText = parkingData[i].createTime ? util.formatDate.format(new Date(parkingData[i].createTime * 1000),"yyyy-MM-dd hh:mm:ss") : '';
						parkingData[i].stateText = parkingData[i].state == 1 ? "启用中" : "已停用";
						parkingData[i].parkAmountText = (parkingData[i].parkAmount || 0) + '元';
						parkingData[i].realPayAmountText = (parkingData[i].realPayAmount || 0) + '元';
						parkingData[i].authTypeText = parkingData[i].authType == 1 ? '公司' : '个人'
					}
					this.parkingData = parkingData;
				}
			});
		},
		//分页
		handleCurrentChange(val) {
			this.filteringData.pageNo = val || this.filteringData.pageNo || 1;
			this.parkinglotList();
		},
		//清空筛选搜索框
		resetInput() {
			Object.keys(this.filteringData).forEach(key => {
				this.filteringData[key] = null;
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
		toParklotP($row,tab){ 
			localStorage.setItem("repData", JSON.stringify(this.filteringData));
			localStorage.setItem("timeData", JSON.stringify(this.defaultTime));
			this.$router.push({
				name: "parkingLotDetail",
				params: { tid: $row.tid,tabs: tab }
			});
		},
		toParklotDetail($row) {
			localStorage.setItem("repData", JSON.stringify(this.filteringData));
			localStorage.setItem("timeData", JSON.stringify(this.defaultTime));
			this.$router.push({ name: "parkingLotDetail", params: { tid: $row.tid } });
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
		goCompile($row){
			localStorage.setItem("repData", JSON.stringify(this.filteringData));
			localStorage.setItem("timeData", JSON.stringify(this.defaultTime));
			this.$router.push({ name: "parkingLotDetail", params: { tid: $row.tid,edit:true } });
		}
	}
}
</script>

<style scoped lang="scss">
</style>