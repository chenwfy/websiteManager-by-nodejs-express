var adminUser = require('../database/coreUser'),
    session = require('../webSession'),
    tools = require('../utilities/tools'),
    encrypt = require('../utilities/encrypt'),
    respond = require('./respondBase');

var coreAuthSvc = module.exports = {};

//管理员用户登录验证
coreAuthSvc.checkLogin = function (req, res) {
    var userName = (req.body.username || '').trim(),
        userPass = (req.body.password || '').trim(),
        loginIp = tools.ipAddrClear(req.ip || '127.0.0.1');

    if (userName == '' || userPass == '') {
        respond.authFailed(res, '用户名和密码不能为空！');
        return;
    }

    adminUser.Validate(userName, function (err, user) {
        if (err) {
            console.log(err);
            respond.authFailed(res, '抱歉，登录出错！');
            return;
        }

        if (!!!user) {
            respond.authFailed(res, '登录名或密码错误！');
            return;
        }

        var password = encrypt.createEncrypt(userPass, user.passwordSalt);
        if (password != user.password) {
            respond.authFailed(res, '登录名或密码错误！');
            return;
        }

        if (user.approved == 0) {
            respond.authFailed(res, '账号不可用！');
            return;
        }

        user.lastLoginIp = loginIp;
        user.lastLoginDate = tools.now();
        adminUser.updateLoginInfo(user);

        user.password && (delete user.password);
        user.passwordSalt && (delete user.passwordSalt);
        session.set(req, 'user', user);
        respond.authSucceed(res);
    });
};

//管理员登出
coreAuthSvc.logout = function (req, res) {
    session.set(req, 'user', null);
};