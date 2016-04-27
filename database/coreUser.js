var database = require('./coreSqlite');

//管理员用户数据库操作部分
var adminUser = module.exports = {};

//管理员登录验证
adminUser.Validate = function (userName, callback) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'SELECT userId, userName, password, passwordSalt, realName, isSuper, approved FROM admin_Users WHERE userName = $name';
        dbContext.get(sql, { $name: userName }, function (err, row) {
            callback && callback(err, row);
        });
    });
    database.close(dbContext);
};

//更新登录信息
adminUser.updateLoginInfo = function (user) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'UPDATE admin_Users SET loginCount = (loginCount + 1), lastLoginIp = $ip, lastLoginDate = $date WHERE userId = $id';
        dbContext.run(sql, { $ip: user.lastLoginIp, $date: user.lastLoginDate, $id: user.userId });
    });
    database.close(dbContext);
};

/*
系统管理员用户角色管理部分
*/
adminUser.roleExists = function (role, callback) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'SELECT count(0) AS count FROM admin_Roles WHERE ( roleName = $roleName OR roleDescription = $roleDescription ) AND roleId <> $roleId';
        dbContext.get(sql, { $roleName: role.roleName, $roleDescription: role.roleDescription, $roleId: role.roleId }, function (err, row) {
            callback && callback(err, row);
        });
    });
    database.close(dbContext);
};

adminUser.createRole = function (role) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'INSERT INTO admin_Roles (roleName, roleDescription) VALUES ($roleName, $roleDescription)';
        dbContext.run(sql, { $roleName: role.roleName, $roleDescription: role.roleDescription });
    });
    database.close(dbContext);
};

adminUser.updateRole = function (role) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'UPDATE admin_Roles SET roleName = $roleName, roleDescription = $roleDescription WHERE roleId = $roleId';
        dbContext.run(sql, { $roleName: role.roleName, $roleDescription: role.roleDescription, $roleId: role.roleId });
    });
    database.close(dbContext);
};

adminUser.getRole = function (roleId, callback) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'SELECT roleId, roleName, roleDescription FROM admin_Roles WHERE roleId = $roleId';
        dbContext.get(sql, { $roleId: roleId }, function (err, row) {
            callback && callback(err, row);
        });
    });
    database.close(dbContext);
};

adminUser.removeRole = function (roleIds) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        dbContext.run('PRAGMA foreign_keys = ON');
        var stmt = dbContext.prepare('DELETE FROM admin_Roles WHERE roleId = ?');
        for (var i = 0; i < roleIds.length; i++) {
            stmt.run(roleIds[i]);
        }
        stmt.finalize();
    });
    database.close(dbContext);
};

adminUser.getRoles = function (callback) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'SELECT roleId, roleName, roleDescription FROM admin_Roles';
        dbContext.all(sql, {}, function (err, rows) {
            callback && callback(err, rows);
        });
    });
    database.close(dbContext);
};

/*
系统管理员用户管理部分
*/
adminUser.userExists = function (user, callback) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'SELECT count(0) AS count FROM admin_Users WHERE userName = $userName AND userId <> $userId';
        dbContext.get(sql, { $userName: user.userName, $userId: user.userId }, function (err, row) {
            callback && callback(err, row);
        });
    });
    database.close(dbContext);
};

adminUser.createUser = function (user) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'INSERT INTO admin_Users ( userName, password, passwordSalt, realName, email, mobile, comment, inviterId, isSuper, approved, createIp, createDate, loginCount, lastLoginIp, lastLoginDate ) VALUES ( $userName, $password, $passwordSalt, $realName, $email, $mobile, $comment, $inviterId, $isSuper, $approved, $createIp, $createDate, $loginCount, $lastLoginIp, $lastLoginDate )';
        dbContext.run(sql, {
            $userName: user.userName,
            $password: user.password,
            $passwordSalt: user.passwordSalt,
            $realName: user.realName,
            $email: user.email,
            $mobile: user.mobile,
            $comment: user.comment,
            $inviterId: user.inviterId,
            $isSuper: user.isSuper,
            $approved: user.approved,
            $createIp: user.createIp,
            $createDate: user.createDate,
            $loginCount: user.loginCount,
            $lastLoginIp: user.lastLoginIp,
            $lastLoginDate: user.lastLoginDate
        });
    });
    database.close(dbContext);
};

adminUser.updateUser = function (user) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'UPDATE admin_Users SET realName = $realName, email = $email, mobile = $mobile, comment = $comment, approved = $approved WHERE userId = $userId';
        dbContext.run(sql, {
            $realName: user.realName,
            $email: user.email,
            $mobile: user.mobile,
            $comment: user.comment,            
            $approved: user.approved,
            $userId: user.userId
        });
    });
    database.close(dbContext);
};

adminUser.changePassword = function (userId, password) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'UPDATE admin_Users SET password = $password WHERE userId = $userId';
        dbContext.run(sql, { $password: password, $userId: userId });
    });
    database.close(dbContext);
};

adminUser.getUser = function (userId, callback) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'SELECT userId, userName, password, passwordSalt, realName, email, mobile, comment, approved, createIp, createDate, loginCount, lastLoginIp, lastLoginDate FROM admin_Users WHERE userId = $userId';
        dbContext.get(sql, { $userId: userId }, function (err, row) {
            callback && callback(err, row);
        });
    });
    database.close(dbContext);
};

adminUser.removeUser = function (userIds) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        dbContext.run('PRAGMA foreign_keys = ON');
        var stmt = dbContext.prepare('DELETE FROM admin_Users WHERE userId = ?');
        for (var i = 0; i < userIds.length; i++) {
            stmt.run(userIds[i]);
        }
        stmt.finalize();
    });
    database.close(dbContext);
};

adminUser.getUsers = function (callback) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'SELECT userId, userName, realName, email, mobile, comment, approved, createIp, createDate, loginCount, lastLoginIp, lastLoginDate FROM admin_Users ORDER BY userId DESC';
        dbContext.all(sql, { }, function (err, rows) {
            callback && callback(err, rows);
        });
    });
    database.close(dbContext);
};

/*
系统管理员用户与角色关系管理部分
*/
adminUser.getUsersWithRole = function (roleId, inRoleType, callback) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'SELECT userId, userName, realName, email, mobile, comment, approved, createIp, createDate, loginCount, lastLoginIp, lastLoginDate FROM admin_Users WHERE userId ' + (0 == inRoleType ? 'NOT ' : '') + 'IN (SELECT userId FROM admin_UserInRole WHERE roleId = $roleId ) ORDER BY userId DESC';
        dbContext.all(sql, { $roleId: roleId }, function (err, rows) {
            callback && callback(err, rows);
        });
    });
    database.close(dbContext);
};

adminUser.addUsersToRole = function (roleIds, userIds) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var stmt = dbContext.prepare('INSERT INTO admin_UserInRole (userId, roleId) SELECT $userId, $roleId WHERE NOT EXISTS (SELECT 1 FROM admin_UserInRole WHERE userId = $userId AND roleId = $roleId)');
        for (var n = 0; n < roleIds.length; n++) {
            for (var i = 0; i < userIds.length; i++) {
                stmt.run({ $userId: userIds[i], $roleId: roleIds[n] });
            }
        }
        stmt.finalize();
    });
    database.close(dbContext);
};

adminUser.removeUsersFromRole = function (roleId, userIds) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var stmt = dbContext.prepare('DELETE FROM admin_UserInRole WHERE roleId = ' + roleId + ' AND userId = ?');
        for (var i = 0; i < userIds.length; i++) {
            stmt.run(userIds[i]);
        }
        stmt.finalize();
    });
    database.close(dbContext);
};