import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex);

// 应用初始状态
const state = {
    user: {},
    menuPower: {},
    btnPower: {},
    userId: {},
    tide: {},
    cityList: []
};

// 定义所需的 mutations
const mutations = {
    USER(state, user) {
        state.user = user;
        localStorage.setItem('user', JSON.stringify(state.user));
    },
    MENUPOWER(state, menuPower) {
        state.menuPower = menuPower;
        localStorage.setItem('menuPower', JSON.stringify(state.menuPower));
    },
    BTNPOWER(state, btnPower) {
        state.btnPower = btnPower;
        localStorage.setItem('btnPower', JSON.stringify(state.btnPower));
    },
    USERID(state, userId) {
        state.userId = userId;
        localStorage.setItem('userId', JSON.stringify(state.userId));
    },
    TIDE(state, tide) {
        state.tide = tide;
        localStorage.setItem('tide', JSON.stringify(state.tide));
    },
    SETCITYLIST(state,cityList) {
        state.cityList = cityList
    }
};

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})