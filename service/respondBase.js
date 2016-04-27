var respond = module.exports = {};

//未知的POST请求
respond.unknownPost = function (res) {
    flush(res, 0, 0, '未知请求!', null);
};

//用户未登录
respond.notLogin = function (res) {
    flush(res, 0, 1001, '抱歉，您尚未登录或登录已失效！请登录后重试!', null);
};

//用户鉴权失败
respond.authFailed = function (res, message) {
    flush(res, 0, 1002, message, null);
};

//用户鉴权成功
respond.authSucceed = function (res) {
    flush(res, 1, 1, '登录成功!', null);
};

//响应错误
respond.flushError = function (res, code, message) {
    code = code || 0;
    message = message || 'error';
    flush(res, 0, code, message, null);
};

//响应数据
respond.flushData = function (res, data) {
    flush(res, 1, 1, 'success', data);
};

//响应分页数据 paging: /utilities/tools.js --> paging
respond.flushPageData = function (res, paging, data) {
    res.json({ status: 1, code: 1, message: 'success', recordCount: paging.recordCount, pageCount: paging.pageCount, pageIndex: paging.pageIndex, pageSize: paging.pageSize, data: data });
};

var flush = function (res, status, code, message, data) {
    if (data)
        res.json({ status: status, code: code, message: message, data: data });
    else
        res.json({ status: status, code: code, message: message });
};