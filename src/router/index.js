import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Dashboard from '@/components/Dashboard'

import UserList from '@/components/user/list'
import AccidentList from '@/components/accident/list'
import RoleList from '@/components/role/list'
import GroupList from '@/components/group/list'
import UserChangePwd from '@/components/user/changepwd'
import Menu from '@/components/menu/index'
import UserProfile from '@/components/user/profile'

// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/components/Login'], resolve)

Vue.use(Router)

let router = new Router({
// mode: 'history',
    routes: [
        {
            path: '/login',
            name: '登录',
            component: Login
        }, {
            path: '/',
            name: 'home',
            component: Home,
            redirect: '/dashboard',
            leaf: true, // 只有一个节点
            menuShow: true,
            iconCls: 'iconfont icon-home', // 图标样式class
            children: [
                {path: '/dashboard', component: Dashboard, name: '首页', menuShow: true}
            ]
        }, {
            path: '/',
            component: Home,
            name: '用户管理',
            menuShow: true,
            leaf: true, // 只有一个节点
            iconCls: 'iconfont icon-users', // 图标样式class
            children: [
                {path: '/user/list', component: UserList, name: '用户管理', menuShow: true}
            ]
        }, {
            path: '/',
            component: Home,
            name: '角色管理',
            menuShow: true,
            leaf: true, // 只有一个节点
            iconCls: 'iconfont icon-users', // 图标样式class
            children: [
                {path: '/role/list', component: RoleList, name: '角色管理', menuShow: true}
            ]
        }, {
            path: '/',
            component: Home,
            name: '用户组管理',
            menuShow: true,
            leaf: true, // 只有一个节点
            iconCls: 'iconfont icon-users', // 图标样式class
            children: [
                {path: '/group/list', component: GroupList, name: '用户组管理', menuShow: true}
            ]
        }, {
            path: '/',
            component: Home,
            name: '菜单管理',
            menuShow: true,
            leaf: true, // 只有一个节点
            iconCls: 'iconfont icon-users', // 图标样式class
            children: [
                {path: '/menu/index', component: Menu, name: '菜单管理', menuShow: true}
            ]
        }, {
            path: '/',
            component: Home,
            name: '设置',
            menuShow: true,
            iconCls: 'iconfont icon-setting1',
            children: [
                {path: '/user/profile', component: UserProfile, name: '个人信息', menuShow: true},
                {path: '/user/changepwd', component: UserChangePwd, name: '修改密码', menuShow: true}
            ]
        },
        // {
        //     path: '/',
        //     component: Home,
        //     name: '微博设置',
        //     menuShow: true,
        //     iconCls: 'iconfont icon-users', // 图标样式class
        //     children: [
        //         {path: '/weibo/keywordList', component: KeywordsList, name: '关键词管理', menuShow: true},
        //         {path: '/weibo/seed', component: SeedList, name: '种子采集', menuShow: true},
        //         {path: '/weibo/Infolist', component: InfoList, name: '微博用户信息', menuShow: true},
        //         {path: '/weibo/logList', component: LogList, name: '日志展示', menuShow: true},
        //         {path: '/weibo/accountList', component: AccountList, name: '账户管理', menuShow: true},
        //     ]
        // },
        {
            path: '/',
            component: Home,
            name: '事故',
            menuShow: true,
            leaf: true, // 只有一个节点
            iconCls: 'iconfont icon-users', // 图标样式class
            children: [
                {path: '/accident/list', component: AccidentList, name: '事故管理', menuShow: true},
            ]
        }
    ]
})

router.beforeEach((to, from, next) => {
    // console.log('to:' + to.path)
    if (to.path.startsWith('/login')) {
        window.localStorage.removeItem('access-user')
        next()
    } else {
        let user = (window.localStorage.getItem('access-user'))
        if (!user) {
            next({path: '/login'})
        } else {
            next()
        }
    }
})

export default router
