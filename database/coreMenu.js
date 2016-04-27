var database = require('./coreSqlite');

//主菜单数据库操作部分
var coreMenu = module.exports = {};

coreMenu.menuNameExists = function (menu, callback) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'SELECT count(0) AS count FROM core_Menus WHERE parentId = $parentId AND menuName = $menuName AND menuId <> $menuId';
        dbContext.get(sql, { $menuId: menu.menuId, $parentId: menu.parentId, $menuName: menu.menuName }, function (err, row) {
            callback && callback(err, row);
        });
    });
    database.close(dbContext);
};

coreMenu.createMenu = function (menu, callback) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'INSERT INTO core_Menus ( parentId, menuName, menuIcon, leftPage, rightPage, creatorUserId, status, sort, createDate ) VALUES ( $parentId, $menuName, $menuIcon, $leftPage, $rightPage, $creatorUserId, $status, $sort, $createDate );';
        dbContext.run(sql, { $parentId: menu.parentId, $menuName: menu.menuName, $menuIcon: menu.menuIcon, $leftPage: menu.leftPage, $rightPage: menu.rightPage, $creatorUserId: menu.creatorUserId, $status: menu.status, $sort: menu.sort, $createDate: menu.createDate });

        sql = 'SELECT last_insert_rowid() AS menuId FROM core_Menus;';
        dbContext.get(sql, {}, function (err, row) {
            callback && callback(err, row);
        });
    });
    database.close(dbContext);
};

coreMenu.updateMenu = function (menu) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'UPDATE core_Menus SET menuName = $menuName, menuIcon = $menuIcon, leftPage = $leftPage, rightPage = $rightPage, status = $status, sort = $sort WHERE menuId = $menuId';
        dbContext.run(sql, {
            $menuId: menu.menuId,
            $menuName: menu.menuName,
            $menuIcon: menu.menuIcon,
            $leftPage: menu.leftPage,
            $rightPage: menu.rightPage,
            $status: menu.status,
            $sort: menu.sort
        });
    });
    database.close(dbContext);
};

coreMenu.updateMenuRoles = function (menuId, roleIds) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'DELETE FROM core_MenuInRole WHERE menuId = $menuId';
        dbContext.run(sql, { $menuId: menuId });

        var stmt = dbContext.prepare('INSERT INTO core_MenuInRole ( menuId, roleId ) VALUES ( $menuId, $roleId )');
        for (var i = 0; i < roleIds.length; i++) {
            stmt.run({ $menuId: menuId, $roleId: roleIds[i] });
        }
        stmt.finalize();
    });
    database.close(dbContext);
};

coreMenu.getMenu = function (menuId, callback) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'SELECT menuId, parentId, menuName, menuIcon, leftPage, rightPage, status, sort FROM core_Menus WHERE menuId = $menuId';
        dbContext.get(sql, { $menuId: menuId }, function (err, row) {
            callback && callback(err, row);
        });
    });
    database.close(dbContext);
};

coreMenu.getMenuRoles = function (menuId, callback) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = 'SELECT roleId FROM core_MenuInRole WHERE menuId = $menuId';
        dbContext.all(sql, { $menuId: menuId }, function (err, rows) {
            callback && callback(err, rows);
        });
    });
    database.close(dbContext);
};

coreMenu.setMenuStatus = function (menuIds, status) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var stmt = dbContext.prepare('UPDATE core_Menus SET status = $status WHERE menuId = $menuId');
        for (var i = 0; i < menuIds.length; i++) {
            stmt.run({ $menuId: menuIds[i], $status: status });
        }
        stmt.finalize();
    });
    database.close(dbContext);
};

coreMenu.setMenuSort = function (menuIds, sortNums) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var stmt = dbContext.prepare('UPDATE core_Menus SET sort = $sort WHERE menuId = $menuId');
        for (var i = 0; i < menuIds.length; i++) {
            stmt.run({ $menuId: menuIds[i], $sort: sortNums[i] });
        }
        stmt.finalize();
    });
    database.close(dbContext);
};

coreMenu.removeMenu = function (menuIds) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        dbContext.run('PRAGMA foreign_keys = ON');
        var stmt = dbContext.prepare('DELETE FROM core_Menus WHERE menuId = ?');
        for (var i = 0; i < menuIds.length; i++) {
            stmt.run(menuIds[i]);
        }
        stmt.finalize();
    });
    database.close(dbContext);
};

coreMenu.getMenus = function (userId, callback) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = userId == 0
            ? 'SELECT menuId, parentId, menuName, menuIcon, leftPage, rightPage FROM core_Menus WHERE status = 1 ORDER BY sort DESC, menuId DESC'
            : 'SELECT m.menuId, m.parentId, m.menuName, m.menuIcon, m.leftPage, m.rightPage FROM core_Menus m INNER JOIN ( SELECT DISTINCT mr.menuId FROM core_MenuInRole mr INNER JOIN ( SELECT roleId FROM admin_UserInRole WHERE userId = $userId ) r ON mr.roleId = r.roleId ) rm ON m.menuId = rm.menuId WHERE m.status = 1 ORDER BY m.sort DESC, m.menuId DESC',
            parames = userId == 0 ? {} : { $userId: userId };

        dbContext.all(sql, parames, function (err, rows) {
            callback && callback(err, rows);
        });
    });
    database.close(dbContext);
};

coreMenu.getMenuTree = function (userId, parentId, callback) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = userId == 0
            ? 'SELECT menuId, menuName, menuIcon, status, (SELECT count(0) FROM core_Menus WHERE parentId = m.menuId ) AS childRen FROM core_Menus m WHERE parentId = $parentId ORDER BY sort DESC, menuId DESC'
            : 'SELECT m.menuId, m.menuName, m.menuIcon, m.status, ( SELECT COUNT(0) FROM core_Menus sm INNER JOIN ( SELECT DISTINCT smr.menuId FROM core_MenuInRole smr INNER JOIN ( SELECT roleId FROM admin_UserInRole WHERE userId = $userId ) sr ON smr.roleId = sr.roleId ) srm ON sm.menuId = srm.menuId WHERE sm.parentId = m.menuId ) AS childRen FROM core_Menus m INNER JOIN ( SELECT DISTINCT mr.menuId FROM core_MenuInRole mr INNER JOIN ( SELECT roleId FROM admin_UserInRole WHERE userId = $userId ) r ON mr.roleId = r.roleId ) rm ON m.menuId = rm.menuId WHERE m.parentId = $parentId ORDER BY m.sort DESC, m.menuId DESC',
            parames = userId == 0 ? { $parentId: parentId } : { $parentId: parentId, $userId: userId };

        dbContext.all(sql, parames, function (err, rows) {
            callback && callback(err, rows);
        });
    });
    database.close(dbContext);
};

coreMenu.getMenuCount = function (userId, parentId, callback) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = userId == 0
            ? 'SELECT count(0) AS count FROM core_Menus WHERE parentId = $parentId'
            : 'SELECT count(0) AS count FROM core_Menus m INNER JOIN ( SELECT DISTINCT mr.menuId FROM core_MenuInRole mr INNER JOIN ( SELECT roleId FROM admin_UserInRole WHERE userId = $userId ) r ON mr.roleId = r.roleId ) rm ON m.menuId = rm.menuId WHERE m.parentId = $parentId',
            parames = userId == 0 ? { $parentId: parentId } : { $parentId: parentId, $userId: userId };

        dbContext.get(sql, parames, function (err, row) {
            callback && callback(err, row);
        });
    });
    database.close(dbContext);
};

coreMenu.getMenuList = function (userId, parentId, pageSize, pageIndex, callback) {
    var dbContext = database.open();
    dbContext.serialize(function () {
        var sql = userId == 0
            ? 'SELECT menuId, parentId, menuName, menuIcon, leftPage, rightPage, status, sort, createDate FROM core_Menus WHERE parentId = $parentId ORDER BY sort DESC, menuId DESC'
            : 'SELECT m.menuId, m.parentId, m.menuName, m.menuIcon, m.leftPage, m.rightPage, m.status, m.sort, m.createDate FROM core_Menus m INNER JOIN ( SELECT DISTINCT mr.menuId FROM core_MenuInRole mr INNER JOIN ( SELECT roleId FROM admin_UserInRole WHERE userId = $userId ) r ON mr.roleId = r.roleId ) rm ON m.menuId = rm.menuId WHERE m.parentId = $parentId ORDER BY m.sort DESC, m.menuId DESC',
            parames = userId == 0 ? { $parentId: parentId } : { $parentId: parentId, $userId: userId };

        sql += ' LIMIT ' + pageSize + ' OFFSET ' + (pageIndex - 1) * pageSize;

        dbContext.all(sql, parames, function (err, rows) {
            callback && callback(err, rows);
        });
    });
    database.close(dbContext);
};