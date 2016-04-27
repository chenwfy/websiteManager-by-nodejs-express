var webSession = module.exports = {};

webSession.set = function (context, name, value) {
    context.session[name] = value;
};

webSession.get = function (context, name) {
    return context.session[name] || null;
};