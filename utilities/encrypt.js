var crypto = require('crypto');
var encrypt = module.exports = {};

encrypt.createEncrypt = function (source, salt) {
    var sourceString = ['GW', source || '', salt || createSalt(16), 'soft'].join(''),
        hash = crypto.createHash('md5');

    hash.update(sourceString);
    return hash.digest('hex');
};

var createSalt = encrypt.createSalt = function () {
    var len = arguments.length == 1 ? arguments[0] : 16,
        sourceChars = 'ABC1DEFGH2IJK3LMNOQP4RSTU5VWXYZab6cdef8ghij7kmlnopq9rest0uvwxyz',
        sourceLen = sourceChars.length,
        array = [];

    for (i = 0; i < len; i++) {
        array.push(sourceChars.charAt(Math.floor(Math.random() * sourceLen)));
    }

    return array.join('').toString('base64');
};