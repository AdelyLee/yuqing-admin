/**
 * Created by jerry on 2017/4/13.
 */
import axios from 'axios'
import qs from 'querystring'
import {base} from './common'

// 创建实例时设置配置的默认值
var instance = axios.create({
    baseURL: base
});

var AUTH_TOKEN = localStorage.getItem('access-user');
// 在实例已创建后修改默认值
instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;

/**
 * 登录用户接口
 * @param params
 * @returns {Promise.<TResult>}
 */
export const requestLogin = params => {
    return instance.post('/login/login', qs.stringify(params)).then(res => res.data)
}
/**
 * 获取用户信息
 * @param params
 * @returns {*}
 */
export const reqGetUserList = params => {
    return instance.get('/admin/user/', {params: params})
}
/**
 * 添加用户接口
 * @param params
 * @returns {*|AxiosPromise}
 */
export const addUser = params => {
    return instance.post('/admin/user/', params)
}
/**
 * 编辑用户 PUT /admin/user/{id}
 * @param params
 * @returns {*|AxiosPromise}
 */
export const editUser = params => {
    return instance.put('/admin/user/' + params.id, params)
}
/**
 * 删除用户接口 DELETE /admin/user/{id}
 * @param params
 * @returns {AxiosPromise}
 */
export const deleteUser = params => {
    return instance.delete('/admin/user/' + params.id)
}
export const reqGetRoleList = params => {
    return instance.get('/admin/role/', {params: params})
}
export const reqAddRole = params => {
    return instance.post('/admin/role/', params)
}
export const reqEditRole = params => {
    return instance.put('/admin/role/' + params.id, params)
}
export const reqDeleteRole = params => {
    return instance.delete('/admin/role/' + params.id)
}
export const reqBatchDeleteRole = params => {
    return instance.delete('/admin/role/', params)
}
/**
 * 获取用户组信息
 * @param params
 * @returns {V}
 */
export const reqGetGroupList = params => {
    return instance.get('/admin/group/', params)
}
/**
 * 添加用户组信息
 * @param params
 * @returns {V}
 */
export const addGroup = params => {
    return instance.post('/admin/group/', params)
}
/**
 * 编辑用户组信息
 * @param params
 * @returns {V}
 */
export const editGroup = params => {
    return instance.put('/admin/group/' + params.id, params)
}
/**
 * 删除用户组信息
 * @param params
 * @returns {V}
 */
export const deleteGroup = params => {
    return instance.delete('/admin/group/' + params.id)
}

//事故管理
//获取列表
export const reqAccidentList = (params, name) => {
    return instance.post('/accident/findByCompanyFullNameLike?companyFullName=' + name, params)
}
//新增
export const reqAccidentAdd = params => {
    return instance.post('/accidentYuqing/saveAccident', params)
}
//单个删除
export const reqAccidentDelete = params => {
    return instance.delete('/accident/' + params)
}
//多个删除
export const reqAccidentDeleteMultiple = params => {
    debugger
    return instance.delete('/accident/deleteByIds', params)
}
//搜索
export const reqAccidentSearch = params => {
    return instance.get('/accident/findById/' + params)
}
//编辑
export const reqAccidentEdit = (params, id) => {
    return instance.put('/accidentYuqing/' + id, params)
}


