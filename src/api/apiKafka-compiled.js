'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.reqSeedsSearch = exports.reqSeedsEdit = exports.reqSeedsDelete = exports.reqSeedsAdd = exports.reqEditLog = exports.reqBatchDeleteLog = exports.reqDeleteLog = exports.reqFindTypeList = exports.reqGetIdLogList = exports.reqGetLogList = exports.reqEditAccount = exports.reqBatchDeleteAccount = exports.reqDeleteAccount = exports.reqAddAccount = exports.reqGetAccountQueryList = exports.reqGetAccountList = exports.reqEditKeyword = exports.reqBatchDeleteKeyword = exports.reqDeleteKeyword = exports.reqAddKeyword = exports.reqGetKeywordQueryList = exports.reqGetKeywordList = exports.reqWeiboUser = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var baseKafka = 'http://115.29.45.208:10000/data2kafka';

var instanceKafka = _axios2.default.create({
    baseURL: baseKafka
});
var AUTH_TOKEN_Kafka = localStorage.getItem('access-user');

instanceKafka.defaults.headers.common['Authorization'] = AUTH_TOKEN_Kafka;

var reqWeiboUser = exports.reqWeiboUser = function reqWeiboUser(params) {
    return instanceKafka.get('/weiboUser/findByNameOrderBySelect', { params: params });
};

var reqGetKeywordList = exports.reqGetKeywordList = function reqGetKeywordList(params) {
    return instanceKafka.get('/keywords/', {});
};
var reqGetKeywordQueryList = exports.reqGetKeywordQueryList = function reqGetKeywordQueryList(params) {
    return instanceKafka.get('/keywords/query', { params: params });
};
var reqAddKeyword = exports.reqAddKeyword = function reqAddKeyword(params) {
    return instanceKafka.post('/keywords/', params);
};
var reqDeleteKeyword = exports.reqDeleteKeyword = function reqDeleteKeyword(params) {
    return instanceKafka.delete('/keywords/' + params.id);
};
var reqBatchDeleteKeyword = exports.reqBatchDeleteKeyword = function reqBatchDeleteKeyword(params) {
    return instanceKafka.delete('/keywords/', _querystring2.default.stringify(params));
};
var reqEditKeyword = exports.reqEditKeyword = function reqEditKeyword(params) {
    return instanceKafka.put('/keywords/' + params.id, params);
};
var reqGetAccountList = exports.reqGetAccountList = function reqGetAccountList(params) {
    return instanceKafka.get('/logininfo/', {});
};
var reqGetAccountQueryList = exports.reqGetAccountQueryList = function reqGetAccountQueryList(params) {
    return instanceKafka.get('/logininfo/query', { params: params });
};
var reqAddAccount = exports.reqAddAccount = function reqAddAccount(params) {
    return instanceKafka.post('/logininfo/', params);
};
var reqDeleteAccount = exports.reqDeleteAccount = function reqDeleteAccount(params) {
    return instanceKafka.delete('/logininfo/' + params.id);
};
var reqBatchDeleteAccount = exports.reqBatchDeleteAccount = function reqBatchDeleteAccount(params) {
    return instanceKafka.delete('/logininfo/', params);
};
var reqEditAccount = exports.reqEditAccount = function reqEditAccount(params) {
    return instanceKafka.put('/logininfo/' + params.id, params);
};
var reqGetLogList = exports.reqGetLogList = function reqGetLogList(params) {
    return instanceKafka.get('/saveLog/findByTypeOrderByLongCreateTime.json', { params: params });
};
var reqGetIdLogList = exports.reqGetIdLogList = function reqGetIdLogList(params) {
    return instanceKafka.get('/saveLog/findByTypeOrderById.json', { params: params });
};
var reqFindTypeList = exports.reqFindTypeList = function reqFindTypeList(params) {
    return instanceKafka.get('/saveLog/findLastSpiderLog/' + params.type);
};
var reqDeleteLog = exports.reqDeleteLog = function reqDeleteLog(params) {
    return instanceKafka.delete('/saveLog/' + params.id);
};
var reqBatchDeleteLog = exports.reqBatchDeleteLog = function reqBatchDeleteLog(params) {
    return instanceKafka.delete('/admin/weibo/log', params);
};
var reqEditLog = exports.reqEditLog = function reqEditLog(params) {
    return instanceKafka.put('/saveLog/' + params.id, params);
};

var reqSeedsAdd = exports.reqSeedsAdd = function reqSeedsAdd(params) {
    return instanceKafka.post('/weiboSeeds/', params);
};
var reqSeedsDelete = exports.reqSeedsDelete = function reqSeedsDelete(params) {
    return instanceKafka.delete('/admin/role/' + params);
};
var reqSeedsEdit = exports.reqSeedsEdit = function reqSeedsEdit(params) {
    return instanceKafka.put('/weiboSeeds/' + params.id, params);
};
var reqSeedsSearch = exports.reqSeedsSearch = function reqSeedsSearch(params) {
    return instanceKafka.get('/weiboSeeds/query', { params: params });
};

//# sourceMappingURL=apiKafka-compiled.js.map