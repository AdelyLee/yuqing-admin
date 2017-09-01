'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vueRouter = require('vue-router');

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _Home = require('@/components/Home');

var _Home2 = _interopRequireDefault(_Home);

var _Dashboard = require('@/components/Dashboard');

var _Dashboard2 = _interopRequireDefault(_Dashboard);

var _list = require('@/components/user/list');

var _list2 = _interopRequireDefault(_list);

var _list3 = require('@/components/accident/list');

var _list4 = _interopRequireDefault(_list3);

var _list5 = require('@/components/role/list');

var _list6 = _interopRequireDefault(_list5);

var _list7 = require('@/components/group/list');

var _list8 = _interopRequireDefault(_list7);

var _changepwd = require('@/components/user/changepwd');

var _changepwd2 = _interopRequireDefault(_changepwd);

var _index = require('@/components/menu/index');

var _index2 = _interopRequireDefault(_index);

var _profile = require('@/components/user/profile');

var _profile2 = _interopRequireDefault(_profile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Login = function Login(resolve) {
    return require(['@/components/Login'], resolve);
};

_vue2.default.use(_vueRouter2.default);

var router = new _vueRouter2.default({
    routes: [{
        path: '/login',
        name: '登录',
        component: Login
    }, {
        path: '/',
        name: 'home',
        component: _Home2.default,
        redirect: '/dashboard',
        leaf: true,
        menuShow: true,
        iconCls: 'iconfont icon-home',
        children: [{ path: '/dashboard', component: _Dashboard2.default, name: '首页', menuShow: true }]
    }, {
        path: '/',
        component: _Home2.default,
        name: '用户管理',
        menuShow: true,
        leaf: true,
        iconCls: 'iconfont icon-users',
        children: [{ path: '/user/list', component: _list2.default, name: '用户管理', menuShow: true }]
    }, {
        path: '/',
        component: _Home2.default,
        name: '角色管理',
        menuShow: true,
        leaf: true,
        iconCls: 'iconfont icon-users',
        children: [{ path: '/role/list', component: _list6.default, name: '角色管理', menuShow: true }]
    }, {
        path: '/',
        component: _Home2.default,
        name: '用户组管理',
        menuShow: true,
        leaf: true,
        iconCls: 'iconfont icon-users',
        children: [{ path: '/group/list', component: _list8.default, name: '用户组管理', menuShow: true }]
    }, {
        path: '/',
        component: _Home2.default,
        name: '菜单管理',
        menuShow: true,
        leaf: true,
        iconCls: 'iconfont icon-users',
        children: [{ path: '/menu/index', component: _index2.default, name: '菜单管理', menuShow: true }]
    }, {
        path: '/',
        component: _Home2.default,
        name: '设置',
        menuShow: true,
        iconCls: 'iconfont icon-setting1',
        children: [{ path: '/user/profile', component: _profile2.default, name: '个人信息', menuShow: true }, { path: '/user/changepwd', component: _changepwd2.default, name: '修改密码', menuShow: true }]
    }, {
        path: '/',
        component: _Home2.default,
        name: '事故',
        menuShow: true,
        leaf: true,
        iconCls: 'iconfont icon-users',
        children: [{ path: '/accident/list', component: _list4.default, name: '事故管理', menuShow: true }]
    }]
});

router.beforeEach(function (to, from, next) {
    if (to.path.startsWith('/login')) {
        window.localStorage.removeItem('access-user');
        next();
    } else {
        var user = window.localStorage.getItem('access-user');
        if (!user) {
            next({ path: '/login' });
        } else {
            next();
        }
    }
});

exports.default = router;

//# sourceMappingURL=index-compiled.js.map