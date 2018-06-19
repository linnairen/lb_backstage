<template>
	<section>
		<!--****************顶部***********新建************-->
		<el-row :span="24"  class="clearfix b" style="margin-bottom:20px;">
			<h1 class="l">保安详情</h1>
		</el-row>
		<el-row class="main" v-loading="loading" element-loading-text="拼命加载中">
	    	<el-row class="clearfix caption">
				<h2 class="l">保安信息</h2>
			</el-row>
			<el-row class="clearfix bor" style="padding-top:10px;margin: 0 20px;" >
				<div  class="clearfix">
					<div class="clearfix l" style="width:50%;">
						<div class="t_d"><strong>停车场名称</strong><span>{{detailData.parkingName}}</span></div>
						<div class="t_d"><strong>保安昵称</strong><span>{{detailData.nickName}}</span></div>
						<div class="t_d"><strong>手机号码</strong><span>{{detailData.mobile}}</span></div>
						<div class="t_d"><strong>注册时间</strong><span>{{changeTime(detailData.registTime)}}</span></div>
					</div>
					<div class="clearfix l" style="width:50%;">
						<div class="t_d"><strong>真实姓名</strong><span>{{detailData.realName}}</span></div>
						<div class="t_d"><strong>身份证号码</strong><span>{{detailData.idCardNo}}</span></div>
						<div class="t_d"><strong>角色</strong><span>{{detailData.roleId == 1 ? '管理员' : '接单员' }}</span></div>
					</div>	
				</div>
			</el-row>
			<el-row>
				<div style="display: flex;justify-content: center;padding: 20px;">
                    <table class="totalTable" cellpadding="0" cellspacing="0">
                        <tr>
                            <th>奖励累计</th>
                            <th>余额</th>
                            <th>订单总数</th>
                            <th>停车费（实收）合计</th>
                            <th>平均日单数</th>
                            <th>每单平均费用</th>
                        </tr>
                        <tr>
                            <td>{{detailData.rewardAmount}}元</td>
                            <td>{{detailData.overAmount}}元</td>
                            <td>{{detailData.orderNum}}单</td>
                            <td>{{detailData.parkAmount}}元</td>
                            <td>{{detailData.dayAverageOrder}}单</td>
                            <td>{{detailData.orderAverageAmount}}元</td>
                        </tr>
                    </table>
                </div>
			</el-row>
		</el-row>
		<el-row class="clearfix r" style="padding-top: 100px;">
            <el-button style="width:120px;" icon="el-icon-back" @click="$router.go(-1);">返回</el-button>
		</el-row>
	</section>
</template>

<script>
	import { mapGetters,mapActions } from 'vuex'
	import localData from '../../common/js/localData'
	import util from '../../common/js/util'
	import { getParkOrgUserDetail } from '../../api/api'
	
	export default {
		data() {
			return {
				detailData: {},
				loading: false
			}
		},
		created() {
			this.tid = this.$route.params.tid;
		},
		mounted() {
			this.getParkOrgUserDetail()
		},
		methods: {
			getParkOrgUserDetail(){    //获取停车场详情
				getParkOrgUserDetail({tid:this.tid}).then( data => {
					if(data.code == 200){
						this.detailData = data.rs
					}
				})
			},
			stop(e) {   //阻止冒泡
				window.event? window.event.cancelBubble = true : e.stopPropagation()
			},
			isType(state) {    //状态颜色参数
				switch(state){
					case -9: return 'danger' 
					case -2: return 'danger' 
					case -1: return 'danger' 
					case 0: return 'warning'  				
					case 1: return 'primary' 	
					case 2: return 'primary' 					
					case 3: return 'success' 
					case 5: return 'gray' 
					case 6: return 'success' 
				}
			},
			changeTime (time) { //转换时间格式
				return time ? util.formatDate.format(new Date(time * 1000),'yyyy-MM-dd hh:mm:ss') : ''
			},
			stateText(state) {
				for(var i = 0;i < this.teamState.length; i++){
					if(state == this.teamState[i].value) {
						return this.teamState[i].text
					}
				}
			},
			startDraw (arr,one) {
				drawLine.drawMap('cv',one,['周一','周二','周三','周四','周五','周六','周日'])
				drawLine.draw(arr)
			},
            dealTime (time) { //转换时间格式
                let hour = time ? ~~(time / 3600) : 0,
                    minite = time ? ~~(time % 3600 / 60) : 0,
                    second = time ? ~~(time % 60) : 0
                return ((hour + '').length == 1 ? '0' : '') + hour + ':' + ((minite + '').length == 1 ? '0' : '') + minite + ':' + ((second + '').length == 1 ? '0' : '') + second
            },
			handleClick(){
				
			}	
		}
	}
</script>

<style scoped lang="scss">

	.t_d{
		line-height: 1.5;
		height: 1.5em;
		padding: 1em 0;
		strong,b{
			display: inline-block;
			width: 50%;
			text-align: right;
			vertical-align: top;
		}
		strong:after{
			content: '：';
		}
		span{
			display: inline-block;
			width: 50%;
			text-align: left;
			white-space: pre-wrap;
			word-wrap: normal;
		}
	}
	.btn{
		padding-top: 20px;
		display: flex;
		justify-content: space-around;
	}
	.inp{
		line-height: 1.5;
		padding: 2px;
		vertical-align: middle;
		border: 1px solid #aaa;
		border-radius: 5px;
		outline: none;
	}
	.ta{
		display: inline-block;
		vertical-align: top;
		line-height: 1.5;
		border: 1px solid #aaa;
		border-radius: 5px;
		height: 100px;
		width: 260px;
		outline: none;
	}
	.bor{
		border-bottom:1px solid #eee;
	}
	.totalTable{
        width: 100%;
        text-align: center;
        line-height: 3;
        border-left: 1px solid #dfe6ec;
        border-top: 1px solid #dfe6ec;
        tr{
        }
        th{
            font-weight: bold;
            background: #eef1f6;
        }
        td,th{
            padding: 0 10px;
            border-right: 1px solid #dfe6ec;
            border-bottom: 1px solid #dfe6ec;
        }
    }
</style>