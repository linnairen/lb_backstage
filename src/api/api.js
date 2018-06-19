import axios from 'axios';
import qs from 'qs';



const easykp_config = {
    imgAddress: 'http://ovr04x0lk.bkt.clouddn.com/', //线下的公有图片上传地址
    // imgAddress: 'http://img.cheweiditu.com/', //线上的公有图片打开地址
    imagePrivate: 'http://ovr6oetrw.bkt.clouddn.com/', //私有图片上传地址
    //接口调试服务器地址为
    //登录 token
//  武鼎本地
    // auth: 'http://192.168.11.130:8001',
    // m: 'http://192.168.11.130:8003',
//   毅哥本地
	 // auth: 'http://192.168.11.138:8001',
	 // m: 'http://192.168.11.138:8003',
//  测试环境
    auth: 'http://192.168.11.170:8001',
    m: 'http://192.168.11.170:8003',
//   正式服务器地址为
//	 auth: 'http://auth.cheweiditu.com',
//	 m: 'http://system.cheweiditu.com',
	 
	 // auth:'http://lb-auth.cheweiditu.com',
	 // m:'http://lb-sysinter.cheweiditu.com'
	 


};
export {
    easykp_config
};

//域名

// axios.defaults.baseURL = easykp_config.host;





// 七牛token
export const getQiniuToken = params => {
    return axios.get(easykp_config.auth + '/skyauth/qiniu/token/get', { params: params }).then(res => res.data)
};
//获取私有图片链接
export const getPic = params => {
    return axios.get(easykp_config.m + '/skysys/partsPices/qiniuImgUrl', { params: params }).then(res => res.data);
};
//token接口
export const getToken = params => {
    return axios.get(easykp_config.auth + '/skyauth/token/get.shtml', { params: params }).then(res => res.data);
};
//退出登录
export const logOut = params => {
    return axios.get(easykp_config.auth + '/skyauth/oauth/logout.shtml', { params: params }).then(res => res.data);
};
//登录接口
export const requestLogin = params => {
    return axios.post(easykp_config.auth + '/skyauth/oauth/login.shtml?loginType=pwd', params).then(res => res.data);
};
//城市三级联动
export const getUrbLin = params => {
    return axios.get(easykp_config.m + '/skysys/coreArea/cityDivide', { params: params }).then(res => res.data);
};
//权限接口
export const getExtent = params => {
    return axios.get(easykp_config.m + '/skysys/menu/get', { params: params }).then(res => res.data);
};
//开放贷款的城市列表
export const getCityList = params => {
    return axios.get(easykp_config.m + '/skysys/coreArea/openCity', { params: params }).then(res => res.data);
};
//审核人列表
export const getAuditList = params => {
    return axios.get(easykp_config.m + '/skysys/permissionRoleUser/findFirstAuditUser', { params: params }).then(res => res.data);
};
//修改密码
export const setChangePass = params => {
    return axios.post(easykp_config.m + '/skysys/permissionRoleUser/updatePwd', params).then(res => res.data);
};
//特惠小区列表下拉列表
export const getPlotLi = params => {
    return axios.get(easykp_config.m + '/skysys/communityJoint/getCommunityJointList', { params: params }).then(res => res.data);
};

//指派人员
export const getAssPer = params => {
    return axios.post(easykp_config.m + '/skysys/loan/updateFirstAuditUser', params).then(res => res.data);
};







//获取提现列表
export const getWitList = params => {
    return axios.get(easykp_config.m + '/skysys/userRedbagsLog/getUserRedbagsLogList', { params: params }).then(res => res.data);
};
//提现审核
export const getWitAud = params => {
    return axios.get(easykp_config.m + '/skysys/userRedbagsLog/getRedLogsDetail', { params: params }).then(res => res.data);
};
//提现历史
export const getWitHis = params => {
    return axios.get(easykp_config.m + '/skysys/userRedbagsLog/getUserRedLogs', { params: params }).then(res => res.data);
};
//提现确认放款
export const setWitLoa = params => {
    return axios.post(easykp_config.m + '/skysys/userRedbagsLog/update', params).then(res => res.data);
};







//用户列表
export const getUserInfoList = params =>{
	return axios.post(easykp_config.m + '/skysys/userInfoApp/getAppUserInfoList',params).then(res => res.data);
}

//用户信息
export const getAppUserInfo = params =>{
	return axios.get(easykp_config.m + '/skysys/userInfoApp/getAppUserInfo',{ params: params }).then(res => res.data);
}

//修改用户信息
export const updateUserInfo = params =>{
	return axios.get(easykp_config.m + '/skysys/userInfoApp/updateUserInfo',{ params: params }).then(res => res.data);
}

//用户银行卡信息
export const getAppUserBankMsg = params =>{
	return axios.get(easykp_config.m + '/skysys/userInfoApp/getAppUserBankMsg',{ params: params }).then(res => res.data);
}

//用户车辆信息
export const getAppUserCarMsg = params =>{
	return axios.get(easykp_config.m + '/skysys/userInfoApp/getAppUserCarMsg',{ params: params }).then(res => res.data);
}

//编辑用户车辆信息
export const updateCar = params =>{
	return axios.post(easykp_config.m + '/skysys/userInfoApp/updateCar', params).then(res => res.data);
}

//新增车牌号
export const insertPlateNo = params =>{
	return axios.post(easykp_config.m + '/skysys/userInfoApp/insertPlateNo', params).then(res => res.data);
}

//删除车辆信息
export const delCar = params =>{
	return axios.get(easykp_config.m + '/skysys/userInfoApp/delCar', { params: params }).then(res => res.data);
}

//获取实名认证信息
export const authIdentityInfo = params =>{
	return axios.get(easykp_config.m + '/skysys/userInfoApp/authIdentityInfo', { params: params }).then(res => res.data);
}



//停车场认证列表
export const certificationList = params => {
    return axios.get(easykp_config.m + '/skymapsys/org/auth/list', { params: params }).then(res => res.data);
}

//停车场认证详情
export const certificationDetail = params => {
    return axios.get(easykp_config.m + '/skymapsys/org/auth/detail', { params: params }).then(res => res.data);
}

//保存修改停车场信息
export const certificationUpdate = params => {
    return axios.post(easykp_config.m + '/skymapsys/org/auth/update', params).then(res => res.data);
}

//停车场认证审核通过
export const authAuditPass = params => {
    return axios.get(easykp_config.m + '/skymapsys/org/auth/authAuditPass', { params: params }).then(res => res.data);
}

//审核不通过
export const authAuditFail = params => {
    return axios.get(easykp_config.m + '/skymapsys/org/auth/authAuditFail', { params: params }).then(res => res.data);
}




//停车场目的地列表
export const destinationList = params => {
    return axios.get(easykp_config.m + '/skymapsys/parkClassify/detail/list', { params: params }).then(res => res.data);
}

//停车场目的地分类
export const classList = params => {
    return axios.get(easykp_config.m + '/skymapsys/parkClassify/list', { params: params }).then(res => res.data);
}

//停车场目的地分类详情
export const destDetailInfo = params => {
    return axios.get(easykp_config.m + '/skymapsys/parkClassify/detail/info', { params: params }).then(res => res.data);
}

//保存停车场目的地详情
export const destDetailsaveOrUpdate = params => {
    return axios.post(easykp_config.m + '/skymapsys/parkClassify/detail/saveOrUpdate', params).then(res => res.data);
}

//删除停车场目的地详情
export const destDetaildel = params => {
    return axios.post(easykp_config.m + '/skymapsys/parkClassify/detail/del', params).then(res => res.data);
}


//停车场全平台数据
// export const parkinglotFull = params => {
//     return axios.get(easykp_config.m + '/skymapsys/organization/getStatParkOrg', { params: params }).then(res => res.data);
// }
export const parkinglotFull = params => {
    return axios.get(easykp_config.m + '/skymapsys/organization/realTimeData', { params: params }).then(res => res.data);
}

//停车场认证全平台数据
export const certificationFull = params => {
    return axios.get(easykp_config.m + '/skymapsys/org/auth/getStatParkOrgAuth', { params: params }).then(res => res.data);
}

//停车场列表
export const parkinglotList = params => {
    return axios.get(easykp_config.m + '/skymapsys/organization/list', { params: params }).then(res => res.data);
}

//停车场详情
export const parkinglotDetail = params => {
    return axios.get(easykp_config.m + '/skymapsys/organization/detail', { params: params }).then(res => res.data);
}

//停车场二维码
export const getPayQrCode = params => {
    return easykp_config.m + '/skymapsys/organization/getPayQrCode' + reSetParams(params)
}

//添加停车场信息
export const insertParkOrganization = params => {
    return axios.post(easykp_config.m + '/skymapsys/organization/insertParkOrganization', params).then(res => res.data);
}

//修改停车场信息
export const setParkinglot = params => {
    return axios.post(easykp_config.m + '/skymapsys/organization/update', params).then(res => res.data);
}

//停车场团队成员
export const parkingTeamMembers = params => {
    return axios.get(easykp_config.m + '/skymapsys/organization/getTeamMembers', { params: params }).then(res => res.data);
}

//删除停车场团队成员
export const delTeamMember = params => {
    return axios.get(easykp_config.m + '/skymapsys/organization/delTeamMember', { params: params }).then(res => res.data);
}

//新增团队成员
export const saveTeamMember = params => {
    return axios.post(easykp_config.m + '/skymapsys/organization/saveTeamMember', params).then(res => res.data);
};

//设为管理员
export const setAdmin = params => {
    return axios.get(easykp_config.m + '/skymapsys/organization/setAdmin', { params: params }).then(res => res.data);
};

//停用parkingLot /skymapsys/organization/stopParkOrg
export const getParkingLot = params => {
    return axios.get(easykp_config.m + '/skymapsys/organization/stopParkOrg', { params: params }).then(res => res.data);
};

//啟用parkingStart
export const getParkingStart = params => {
    return axios.get(easykp_config.m + '/skymapsys/organization/startParkOrg', { params: params }).then(res => res.data);
};

//停车场统计数据
export const getStatMsg = params => {
    return axios.get(easykp_config.m + '/skymapsys/organization/getStatMsg', { params: params }).then(res => res.data);
};
//修改停车场优惠信息
export const updateCoupon = params => {
    return axios.post(easykp_config.m + '/skymapsys/organization/updateCoupon', params ).then(res => res.data);
};



//保安列表
export const findParkOrgUserList = params => {
    return axios.get(easykp_config.m + '/skymapsys/organization/findParkOrgUserList', { params: params }).then(res => res.data);
};
//保安列表统计
export const getParkOrgUserData = params => {
    return axios.get(easykp_config.m + '/skymapsys/organization/getParkOrgUserData', { params: params }).then(res => res.data);
};
//保安详情
export const getParkOrgUserDetail = params => {
    return axios.get(easykp_config.m + '/skymapsys/organization/getParkOrgUserDetail', { params: params }).then(res => res.data);
};


//人员列表
export const getPerList = params => {
    return axios.post(easykp_config.m + '/skysys/permissionRoleUser/list', params).then(res => res.data);
};
//获取部门部门
export const getDepSur = params => {
    return axios.get(easykp_config.m + '/skysys/permissionRoleUser/orgList', { params: params }).then(res => res.data);
};
//角色列表
export const getMember = params => {
    return axios.get(easykp_config.m + '/skysys/permissionRoleUser/roleList', { params: params }).then(res => res.data);
};
//添加或修改用户
export const setChaPer = params => {
    return axios.post(easykp_config.m + '/skysys/permissionRoleUser/insert', params).then(res => res.data);
};
//进入修改人员
export const getGoAddPer = params => {
    return axios.get(easykp_config.m + '/skysys/permissionRoleUser/findByTid', { params: params }).then(res => res.data);
};
//删除用户
export const setDelPer = params => {
    return axios.get(easykp_config.m + '/skysys/permissionRoleUser/del', { params: params }).then(res => res.data);
};
//重置密码
export const setPerPass = params => {
    return axios.get(easykp_config.m + '/skysys/permissionRoleUser/resetPwd', { params: params }).then(res => res.data);
};


//还款清单
export const reimburseList = params => {
    return axios.post(easykp_config.m + '/skysys/loanUserRepay/getFutureUserRepayDetail', params).then(res => res.data);
};



//订单列表
// export const parkOrderList = params => {
//     return axios.get(easykp_config.m + '/skysys/parkOrder/parkOrderList',  { params: params }).then(res => res.data);
// }
export const parkOrderList = params => {
    return axios.get(easykp_config.m + '/skysys/parkOrder/v120/parkOrderList',  { params: params }).then(res => res.data);
}

//订单详情
// export const getParkOrderDeatil = params => {
//     return axios.get(easykp_config.m + '/skysys/parkOrder/getParkOrderDeatil',  { params: params }).then(res => res.data);
// }
export const getParkOrderDeatil = params => {
    return axios.get(easykp_config.m + '/skysys/parkOrder/v120/deatil',  { params: params }).then(res => res.data);
}

//费用信息
export const getCostDetail = params => {
    return axios.get(easykp_config.m + '/skysys/parkOrder/getCostDetail', { params: params } ).then(res => res.data)
}


//收到订单停车场
export const getSendParkOrg = params => {
    return axios.get(easykp_config.m + '/skysys/parkOrder/getSendParkOrg',  { params: params }).then(res => res.data)
}

//短信发送列表
export const getPageList = params => {
    return axios.get(easykp_config.m + '/skysys/sms/getPageList',  { params: params }).then(res => res.data)
}

//提现列表
export const userDrawCash = params => {
    return axios.get(easykp_config.m + '/skysys/userDrawCash/list',  { params: params }).then(res => res.data)
}

//提现详情
export const userDrawCashDetail = params => {
    return axios.get(easykp_config.m + '/skysys/userDrawCash/detail',  { params: params }).then(res => res.data)
}

//手工提现
export const offDrawCash = params => {
    return axios.get(easykp_config.m + '/skysys/userDrawCash/offDrawCash',  { params: params }).then(res => res.data)
}

//交易列表
export const transaction = params => {
    return axios.get(easykp_config.m + '/skysys/transaction/list',  { params: params }).then(res => res.data)
}

//提现统计
export const getPlatformData = params => {
    return axios.get(easykp_config.m + '/skysys/userDrawCash/getPlatformData',  { params: params }).then(res => res.data)
}

//任务列表
export const getParkTaskList = params => {
    return axios.post(easykp_config.m + '/skysys/logUserOnline/getParkTaskList', params ).then(res => res.data)
}

// //单一发奖
// export const singleSendAward = params => {
//     return axios.get(easykp_config.m + '/skysys/logUserOnline/singleSendAward',  { params: params }).then(res => res.data)
// }

//批量发奖
export const batchSendAward = params => {
    return axios.get(easykp_config.m + '/skysys/logUserOnline/batchSendAward',  { params: params } ).then(res => res.data)
}

//车主列表
export const findCarOwnerList = params => {
    return axios.post(easykp_config.m + '/skysys/userInfoApp/findCarOwnerList', params ).then(res => res.data)
}

//车主详情
export const findCarOwnerInfo = params => {
    return axios.get(easykp_config.m + '/skysys/userInfoApp/findCarOwnerInfo',  { params: params } ).then(res => res.data)
}

//车主统计数据
export const getStatCarUser = params => {
    return axios.get(easykp_config.m + '/skysys/userInfoApp/getStatCarUser',  { params: params } ).then(res => res.data)
}

//服务端退费
// export const refundAmount = params => {
//     return axios.get(easykp_config.m + '/skysys/parkOrder/refundAmount',  { params: params } ).then(res => res.data)
// }
export const refundAmount = params => {
    return axios.post(easykp_config.m + '/skysys/parkOrder/v120/refund',  params ).then(res => res.data)
}

//获取支付状态
// export const getPayState = params => {
//     return axios.get(easykp_config.m + '/skymine/pay/state/get.shtml',  { params: params } ).then(res => res.data)
// }
export const getPayState = params => {
    return axios.get(easykp_config.m + '/skysys/parkOrder/v120/getRefundState',  { params: params } ).then(res => res.data)
}

//补卷
// export const sendCompensateCoupon = params => {
//     return axios.get(easykp_config.m + '/skysys/parkOrder/sendCompensateCoupon',  { params: params } ).then(res => res.data)
// }
export const sendCompensateCoupon = params => {
    return axios.post(easykp_config.m + '/skysys/parkOrder/v120/sendCompensateCoupon',  params ).then(res => res.data)
}

//平台优惠券列表
export const getCouponList = params => {
    return axios.get(easykp_config.m + '/skysys/parkOrder/getCouponList',  { params: params } ).then(res => res.data)
}

//平台取消订单
export const cancelOrder = params => {
    return axios.get(easykp_config.m + '/skysys/parkOrder/cancelOrder',  { params: params } ).then(res => res.data)
}

//锁定用户
export const lockUser = params => {
    return axios.get(easykp_config.m + '/skysys/userInfoApp/lockUser',  { params: params } ).then(res => res.data)
}

//启用用户
export const startUser = params => {
    return axios.get(easykp_config.m + '/skysys/userInfoApp/startUser',  { params: params } ).then(res => res.data)
}

//订单全平台数据
// export const getStatParkOrder = params => {
//     return axios.get(easykp_config.m + '/skysys/parkOrder/getStatParkOrder',  { params: params } ).then(res => res.data)
// }
export const getStatParkOrder = params => {
    return axios.get(easykp_config.m + '/skysys/parkOrder/v120/realTimeData',  { params: params } ).then(res => res.data)
}

function reSetParams(params) {
    let str = ''
    for(let i in params){
        if(i != 'pageNo' && params[i] !== null){
            str += (str == '' ? '?' : '&') + i + '=' + params[i]
        }
    }
    return str
}

//车主导出报表
export const carOwnerOutput = params => {
    return easykp_config.m + '/skysys/userInfoApp/exportXls' + reSetParams(params)
}

//停车场报表导出
export const parkOutput = params => {
    return easykp_config.m + '/skymapsys/organization/exportXls' + reSetParams(params)
}

// 订单报表导出
// export const parkOrderOutput = params => {
//     return easykp_config.m + '/skysys/parkOrder/exportXls' + reSetParams(params)
// }
export const parkOrderOutput = params => {
    return easykp_config.m + '/skysys/parkOrder/v120/exportOrder' + reSetParams(params)
}

// 交易列表导出
export const transactionOutput = params => {
    return easykp_config.m + '/skysys/transaction/exportXls' + reSetParams(params)
}
