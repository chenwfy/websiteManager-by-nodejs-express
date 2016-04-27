//全局变量 - 站点文件根目录
global.wwwRoot = __dirname;

//引用
var express = require('./webExpress'),
    session = require('express-session'),
    path = require('path'),
    favicon = require('serve-favicon'),
    template = require('art-template'),
    baseRouter = require('./webRouters'),
    bodyParser = require('body-parser'),
    coreSqliteDb = require('./database/coreSqlite');

//当前实例上下文
var context = module.exports = express();

//静态文件配置
context.use('/assets', express.static(path.join(__dirname, 'assets')));
context.use('/res', express.static(path.join(__dirname, 'res')));
context.use('/tools', express.static(path.join(__dirname, 'utilities')));
//上传文件目录配置（全局变量）
global.uploadRoot = '/uploads';
global.uploadRootFolder = path.join(__dirname, 'uploads');
context.use(global.uploadRoot, express.static(global.uploadRootFolder));

//favicon配置
context.use(favicon(path.join(__dirname, 'favicon.ico')));

//指定模板引擎
template.config('extname', '.html');
context.engine('.html', template.__express);
context.set('view engine', 'html');
context.set('views', './views');

//请求数据编码
context.use(bodyParser.urlencoded({ extended: false }));

//session设定
context.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'gwsoft'
}));

//默认数据库创建
!coreSqliteDb.exists() && coreSqliteDb.create();

//路由设定
context.use(baseRouter);

//404错误
context.use(function (req, res, next) {
    console.log(req.path);
    var err = new Error();
    err.status = 404;
    err.message = '访问的页面或文件不存在！'
    next(err);
});

//500错误
context.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500);
    res.send(err.message || '抱歉，发生意外错误！');
});