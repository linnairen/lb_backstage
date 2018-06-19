<template>
	<el-row class="container">
		<!-- *******************头部信息  logo和用户信息*********************** -->
		<el-col :span="24" class="header">
			<el-col :span="12" class="logo"><img src="../assets/llogo.png" alt="logo">后台管理系统</el-col>
			<el-col :span="12" class="userinfo">
				<el-dropdown trigger="click">
					<span class="el-dropdown-link userinfo-inner"><img :src="$store.state.user.headUrl"/>{{$store.state.user.realName}}</span>
					<el-dropdown-menu slot="dropdown" style="color:#000">
						<!-- <el-dropdown-item @click.native="Off = true">修改密码</el-dropdown-item> -->
						<el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
			<!-- ***********************修改密码弹窗************************** -->
			<el-dialog title="修改密码" :visible.sync="Off" style="minWidth:1280px;z-index:22222;position: absolute;">
				<div class="changePass">
					<div>
						<span>旧密码</span><el-input v-model="passData.oldPassword" type="password" @keydown.space.native="$event.returnValue = false" @keyup.enter.native="setChangePass" placeholder="请输入旧密码" size="mini" style="width:130px;"></el-input>
					</div>
					<div>
						<span>新密码</span><el-input v-model="passData.password" type="password" @keydown.space.native="$event.returnValue = false" @keyup.enter.native="setChangePass" placeholder="请输入新密码" size="mini" style="width:130px;"></el-input>
					</div>
					<div>
						<span>确认密码</span><el-input v-model="pass" type="password" @keydown.space.native="$event.returnValue = false" @keyup.enter.native="setChangePass" placeholder="请再次输入新密码" size="mini" style="width:130px;"></el-input>
					</div>
				</div>
				
				<div slot="footer" class="dialog-footer">
					<el-button @click="Off = false">取消</el-button>
					<el-button type="primary" @click="setChangePass">确定</el-button>
				</div>
			</el-dialog>
		</el-col>
		<el-col :span="24" class="main">
			<aside class="menu-expanded" :style="{'left':left + 'px'}" @mouseenter="left = 0" @mouseleave="left = -225">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo" unique-opened router>
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu  :key="index" :index="index + ''">
							<template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden">
								{{child.name}}
							</el-menu-item>
						</el-submenu>
					</template>
				</el-menu> 
				<!-- 控制过权限的菜单 -->
				<!-- <el-menu :default-active="$route.path" class="menu" unique-opened router>
					<template v-for="(item,index) in $store.state.menuPower">
						<el-submenu  :key="index" :index="index + ''">
							<template slot="title"><i :class="item.icon"></i>{{item.name}}</template>
							<el-menu-item v-for="child in item.subMenuList" :index="child.url" :key="child.url">
								{{child.name}}
							</el-menu-item>
						</el-submenu>
					</template>
				</el-menu> -->
				<!-- <div class="enter_btn" @click="menu = !menu" :class="menu ? 'on' : ''">
					<i class="el-icon-circle-cross" v-if="menu"></i>
					<i class="el-icon-menu" v-else></i>
				</div> -->
			</aside>
			<section class="content-container">
				<transition name="fade" mode="out-in">
					<router-view></router-view>
				</transition>
			</section>
		</el-col>
	</el-row>
</template>

<script> 
    import { mapGetters } from 'vuex'
    import { mapActions } from 'vuex'
	import util from '../common/js/util'
	import {setChangePass,logOut,getCityList} from './../api/api'
	import qs from 'qs'

	export default {
		data() {
			return {
				Off: false,
				passData: {
					oldPassword: null,password: null,
				},
				pass: null,
				qToken: null,
				left: -225,
				menu: true
			}
		},
		created() {
			this.$store.state.menuPower = JSON.parse(localStorage.getItem('menuPower'));
			this.$store.state.user = JSON.parse(localStorage.getItem('user'));
			this.qToken = decodeURIComponent(util.Cookie.get('skytkn'));
			if(util.Cookie.get('skytkn')){
		        this.getCityList()
		    }
		    else{
		        setTimeout(() => {
		          	this.getCityList()
		        }, 2000);
		    }
		},
		computed: {
            ...mapGetters([ 
				'getMenuPower',
                'getUser'
            ])
		},
		methods: {
			...mapActions([
				'passMenuPower',
                'passUser',
                'passCityList'
			]),
		    getCityList() {   //获取城市
		        getCityList({type:2}).then( data => {
		          	this.passCityList(data.rs)
		        })
		    },
			logout() {	  //退出登录
				this.$confirm('确认退出吗?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'info'}).then(() => {
					logOut({ skytkn: this.qToken }).then( data => {
						if( data.code == 200 ){
							this.$router.push('/login');	
							this.$message.error('退出登录');
						}
					})
				})
			},
			setChangePass() {
				const a = this.passData.oldPassword;
				const b = this.passData.password;
				const c = this.pass;
				if ( a && b && a != b && b == c ) {
					setChangePass(qs.stringify(this.passData)).then( data => {
						if ( data.code == 200 ){ 
							this.$message.success('密码修改成功');
							this.Off = false;
							this.passData.oldPassword = ''
							this.passData.password = ''
							this.pass = ''
						}
					})
				} else {
					this.$message.error('密码输入有误');
				}

			}
		}
	}

</script>

<style scoped lang="scss">
	@import '../styles/vars.scss';
	
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
    		background: linear-gradient(to bottom, $color-primary 0%,$color-LightBlack 100%);
			.userinfo {
				width:50%;
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color: #FFF;
					img {
						width: 40px;
						height: 40px;
						border-radius: 50%;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
			}
			.logo {
				width:50%;
				height:60px;
				font-size: 22px;
				padding-left:20px;
				padding-right:20px;
				color:#fff;
				img {
					width: 40px;
					height: 40px;
					float: left;
					border-radius: 50%;
					padding: 1px;
					margin: 9px 0;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:230px;
			}
		}
		.changePass{
			width: 300px;
			margin: -40px 100px;
			div{
				height: 40px;
				line-height: 40px;
				span{
					display: inline-block;
					width: 70px;
				}
			}
		}
		.main {
			display: flex;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			background-color: #fbfbfd;
			color: #ddd;
			aside {
				flex:0 0 230px;
				width: 230px;
				height: 100%;
				.el-menu{
					height: 100%;
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.el-menu {
				overflow: auto;
			}
			.menu-expanded{
				width: 230px;
				z-index: 200;
				left: 0;
				top: 0;
				transition: 0.5s;
			}
			.content-container {
				flex:1;
				color: #333;
				overflow-y: scroll;
				padding: 20px;
				box-sizing: border-box;
				.content-wrapper {
					background-color: #f5f5f5;
					box-sizing: border-box;
				}
			}
		}
	}
	/*.enter_btn{
		position: absolute;
		top: 90%;
		left: 50%;
		margin: -25px 0 0 -25px;
		width: 50px;
		height: 50px;
		font-size: 50px;
		transition: all 0.5s;
		display: none;
	}
	.on {
		transform: rotate(360deg);
	}
	.hideMenu{
		transform-origin: 50% 90%;
		transform: scale(0);
	}
	.menu{
		transition: all 0.5s ease-in;
	}*/
	@media screen and (max-width: 1580px) {
		.container .main .menu-expanded{
			position: absolute;
		}
		/*.enter_btn {
			display: block;
		}*/
	}
</style>