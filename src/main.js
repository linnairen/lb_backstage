import Vue from 'vue'
import 'babel-polyfill'
import App from './App'
import routes from './router/router'
import VueRouter from 'vue-router'
import store from './store/store'
import axios from 'axios'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-default/index.css'
import 'element-ui/lib/theme-chalk/index.css';
// import 'element-ui/lib/index.js'
import util from './common/js/util'
import Qs from 'qs'
import './common/js/qiniu.min.js'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from './api/api'
import { Message,MessageBox } from 'element-ui'
// import VueClipboard from 'vue-clipboard2'
import './styles/common.css'
import './styles/vars.scss'

require('./common/js/util')

Vue.use(ElementUI)
Vue.use(Vuex)
Vue.use(VueRouter)
// Vue.use(VueClipboard)

NProgress.configure({ showSpinner: false });

Vue.config.productionTip = false;

const router = new VueRouter({
    routes
});




//首次打开登录把token设为请求头
axios.interceptors.request.use(function(config) {
    if (util.Cookie.get('skytkn')) {
        config.headers.skytkn = decodeURIComponent(util.Cookie.get('skytkn')) ;

    }
    return config;
}, function(error) {
    return Promise.reject(error);
})

axios.interceptors.response.use(
    response => {
        if (response.data.code == 1402) { // 登录拦截
            MessageBox.alert('没有权限,将返回上一页', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                router.go(-1);
              }
            })
        } else if (response.data.code == 1406) { // 退出登录拦截
            Message.error(response.data.msg);
            // MessageBox.alert('没有登录,将前往登录页', '提示', {
            //   confirmButtonText: '确定',
            //   callback: action => {
            //     router.push('/login');
            //   }
            // })
            router.push('/login');
        } else if (response.data.code == 1404) { //重新获取token
            getToken({ clientType: 5 }).then(data => {
                if (data.code == 200) {
                    util.Cookie.set('skytkn', data.rs.token, parseInt(data.rs.expireTime) - parseInt(data.rs.createTime));
                } else {
                    Message.error('服务器错误,请重新登录');
                    router.push('/login');
                }
            })
        } else if (response.data.code != 200) { //报错
            Message.error(response.data.msg);
        }
        return response;
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 404: Message.error('服务器炸了');break;
                default: Message.error('请求出错');
            }
        }
        return Promise.reject(error.response); // 返回接口返回的错误信息
    }
)

//登陆拦截
router.beforeEach((to, from, next) => {
    NProgress.start();
    if (to.path == '/login') {
        localStorage.removeItem('user');
    }
    let user = JSON.parse(localStorage.getItem('user'));
    if (!user && to.path != '/login') {
        next({ path: '/login' });
    } else {
        NProgress.start();
        next();
    }
});

router.afterEach(transition => {
    NProgress.done();
});

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')