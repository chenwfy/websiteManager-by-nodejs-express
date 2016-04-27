var path = require('path'),
    fs = require('fs'),
    util = require("util"),
    respond = require('./respondBase'),
    fileTypeFilter = require('../utilities/fileTypeFilter'),
    formidable = require('formidable');

var fileViewSvc = module.exports = {},
    createDirSycn = function (dirName) {
        if (fs.existsSync(dirName))
            return true;

        if (createDirSycn(path.dirname(dirName))) {
            fs.mkdirSync(dirName);
            return true;
        }
    };

fileViewSvc.getUploadRoot = function (req, res) {
    respond.flushData(res, global.uploadRoot);
};

fileViewSvc.uploadFile = function (req, res) {
    var tmpDir = path.join(global.uploadRootFolder, 'tmp');
    !fs.existsSync(tmpDir) && createDirSycn(tmpDir);

    var form = new formidable.IncomingForm({
        uploadDir: tmpDir
    });

    form.parse(req, function (err, fields, files) {
        if (err) {
            console.error(err);
            respond.flushError(res);
            return;
        }

        var saveDir = fields.root || '',
            filter = fields.filter || 'All',
            fileName = fields.name,
            fileSize = parseInt(fields.size, 10),
            filePath = files.file.path;

        if (!!!saveDir) {
            fs.existsSync(filePath) && fs.unlink(filePath);
            respond.flushError(res, 0, '请求错误！');
            return;
        }

        if (!saveDir.startsWith(global.uploadRoot)) {
            fs.existsSync(filePath) && fs.unlink(filePath);
            respond.flushError(res, 0, '目录错误！');
            return;
        }

        var root = path.join(global.uploadRootFolder, saveDir.substring(global.uploadRoot.length));
        !fs.existsSync(root) && createDirSycn(root);

        var typeFilter = new fileTypeFilter.filter(filter);

        if (!typeFilter.allowable(fileName)) {
            fs.existsSync(filePath) && fs.unlink(filePath);
            respond.flushError(res, 0, '文件类型不被允许！');
            return;
        }

        fs.rename(filePath, path.join(root, fileName), function (err) {
            if (err) {
                console.error(err);
                fs.existsSync(filePath) && fs.unlink(filePath);
                respond.flushError(res);
                return;
            }

            respond.flushData(res, true);
        });
    });
};

fileViewSvc.readDir = function (req, res) {
    var readPath = req.body.root || '',
        filter = req.body.filter || 'All';

    if (!!!readPath) {
        respond.flushError(res, 0, '请求错误！');
        return;
    }

    if (!readPath.startsWith(global.uploadRoot)) {
        respond.flushError(res, 0, '目录错误！');
        return;
    }

    var root = path.join(global.uploadRootFolder, readPath.substring(global.uploadRoot.length));
    !fs.existsSync(root) && createDirSycn(root);

    var files = fs.readdirSync(root),
        list = [],
        typeFilter = new fileTypeFilter.filter(filter);

    for (var i in files) {
        var file = files[i],
            stat = fs.lstatSync(path.join(root, file));

        stat.isFile() && typeFilter.allowable(file) && list.push(file);
    };

    respond.flushData(res, list);
};

fileViewSvc.removeFile = function (req, res) {
    var readPath = req.body.root || '',
        fileName = req.body.file || '';

    if (!!!readPath || !!!fileName) {
        respond.flushError(res, 0, '请求错误！');
        return;
    }

    if (!readPath.startsWith(global.uploadRoot)) {
        respond.flushError(res, 0, '目录错误！');
        return;
    }

    var root = path.join(global.uploadRootFolder, readPath.substring(global.uploadRoot.length));
    if (!fs.existsSync(root)) {
        respond.flushError(res, 0, '目录不存在！');
        return;
    }

    var filePath = path.join(root, fileName);
    if (!fs.existsSync(filePath)) {
        respond.flushError(res, 0, '文件不存在！');
        return;
    }
    
    fs.unlink(filePath, function (err) {
        if (err) {
            console.error(err);
            respond.flushError(res);
            return;
        }
        
        respond.flushData(res, true);
    });
};