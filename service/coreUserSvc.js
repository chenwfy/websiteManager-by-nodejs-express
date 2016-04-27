var adminUser = require('../database/coreUser'),
    session = require('../webSession'),
    tools = require('../utilities/tools'),
    encrypt = require('../utilities/encrypt'),
    respond = require('./respondBase');

var coreUserSvc = module.exports = {};

//获取当前用户信息
coreUserSvc.getCurrent = function (req, res) {
    var user = session.get(req, 'user');
    user.password && delete user['password'];
    user.passwordSalt && delete user['passwordSalt'];
    respond.flushData(res, user);
};

coreUserSvc.getCurrentUserInfo = function (req, res) {
    var user = session.get(req, 'user');
    adminUser.getUser(user.userId, function (err, user) {
        if (err) {
            console.error(err);
            respond.flushError(res);
            return;
        }

        user.password && (delete user.password);
        user.passwordSalt && (delete user.passwordSalt);
        respond.flushData(res, user);
    });
};

coreUserSvc.saveCurrentUserInfo = function (req, res) {
    var user = session.get(req, 'user'),
        realName = (req.body.realName || '').trim(),
        email = (req.body.email || '').trim(),
        mobile = (req.body.mobile || '').trim(),
        comment = (req.body.comment || '').trim(),
        user = { userId: user.userId, userName: user.userName, realName: realName, email: email, mobile: mobile, comment: comment, approved: user.approved };

    adminUser.updateUser(user);
    respond.flushData(res, true);
};

coreUserSvc.changeCurrentUserPassword = function (req, res) {
    var user = session.get(req, 'user'),
        password = (req.body.password || '').trim();

    if (password == '') {
        respond.flushError(res, 0, '密码不能为空！');
        return;
    }

    changeUserPassword(req, res, user.userId, password);
};

/*
系统管理员用户角色管理部分
*/
coreUserSvc.saveRole = function (req, res) {
    var roleId = ~~req.body.roleId || 0,
        roleName = (req.body.roleName || '').trim(),
        roleDescription = (req.body.roleDescription || '').trim(),
        role = { roleId: roleId, roleName: roleName, roleDescription: roleDescription };

    if (roleName == '' || roleDescription == '') {
        respond.flushError(res, 0, '角色名或者角色描述不能为空！');
        return;
    }

    adminUser.roleExists(role, function (err, row) {
        if (err) {
            console.error(err);
            respond.flushError(res);
            return;
        }

        if (row.count > 0) {
            respond.flushError(res, 0, '角色名或者角色描述已存在！');
            return;
        }

        roleId > 0 && adminUser.updateRole(role);
        roleId == 0 && adminUser.createRole(role);
        respond.flushData(res, true);
    });
};

coreUserSvc.getRole = function (req, res) {
    var roleId = parseInt(~~req.body.roleId || 0, 10);

    roleId == 0 && respond.flushData(res, { roleId: 0, roleName: '', roleDescription: '' });
    roleId > 0 && adminUser.getRole(roleId, function (err, role) {
        if (err) {
            console.error(err);
            respond.flushError(res);
            return;
        }
        respond.flushData(res, role);
    });
};

coreUserSvc.removeRole = function (req, res) {
    var roleIds = req.body['roleIds[]'] || [];
    !(roleIds instanceof Array) && (roleIds = [roleIds]);
    roleIds.length > 0 && adminUser.removeRole(roleIds);
    respond.flushData(res, true);
};

coreUserSvc.getAllRoles = function (req, res) {
    adminUser.getRoles(function (err, roles) {
        if (err) {
            console.error(err);
            respond.flushError(res);
            return;
        }

        respond.flushData(res, roles);
    });
};

coreUserSvc.getRoleList = function (req, res) {
    var pageSize = req.body.pageSize || 20,
        pageIndex = req.body.pageIndex || 1;

    adminUser.getRoles(function (err, roles) {
        if (err) {
            console.error(err);
            respond.flushError(res);
            return;
        }

        var recordCount = roles.length,
            pager = tools.paging(recordCount, pageSize, pageIndex),
            data = recordCount <= pager.pageSize ? roles : roles.splice((pager.pageIndex - 1) * pager.pageSize, pager.pageSize);

        respond.flushPageData(res, pager, data);
    });
};

/*
系统管理员用户管理部分
*/
coreUserSvc.saveUser = function (req, res) {
    var userId = ~~req.body.userId || 0,
        userName = (req.body.userName || '').trim(),
        password = (req.body.password || '').trim(),
        realName = (req.body.realName || '').trim(),
        email = (req.body.email || '').trim(),
        mobile = (req.body.mobile || '').trim(),
        comment = (req.body.comment || '').trim(),
        approved = ~~req.body.approved,
        user = { userId: userId, userName: userName, realName: realName, email: email, mobile: mobile, comment: comment, approved: approved };

    if (userName == '') {
        respond.flushError(res, 0, '用户名不能为空！');
        return;
    }

    if (userId == 0 && password == '') {
        respond.flushError(res, 0, '登录密码不能为空！');
        return;
    }

    adminUser.userExists(user, function (err, result) {
        if (err) {
            console.error(err);
            respond.flushError(res);
            return;
        }

        if (result.count > 0) {
            respond.flushError(res, 0, '用户名已存在！');
            return;
        }

        userId == 0 && createUser(req, res, user, password);
        userId > 0 && updateUser(req, res, user, password);
    });
};

var createUser = function (req, res, user, password) {
    var dateNow = tools.now(),
        ipAddr = tools.ipAddrClear(req.ip || '127.0.0.1'),
        curAdmin = session.get(req, 'user');

    user.passwordSalt = encrypt.createSalt();
    user.password = encrypt.createEncrypt(password, user.passwordSalt);
    user.inviterId = curAdmin ? curAdmin.userId : 0;
    user.isSuper = 0;
    user.createIp = ipAddr;
    user.createDate = dateNow;
    user.loginCount = 0;
    user.lastLoginIp = ipAddr;
    user.lastLoginDate = dateNow;

    adminUser.createUser(user);
    respond.flushData(res, true);
};

var updateUser = function (req, res, user, password) {
    adminUser.updateUser(user);
    password = (password || '').trim();
    if (password == '') {
        respond.flushData(res, true);
        return;
    }

    changeUserPassword(req, res, user.userId, password);
};

var changeUserPassword = function (req, res, userId, password) {
    adminUser.getUser(userId, function (err, user) {
        if (err) {
            console.error(err);
            respond.flushError(res);
            return;
        }

        var newPassword = encrypt.createEncrypt(password, user.passwordSalt)
        newPassword !== user.password && adminUser.changePassword(userId, newPassword);
        respond.flushData(res, true);
    });
};

coreUserSvc.getUser = function (req, res) {
    var userId = ~~req.body.userId || 0;
    adminUser.getUser(userId, function (err, user) {
        if (err) {
            console.error(err);
            respond.flushError(res);
            return;
        }

        user.password && (delete user.password);
        user.passwordSalt && (delete user.passwordSalt);
        respond.flushData(res, user);
    });
};

coreUserSvc.removeUser = function (req, res) {
    var userIds = req.body['userIds[]'] || [];
    !(userIds instanceof Array) && (userIds = [userIds]);
    userIds.length > 0 && adminUser.removeUser(userIds);
    respond.flushData(res, true);
};

coreUserSvc.getUserList = function (req, res) {
    var pageSize = req.body.pageSize || 20,
        pageIndex = req.body.pageIndex || 1;

    adminUser.getUsers(function (err, users) {
        if (err) {
            console.error(err);
            respond.flushError(res);
            return;
        }

        var recordCount = users.length,
            pager = tools.paging(recordCount, pageSize, pageIndex),
            data = recordCount <= pager.pageSize ? users : users.splice((pager.pageIndex - 1) * pager.pageSize, pager.pageSize);

        respond.flushPageData(res, pager, data);
    });
};

/*
系统管理员用户与角色关系管理部分
*/
coreUserSvc.getUsersInRole = function (req, res) {
    getUsersWithRole(req, res, 1);
};

coreUserSvc.getUsersNotInRole = function (req, res) {
    getUsersWithRole(req, res, 0);
};

var getUsersWithRole = function (req, res, inRoleType) {
    var roleId = ~~req.body.roleId || 0,
        pageSize = req.body.pageSize || 20,
        pageIndex = req.body.pageIndex || 1;

    adminUser.getUsersWithRole(roleId, inRoleType, function (err, users) {
        if (err) {
            console.error(err);
            respond.flushError(res);
            return;
        }

        var recordCount = users.length,
            pager = tools.paging(recordCount, pageSize, pageIndex),
            data = recordCount <= pager.pageSize ? users : users.splice((pager.pageIndex - 1) * pager.pageSize, pager.pageSize);

        respond.flushPageData(res, pager, data);
    });
};

coreUserSvc.addUsersToRole = function (req, res) {
    var roleIds = req.body['roleIds[]'] || [],
        userIds = req.body['userIds[]'] || [];
    !(roleIds instanceof Array) && (roleIds = [roleIds]);
    !(userIds instanceof Array) && (userIds = [userIds]);
    roleIds.length > 0 && userIds.length > 0 && adminUser.addUsersToRole(roleIds, userIds);
    respond.flushData(res, true);
};

coreUserSvc.removeUsersFromRole = function (req, res) {
    var roleId = ~~req.body.roleId || 0,
        userIds = req.body['userIds[]'] || [];
    !(userIds instanceof Array) && (userIds = [userIds]);
    roleId > 0 && userIds.length > 0 && adminUser.removeUsersFromRole(roleId, userIds);
    respond.flushData(res, true);
};