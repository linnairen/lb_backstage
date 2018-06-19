import Home from '../pages/Home'
import Login from '../pages/Login'
import NotFound from '../pages/404.vue'






//用户管理
import Userlist from '../pages/user/Userlist'
import Userdetails from '../pages/user/Userdetails'
import Userorderlist from '../pages/user/Userorderlist'

//停车场认证管理
import Certification from '../pages/certification/Certification'
import CertificationDetail from '../pages/certification/CertificationDetail'


//目的地管理
import DestinationList from '../pages/destination/DestinationList'
import DestinationDetail from '../pages/destination/DestinationDetail'

//停车场认证
import ParkingLotList from '../pages/parkingLot/ParkingLotList'
import ParkingLotDetail from '../pages/parkingLot/ParkingLotDetail'


//人员管理相关
import Personnel from '../pages/personnel/Personnel'
import Editorial from '../pages/personnel/Editorial'



//订单列表
import OrderList from '../pages/orderModule/orderList'
import OrderDetail from '../pages/orderModule/orderDetail'

//短信发送列表
import MessageList from '../pages/sendMessage/messageList'

// 提现列表
import withdrawList from '../pages/withdraw/withdrawList'
import withdrawDetail from '../pages/withdraw/withdrawDetail'

//交易列表
import transactionList from '../pages/transaction/transactionList'

//任务列表
import taskList from '../pages/task/taskList'
import taskDetail from '../pages/task/taskDetail'

//车主列表
import carOwnerList from '../pages/carOwner/carOwnerList'
import carOwnerDetail from '../pages/carOwner/carOwnerDetail'

//保安列表
import protectorList from '../pages/protector/protectorList'
import protectorDetail from '../pages/protector/protectorDetail'

const routes = [
    {
        path: '/login',
        component: Login,
        name: 'Login',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        hidden: true,
        redirect: { path: '/login' }
    },
    {
        path: '/',
        component: Home,
        name: '订单管理',
        iconCls: 'el-icon-document',
        children: [
            { path: '/orderList', component: OrderList, name: '订单列表' },
            { path: '/orderDetail/:orderNo', component: OrderDetail, name: 'orderDetail', hidden: true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '停车场管理',
        iconCls: 'el-icon-star-on',
        children: [
            { path: '/certificationDetail', component: CertificationDetail, hidden:true},
            { path: '/certificationDetail/:state', component: CertificationDetail, name: 'certificationDetaild', hidden:true},
            { path: '/protectorList', component: protectorList, name: '保安管理' },
            { path: '/protectorDetail/:tid', component: protectorDetail, name: 'protectorDetail',hidden:true },
            { path: '/parkingLotList', component: ParkingLotList, name: '停车场列表' },
            { path: '/parkingLotDetail/:tid', component: ParkingLotDetail, name: 'parkingLotDetail',hidden:true }
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '萝泊停车',
    //     iconCls: 'el-icon-star-on',
    //     children: [
    //         { path: '/certification', component: Certification, name: '停车场认证管理' },
    //         { path: '/certificationDetail/:id', component: CertificationDetail, name: 'certificationDetail', hidden:true},
    //         { path: '/certificationDetail/:state', component: CertificationDetail, name: 'certificationDetaild', hidden:true},
    //         { path: '/destinationList', component: DestinationList, name: '目的地管理' },
    //         { path: '/destinationDetail', component: DestinationDetail, name: 'destinationDetail',hidden:true },
    //         { path: '/destinationDetail/:tid', component: DestinationDetail, name: 'destinationDetaild',hidden:true },
    //         { path: '/withdrawList', component: withdrawList, name: '提现管理' },
    //         { path: '/withdrawDetail/:orderNo', component: withdrawDetail, name: 'withdrawDetail',hidden:true },
    //         { path: '/transactionList', component: transactionList, name: '交易查询' },
    //         { path: '/taskList', component: taskList, name: '任务管理' },
    //         { path: '/taskDetail/:userId', component: taskDetail, name: 'taskDetail',hidden:true },
    //         { path: '/carOwnerList', component: carOwnerList, name: '车主管理' },
    //         { path: '/carOwnerDetail/:userId', component: carOwnerDetail, name: 'carOwnerDetail',hidden:true },
    //     ]
    // },
    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'el-icon-setting',
        children: [
            { path: '/messageList', component: MessageList, name: '短信发送列表' },
        	// { path: '/userlist', component: Userlist, name: '用户管理' },
        	// { path: '/userdetails', component: Userdetails ,hidden: true},
        	// { path: '/userdetails/:id', component: Userdetails, name: 'userdetails' ,hidden: true},
        	// { path: '/userorderlist', component:Userorderlist ,hidden:true},
        	// { path: '/userorderlist/:id', component:Userorderlist ,name: 'userorderlist' ,hidden:true},
            { path: '/personnel', component: Personnel, name: '人员管理' },
            { path: '/editorial', component: Editorial, name:"editoriald", hidden: true },
            { path: '/editorial/:id', component: Editorial, name:"editorial",hidden: true }
        ]
    },
    {
        path: '*',
        name: '',
        hidden: true,
        redirect: { path: '/404' }
    }
]


export default routes;