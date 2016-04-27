var menuData = require('../database/coreMenu'),
    session = require('../webSession'),
    tools = require('../utilities/tools'),
    respond = require('./respondBase');

var coreMenuSvc = module.exports = {};

coreMenuSvc.saveMenu = function (req, res) {
    var menuId = ~~req.body.menuId || 0,
        parentId = ~~req.body.parentId || 0,
        menuName = (req.body.menuName || '').trim(),
        menuIcon = (req.body.menuIcon || '').trim(),
        leftPage = (req.body.leftPage || '').trim(),
        rightPage = (req.body.rightPage || '').trim(),
        status = ~~req.body.status,
        sort = ~~req.body.sort || 10,
        roleIds = req.body['roleIds[]'] || [],
        menu = { menuId: menuId, parentId: parentId, menuName: menuName, menuIcon: menuIcon, leftPage: leftPage, rightPage: rightPage, status: status, sort: sort };

    !(roleIds instanceof Array) && (roleIds = [roleIds]);

    if (menuName == '') {
        respond.flushError(res, 0, '菜单名称不能为空！');
        return;
    }

    menuData.menuNameExists(menu, function (err, row) {
        if (err) {
            console.error(err);
            respond.flushError(res);
            return;
        }

        if (row.count > 0) {
            respond.flushError(res, 0, '同级菜单名称已存在！');
            return;
        }

        menuId == 0 && createMenu(req, res, menu, roleIds);
        menuId > 0 && updateMenu(req, res, menu, roleIds);
    });
};

var createMenu = function (req, res, menu, roleIds) {
    var curAdmin = session.get(req, 'user'),
        dateNow = tools.now();

    menu.creatorUserId = curAdmin.userId;
    menu.createDate = dateNow;

    menuData.createMenu(menu, function (err, row) {
        if (err) {
            console.error(err);
            respond.flushError(res);
            return;
        }

        menu.menuId = row.menuId;
        roleIds.length > 0 && menuData.updateMenuRoles(menu.menuId, roleIds);
        respond.flushData(res, true);
    });
};

var updateMenu = function (req, res, menu, roleIds) {
    menuData.updateMenu(menu);
    //roleIds.length > 0 && menuData.updateMenuRoles(menu.menuId, roleIds);
    menuData.updateMenuRoles(menu.menuId, roleIds);
    respond.flushData(res, true);
};

coreMenuSvc.getMenu = function (req, res) {
    var menuId = ~~req.body.menuId || 0;
    menuId == 0 && respond.flushData(res, {});
    menuId > 0 && menuData.getMenu(menuId, function (err, menu) {
        if (err) {
            console.error(err);
            respond.flushError(res);
            return;
        }
        respond.flushData(res, menu);
    });
};

coreMenuSvc.getMenuRoles = function (req, res) {
    var menuId = ~~req.body.menuId || 0;
    menuId == 0 && respond.flushData(res, []);
    menuId > 0 && menuData.getMenuRoles(menuId, function (err, rows) {
        if (err) {
            console.error(err);
            respond.flushError(res);
            return;
        }

        var roleIds = [];
        for (var r in rows) {
            roleIds.push(rows[r].roleId);
        }
        respond.flushData(res, roleIds);
    });
};

coreMenuSvc.setMenuStatus = function (req, res) {
    var menuIds = req.body['menuIds[]'] || [],
        status = ~~req.body.status;
    !(menuIds instanceof Array) && (menuIds = [menuIds]);
    menuIds.length > 0 && menuData.setMenuStatus(menuIds, status);
    respond.flushData(res, true);
};

coreMenuSvc.setMenuSort = function (req, res) {
    var menuIds = req.body['menuIds[]'] || [],
        sortNums = req.body['sortNums[]'] || [];
    !(menuIds instanceof Array) && (menuIds = [menuIds]);
    !(sortNums instanceof Array) && (sortNums = [sortNums]);
    if (menuIds.length != sortNums.length) {
        respond.flushError(res, 0, '提交的数据不正确！');
        return;
    };

    menuIds.length > 0 && menuData.setMenuSort(menuIds, sortNums);
    respond.flushData(res, true);
};

coreMenuSvc.removeMenu = function (req, res) {
    var menuIds = req.body['menuIds[]'] || [];
    !(menuIds instanceof Array) && (menuIds = [menuIds]);

    if (menuIds.length > 0) {
        menuData.getMenus(0, function (err, menus) {
            if (err) {
                console.error(err);
                respond.flushError(res);
                return;
            }

            var removeIds = [], mId;
            for (var i in menuIds) {
                mId = parseInt(menuIds[i], 10);
                removeIds.indexOf(mId) < 0 && removeIds.push(mId) && recursiveMenuIds(menus, mId, removeIds);                
            }
            removeIds.length > 0 && menuData.removeMenu(removeIds);
            respond.flushData(res, true);
        });
    } else {
        respond.flushData(res, true);
    }
};

var recursiveMenuIds = function (allMenus, parentId, menuIds) {
    var m;
    for (var i in allMenus) {
        m = allMenus[i];
        m.parentId == parentId && menuIds.indexOf(m.menuId) < 0 && menuIds.push(m.menuId) && recursiveMenuIds(allMenus, m.menuId, menuIds);
    }
};

coreMenuSvc.getMenus = function (req, res) {
    var user = session.get(req, 'user'),
        userId = user.isSuper == 1 ? 0 : user.userId;

    menuData.getMenus(userId, function (err, menus) {
        if (err) {
            console.error(err);
            respond.flushError(res);
            return;
        }

        var result = recursiveMenus(0, menus);
        respond.flushData(res, result);
    });
};

var recursiveMenus = function (parentId, allMenus) {
    var mArray = [],
        count = allMenus.length;

    for (var i = 0; i < count; i++) {
        var m = allMenus[i];
        if (m.parentId == parentId) {
            m.childRen = recursiveMenus(m.menuId, allMenus);
            mArray.push(m);
        }
    }

    return mArray;
};

coreMenuSvc.getMenuTree = function (req, res) {
    var user = session.get(req, 'user'),
        userId = user.isSuper == 1 ? 0 : user.userId,
        parentId = ~~req.body.parentId || 0;

    menuData.getMenuTree(userId, parentId, function (err, menus) {
        if (err) {
            console.error(err);
            respond.flushError(res);
            return;
        }
        respond.flushData(res, menus);
    });
};

coreMenuSvc.getMenuList = function (req, res) {
    var user = session.get(req, 'user'),
        userId = user.isSuper == 1 ? 0 : user.userId,
        parentId = ~~req.body.parentId || 0,
        pageSize = ~~req.body.pageSize || 20,
        pageIndex = ~~req.body.pageIndex || 1;

    menuData.getMenuCount(userId, parentId, function (err, row) {
        var recordCount = err ? 0 : row.count,
            pager = tools.paging(recordCount, pageSize, pageIndex);

        recordCount == 0 && respond.flushPageData(res, pager, []);
        recordCount > 0 && menuData.getMenuList(userId, parentId, pager.pageSize, pager.pageIndex, function (err, menus) {
            if (err) {
                console.error(err);
                respond.flushError(res);
                return;
            }
            respond.flushPageData(res, pager, menus);
        });
    });
};