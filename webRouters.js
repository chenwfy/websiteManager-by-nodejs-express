var express = require('./webExpress'),
    adminUser = require('./database/coreUser'),
    session = require('./webSession'),
    tools = require('./utilities/tools'),
    encrypt = require('./utilities/encrypt'),
    coreAuth = require('./service/coreAuthSvc'),
    respond = require('./service/respondBase');

var router = module.exports = express.Router();

var adminIndexUrl = '/admin/index.html',
    adminLoginUrl = '/login.html',
    htmlFileSenderOptions = { root: __dirname, dotfiles: 'ignore' },
    authResult = null,
    authPage = function (path, req, res) {
        authResult = session.get(req, 'user') !== null;
        authResult && res.sendFile(path, htmlFileSenderOptions);
        !authResult && res.redirect(adminLoginUrl);
    },
    authService = function (req, res, next) {
        authResult = session.get(req, 'user') !== null;
        authResult && next && next(req, res);
        !authResult && respond.notLogin(res);
    };

//登录
router.get('/login(.html)?$', function (req, res) {
    res.render('login');
});

//登出
router.get('/logout', function (req, res) {
    coreAuth.logout(req, res);
    res.redirect(adminLoginUrl);
});

//admin目录下所有HTML文件需要鉴权
router.get('/', function (req, res) {
    authPage(adminIndexUrl, req, res);
});

router.get('/index', function (req, res) {
    authPage(adminIndexUrl, req, res);
});

router.get('/admin/*.html', function (req, res) {
    authPage(req.path, req, res);
});


//WEB SERVICE部分
router.post('/service/login', function (req, res) {
    coreAuth.checkLogin(req, res);
});

//WEB SERVER路由集合
var serviceConfig = {
    'fileView': require('./service/fileViewSvc'),
    'coreUser': require('./service/coreUserSvc'),
    'coreMenu': require('./service/coreMenuSvc')
};

router.post('/service/:module/:action', function (req, res) {
    var module = req.params.module,
        action = req.params.action;

    authService(req, res, function () {
        if (serviceConfig[module]) {
            serviceConfig[module][action](req, res);
        } else {
            respond.unknownPost(res);
        }
    });
});