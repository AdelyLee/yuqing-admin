'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var handlerError = exports.handlerError = function handlerError(error, vue) {
    var response = error.response,
        me = error.me;

    if (response) {
        var _response$data = response.data,
            code = _response$data.code,
            _message = _response$data.message;

        if (code === 401) {
            vue.$confirm(_message, '错误', { type: 'error' }).then(function () {
                vue.$router.push('/login');
            });
        } else if (code === 'error') {
            vue.$confirm(_message, '错误', { type: 'error' });
        } else {
            vue.$confirm(_message, '错误', { type: 'error' });
        }
    } else {
        vue.$confirm(message, '错误', { type: 'error' });
    }
};

//# sourceMappingURL=handlerError-compiled.js.map