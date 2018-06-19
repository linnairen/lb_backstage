//test
export const passUser = ({ commit }, payload) => {
    commit('USER', payload)
    
};
export const passMenuPower = ({ commit }, payload) => {
    commit('MENUPOWER', payload)
};
export const passBtnPower = ({ commit }, payload) => {
    commit('BTNPOWER', payload)
};
export const passUserId = ({ commit }, payload) => {
    commit('USERID', payload)
};
export const passTide = ({ commit }, payload) => {
    commit('TIDE', payload)
};
export const passCityList = ({ commit }, payload) => {
    commit('SETCITYLIST', payload)
};