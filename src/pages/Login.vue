<template>
    <div class="wrapper bgimg">
        <div class="loginWrap">
            <div class="loginWrap_c"></div>
            <div class="loginWrap_r">
                <div class="loginWrap_con">
                   	<img src="../assets/llogo.png" alt="logo" class="logo">
                    <div class="inputWrap">
                        <img src="../assets/phone.png"/>
                        <input type="text" v-model="forms.mobile" placeholder="请输入账号" class="inputtext"
                        @keydown.space="$event.returnValue = false" onkeypress="return event.keyCode>=48&&event.keyCode<=57" @keydown.enter="TriggerTheLogin" ng-pattern="/[^a-zA-Z]/" maxlength="11"/>
                    </div>
                    <div class="inputWrap">
                        <img src="../assets/password.png"/>
                        <input type="password" ref='password' @keydown.space="$event.returnValue = false" @keydown.enter="TriggerTheLogin" v-model="forms.password" placeholder="请输入密码" class="inputtext"/>
                    </div>
                    <div class="loginBtn" @click="TriggerTheLogin">登 录</div>
                </div>
            </div>
        </div>
        <div class="copy_right">
            <ul>
                <li>客服电话：0571-86418992</li>
                <li>浙江萝泊科技有限公司版权所有</li>
                <li>Copyright@2016-2022 Hangzhou Sirius Technology Co.,Ltd.</li>
            </ul>
        </div>
    </div>
</template>
<script>
    import { mapGetters,mapActions } from 'vuex'
    import util from '../common/js/util'
    import {getToken,requestLogin,getExtent} from '../api/api'
    import qs from 'qs'

    export default {
        data() {
            return {
                forms: {
                    clientType: 5,mobile: null,loginType: 'pwd',password: null
                },
                loginParams: null
            }
        },
        created() {
            let browser = navigator.appName;
            let b_version = navigator.appVersion;
            let version = b_version.split(";");
            let trim_Version = version[1].replace(/[ ]/g, "");
            if (browser == "Microsoft Internet Explorer" && (trim_Version == "MSIE6.0" || trim_Version == "MSIE7.0" || trim_Version == "MSIE8.0" || trim_Version == "MSIE9.0"))
            alert('请下载ie9以上版本浏览器或者切换谷歌浏览器');
        },
        mounted() {
            this.getToken() 
        },
        computed: {
            ...mapGetters([
                'getUser',
                'getMenuPower',
                'getBtnPower'
            ]),
        },
        methods: {
            ...mapActions([
                'passUser',
                'passMenuPower',
                'passBtnPower'
            ]),
            getToken() {
                getToken({ clientType: 5 }).then( data => {   //初次打开如果没有token 就获取一下                              
                    if (data.code == 200) util.Cookie.set('skytkn', data.rs.token, parseInt(data.rs.expireTime) - parseInt(data.rs.createTime));
                })
            },
            TriggerTheLogin(){   //验证用户名 密码
                if ( !this.forms.mobile || !this.forms.password ) {
                    this.$message.error('账号或密码为空')
                } else {
                    requestLogin(qs.stringify(this.forms)).then( data => {//发送登录请求
                        if( data.code == 200 ){
                            this.passUser(data.rs);
                            this.$router.push({path: '/'});
                            this.getExtent()
                        }   
                    })
                }
            },
            getExtent() {
                getExtent().then( data => {
                    if (data.code == 200) {
                        if(JSON.stringify(data.rs) != "{}"){
                            this.$message.success('欢迎回来 ━(*｀∀´*)ノ亻!');
                            this.$router.push({ path: '/orderList' })
                            this.passMenuPower(data.rs.firstAndSecMenu);
                            this.passBtnPower(data.rs.allMenusMap);
                        }
                    }
                })
            }
        }
    }

</script>

<style type="text/css">
    body,html{
        min-height: 750px;
        min-width: 750px;
        overflow: auto;
    }
    #app{
        min-height: 750px;
        overflow: auto; 
    }
    .wrapper{
        background:#eef6ff;
        height: 100%;
        width: 100%;
        margin: 0 auto;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }
    .bgimg{
        overflow: hidden;
        position: absolute;
        min-width: 740px;
        min-height: 740px;
        background: url('../assets/loginbg.png') no-repeat;
        background-size:cover;
    }
    .loginWrap{
        width: 740px;
        height: 740px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -370px 0 0 -370px;
        overflow: hidden;
        background: rgba(255,255,255,0.1);
        border-radius: 50%;
    }
    .loginWrap_c{
        width: 610px;
        height: 610px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -305px 0 0 -305px;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
    }
    .loginWrap_r{
        width: 480px;
        height: 480px;
        background: rgba(255,255,255,0.32);
        border-radius: 50%;
        text-align: center;
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -240px 0 0 -240px;
    }
    .loginWrap_con{
        padding-top: 43px;
    }
    .logo{
        width: 88px;
        height: 88px;
        margin: 0 auto 44px;
    }

    .inputWrap{
        height: 54px;
        line-height: 54px;
        width: 280px;
        margin: 0 auto 30px;
        background: #fff;
        font-size: 0;
    }

    .inputWrap img{
        height: 30px;
        vertical-align: middle;
    }

    .inputtext{
        width: 200px;
        height: 54px;
        border: none;
        outline: 0;
        text-decoration: none;
        font-size: 20px;
        color: #2c2c2c;
        letter-spacing: 0;
        line-height: 54px;
        vertical-align: middle;
        margin-left: 22px;
    }
    .loginBtn{
        height: 54px;
        width: 280px;
        background-color: #3D8AEF;
        border-radius: 4px;
        text-align: center;
        font-size: 20px;
        line-height: 54px;
        color: #fff;
        margin: 0 auto;
    }
    input:-webkit-autofill {
        box-shadow: 0 0 0px 1000px white inset;
        -webkit-box-shadow: 0 0 0px 1000px white inset;
        -webkit-text-fill-color: #444;
    }
    .copy_right{
        width: 100%;
        text-align: center;
        color: #fff;
        position: absolute;
        bottom: 10px;
        left: 0;
        font-size: 14px;
    }
    .copy_right ul li:first-child{
        margin-bottom: 14px;
    }
    .copy_right ul li:nth-child(2){
        margin-bottom: 8px;
    }
    @media screen and (max-height: 750px) {
        .loginWrap{
            width: 550px;
            height: 550px;
            margin: -275px 0 0 -275px;
        }
        .loginWrap_c{
            width: 520px;
            height: 520px;
            margin: -260px 0 0 -260px;
        }
        .copy_right{
            font-size: 13px;
        }
        .copy_right ul li:first-child{
            margin-bottom: 8px;
        }
        .copy_right ul li:nth-child(2){
            margin-bottom: 4px;
        }
    }
    @media screen and (max-height: 799px) and (min-height: 751px) {
        .loginWrap{
            width: 570px;
            height: 570px;
            margin: -285px 0 0 -285px;
        }
        .loginWrap_c{
            width: 530px;
            height: 530px;
            margin: -265px 0 0 -265px;
        }
        .copy_right{
            font-size: 14px;
        }
        .copy_right ul li:first-child{
            margin-bottom: 10px;
        }
        .copy_right ul li:nth-child(2){
            margin-bottom: 5px;
        }
    }
    @media screen and (max-height: 850px) and (min-height: 800px) {
        .loginWrap{
            width: 630px;
            height: 630px;
            margin: -315px 0 0 -315px;
        }
        .loginWrap_c{
            width: 560px;
            height: 560px;
            margin: -280px 0 0 -280px;
        }
        .copy_right{
            font-size: 14px;
        }
        .copy_right ul li:first-child{
            margin-bottom: 10px;
        }
        .copy_right ul li:nth-child(2){
            margin-bottom: 5px;
        }
    }
    @media screen and (max-height: 900px) and (min-height: 851px) {
        .loginWrap{
            width: 650px;
            height: 650px;
            margin: -325px 0 0 -325px;
        }
        .loginWrap_c{
            width: 570px;
            height: 570px;
            margin: -285px 0 0 -285px;
        }
        .copy_right{
            font-size: 14px;
        }
        .copy_right ul li:first-child{
            margin-bottom: 10px;
        }
        .copy_right ul li:nth-child(2){
            margin-bottom: 5px;
        }
    }
</style>