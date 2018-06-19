<template>
    <section>
        <!--头部-->
        <el-row class="clearfix b" style="margin-bottom:20px;">
            <h1 class="l">订单详情</h1> 
            <el-row class="r"  style="margin: 20px 20px 0 0;" ></el-row>
        </el-row>
        <el-row>
            <div style="text-align: right;">
                <strong>订单编号：</strong> <span>{{orderData.oderNo}}</span>
                <!-- <strong style="margin-left: 20px;">生命周期：</strong><span>{{dealText(orderData.lifeCycle,lifeCycles)}}</span>  -->
                <strong style="margin-left: 20px;">订单状态：</strong><span>{{dealText(orderData.state,orderState)}}</span>
            </div>
        </el-row>
        <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
            <el-tab-pane label="订单信息" name="first" class="clearfix">
                <div class="clearfix" style="padding: 20px 0;border-bottom: 1px solid #eee;">
                    <div class="l" style="width:50%;">
                        <div class="t_d"><strong>客户姓名：</strong><span>{{orderData.userName}}</span></div>
                        <div class="t_d"><strong>车牌号：</strong><span>{{orderData.plateNumber}}</span></div>
                        <div class="t_d"><strong>车辆颜色：</strong><span>{{orderData.carColor}}</span></div>
                    </div>
                    <div class="l" style="width:50%;">
                        <div class="t_d"><strong>车主手机：</strong><span>{{orderData.mobile}}</span></div>
                        <div class="t_d"><strong>车辆型号：</strong><span>{{orderData.carModel}}</span></div>
                        <div class="t_d"><strong>城市：</strong><span>{{orderData.cityName}}</span></div>
                    </div>
                </div>
                <div class="clearfix" style="padding: 20px 0;border-bottom: 2px solid #eee;">
                    <div class="l" style="width:50%;">
                        <div class="t_d"><strong>停车场名称：</strong><span>{{orderData.parkingName}}</span></div>
                        <div class="t_d"><strong>停车场地址：</strong><span>{{orderData.parkingAddr}}</span></div>
                        <div class="t_d"><strong>停车场规模：</strong><span>{{orderData.parkNum}}个</span></div>
                    </div>
                    <div class="l" style="width:50%;">
                        <div class="t_d"><strong>停车场联系电话：</strong><span>{{orderData.parkingMobile}}</span></div>
                        <div class="t_d"><strong>停车场收费标准：</strong><span>{{orderData.parkFeeHourly}}元/小时</span></div>
                        <div class="t_d"><strong>营业时间：</strong><span>{{ ((orderData.businessStart + '').length == 1 ? '0' : '') + orderData.businessStart }}:00至{{ ((orderData.businessEnd + '').length == 1 ? '0' : '') + orderData.businessEnd }}:00</span></div>
                    </div>
                </div>
                <div class="clearfix" style="padding: 20px 0;">
                    <div class="l" style="width:50%;">
                        <div class="t_d" v-show="orderData.parkStartTime"><strong>入场时间：</strong><span>{{changeTime(orderData.parkStartTime)}}</span></div>
                        <div class="t_d"><strong>停车时长：</strong><span>{{ dealTime(orderData.parkEndTime - orderData.parkStartTime) }}</span></div>
                        <div class="t_d" v-show="orderData.grabTime"><strong>完成时间：</strong><span>{{changeTime(orderData.grabTime)}}</span></div>
                        <div class="t_d" v-show="orderData.refundAmount"><strong>退费金额：</strong><span>{{ orderData.refundAmount }}</span></div>
                        <div class="t_d" v-show="orderData.refundTime"><strong>退费时间：</strong><span>{{changeTime(orderData.refundTime)}}</span></div>
                        <div class="t_d" v-show="orderData.compensateCouponAmount"><strong>补券金额：</strong><span>{{ orderData.compensateCouponAmount }}</span></div>
                        <div class="t_d" v-show="orderData.compensateTime"><strong>补券时间：</strong><span>{{changeTime(orderData.compensateTime)}}</span></div>
                    </div>
                    <div class="l" style="width:50%;">
                        <div class="t_d" v-show="orderData.parkEndTime"><strong>离场时间：</strong><span>{{changeTime(orderData.parkEndTime)}}</span></div>
                        <div class="t_d" v-show="orderData.grabUserName"><strong>接单人姓名：</strong><span>{{ orderData.grabUserName }}</span></div>
                        <div class="t_d" v-show="orderData.refundOperName"><strong>退费操作人：</strong><span>{{ orderData.refundOperName }}</span></div>
                        <div class="t_d" v-show="orderData.refundTime"><strong>退费备注：</strong><span>{{ orderData.refundContent }}</span></div>
                        <div class="t_d" v-show="orderData.compensateOperName"><strong>补券操作人：</strong><span>{{ orderData.compensateOperName }}</span></div>
                        <div class="t_d" v-show="orderData.compensateTime"><strong>补券备注：</strong><span>{{ orderData.compensateContent }}</span></div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="费用信息" name="second">
                <div style="display: flex;justify-content: center;">
                    <table class="totalTable" cellpadding="0" cellspacing="0">
                        <tr>
                            <th>订单费用</th>
                            <th>合同折扣</th>
                            <th>优惠券 | 折扣</th>
                            <th>退费</th>
                            <th>微信手续费</th>
                            <th>补券</th>
                            <th>引导奖励</th>
                        </tr>
                        <tr>
                            <td>{{ orderData.parkAmount || 0 }} 元</td>
                            <td>{{ ((1 - (orderData.discountPark || 0.8))*(orderData.parkAmount || 0)).toFixed(2) }} 元</td>
                            <td>{{ orderData.parkCouponAmount || orderData.discountAmount }} 元</td>
                            <td>{{ orderData.refundAmount || 0 }} 元</td>
                            <td>{{ orderData.proceduresAmount  || 0 }} 元</td>
                            <td>{{ orderData.compensateCouponAmount || 0 }} 元</td>
                            <td>{{ orderData.awardAmount || 0 }} 元</td>
                        </tr>
                        <tr>
                            <td colspan="9" style="text-align: left;">订单费用=收费标准（原价停车费）*停车时长= <b style="color: #ff9938;font-size: 18px;">{{ orderData.parkAmount }}</b> 元</td>
                        </tr>
                        <tr>
                            <td colspan="9" style="text-align: left;">保安收入=引导奖励= <b style="color: #ff9938;font-size: 18px;">{{ orderData.awardAmount || 0 }}</b> 元</td>
                        </tr>
                        <tr>
                            <td colspan="9" style="text-align: left;">平台收入=订单费用-平台补贴（优惠券 | 折扣）-退费= <b style="color: #ff9938;font-size: 18px;">{{ (orderData.parkAmount - (orderData.parkCouponAmount || orderData.discountAmount) - (orderData.refundAmount || 0)).toFixed(2) }}</b> 元</td>
                        </tr>
                        <tr>
                            <td colspan="9" style="text-align: left;">平台支出=（订单费用*合同折扣率）+退费+微信手续费+补券+引导奖励= <b style="color: #ff9938;font-size: 18px;">{{ (orderData.parkAmount*(orderData.discountPark || 0.8) + (orderData.refundAmount || 0) + (orderData.proceduresAmount || 0) + (orderData.compensateCouponAmount || 0) + (orderData.awardAmount || 0)).toFixed(2) }}</b> 元</td>
                        </tr>
                        <tr>
                            <td colspan="9" style="text-align: left;"> 平台盈亏=（订单费用-平台补贴）-（订单费用*合同折扣率）-退费-补券-微信手续费－引导奖励= <b style="color: #ff9938;font-size: 18px;">{{ (orderData.parkAmount - (orderData.parkCouponAmount || orderData.discountAmount) - orderData.parkAmount*(orderData.discountPark || 0.8) - (orderData.refundAmount || 0) - (orderData.proceduresAmount || 0) - (orderData.compensateCouponAmount || 0) - (orderData.awardAmount || 0)).toFixed(2) }}</b> 元</td>
                        </tr>
                    </table>
                </div>
            </el-tab-pane>
            <el-tab-pane label="收到订单的保安信息" name="third">

                <el-table v-loading="loading"  element-loading-text="拼命加载中" :data="orderData.pushUserList" border style="width: 100%" max-height="600" highlight-current-row>
                    <el-table-column type="index" label="序号" width="65" header-align="center" align="center"></el-table-column>
                    <!-- <el-table-column prop="orgName" label="停车场名称" min-width="120" header-align="center" align="center"></el-table-column> -->
                    <el-table-column prop="grabUserId" label="保安编号" min-width="125" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="grabUserName" label="保安姓名" min-width="125" header-align="center" align="center"></el-table-column>
                    <el-table-column prop="state" label="抢单状态" min-width="150" header-align="center" align="center">
                        <template slot-scope="scope">
                            <el-tag :type="isType(scope.row.grabUserId == orderData.grabUserId ? 1 : 0)" close-transition>{{dealText(scope.row.grabUserId == orderData.grabUserId ? 1 : 0,recState)}}</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
                
                <el-pagination :current-page="pageNo" @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" :total="total" class="r" style="margin-top:20px;"></el-pagination>
            </el-tab-pane>
        </el-tabs>
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
                orderData: {
                    orgName: '',companyName:'',oderSenderUserRealName: '',parkNum: '',parkFeeHourly: '',legalName:'',appointmentMoney: 0,thankFee: 0,createTime:'',cancelTime:'',grabTime: ''
                },
                costData: {},
                parksData: [],
                pageNo: 1,
                loading: false,
                show: true,
                lifeCycles: [],
                orderState: [],
                recState: [{value: -1,text: '拒绝接单'} ,{ value: 0,text: '未接单'} , {value: 1,text: '已接单'}],
                payType: [],
                text: [ { value: -1,text: '拒绝接单'}, { value: 0,text: '未接单'}, {value: 1, text: '已接单'} , {value: -2, text: '已接单'}],
                total: 0,
                activeName: 'first'
            }
        },
        created() {
            this.orderNo = this.$route.params.orderNo
            this.lifeCycles = localData.lifeCycle
            this.orderState = localData.orderState
            this.payType = localData.payType
        },
        mounted() {
            this.getParkOrderDeatil()
            // this.getSendParkOrg()
            // this.getCostDetail()
        },
        methods: {
            getParkOrderDeatil() {
                getParkOrderDeatil({orderNo:this.orderNo}).then( data => {
                    if(data.code == 200){                       
                        this.orderData = data.rs
                        this.total = data.rs.pushUserList.length
                    }
                })
            },
            handleClick () {

            },
            // getCostDetail () {
            //     getCostDetail({ orderNo:this.orderNo }).then(res => {
            //         if(res.code == 200){                       
            //             this.costData = res.rs
            //         }
            //     })
            // },
            changeTime (time) {
                return time ? util.formatDate.format(new Date(time * 1000),'yyyy-MM-dd hh:mm:ss') : ''
            },
            dealTime (time) { //转换时间格式
                let hour = time ? ~~(time / 3600) : 0,
                    minite = time ? ~~(time % 3600 / 60) : 0,
                    second = time ? ~~(time % 60) : 0
                return ((hour + '').length == 1 ? '0' : '') + hour + ':' + ((minite + '').length == 1 ? '0' : '') + minite + ':' + ((second + '').length == 1 ? '0' : '') + second
            },
            // getSendParkOrg () {
            //     getSendParkOrg({orderNo:this.orderNo,pageNo: this.pageNo}).then(res => {
            //         // console.log(res)
            //         if(res.code == 200){
            //             this.parksData = res.rs.pageList
            //             this.total = res.rs.count
            //         }
            //     })
            // },
            handleCurrentChange(val) {  //分页 
                this.pageNo = val || this.pageNo || 1
                this.getSendParkOrg()
            },
            isType(state) {    //状态颜色参数
                switch(state){
                    case -4: return 'danger' ;
                    case -3: return 'danger' ;
                    case -2: return 'primary' ;
                    case -1: return 'warning' ;
                    case 0: return 'warning' ;              
                    case 1: return 'primary' ;  
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
            dealText (value,list) {
                for(var i = 0;i < list.length; i++){
                    if(value == list[i].value) return list[i].text;
                }
            },
            stateText(state) {
                for(var i = 0;i < this.orderState.length; i++){
                    if(state == this.orderState[i].value) return this.orderState[i].text;
                }
            },
            lifeCycleText(lifeCycle) {
                for(var i = 0;i < this.lifeCycles.length; i++){
                    if(lifeCycle == this.lifeCycles[i].value) return this.lifeCycles[i].text;
                }
            },
            toParkDetail($row){//前往订单详情  需要权限
                this.$router.push({name:"parkingLotDetail",params:{tid:$row.parkingId}})
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
            width: 30%;
            text-align: right;
            vertical-align: top;
        }
        span{
            display: inline-block;
            width: 70%;
            text-align: left;
            white-space: pre-wrap;
            word-wrap: normal;
            box-sizing: border-box;
            padding: 0 1em;
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