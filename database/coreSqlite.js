var fs = require("fs"),
    path = require("path"),
    sqlite3 = require('sqlite3').verbose(),
    dbFile = path.join(global.wwwRoot, '/sqlte3/core.db');

var database = module.exports = {};

database.exists = function () {
    return fs.existsSync(dbFile);
};

database.create = function () {
    //后面补充，如果数据库不存在，则根据SQL语句自动创建
    console.log('create core database');
};

database.open = function () {
    return new sqlite3.Database(dbFile);
};

database.close = function (db) {
    db.close();
};