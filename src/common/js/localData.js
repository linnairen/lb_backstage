//本地定义的所有假数据
const localData = {
    invState: [
        { value: -9, text: '风控初审不通过' },
        { value: -4, text: '风控终审不通过' },
        { value: -2, text: '财务退回' },
        { value: -1, text: '风控驳回' },
        { value: 0, text: '申请未完成' },
        { value: 1, text: '风控审核中' },
        { value: 2, text: '待签约'},
        { value: 3, text: '已签约待邮寄' },
        { value: 4, text: '已邮寄待审核' },
        { value: 5, text: '财务初审' },
        { value: 6, text: '财务终审 '},
        { value: 7, text: '已完成订单 '},
        { value: 9, text: '等待复核 '},
//      新增     
    ],
    audit: [
    	{ value: -9, text: '风控初审不通过' },
        { value: -4, text: '风控终审不通过' },
        { value: -2, text: '财务退回' },
        { value: -1, text: '被驳回' },
        { value: 1, text: '完善订单' },
        { value: 2, text: '风控初审通过'},
        { value: 5, text: '风控终审通过' },
        { value: 6, text: '财务初审通过'},
        { value: 7, text: '已放款'},
    ],
    options: [{
    	value:'',
    	label:'全部'
    },{
      	value: 'a',
      	label: '未通过订单',
      	children: [{
        	value: '-9',
        	label: '风控初审未通过',       
      	},{
      		value: '-4',
        	label: '风控终审未通过', 
      	}]
    },{
		value: '0',
  		label: '申请未完成',  		
    },{
    	value: 'c',
  		label: '风控审核',  
    	children: [{
        	value: '1',
        	label: '风控审核中',       
      	},{
      		value: '-1',
        	label: '风控驳回', 
      	},{
      		value: '9',
        	label: '等待复核', 
      	},{
      		value: '2',
        	label: '待签约', 
      	},{
      		value: '-2',
        	label: '财务退回', 
      	},{
      		value: '3',
        	label: '已签约待邮寄', 
      	},{
      		value: '4',
        	label: '已邮寄待审核', 
      	}]
    },{
    	value: 'd',
        label: '财务审核', 
        children: [{
        	value: '5',
        	label: '财务初审',       
      	},{
      		value: '6',
        	label: '财务终审', 
      	}]
    },{
    	value: '7',
        label: '已完成订单',
    }],
    relationList: [
        { value: 1, label: '配偶' },
        { value: 2, label: '直系亲属' },
        { value: 3, label: '同事' },
        { value: 4, label: '物业' }
    ],
    ideInfors:{
    	"身份信息":[	{ value: 1, text: '联系方式' },
    				{ value: 2, text: '身份证正面' },
    				{ value: 3, text: '身份证反面' }
    			],
    	"车位信息":[	{ value: 4, text:'车位所在地' },
    				{ value: 5, text:'车位证明照片' },
    				{ value: 6, text:'车位发票' }
    			],
    	"银行卡信息":[{ value: 7, text:'持卡人' },
    				{ value: 8, text:'银行卡号' }
    			]
    },
    repState: [
    	{ value:'', text: '全部' },
        { value: 1, text: '履约中' },
        { value: 2, text: '正常结清' },
        { value: 3, text: '处置完成' },
        { value: 4, text: '提前还清' },
        { value: 5, text: '处置中' },
    ],
    payState: [
        { value: -1, text: '提前还款' },
        { value: 1, text: '未还款' },
        { value: 2, text: '已还清' },
        { value: 3, text: '已逾期' },
    ],
    repayMent: [
    	{ value: 1, text: '未还款' },
        { value: 2, text: '已还清' },
        { value: 3, text: '已逾期' }
    ],
    intoSource: [
    	{ value: 0, text: '后台' },
    	{ value: 1, text: 'app' },
    	{ value: 2, text: '微信公众号' },
    	{ value: 3, text: '官网' },
    ],
    extState: [
        { value: 0, text: '申请' },
        { value: 1, text: '已到账' }
    ],
    singlePhase: [
    	{ value: 1, text: '线上主动扣款' },
    	{ value: 2, text: '银行划扣' },
    	{ value: 3, text: '提前还款' },
    	{ value: 4, text: '线下单期还款' }
    ],
    processed: [
    	{ value: -1, text: '拒绝申请' },
    	{ value: 0, text: '申请中' },
    	{ value: 1, text: '确定到账' },
    ],
    lateState: [
    	{ value: -1, text: '拒绝减免' },
    	{ value: 0, text: '申请中' },
    	{ value: 1, text: '确定减免' },
    ],
    userSex: [
	    { value: 0,label: '男'},
	    { value: 1,label: '女'}
    ],
    bankState: [
	    { value: 0,label: '正常'},
	    { value: 1,label: '锁定'}
    ],
    userSource: [
    	{ value: 1, label: '车位e家' },
   		{ value: 2,	label: '车位地图' },
   		{ value: 3, label: '其他渠道' },
   		{ value: 4, label: '后台系统' },
    ],
   	userAge: [
   		{ value: 0, label: '70' },
   		{ value: 1,	label: '80' },
   		{ value: 2, label: '90' },
   		{ value: 3, label: '00' },
   	],
    certifiCation: [
        { value: -9, label: '未完成' },
        { value: -1, label: '认证失败' },
        { value: 0, label: '已提交认证未审核' },
        { value: 1, label: '认证通过' },
    ],
    certifiType: [
        { value: 1, label: '公司' },
        { value: 2, label: '个人' }
    ],
    useData: [
        { value: 1, label: '启用中' },
        { value: -1, label: '已停用' }
    ],
   	loanState: [
    	{ value:'', text: '全部' },
        { value: 1, text: '履约中' },
        { value: 2, text: '正常结清' },
        { value: 3, text: '提前还清' },
        { value: 4, text: '处置中' },
        { value: 5, text: '处置完成' },
    ],
    underlying: [
    	{ value: -2, text: '投资失败' },
    	{ value: -1, text: '投资失败' },
    	{ value: 0, text: '投资成功' },
    	{ value: 1, text: '投资未完成' },
    ],
    interState: [
    	{ value: -1, text: '投资失败' },
    	{ value: 0, text: '投资成功' },
    	{ value: 1, text: '投资未完成' },
    ],
    teamState: [
    	{ value: 0, text: '待确认'},
    	{ value: 1, text: '通过'},
    	{ value: -8, text: '不同意'}
    ],
    // orderState: [
    //     { value: -4, text: '订单超时-无人接单' },
    //     { value: -3, text: '平台取消' },
    //     { value: -2, text: '商家取消' },
    //     { value: -1, text: '用户取消' },
    //     { value: 0 , text: '可抢单' },
    //     { value: 1 , text: '已被抢单未到达' },
    //     { value: 2 , text: '用户确认已到达' },
    //     { value: 3 , text: 'B端商家确认到达' },
    //     { value: 4 , text: '平台默认进场'},
    //     { value: 5 , text: '平台结束'},
    //     { value: 6 , text: '用户自己结束'},
    //     { value: 7 , text: '商家结束'},
    //     { value: 9 , text: '延时中'}
    // ],
    orderState: [
        { value: 1 , text: '进行中' },
        { value: 2 , text: '已完成' },
        { value: 3 , text: '维权订单' }
    ],
    // lifeCycle: [
    //     { value: -3, text: '无人接单订单' },
    //     { value: -2, text: '维权订单' },
    //     { value: -1, text: '取消订单' },
    //     { value: 0,  text: '进行中正常订单' },
    //     { value: 1,  text: '等待支付订单' },
    //     { value:2,  text: '待离场' },
    //     { value: 3,  text: '已完成订单' }
    // ],
    lifeCycle: [
        { value: 1,  text: '待付款' },
        { value: 2,  text: '付款成功' },
        { value: 3,  text: '已出场' },
        { value: 9,  text: '维权订单' }
    ],
    payType: [
        { value: 0, text: '线下支付停车费' },
        { value: 1, text: '支付宝支付' },
        { value: 2, text: '微信APP支付' },
        { value: 3, text: '微信公众号支付' },
        { value: 4, text: '微信小程序支付' },
        { value: 5, text: '快捷通支付' },
    ],
    payChannels: [
        { value: 2, text: '微信提现' },
        { value: 5, text: '银行卡提现' }
    ],
    channelList: [
        { value: 1,text: '创蓝' },
        { value: 2,text: '阿里大于' },
        { value: 3,text: '语音短信' }
    ],
    drawState: [
        { value: 0, text: '申请中' },
        { value: 1, text: '成功' },
        { value: -1, text: '失败' }
    ],
    authType: [
        { value: 1, text: '公司' },
        { value: 2, text: '个人' }
    ],
    ptType: [
        { value: 2, text: '接单员' },
        { value: 1, text: '管理员' }
    ],
    useWays: [
        { value: 1, text: '预约费使用' },
        { value: 2, text: '停车费使用' }
    ],
    payStates: [
        { value: 0, text: '已支付' },
        { value: 1, text: '已退费' }
    ],
    rulesData: [
        { value: 1, text: '以1分钟为计算单位' },
        { value: 5, text: '以5分钟为计算单位' },
        { value: 15, text: '以15分钟为计算单位' },
        { value: 30, text: '以30分钟为计算单位' }
    ]
}

export default localData;