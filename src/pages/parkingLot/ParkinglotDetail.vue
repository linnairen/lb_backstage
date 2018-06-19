<template>
	<section>
		<!--****************顶部***********新建************-->
		<el-row :span="24"  class="clearfix b" style="margin-bottom:20px;">
			<h1 class="l">停车场详情</h1>
		</el-row>
		<el-row class="main" v-loading="loading" element-loading-text="拼命加载中">
			<el-tabs v-model="activeName"  type="card"  @tab-click="handleClick">
			    <el-tab-pane label="关于停车场" name="first">
			    	<el-row class="clearfix caption">
						<h2 class="l">关于停车场</h2>
						<div class="r" style="margin: 0 20px 0 0;font-size: 22px;">当前状态：{{basicMsg.state == 1 ? '启用中' : '已停用'}}</div>
					</el-row>
					<el-row class="clearfix" style="padding-top:10px;" >
						<div  class="clearfix bor">
							<div class="clearfix l" style="width:50%;">
								<div class="t_d"><strong>停车场管理员手机：</strong><span>{{basicMsg.mobile}}</span>
									<!-- <router-link :to="{name:'userdetails',params:{id:basicMsg.applyUserId}}">{{basicMsg.mobile}}</router-link> -->
								</div>
								<div class="t_d"><strong>认证类型：</strong><span>{{['公司','个人'][basicMsg.authType-1]}}</span></div>
								<div class="t_d" v-if="basicMsg.authType == 1">
									<strong>公司名称：</strong>
									<el-input class="ei" v-model="basicMsg.companyName" placeholder="公司名称" style="width:100px;" :disabled="show" @keydown.space.native="$event.returnValue = false"></el-input>
								</div>
								<div class="t_d" v-if="basicMsg.authType == 2">
									<strong>用户姓名：</strong>
									<el-input class="ei" v-model="basicMsg.applyUserRealName" placeholder="用户姓名" style="width:100px;" :disabled="show" @keydown.space.native="$event.returnValue = false"></el-input>
								</div>
								<div class="t_d" v-if="basicMsg.authType == 1">
									<strong>法人姓名：</strong>
									<el-input class="ei" v-model="basicMsg.legalName" placeholder="法人姓名" style="width:120px;" :disabled="show" @keydown.space.native="$event.returnValue = false"></el-input>
								</div>
								<div class="t_d" v-if="basicMsg.authType == 2">
									<strong >身份证号：</strong>
									<el-input class="ei" v-model="basicMsg.identificationCard" placeholder="身份证号" style="width:180px;" :disabled="show" @keydown.space.native="$event.returnValue = false"></el-input>
								</div>
							</div>
							<div class="clearfix l" style="width:50%;">
								<div class="t_d">
									<strong>停车场小程序二维码：</strong>
									<span>
										<el-button icon="el-icon-picture" class="export" style="vertical-align: middle;" type="primary" @click="$showPhoto(qrCode)">查看</el-button>
										<!-- <img :src="qrCode" v-show="showQr" style="width: 200px;height: 200px;position: absolute;top: 0;left: 0;"/> -->
										<a :href="downloadLink" class="export" style="vertical-align: middle;" target="_blank"><i class="el-icon-download"></i>下载</a>
									</span>
								</div>
								<div class="t_d"><strong>认证时间：</strong><span>{{changeTime(basicMsg.createTime) || ''}}</span></div>
								<div class="t_d"><strong>注册时间：</strong><span>{{changeTime(basicMsg.registTime)}}</span></div>
							</div>	
						</div>
						<div  class="clearfix bor">
							<div class="clearfix l" style="width:50%;">
								<div class="t_d">
									<strong>停车场名称：</strong>
									<el-input class="ei" v-model="basicMsg.orgName" placeholder="停车场名称" style="width:240px;" :disabled="show" @keydown.space.native="$event.returnValue = false"></el-input>
								</div>
								<div class="t_d"><strong>详细地址：</strong><span>{{basicMsg.address}}</span></div>
								<div class="t_d">
									<strong>停车场规模：</strong>
									<el-input class="ei" v-model="basicMsg.parkNum" placeholder="规模" style="width: 200px;" :disabled="show" @keydown.space.native="$event.returnValue = false">
										<i slot="append">个</i>
									</el-input>
								</div>
							</div>
							<div class="clearfix l" style="width:50%;">
								<div class="t_d">
									<strong>停车场联系电话：</strong>
									<el-input class="ei" v-model="basicMsg.telphone" placeholder="停车场联系电话" style="width:240px;" :disabled="show" @keydown.space.native="$event.returnValue = false"></el-input>
								</div>
								<div class="t_d"><el-button class="l" style="width:120px;" type="primary" @click="getAddress" v-if="!show">选择地址</el-button></div>
								<div class="t_d" v-if="(basicMsg.businessEnd && basicMsg.businessStart) || !show">
									<strong>营业时间（选）：</strong>
									<el-time-select class="ei" style="width:103px;"
										placeholder="起始时间" :disabled="show"
										v-model="basicMsg.businessStart"
										:picker-options="{ start: '00:00', step: '01:00', end: '23:30'}">
									</el-time-select>
									<el-time-select class="ei" style="width:103px;"
										placeholder="结束时间" :disabled="show"
										v-model="basicMsg.businessEnd"
										:picker-options="{ start: '00:00', step: '01:00', end: '23:30'}">
									</el-time-select>
								</div>
							</div>	
							<div style="text-align: left;color: red;line-height: 50px;padding: 0 14%;"><span>注：平台折扣率、收费标准请在“优惠配置”中修改。</span></div>
						</div>
						<div  class="clearfix bor" v-if="bankMsg">
							<div class="clearfix l" style="width:50%;">
								<div class="t_d"><strong>银行卡类型：</strong><span>{{bankMsg.banCardType}}</span></div>
								<div class="t_d"><strong>银行卡号：</strong><span>{{bankMsg.cardNo}}</span></div>
								<div class="t_d"><strong>预存手机号：</strong><span>{{bankMsg.mobile}}</span></div>
							</div>
							<div class="clearfix l" style="width:50%;">
								<div class="t_d"><strong>开户行：</strong><span>{{bankMsg.bankName}}</span></div>
								<div class="t_d"></div>
								<div class="t_d"><strong>记录时间：</strong><span>{{changeTime(bankMsg.createTime) || ''}}</span></div>
							</div>	
						</div>		
						<div class="clearfix" style="padding: 30px 0 0 50px;"  v-if="imgRoadPhoto.length || imgGroupPhoto.length">
							<div style="width:80px;float:left;font-weight: bold;">认证照片：</div>
							<div class="clearfix picture" style="float:left;" v-if="imgRoadPhoto.length">
								<div class="picture-card"  @click="addIdePic(imgRoadPhoto,imgRoadPhoto[0])">
									<img :src="imgRoadPhoto[0].imgUrl"/>
									<p>停车场路口照片</p>
								</div>
								<div class="picture-card" v-if="imgGroupPhoto.length"  @click="addIdePic(imgGroupPhoto,imgGroupPhoto[0])">
									<img :src="imgGroupPhoto[0].imgUrl"/>
									<p>工作人员合照</p>
								</div>
							</div>
						</div>						
						<div class="clearfix" style="padding: 30px 0 0 50px;" v-if="imgOthersPhoto.length">
							<div style="width:80px;float:left;font-weight: bold;">其他照片：</div>
							<div class="clearfix picture" style="float:left;">
								<div class="picture-card" v-for="item in imgOthersPhoto" @click="addIdePic(imgOthersPhoto,item)">
									<img :src="item.imgUrl"/>
									<p>其他</p>
								</div>
							</div>
						</div>	
					</el-row>	
					<!--保存修改按钮-->
					<el-row style="width:250px;margin:50px auto 0 auto;">
						<div v-if="show">
							<el-button icon="el-icon-edit" type="primary" @click="show = false">编辑</el-button>
						</div>
						<div class="r" v-if="!show">	
							<el-button class="l" style="width:120px;" icon="upload" type="primary" :loading="uploading" @click="setParkinglot">{{uploading?'上传中':'保存'}}</el-button>
							<el-button class="l" style="width:120px;" type="primary" @click="callSet">取消</el-button>
						</div>
					</el-row>								
			    </el-tab-pane>
			    <el-tab-pane label="团队成员" name="second">
			    	<el-row class="clearfix caption">
						<h2 class="l">团队管理</h2>
						<el-button v-if="basicMsg.state >= 1" class="r" style="margin: 0 20px 0 0;"  type="primary" icon="edit" @click="dialogVisible = true">新建团队成员</el-button>
					</el-row>				
					<el-row>
						<el-table v-loading="loading"  element-loading-text="拼命加载中" :data="teamData" border style="width: 100%"  @row-dblclick='toDetail' highlight-current-row>
			    			<el-table-column type="index" label="序号" width="65" header-align="center" align="center"></el-table-column>
							<el-table-column prop="realName" label="姓名"   header-align="center" align="center"></el-table-column>
							<el-table-column prop="nickName" label="昵称" min-width="120" header-align="center" align="center"></el-table-column>
							<el-table-column prop="mobile" label="手机号"   min-width="160" header-align="center" align="center"></el-table-column>
							<el-table-column prop="createTime" label="加入时间" min-width="200" header-align="center" align="center">
								<template slot-scope="scope">
									<span>{{ changeTime(scope.row.createTime) }}</span>
								</template>
							</el-table-column>
							<el-table-column prop="roleId" label="角色" min-width="150" header-align="center" align="center">
								<template slot-scope="scope">
									<span>{{ scope.row.roleId == 1 ? '管理员' : '接单员' }}</span>
								</template>
							</el-table-column>
			    			<el-table-column prop="state" label="状态" width="150" header-align="center" align="center">
								<template slot-scope="scope">
									<el-tag :type="isType(scope.row.state)" close-transition>{{stateText(scope.row.state)}}</el-tag>
								</template>
							</el-table-column>
							<el-table-column v-if="basicMsg.state >= 1"   label="操作"  min-width="220" align='center'>
								<template slot-scope="scope" v-if="scope.row.roleId == 2">
									<!-- <el-button @click="setAdmin(scope.row)" v-if="scope.row.state == 1" type="primary" size="small">转为管理员</el-button> -->
							        <el-button @click="delTeamMember(scope.row)" type="primary" size="small">删除</el-button>
						      	</template>
						   </el-table-column>							
						</el-table>						
					</el-row>
			    </el-tab-pane>
			    <el-tab-pane label="优惠配置" name="third">
			    	<div class="clearfix">
			    		<div style="width: 50%" class="l">
			    			<p class="t_d"><b>预购停车时长：</b><el-input class="ei" v-model="discountData.prepurchaseParkTime" placeholder="预购时长" style="width:240px;" :disabled="!editDiscount" size="small" @keydown.space.native="$event.returnValue = false"><i slot="append">小时</i></el-input></p>
							<p class="t_d"><b>合同折扣率：</b><el-input class="ei" v-model="discountData.discountPark" placeholder="合同折扣" style="width:240px;" :disabled="!editDiscount" size="small" @keydown.space.native="$event.returnValue = false"><i slot="append">折</i></el-input></p>
							<p class="t_d"><b>引导奖励：</b><el-input class="ei" v-model="discountData.rewardAmount" placeholder="奖励金额" style="width:240px;" size="small"  :disabled="!editDiscount"@keydown.space.native="$event.returnValue = false"><i slot="append">元/单</i></el-input></p>
							<p class="t_d"><b>费用计算规则：</b>
								<el-select v-model="discountData.parkAmountRule" placeholder="状态" style="width: 240px;" class="ei" :disabled="!editDiscount">
									<el-option v-for="rule in rulesData" :key="rule.value" :label="rule.text" :value="rule.value"></el-option>
								</el-select>
							</p>
			    		</div>
			    		<div style="width: 50%" class="l">
			    			<p class="t_d"><b>使用周期：</b><el-date-picker class="ei" v-model="defaultTime" type="datetimerange" style="width: 340px;" range-separator="至" start-placeholder="开始日期"  end-placeholder="结束日期"  placeholder="开始日期-结束日期" :disabled="!editDiscount"></el-date-picker></p>
				    		<p class="t_d"><b>平台折扣率：</b><el-input class="ei" v-model="discountData.discount" placeholder="平台折扣" style="width:240px;" size="small" @keydown.space.native="$event.returnValue = false" :disabled="!editDiscount"><i slot="append">折</i></el-input></p>
				    		<p class="t_d"><b>收费标准：</b><el-input class="ei" v-model="discountData.parkFeeHouly" placeholder="每小时停车费" style="width:240px;" size="small" @keydown.space.native="$event.returnValue = false" :disabled="!editDiscount"><i slot="append">元/小时</i></el-input></p>
			    			<p class="t_d"><b>设定执行时间：</b><el-date-picker class="ei" v-model="discountData.executeTime" type="datetime" style="width:240px;" :picker-options="pickerOptions" placeholder="请选择时间"  :disabled="!editDiscount"></el-date-picker></p>
			    		</div>
			    	</div>
			    	<div style="text-align: center;padding: 50px;">
			    		<el-button type="primary" style="width:120px;" v-if="editDiscount" @click="updateCoupon">保存</el-button>
			    		<el-button type="primary" style="width:120px;" v-if="editDiscount" @click="parkinglotDetail();editDiscount = false">取消</el-button>
			    		<el-button type="primary" icon="el-icon-edit" style="width:120px;" v-if="!editDiscount" @click="editDiscount = true">编辑</el-button>
			    	</div>
			    </el-tab-pane>
			    <el-tab-pane label="统计信息" name="forth">
			    	<div style="display: flex;justify-content: center;">
	                    <table class="totalTable" cellpadding="0" cellspacing="0">
	                        <tr>
	                            <th>累计使用时长</th>
	                            <th>累计使用天数</th>
	                            <th>总订单数</th>
	                            <th>实际支付停车费</th>
	                            <th>平均日订单数</th>
	                            <th>平均每单费用</th>
	                        </tr>
	                        <tr>
	                            <td>{{ dealTime(totalData.usedTime || 0) }}</td>
	                            <td>{{ totalData.usedDay || 0 }}天</td>
	                            <td>{{ totalData.orderNum || 0 }}单</td>
	                            <td>{{ totalData.realPayParkAmount || 0 }}元</td>
	                            <td>{{ totalData.orderAverageDay || 0 }}单</td>
	                            <td>{{ totalData.orderAverageAmount || 0 }}元</td>
	                        </tr>
	                        <tr>
	                            <th>平均单数7-13点</th>
	                            <th>平均单数13-22点</th>
	                            <th>平均单数22-7点</th>
	                            <th>平均单数8-19点</th>
	                            <th>保安奖励合计</th>
	                            <th>保安人数</th>
	                        </tr>
	                        <tr>
	                            <td>{{ totalData.averageNumSevenToThirteen || 0 }}单</td>
	                            <td>{{ totalData.averageNumThirteenToTwentytwo || 0 }}单</td>
	                            <td>{{ totalData.averageNumTwentytwoToSeven || 0 }}单</td>
	                            <td>{{ totalData.averageNumEightToNineteen || 0 }}单</td>
	                            <td>{{ totalData.awardAmountCnt || 0 }}元</td>
	                            <td>{{ teamData.length || 0 }}人</td>
	                        </tr>
	                    </table>
	                </div>
			    </el-tab-pane>
			</el-tabs>
		</el-row>	
		<!-- 图片编辑和查看弹窗 -->
		<el-row v-if="addPic" class="sbe" @click.native="shut">
			<img v-if="bigPic.imgUrl" :src="bigPic.imgUrl" class="bg">
			<div class="exa">
				<div class="pic">
					<img class="rotate0" style="height:480px;" src="../../assets/pic.jpg" v-if="!bigPic.imgUrl"/>
					<el-button class="img" v-if="uploadingP" :loading="uploadingP"></el-button>
					<img :class="rotate" :src="bigPic.imgUrl" v-if="bigPic.imgUrl"/>
				</div>
				<div class="btn3" >
					<a class="el-button" :href="bigPic.imgUrl" :download="bigPic.imgUrl"><span>点击下载</span></a>
					<el-button type="primary" style="width:120px;" @click="setrotate($event)">旋转</el-button>
					<el-button type="primary" style="width:120px;">关闭</el-button>
				</div>
			</div>
		</el-row>	
		<el-dialog title="添加"  :visible.sync="dialogVisible" style="minWidth:1600px;">
		  	<el-form ref="form" :model="newParking" label-width="80px" style="width: 60%;margin: auto;">
		  		<el-form-item label="昵称">
				    <el-input v-model="newParking.nickName" style="width: 180px;"></el-input>
				</el-form-item>
		  		<el-form-item label="手机号">
				    <el-input v-model="newParking.mobile" style="width: 180px;" :maxlength="11"></el-input>
				</el-form-item>
		  	</el-form>
		  	<span slot="footer" class="dialog-footer">
		    	<el-button @click="dialogVisible = false">取 消</el-button>
		    	<el-button type="primary" @click="saveTeamMember">确 定</el-button>
		  	</span>
		</el-dialog>	
		<el-row class="clearfix r" style="padding-top: 100px;">
            <el-button style="width:120px;" icon="el-icon-back" @click="$router.go(-1);">返回</el-button>
		</el-row>
	</section>
</template>

<script>
	import { mapGetters,mapActions } from 'vuex'
	import localData from '../../common/js/localData'
	import util from '../../common/js/util'
	import { getQiniuToken,parkinglotDetail,delTeamMember,saveTeamMember,setAdmin,setParkinglot,getPayQrCode,updateCoupon,easykp_config } from '../../api/api'
	
	export default {
		data() {
			return {
				imgAddress : '',      //图片地址
				activeName: 'first',
				tid: '',
				parkingInfo: {},
				parkingInfoImg: [],
				teamData: [],
				teamState: [],
				newParking: {
					nickName: null,
					mobile: null
				},
				rotate: 'rotate0',
				dialogVisible: false,
				loading: false,
				addPic: false,
				uploadingP: false,
				basicMsg:{},
				bankMsg:null,
				imgGroupPhoto:[],
				imgRoadPhoto:[],
				imgOthersPhoto:[],
				bigPic:{imgUrl:''},
				show: true,
				uploading:false,
				totalData: {},
				destinationInfo: null,
				qrCode: '',
				downloadLink: '',
				discountData: {
					parkAmountRule: '',prepurchaseParkTime: '',rewardAmount: '',discountPark: '',discount: '',parkFeeHouly: '',executeTime: ''
				},
				defaultTime: [],
				rulesData: [],
				pickerOptions: {
					disabledDate: function (time) {
						let now = new Date()
						return now.getTime() > time.getTime()
					}
				},
				editDiscount: false
			}
		},
		created() {
			this.rulesData = localData.rulesData;
			this.tid = this.$route.params.tid;
			this.show = this.$route.params.edit ? false : true;
			this.activeName = this.$route.params.tabs || 'first';
			this.teamState = localData.teamState;
			this.imgAddress = easykp_config.imgAddress
		},
		mounted() {
			this.parkinglotDetail()
			this.qrCode =  this.getPayQrCode(1)
			this.downloadLink = this.getPayQrCode(2)
		},
		methods: {
			parkinglotDetail(){    //获取停车场详情
				parkinglotDetail({tid:this.tid}).then( data => {
					if(data.code == 200){
						data.rs.basicMsg.businessStart = this.changeHour(data.rs.basicMsg.businessStart)
						data.rs.basicMsg.businessEnd = this.changeHour(data.rs.basicMsg.businessEnd)
						data.rs.basicMsg.discount *= 10
						this.basicMsg = data.rs.basicMsg;
						data.rs.bankMsg && (this.bankMsg = data.rs.bankMsg);
						this.imgGroupPhoto =  data.rs.imgGroupPhoto ? [{imgUrl: data.rs.imgGroupPhoto}] : [];
						this.imgRoadPhoto = data.rs.imgRoadPhoto ? [{imgUrl: data.rs.imgRoadPhoto}] : [];
						this.imgOthersPhoto = [];
						if(data.rs.imgOthersPhoto.length) {
							for(let i=0;i<data.rs.imgOthersPhoto.length;i++){
								this.imgOthersPhoto.push({
									imgUrl: data.rs.imgOthersPhoto[i]
								});
							}
						}
						this.teamData = data.rs.teamUserList
						this.totalData = data.rs.parkOrgStatistics
						this.discountData.prepurchaseParkTime = data.rs.basicMsg.prepurchaseParkTime || ''
						this.discountData.discountPark = data.rs.basicMsg.discountPark*10 || ''
						this.discountData.rewardAmount = data.rs.basicMsg.rewardAmount || ''
						this.discountData.parkAmountRule = data.rs.basicMsg.parkAmountRule || ''
						this.discountData.discount = data.rs.basicMsg.discount || ''
						this.discountData.parkFeeHouly = data.rs.basicMsg.parkFeeHouly || ''
						this.discountData.executeTime = data.rs.basicMsg.executeTime ? new Date(data.rs.basicMsg.executeTime*1000) : ''
						this.defaultTime = data.rs.basicMsg.useTimeStart && data.rs.basicMsg.useTimeEnd ? [new Date(data.rs.basicMsg.useTimeStart*1000),new Date(data.rs.basicMsg.useTimeEnd*1000)] : ''
					}
				})
			},
			setParkinglot(){//修改停车场信息
				this.uploading = true;
				let par = {};
				let pars = ['tid','state','identificationCard','orgName','applyUserRealName','parkNum','parkFeeHouly','legalName','companyName','businessStart','businessEnd','telphone','discount','address']
				for(let i =0; i < pars.length; i++){
					if(pars[i] == 'businessStart' || pars[i] == 'businessEnd') {
						par[pars[i]] = ( (this.basicMsg[pars[i]] && this.basicMsg[pars[i]] !== -9 && this.basicMsg[pars[i]] !== '') || this.basicMsg[pars[i]] === 0) ? parseInt(this.basicMsg[pars[i]]) : -9;
					}
					else if(this.basicMsg[pars[i]]){
						par[pars[i]] = this.basicMsg[pars[i]];
					}else{
						if(pars[i] == 'applyUserRealName' || pars[i] == 'identificationCard' || pars[i] == 'companyName' || pars[i] == 'legalName'){
							par[pars[i]] = null;
						}else{
							this.uploading = false;
							this.$message.error('必填项'+ pars[i] +'不能为空');
							return;
						}
					}
				}
				par.cityId = this.basicMsg.cityId
				par.cityName = this.basicMsg.cityName
				par.gaodeLng = this.basicMsg.gaodeLng
				par.gaodeLat = this.basicMsg.gaodeLat
				par.discount /= 10
				setParkinglot(par).then(data => {
					if(data.code == 200){
						this.$message.success('修改成功');
						this.show = true;
						this.parkinglotDetail()
					}
					this.uploading = false;
				}).catch( data => {
					this.uploading = false;
				})
			},
			getAddress () {
				this.$getMapInfo(true,this.destinationInfo,obj => {
					this.destinationInfo = obj
					this.basicMsg.gaodeLng = obj.longitude
					this.basicMsg.gaodeLat = obj.latitude
					this.basicMsg.address = obj.address
					this.basicMsg.cityId = obj.city.id
					this.basicMsg.cityName = obj.city.name
				})
			},
			getPayQrCode (type) {
				return getPayQrCode({
					tid: this.tid,
					downloadType: type
				})
			},
			updateCoupon () {
				let params = {
					tid: this.tid,
					prepurchaseParkTime: this.discountData.prepurchaseParkTime,
					discountPark: this.discountData.discountPark,
					parkAmountRule: this.discountData.parkAmountRule,
					executeTime: this.discountData.executeTime ? this.discountData.executeTime.getTime() / 1000 : null,
					rewardAmount: this.discountData.rewardAmount,
					useTimeStart: this.defaultTime ? Date.parse(this.defaultTime[0]) / 1000 : null,
					useTimeEnd: this.defaultTime ? Date.parse(this.defaultTime[1]) / 1000 : null,
					parkFeeHouly: this.discountData.parkFeeHouly,
					discount: this.discountData.discount
				}
				let paramsText = {
					prepurchaseParkTime: '预购时长',
					discountPark: '合同折扣',
					parkAmountRule: '计费规则',
					rewardAmount: '奖励金额',
					useTimeStart: '使用周期',
					useTimeEnd: '使用周期',
					parkFeeHouly: '收费标准',
					discount: '平台折扣',
					executeTime: '执行时间'
				}
				for(let i in paramsText){
					if(params[i] === null || (params[i] + '').match(/^\s*$/)){
						this.$message.error(paramsText[i] + '有误')
						return
					}
				}
				updateCoupon (params).then(res => {
					if(res.code == 200){
						this.$message.success('修改成功')
						this.discountData = {}
						this.defaultTime = {}
						this.editDiscount = false
						this.parkinglotDetail()
					}
				})
			},
			delTeamMember($row) {    //删除团队成员
				this.$confirm('确认删除成员?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          	delTeamMember({parkUserTid:$row.tid}).then( data => {
						if(data.code == 200){
							this.$message.success('删除成功')
							this.parkinglotDetail()
						}
					})
		        })
			},
			saveTeamMember() {   //新增团队成员
				if(this.newParking.nickName.match(/^\s*$/)){
					this.$message.error('请填写昵称')
					return
				}
				if(!this.newParking.mobile.match(/^1[3456789]\d{9}$/)){
					this.$message.error('请填写正确的手机号')
					return
				}

				this.newParking.parkingId = this.tid
				saveTeamMember(this.newParking).then( data => {
					if(data.code == 200){
						this.$message.success('添加成功')
						this.dialogVisible = false
						this.newParking = {}
						this.parkinglotDetail()
					}
				})
			},
			setAdmin($row) {    //设为管理员
				setAdmin({parkingId: $row.parkingId,parkUserTid:$row.tid}).then( data => {
					if(data.code == 200){
						this.$notify.success('设置成功')
						this.parkinglotDetail()
					}
				})
			},
			setrotate(e) {   //图片旋转
				this.stop(e)
				switch(this.rotate){
					case 'rotate0': this.rotate = 'rotate90'; return
					case 'rotate90': this.rotate = 'rotate180'; return
					case 'rotate180': this.rotate = 'rotate270'; return
					case 'rotate270': this.rotate = 'rotate360';setTimeout(() => {this.rotate = 'rotate0'},600);return
				}
			},
			setMm() { this.mm = true;this.mm = false; },	//解决无法change的选择器
			shut() {  // 照片上传中不能其他操作
				if(!this.uploadingP){
					this.addPic = false
				}else{
					this.$message.error("照片上传中")
				}
			},		
			getQiniuToken() {  //获取七牛私有token
				if(!this.show){
					getQiniuToken({type: 1}).then(data => { 
						data.code == 200 && (this.token = data.rs) 
					})
				}	
			},
			compile() {   //
				if(this.inForMation.state == 2){
					return
				}
				this.show = false
			},
			stop(e) {   //阻止冒泡
				window.event? window.event.cancelBubble = true : e.stopPropagation()
			},
			addIdePic($bigPicList,$img) {   //身份信息图片
				this.rotate = 'rotate0'
				this.addPic = true
				this.bigPicList = $bigPicList
				this.bigPic = $img
				// this.getQiniuToken()
			},
			addUpFile(obj) {
				if (!obj.files.length) return
				let files = Array.prototype.slice.call(obj.files)
				files.forEach(file => { this.addHandleUpload(file) })
			},
			addHandleUpload(file){
				this.uploadingP = true
				let qiniuKey = new Date().getTime()  + Math.floor(9000 * Math.random() + 1000)
				if(/\/(?:jpeg|png|gif|bmp|jpg)/i.test(file.type)){
					util.chooseAllFile(file,this.token,this.addUploadCallBack,qiniuKey + '.' + file.type.split('/')[1])
				}else{
					this.$message.error('请选择图片')
					this.uploadingP = false
				}
			},
			addUploadCallBack(res){
				if(this.bigPic.imgUrl){
					this.bigPic.imgUrl = res.key
				}else{
					this.bigPic.imgUrl = res.key
					this.bigPicList.push(this.bigPic)
				}
				this.uploadingP = false
				this.rotate = 'rotate0'
			},
			callSet(){
				this.show = true
				this.trialOver = true
				this.parkinglotDetail()
				// this.destDetailInfo()
			},
			toDetail($row) {
				this.$router.push({ name: "protectorDetail", params: { tid: $row.tid } });
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
			changeTime (time) { //转换时间格式
				return time ? util.formatDate.format(new Date(time * 1000),'yyyy-MM-dd hh:mm:ss') : ''
			},
			changeHour (time) {
				return time || time == 0 ? (((time + '').length == 1 ? '0' : '') + time + ':00') : ''
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
	.picture{
		.picture-card{
			position: relative;
			width: 200px;
			float: left;
			img{
				display: block;
				width: 150px;
				height: 100px;
				border-radius: 10px;
				margin: 0 auto;
				-webkit-box-shadow: #ccc 0 5px 15px;  
				-moz-box-shadow: #ccc 0 5px 15px; 
				-o-box-shadow: #ccc 0 5px 15px;  
				box-shadow: #ccc 0 5px 15px; 
			}
			p{
				width: 100%;
				text-align: center;
				height: 40px;
				line-height: 40px;
				padding: 0;
			}
			input{
				display: block;
				position: absolute;
				top: 0px;
				left: 0px;
				width: 100%;
				height: 100%;
				z-index: 99;
				opacity: 0;
			}
		}
		.picture-card:hover img{
			border: 1px solid rgb(32,160,255);
			width: 148px;
			height: 98px;
		}
	}

	.t_d{
		line-height: 1.5;
		height: 1.5em;
		padding: 1em 0;
		strong,b{
			display: inline-block;
			width: 35%;
			text-align: right;
			vertical-align: top;
		}
		span{
			display: inline-block;
			width: 60%;
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

	.ei{
		margin-top: -10px;
	}
	.cv_box{
		text-align: center;
		width: 600px;
		height: 500px;
		margin: 0 auto;
		background: #fff;
		border: 1px solid #eee;
		ul{
			display: flex;
			justify-content: space-around;
			border-bottom: 1px solid #eee;
			li{
				width: 3.5em;
				font-size: 20px;
				height: 3em;
				line-height: 3;
				text-align: center;
				box-sizing: border-box;
			}
			.on{
				border-bottom: 3px solid #ef9848;
			}
		}
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