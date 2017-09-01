'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteMenu = exports.editMenu = exports.getMenuItem = exports.addMenu = exports.getMenuTree = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _querystring = require('querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _common = require('./common');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var instance = _axios2.default.create({
  baseURL: _common.base
});

var AUTH_TOKEN = localStorage.getItem('access-user');

instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;

var getMenuTree = exports.getMenuTree = function getMenuTree(params) {
  return instance.get('/admin/resource/getTree.json?' + _querystring2.default.stringify(params)).then(function (res) {
    return res.data;
  });
};

var addMenu = exports.addMenu = function addMenu(params) {
  return instance.post('/admin/resource/', params).then(function (res) {
    return res.data;
  });
};

var getMenuItem = exports.getMenuItem = function getMenuItem(params) {
  return instance.get('/admin/resource/' + params.id).then(function (res) {
    return res.data;
  });
};

var editMenu = exports.editMenu = function editMenu(params) {
  return instance.put('/admin/resource/' + params.id, params).then(function (res) {
    return res.data;
  });
};

var deleteMenu = exports.deleteMenu = function deleteMenu(params) {
  return instance.delete('/admin/resource/' + params.id).then(function (res) {
    return res.data;
  });
};

//# sourceMappingURL=menu-compiled.js.map