<template>
    <section>
        <!--头部-->
        <el-row class="clearfix b" style="margin-bottom:20px;">
            <h1 class="l">任务详情</h1> 
            <el-row class="r"  style="margin: 20px 20px 0 0;" ></el-row>
        </el-row>
        
        <el-row>

            <el-table v-loading="loading"  element-loading-text="拼命加载中" :data="tableData" border style="width: 100%" @row-dblclick='toParkDetail'  max-height="600" highlight-current-row>
                <el-table-column prop="orgName" label="被邀请人（客户姓名）" min-width="120" header-align="center" align="center"></el-table-column>
                <el-table-column prop="grabUserName" label="被邀请人（车主手机）" min-width="125" header-align="center" align="center"></el-table-column>
                <el-table-column prop="orgName" label="被邀请人（车牌号）" min-width="120" header-align="center" align="center"></el-table-column>
                <el-table-column prop="grabUserName" label="推荐时间" min-width="125" header-align="center" align="center"></el-table-column>
                <el-table-column prop="orgName" label="推荐成功（注册时间）" min-width="120" header-align="center" align="center"></el-table-column>
                <el-table-column prop="grabUserName" label="首次发单" min-width="125" header-align="center" align="center"></el-table-column>         
                <el-table-column prop="grabUserName" label="订单编号" min-width="125" header-align="center" align="center"></el-table-column>
                <el-table-column prop="orgName" label="停车场名称" min-width="120" header-align="center" align="center"></el-table-column>
                <el-table-column prop="grabUserName" label="订单费用" min-width="125" header-align="center" align="center"></el-table-column>                          
            </el-table>
            
            <!-- *********************分页部分******************** -->
            <el-pagination :current-page="pageNo" @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total" class="r" style="margin-top:20px;"></el-pagination>
        </el-row>
        <!--返回-->       
        <el-row class="clearfix r "  style="padding-top: 20px;">
            <el-button style="width:120px;" icon="el-icon-back" @click="$router.go(-1);">返回</el-button>
        </el-row>
    </section>
</template>

<script>
    import { mapGetters,mapActions } from 'vuex'
    import util from '../../common/js/util'
    import localData from '../../common/js/localData'
    import type from '../../common/js/type'
    import { getParkOrderDeatil,getSendParkOrg,getCostDetail } from '../../api/api'
    import qs from 'qs'
    import NProgress from 'nprogress'

    export default {
        data() {
            return {
                orderNo: null,
                taskData: {
                    orgName: '',companyName:'',oderSenderUserRealName: '',parkNum: '',parkFeeHourly: '',legalName:'',appointmentMoney: 0,thankFee: 0,createTime:'',cancelTime:'',grabTime: ''
                },
                tableData: [],
                pageNo: 1,
                loading: false,
                show: true,
                total: 0
            }
        },
        created() {
            this.orderNo = this.$route.params.orderNo
        },
        mounted() {
            // this.getParkOrderDeatil()
            // this.getSendParkOrg()
            // this.getCostDetail()
        },
        methods: {
            getParkOrderDeatil() {
                // getParkOrderDeatil({orderNo:this.orderNo}).then( data => {
                //     if(data.code == 200){                       
                //         this.taskData = data.rs
                //     }
                // })
            },
            handleClick () {

            },
            changeTime (time) {
                return time ? util.formatDate.format(new Date(time * 1000),'yyyy-MM-dd hh:mm:ss') : ''
            },
            getSendParkOrg () {
                // getSendParkOrg({orderNo:this.orderNo,pageNo: this.pageNo}).then(res => {
                //     // console.log(res)
                //     if(res.code == 200){
                //         this.tableData = res.rs.pageList
                //         this.total = res.rs.count
                //     }
                // })
            },
            handleCurrentChange(val) {  //分页 
                // this.pageNo = val || this.pageNo || 1
                // this.getSendParkOrg()
            },
            isType(state) {    //状态颜色参数
                // switch(state){
                //     case -4: return 'danger' ;
                //     case -3: return 'danger' ;
                //     case -2: return 'primary' ;
                //     case -1: return 'warning' ;
                //     case 0: return 'warning' ;              
                //     case 1: return 'primary' ;  
                //     case 2: return 'primary' ;                  
                //     case 3: return 'success' ;
                //     case 4: return 'danger' ;
                //     case 5: return 'gray' ;
                //     case 6: return 'success' ;
                //     case 7: return 'danger' ;
                //     case 8: return 'gray' ;
                //     case 9: return 'success' ;
                // }
            },
            dealText (value,list) {
                // for(var i = 0;i < list.length; i++){
                //     if(value == list[i].value) return list[i].text;
                // }
            },
            stateText(state) {
                // for(var i = 0;i < this.orderState.length; i++){
                //     if(state == this.orderState[i].value) return this.orderState[i].text;
                // }
            },
            lifeCycleText(lifeCycle) {
                // for(var i = 0;i < this.lifeCycles.length; i++){
                //     if(lifeCycle == this.lifeCycles[i].value) return this.lifeCycles[i].text;
                // }
            },
            toParkDetail($row){//前往订单详情  需要权限
                // this.$router.push({name:"parkingLotDetail",params:{tid:$row.parkingId}})
            }
        }
    }
</script>

<style scoped lang="scss">
    .t_d{
        line-height: 1.5;
        height: 1.5em;
        padding: 1em 0;
        strong{
            display: inline-block;
            width: 50%;
            text-align: right;
            vertical-align: top;
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