/**
 * Created by jerry on 2017/4/13.
 */
import axios from 'axios'
import qs from 'querystring'

let baseKafka = 'http://115.29.45.208:10000/data2kafka';

// 创建实例时设置配置的默认值
var instanceKafka = axios.create({
    baseURL: baseKafka
});
var AUTH_TOKEN_Kafka = localStorage.getItem('access-user');
// 在实例已创建后修改默认值
instanceKafka.defaults.headers.common['Authorization'] = AUTH_TOKEN_Kafka;

//微博用户信息
export const reqWeiboUser = params => {
    return instanceKafka.get('/weiboUser/findByNameOrderBySelect', {params: params})
}

export const reqGetKeywordList = params => {
    return instanceKafka.get('/keywords/', {})
}
export const reqGetKeywordQueryList = params => {
    return instanceKafka.get('/keywords/query', {params: params})
}
export const reqAddKeyword = params => {
    return instanceKafka.post('/keywords/', params)
}
export const reqDeleteKeyword = params => {
    return instanceKafka.delete('/keywords/' + params.id)
}
export const reqBatchDeleteKeyword = params => {
    return instanceKafka.delete('/keywords/', qs.stringify(params))
}
export const reqEditKeyword = params => {
    return instanceKafka.put('/keywords/' + params.id, params)
}
//账户
export const reqGetAccountList = params => {
    return instanceKafka.get('/logininfo/', {})
}
export const reqGetAccountQueryList = params => {
    return instanceKafka.get('/logininfo/query', {params: params})
}
export const reqAddAccount = params => {
    return instanceKafka.post('/logininfo/', params)
}
export const reqDeleteAccount = params => {
    return instanceKafka.delete('/logininfo/' + params.id)
}
export const reqBatchDeleteAccount = params => {
    return instanceKafka.delete('/logininfo/', params)
}
export const reqEditAccount = params => {
    return instanceKafka.put('/logininfo/' + params.id, params)
}
//日志
export const reqGetLogList = params => {
    return instanceKafka.get('/saveLog/findByTypeOrderByLongCreateTime.json', {params: params})
}
export const reqGetIdLogList = params => {
    return instanceKafka.get('/saveLog/findByTypeOrderById.json', {params: params})
}
export const reqFindTypeList = params => {
    return instanceKafka.get('/saveLog/findLastSpiderLog/'+ params.type)
}
export const reqDeleteLog = params => {
    return instanceKafka.delete('/saveLog/' + params.id)
}
export const reqBatchDeleteLog = params => {
    return instanceKafka.delete('/admin/weibo/log', params)
}
export const reqEditLog = params => {
    return instanceKafka.put('/saveLog/' + params.id, params)
}

//种子采集
//新增
export const reqSeedsAdd = params => {
    return instanceKafka.post('/weiboSeeds/', params)
}
//删除
export const reqSeedsDelete = params => {
    return instanceKafka.delete('/admin/role/' + params)
}
//编辑
export const reqSeedsEdit = params => {
    return instanceKafka.put('/weiboSeeds/' + params.id, params)
}
//查取
export const reqSeedsSearch = params => {
    return instanceKafka.get('/weiboSeeds/query', {params: params})
}
