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
 * 获取用户菜单树 GET /admin/resource/getTree.json
 * @param params
 * @returns {Promise.<TResult>}
 */
export const getMenuTree = params => {
    return instance.get('/admin/resource/getTree.json?' + qs.stringify(params)).then(res => res.data)
}

/**
 * 添加用户菜单 POST /admin/resource/
 * @param params
 * @returns {Promise.<TResult>}
 */
export const addMenu = params => {
    return instance.post('/admin/resource/', params).then(res => res.data)
}

/**
 * 获取用户菜单项 GET /admin/resource/{id}
 * @param params
 * @returns {Promise.<TResult>}
 */
export const getMenuItem = params => {
    return instance.get('/admin/resource/' + params.id).then(res => res.data)
}

/**
 * 修改用户菜单 PUT /admin/resource/{id}
 * @param params
 * @returns {Promise.<TResult>}
 */
export const editMenu = params => {
    return instance.put('/admin/resource/' + params.id, params).then(res => res.data)
}

/**
 * 删除用户菜单叶子节点 DELETE /admin/resource/{id}
 * @param params
 * @returns {Promise.<TResult>}
 */
export const deleteMenu = params => {
    return instance.delete('/admin/resource/' + params.id).then(res => res.data)
}


