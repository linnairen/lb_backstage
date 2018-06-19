<template>
	<section>
		<!--****************顶部***********新建************-->
		<el-row :span="24"  class="clearfix b">
			<h1 class="l">目的地列表</h1>
			<el-button class="r" style="margin: 10px 20px 0 0;"  type="primary" icon="edit" @click="$router.push('/destinationDetail')"  >新建分类</el-button>
		</el-row>
		<!-- *************筛选功能******************* -->
		<el-row>
			<el-form style="width:100%; padding-top:20px;">
				<div class="clearfix">
					
					<!-- 分类-->
					<el-form-item label="分类名称" label-width="80px" style="width:40%;" class="l">
						<el-select v-model="destinationInfo.typeId" placeholder="分类" style="width:150px;">
							<el-option v-for="classif in classification" :key="classif.tid" :label="classif.name" :value="classif.tid"></el-option>
						</el-select>
					</el-form-item>
					
					<!-- 城市 -->
					<el-form-item label="城市" label-width="80px" style="width:45%;" class="l">
						<el-select v-model="destinationInfo.cityId" placeholder="城市" style="width:150px;">
							<el-option v-for="city in cityList" :key="city.id" :label="city.name" :value="city.id"></el-option>
						</el-select>
					</el-form-item>
										
					<!-- 确认按钮 -->
					<el-form-item  style="width: 5%; padding: 0 1%" class="l">
						<el-button type="primary" @click="handleCurrentChange()">搜索</el-button>
					</el-form-item>
					<!-- 重置按钮 -->
					<el-form-item  style="width:5%; padding: 0 1%" class="l">
						<el-button :plain="true" @click="resetInput">重置</el-button>
					</el-form-item>
				</div>
				
			</el-form>
		</el-row>
		<!-- ****************************列表显示**************************** -->
		<el-row>
			<el-table v-loading="loading"  element-loading-text="拼命加载中" :data="destinationData" border style="width: 100%" @row-dblclick='toDetail'  highlight-current-row>
    			<el-table-column type="index" label="序号" width="65" header-align="center" align="center"></el-table-column>
				<el-table-column prop="typeName" label="分类名称" min-width="120" header-align="center" align="center"></el-table-column>
				<el-table-column prop="detailName" label="地址名称" min-width="120" header-align="center" align="center"></el-table-column>
				<el-table-column prop="cityName" label="城市" min-width="120" header-align="center" align="center"></el-table-column>
				<el-table-column prop="address" label="详细地址" min-width="200" header-align="center" align="center"></el-table-column>
				<el-table-column prop="createTime" label="申请时间" min-width="175" header-align="center" align="center"></el-table-column>
			</el-table>
		
			<!-- *********************分页部分******************** -->
			<el-pagination :current-page="destinationInfo.pageNo" @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total" class="r" style="margin-top:20px;"></el-pagination>
		</el-row>	
	</section>
	
</template>

<script>
	import { mapGetters } from 'vuex'
    import { mapActions } from 'vuex'
	import util from '../../common/js/util'
	import localData from '../../common/js/localData'
	import type from '../../common/js/type'
	import { getCityList,classList,destinationList} from '../../api/api'
	import qs from 'qs'
	import NProgress from 'nprogress'
		
	export default{
		data() {
			return {
				destinationInfo: {
					pageNo: null,
				},
				destinationData: [],
				classification: [],
				cityList: [],
				loading: false,
				total: null
			}
		},	
		computed: {
            ...mapGetters([
				'getBtnPower',
				'getTid'
            ])
        },
        created (){
        	this.qToken = decodeURIComponent(util.Cookie.get('skytkn'));
			this.destinationInfo = JSON.parse(localStorage.getItem('destinationInfo')) || this.destinationInfo;
			localStorage.removeItem('destinationInfo');
        	this.getCityList()
        	this.classList()
        },
        mounted() {
			this.handleCurrentChange()
		},
		methods: {
			classList(){   //获取所有分类
				classList().then( data => {
					this.classification = data.rs
				})
			},
			getCityList() {   //获取城市
				getCityList({type:2}).then( data => {
					this.cityList = data.rs 					
				})
			},
			destinationList(){   //获取列表数据
				destinationList(this.destinationInfo).then( data=> {
					if(data.code == 200){
						this.total = data.rs.count;
						let destinationData = data.rs.pageList;
						for(let i=0; i< destinationData.length; i++){
							destinationData[i].createTime = destinationData[i].createTime ? util.formatDate.format(new Date(destinationData[i].createTime * 1000),'yyyy-MM-dd hh:mm:ss') : ''
						}
						this.destinationData = destinationData
					}
				})
			},
			handleCurrentChange(val) {  //分页 
				this.destinationInfo.pageNo = val || this.destinationInfo.pageNo || 1;
				this.destinationList()
			},
			resetInput() {   //清空筛选搜索框
				Object.keys(this.destinationInfo).forEach((key) => {
					this.destinationInfo[key] = null;
				})
				this.msg = null;
				this.handleCurrentChange()
			},
			toDetail($row) {
				localStorage.setItem('destinationInfo', JSON.stringify(this.destinationInfo));
				this.$router.push({name:"destinationDetaild",params:{tid:$row.tid}})
			}
		}
		
	}
</script>

<style scoped lang="scss">

</style>