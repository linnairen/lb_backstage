<template>
	<section>
		<!--****************顶部******************-->
		<el-row :span="24"  class="clearfix b" style="margin-bottom:20px;">
			<h1 class="l">人员管理</h1>
			<el-button class="r" style="margin: 10px 20px 0 0;" type="primary" suffix-icon="edit" v-if="$store.state.btnPower.PERMISSIONROLEUSER_FINDBYTID" @click="editorial">新建人员</el-button>
		</el-row>
		<el-row class="main" v-loading="loading" element-loading-text="拼命加载中">
			<el-tabs v-model="filteringData.orgId" active-name="filteringData.orgId" type="border-card" @tab-click="handleCurrentChange()">
				<el-tab-pane class="clearfix" :key="index" :disabled="item.state != 1" v-for="(item, index) in secList" 
				:label="item.name" :name="item.tid + ''">
					<div class="clearfix">
						<div class="card l" v-for="(item,index) in perList" :key="index" @dblclick="editorial(item)">
							<div class="por"><img :src="item.headUrl"/></div>
							<p><span>姓名</span>{{item.realName}}</p>
							<p><span>手机号</span>{{item.telphone}}</p>
							<p><span>部门</span>{{getOrg(item.orgId)}}</p>
							<p><span>职位</span>{{item.position}}</p>
							<p><span>角色</span>{{item.name}}</p>
							<p><span>工号</span>{{item.jobNumber}}</p>
						</div>
					</div>
				</el-tab-pane>
				<el-row>
					<el-pagination style="margin: 10px 0 0 15px;" :current-page="filteringData.pageNo" @current-change="handleCurrentChange" small layout=" prev, pager, next" :total="total"></el-pagination>
				</el-row>
			</el-tabs>
		</el-row>
	</section>
</template>

<script>
	import { mapGetters } from 'vuex'
    import { mapActions } from 'vuex'
	import util from '../../common/js/util'
	import NProgress from 'nprogress'
	import qs from 'qs'
	import {getPerList,getDepSur} from '../../api/api'

	export default {
		 data() {
			return {
				loading: true,
				total: null,
				filteringData:{
					pageNo: null,orgId: null
				},
				secList:[],
				perList: [],
			}
		},
		created(){
			this.$store.state.btnPower = JSON.parse(localStorage.getItem('btnPower'));
		},
		mounted(){
			this.getDepSur()
		},
		computed:{
            ...mapGetters([
                'getBtnPower'
			])
		},
		methods: {
			...mapActions([
                'passBtnPower'
			]),
			getDepSur(){  //获取部门列表
				return getDepSur().then(data => {
					if(data.code == 200){
						this.secList = data.rs;
						this.filteringData.orgId = this.secList[0].tid + '';
						this.handleCurrentChange()
					}
				})
			},
			getPerList(){  //获取人员列表
				getPerList(qs.stringify(this.filteringData)).then(data => {
					if(data.code == 200){
						this.total = data.rs.count;
						this.perList = data.rs.pageList;
						this.loading = false;
					}
				})
			},
			getOrg(val){
				for(var i = 0;i < this.secList.length; i++){
					if(val == this.secList[i].tid) return this.secList[i].name;
				}
			},
			handleCurrentChange(val) {  //分页 
				this.filteringData.pageNo = val || this.filteringData.pageNo || 1;
				this.getPerList()
			},
			editorial(val) { //前往人员编辑界面
				if(this.$store.state.btnPower.PERMISSIONROLEUSER_FINDBYTID){
					if(val.tid) {
						this.$router.push({name: 'editorial', params: { id: val.tid }})
					}
					else{
						this.$router.push({name: 'editoriald'}) 
					}
				}else{
					this.$message.error('没有权限');
				}
			},
		}
	}

</script>

<style scoped lang="scss">


	@media screen and (min-width: 1761px) and  (max-width: 1920px){
		.main{
			width: 1476px;
			margin: 0 auto;
		}
	}
	@media screen and (min-width: 1521px) and  (max-width: 1760px){
		.main{
			width: 1236px;
			margin: 0 auto;
		}
	}
	@media screen and (max-width: 1520px) {
		.main{
			width: 996px;
			margin: 0 auto;
		}
	}
	.card{	
		position: relative;
		width: 200px;
		height: 300px;
		margin: 20px;
		color: #444;
		background: -moz-linear-gradient(top, #f5f5f5 0%, #fff  100%);
    	background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#f5f5f5), color-stop(100%,#fff ));
    	background: -webkit-linear-gradient(top, #f5f5f5 0%,#fff  100%);
    	background: -o-linear-gradient(top, #f5f5f5 0%,#fff  100%);
    	background: -ms-linear-gradient(top, #f5f5f5 0%,#fff  100%);
		background: linear-gradient(to bottom, #f5f5f5 0%,#fff  100%);
		-webkit-box-shadow: 0 15px 30px rgba(0,0,0,0.1);
		-moz-box-shadow: 0 15px 30px rgba(0,0,0,0.1);
		-o-box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    	box-shadow: 0 15px 30px rgba(0,0,0,0.1);
		-webkit-transition: all .3s linear;
		-moz-transition: all .3s linear;
		-o-transition: all .3s linear;
    	transition: all .3s linear;
		.mar{
			position: absolute;
			top: 10px;right: 10px;
		}
		.por{
			position: relative;
			width: 200px;
			height: 100px;
			padding: 20px 0 10px 0;
			border-radius: 50%;
			img{
				display: block;
				position: absolute;
				margin: auto;
				top: 0;left: 0;right: 0;bottom: 0;
				width: 100px;
				height: 100px;
				border-radius: 50%;
				-webkit-box-shadow: #aaa 0 3px 15px;  
				-moz-box-shadow: #aaa 0 3px 15px;  
				-o-box-shadow: #aaa 0 3px 15px;  
				box-shadow: #aaa 0 3px 15px; 
				transition: ease-in-out 0.1s;
				-webkit-transition: ease-in-out 0.1s;
				-moz-transition: ease-in-out 0.1s;
				-o-transition: ease-in-out 0.1s;
				transform: rotate(0deg) ;
				-webkit-transform: rotate(0deg);
				-moz-transform: rotate(0deg);
				-o-transform: rotate(0deg);
			}
		}
		p{
			height: 26px;
			line-height: 26px;
			padding-left: 20px;
			span{
				font-weight: bold;
				display: inline-block;
				text-align-last:justify;
				width: 50px;
				padding-right: 10px;
			}
		}
		.y{
			border-radius: 10px;
			background-color: #888;
			margin: auto;
			position: absolute;
			top: 0;left: 0;right: 0;bottom: 0;
		}
		.h{
			width: 60px;
			height: 5px;
		}
		.s{
			width: 5px;
			height: 60px;
		}
	}
	.card:hover {
		color: #fff;
		background: -moz-linear-gradient(top, #a1d5f9 0%, #003b67  100%);
    	background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#a1d5f9), color-stop(100%,#003b67 ));
    	background: -webkit-linear-gradient(top, #a1d5f9 0%,#003b67  100%);
    	background: -o-linear-gradient(top, #a1d5f9 0%,#003b67  100%);
    	background: -ms-linear-gradient(top, #a1d5f9 0%,#003b67  100%);
		background: linear-gradient(to bottom, #a1d5f9 0%,#003b67  100%);
		-webkit-transform: translate3d(0, -3px, 0);
		-moz-transform: translate3d(0, -3px, 0);
		-o-transform: translate3d(0, -3px, 0);
		transform: translate3d(0, -3px, 0);
		-webkit-box-shadow: 0 18px 35px #888;
		-moz-box-shadow: 0 18px 35px #888;
		-o-box-shadow: 0 18px 35px #888;
		box-shadow: 0 18px 35px #888;
		transition: ease-in-out 0.2s;
		-webkit-transition: ease-in-out 0.2s;
		-moz-transition: ease-in-out 0.2s;
		-o-transition: ease-in-out 0.2s;
	}
	.card:hover img{
		-webkit-box-shadow: #eee 0 3px 15px;  
		-moz-box-shadow: #eee 0 3px 15px;  
		-o-box-shadow: #eee 0 3px 15px;  
		box-shadow: #eee 0 3px 15px; 
	}
	.card img:hover{
		transition: ease-in-out 0.1s;
		-webkit-transition: ease-in-out 0.1s;
		-moz-transition: ease-in-out 0.1s;
		-o-transition: ease-in-out 0.1s;
		transform: rotate(360deg) ;
		-webkit-transform: rotate(360deg);
		-moz-transform: rotate(360deg);
		-o-transform: rotate(360deg);
	}
</style>