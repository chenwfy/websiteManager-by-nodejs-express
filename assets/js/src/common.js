//平常用的一些常用函数及方法扩展，本文件必须依赖JQuery
(function (factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        var $ = require('jquery');
        factory($);
    } else {
        factory((typeof (jQuery) != 'undefined') ? jQuery : window.Zepto);
    }
}(function ($) {
    'use strict';

    String.prototype.Trim = function () {
        return (this || '').replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, '');
    };

    String.prototype.StartWith = function (s) {
        var org = this || '';
        if (org.length >= s.length && org.indexOf(s) == 0)
            return true;
        return false;
    };

    String.prototype.EndWith = function (s) {
        var org = this || '';
        if (org.length >= s.length && org.lastIndexOf(s) == org.length - s.length)
            return true;
        return false;
    };

    String.prototype.TrimStart = function (s) {
        var org = this || '';
        while (org.StartWith(s)) {
            org = org.substring(s.length);
        }
        return org;
    };

    String.prototype.TrimEnd = function (s) {
        var org = this || '';
        while (org.EndWith(s)) {
            org = org.substring(0, org.length - s.length);
        }
        return org;
    };

    String.prototype.RemoveHTML = function (s) {
        var org = this || '';
        org = org.replace(/<\/?[^>]*>/g, '');
        org = org.replace(/[ | ]*\n/g, '\n');
        org = org.replace(/&nbsp;/ig, '');
        return org;
    };

    String.prototype.IsMobileNumber = function () {
        var org = this || '';
        var regex = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|17[0-9]|14[57])[0-9]{8}$/;
        return regex.test(org);
    };

    String.prototype.IsTelphoneNumber = function () {
        var org = this || '';
        var regex = /^((\+?86)|(\(\+86\)))?0\d{2,3}-\d{7,8}(-\d{3,4})?$/;
        return regex.test(org);
    };

    String.prototype.IsEmail = function () {
        var org = this || '';
        var regex = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        return regex.test(org);
    };

    Number.prototype.ToLocaleDateString = function (format) {
        var offset = (new Date().getTimezoneOffset()) * 60000,
            second = Math.floor(((this || 0) - offset) / 1000),
            date = (new Date(1970, 0, 1, 0, 0, 0).DateAdd('s', second));
        return date.Format(format);
    };

    String.prototype.IsDate = function () {
        var org = (this || '').replace(/-/g, '/');
        var regex = /^(\d{4})\/(\d{1,2})\/(\d{1,2})?$/;
        if (regex.test(org)) {
            var _year = parseInt(RegExp.$1, 10),
                        _month = parseInt(RegExp.$2, 10) - 1,
                        _day = parseInt(RegExp.$3, 10);
            var newDate = new Date(_year, _month, _day);
            if (!(newDate.getFullYear() == _year && newDate.getMonth() == _month && newDate.getDate() == _day))
                return false;
            else
                return true;
        }
        return false;
    };

    String.prototype.IsDateTime = function () {
        var org = (this || '').replace(/-/g, '/');
        var regex = /^(\d{4})\/(\d{1,2})\/(\d{1,2})(\s(\d{1,2}):(\d{1,2}):(\d{1,2}))$/;
        if (regex.test(org)) {
            var _year = parseInt(RegExp.$1, 10),
                        _month = parseInt(RegExp.$2, 10) - 1,
                        _day = parseInt(RegExp.$3, 10),
                        _hour = parseInt(RegExp.$5, 10),
                        _minute = parseInt(RegExp.$6, 10),
                        _second = parseInt(RegExp.$7, 10);
            var newDate = new Date(_year, _month, _day, _hour, _minute, _second);
            if (!(newDate.getFullYear() == _year && newDate.getMonth() == _month
                          && newDate.getDate() == _day && newDate.getHours() == _hour
                          && newDate.getMinutes() == _minute && newDate.getSeconds() == _second))
                return false;
            else
                return true;
        }
        return false;
    };

    String.prototype.ConvertToDate = function () {
        var org = (this || '').replace(/-/g, '/');
        if (org.IsDate()) {
            (/^(\d{4})\/(\d{1,2})\/(\d{1,2})?$/).test(org);
            return new Date(parseInt(RegExp.$1, 10), parseInt(RegExp.$2, 10) - 1, parseInt(RegExp.$3, 10));
        }
        return new Date();
    };

    String.prototype.ConvertToDateTime = function () {
        var org = (this || '').replace(/-/g, '/');
        if (org.IsDateTime()) {
            (/^(\d{4})\/(\d{1,2})\/(\d{1,2})(\s(\d{1,2}):(\d{1,2}):(\d{1,2}))$/).test(org);
            return new Date(parseInt(RegExp.$1, 10),
                            parseInt(RegExp.$2, 10) - 1,
                            parseInt(RegExp.$3, 10),
                            parseInt(RegExp.$5, 10),
                            parseInt(RegExp.$6, 10),
                            parseInt(RegExp.$7, 10)
                           );
        }
        return new Date();
    };

    Date.prototype.DateToJson = function () {
        return { 'Year': this.getFullYear(), 'Month': this.getMonth() + 1, 'Day': this.getDate() };
    };

    Date.prototype.DateTimeToJson = function () {
        return {
            'Year': this.getFullYear(),
            'Month': this.getMonth() + 1,
            'Day': this.getDate(),
            'Hour': this.getHours(),
            'Minute': this.getMinutes(),
            'Second': this.getSeconds()
        };
    };

    Date.prototype.DateDiff = function (date, timePart) {
        var unit = 1;
        switch (timePart) {
            case 'ms':
                unit = 1;
                break;
            case 's':
                unit = 1000;
                break;
            case 'm':
                unit = 60 * 1000;
                break;
            case 'h':
                unit = 60 * 60 * 1000;
                break;
            case 'd':
                unit = 24 * 60 * 60 * 1000;
                break;
        }
        var result = Math.floor((this.getTime() - date.getTime()) / unit);
        return result < 0 ? result + 1 : result;
    };

    Date.prototype.DateAdd = function (datePart, addValue) {
        var orgDate = this;
        switch (datePart.toLowerCase()) {
            case 'y':
                orgDate.setFullYear(orgDate.getFullYear() + addValue);
                break;
            case 'mm':
                orgDate.setMonth(orgDate.getMonth() + addValue);
                break;
            case 'd':
                orgDate.setDate(orgDate.getDate() + addValue);
                break;
            case 'h':
                orgDate.setHours(orgDate.getHours() + addValue);
                break;
            case 'm':
                orgDate.setMinutes(orgDate.getMinutes() + addValue);
                break;
            case 's':
                orgDate.setSeconds(orgDate.getSeconds() + addValue);
                break;
        }
        return orgDate;
    };

    Date.prototype.Format = function (format) {
        var date = this;
        var zeroize = function (value, length) {
            if (!length) {
                length = 2;
            }
            value = new String(value);
            for (var i = 0, zeros = ''; i < (length - value.length) ; i++) {
                zeros += '0';
            }
            return zeros + value;
        };
        var wk = ['日', '一', '二', '三', '四', '五', '六'];
        var month = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        return format.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHms])\1?)\b/g, function ($0) {
            switch ($0) {
                case 'd':
                    return date.getDate();
                case 'dd':
                    return zeroize(date.getDate());
                case 'ddd':
                    return wk[date.getDay()];
                case 'dddd':
                    return '星期' + wk[date.getDay()];
                case 'M':
                    return date.getMonth() + 1;
                case 'MM':
                    return zeroize(date.getMonth() + 1);
                case 'MMM':
                    return month[date.getMonth()];
                case 'yy':
                    return new String(date.getFullYear()).substr(2);
                case 'yyyy':
                    return date.getFullYear();
                case 'H':
                    return date.getHours();
                case 'HH':
                    return zeroize(date.getHours());
                case 'm':
                    return date.getMinutes();
                case 'mm':
                    return zeroize(date.getMinutes());
                case 's':
                    return date.getSeconds();
                case 'ss':
                    return zeroize(date.getSeconds());
            }
        });
    };

    //IE8 数组indexOf方法扩展
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function (elt) {
            var len = this.length >>> 0;

            var from = Number(arguments[1]) || 0;
            from = (from < 0) ? Math.ceil(from) : Math.floor(from);
            if (from < 0)
                from += len;

            for (; from < len; from++) {
                if (from in this && this[from] === elt)
                    return from;
            }
            return -1;
        };
    };

    $.extend({
        queryString: function () {
            var context;
            if (arguments.length > 0) {
                context = arguments[0];
            } else {
                context = window;
            }
            var params = context.location.search.substr(1).split('&');
            var tmpObject = {};
            for (var i = 0; i < params.length; i++) {
                var tmp = params[i].split('=');
                if (tmp.length == 2) {
                    try {
                        tmpObject[tmp[0]] = decodeURIComponent(tmp[1]);
                    } catch (ex) {
                        tmpObject[tmp[0]] = tmp[1];
                    }
                }
            }
            return tmpObject;
        },
        MD5: function (source) {
            function RotateLeft(lValue, iShiftBits) {
                return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
            }

            function AddUnsigned(lX, lY) {
                var lX4, lY4, lX8, lY8, lResult;
                lX8 = (lX & 0x80000000);
                lY8 = (lY & 0x80000000);
                lX4 = (lX & 0x40000000);
                lY4 = (lY & 0x40000000);
                lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
                if (lX4 & lY4) {
                    return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
                }
                if (lX4 | lY4) {
                    if (lResult & 0x40000000) {
                        return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                    } else {
                        return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                    }
                } else {
                    return (lResult ^ lX8 ^ lY8);
                }
            }

            function F(x, y, z) { return (x & y) | ((~x) & z); }
            function G(x, y, z) { return (x & z) | (y & (~z)); }
            function H(x, y, z) { return (x ^ y ^ z); }
            function I(x, y, z) { return (y ^ (x | (~z))); }

            function FF(a, b, c, d, x, s, ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
            };

            function GG(a, b, c, d, x, s, ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
            };

            function HH(a, b, c, d, x, s, ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
            };

            function II(a, b, c, d, x, s, ac) {
                a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
                return AddUnsigned(RotateLeft(a, s), b);
            };

            function ConvertToWordArray(string) {
                var lWordCount;
                var lMessageLength = string.length;
                var lNumberOfWords_temp1 = lMessageLength + 8;
                var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
                var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
                var lWordArray = Array(lNumberOfWords - 1);
                var lBytePosition = 0;
                var lByteCount = 0;
                while (lByteCount < lMessageLength) {
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
                    lByteCount++;
                }
                lWordCount = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
                return lWordArray;
            };

            function WordToHex(lValue) {
                var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
                for (lCount = 0; lCount <= 3; lCount++) {
                    lByte = (lValue >>> (lCount * 8)) & 255;
                    WordToHexValue_temp = "0" + lByte.toString(16);
                    WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
                }
                return WordToHexValue;
            };

            function Utf8Encode(string) {
                string = string.replace(/\r\n/g, "\n");
                var utftext = "";

                for (var n = 0; n < string.length; n++) {

                    var c = string.charCodeAt(n);

                    if (c < 128) {
                        utftext += String.fromCharCode(c);
                    }
                    else if ((c > 127) && (c < 2048)) {
                        utftext += String.fromCharCode((c >> 6) | 192);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }
                    else {
                        utftext += String.fromCharCode((c >> 12) | 224);
                        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                        utftext += String.fromCharCode((c & 63) | 128);
                    }

                }

                return utftext;
            };

            var x = Array();
            var k, AA, BB, CC, DD, a, b, c, d;
            var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
            var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
            var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
            var S41 = 6, S42 = 10, S43 = 15, S44 = 21;

            source = Utf8Encode(source);

            x = ConvertToWordArray(source);

            a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

            for (k = 0; k < x.length; k += 16) {
                AA = a; BB = b; CC = c; DD = d;
                a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
                d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
                c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
                b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
                a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
                d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
                c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
                b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
                a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
                d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
                c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
                b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
                a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
                d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
                c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
                b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
                a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
                d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
                c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
                b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
                a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
                d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
                b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
                a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
                d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
                c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
                b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
                a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
                d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
                c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
                b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
                a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
                d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
                c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
                b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
                a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
                d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
                c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
                b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
                a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
                d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
                c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
                b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
                a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
                d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
                c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
                b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
                a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
                d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
                c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
                b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
                a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
                d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
                c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
                b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
                a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
                d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
                c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
                b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
                a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
                d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
                c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
                b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
                a = AddUnsigned(a, AA);
                b = AddUnsigned(b, BB);
                c = AddUnsigned(c, CC);
                d = AddUnsigned(d, DD);
            }

            var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
            return temp.toLowerCase();
        },
        Browser: function () {
            var context = arguments.length > 0 ? arguments[0] : window,
                ua = context.navigator.userAgent.toLowerCase(),
                firefox = ua.match(/firefox\/([\d.]+)/),
                chrome = ua.match(/chrome\/([\d.]+)/),
                opera = ua.match(/opera.([\d.]+)/),
                safari = ua.match(/version\/([\d.]+).*safari/),
                ie = ua.match(/(msie\s|trident.*rv:)([\w.]+)/),
                edge = ua.match(/edge\/([\d.]+)/),
                ie6 = ie && ie[2] == '6.0',
                ie7 = ie && ie[2] == '7.0',
                ie8 = ie && ie[2] == '8.0',
                ie9 = ie && ie[2] == '9.0',
                ie10 = ie && ie[2] == '10.0',
                ie11 = ie && ie[2] == '11.0';

            return {
                IE: ie,
                IE6: ie6,
                IE7: ie7,
                IE8: ie8,
                IE9: ie9,
                IE10: ie10,
                IE11: ie11,
                Edge: edge,
                Firefox: firefox,
                Chrome: chrome,
                Opera: opera,
                Safari: safari
            };
        },
        DataFormat: function (source, data) {
            var result = source,
                matchs = result.match(/\{.*?\}/g),
                match,
                key;

            data = data || {};
            if (matchs) {
                for (var m = 0; m < matchs.length; m++) {
                    match = matchs[m];
                    key = match.substring(1, match.length - 1);
                    result = result.replace(match, data[key]);
                }
            }
            return result;
        },
        Alert: function (message) {
            var config = arguments[1] || null;
            if (window.top.dialog && window.top.dialog.alert)
                window.top.dialog.alert(message, config);
            else
                alert(message);
        },
        Confirm: function (message) {
            var config = arguments[1] || null;
            if (window.top.dialog && window.top.dialog.confirm)
                window.top.dialog.confirm(message, config);
            else
                confirm(message);
        },
        Error: function (message) {
            var config = arguments[1] || null;
            if (window.top.dialog && window.top.dialog.error)
                window.top.dialog.error(message, config);
            else
                alert(message);
        },
        Success: function (message) {
            var config = arguments[1] || null;
            if (window.top.dialog && window.top.dialog.success)
                window.top.dialog.success(message, config);
            else
                alert(message);
        },
        Toast: function (message) {
            var config = arguments[1] || null;
            if (window.top.dialog && window.top.dialog.toast)
                window.top.dialog.toast(message, config);
            else
                alert(message);
        },
        OpenWindow: function (url, title, width, height, callback) {
            if (window.top.dialog && window.top.dialog.openWindow)
                window.top.dialog.openWindow(url, title, width, height, callback);
            else
                window.open(url);
        },
        FileView: function (url, title, width, height, callback) {
            if (window.top.dialog && window.top.dialog.fileView)
                window.top.dialog.fileView(url, title, width, height, callback);
            else
                window.open(url);
        },
        ajaxGet: function (url, data, callback) {
            return $.get(url, data).done(function (json) {
                if (json.status == 0) {
                    var code = json.code || 0;
                    if (code == 1001) {
                        alert('抱歉，您尚未登录或登录已失效！请登录后重试!');
                        window.top.location.href = '/login.html';
                        return;
                    }
                    $.Error(json.message || 'error!');
                } else {
                    callback && callback(json);
                }
            }).fail(function () { $.Error('ajax get failed!'); });
        },
        ajaxPost: function (url, data, callback) {
            return $.post(url, data).done(function (json) {
                if (json.status == 0) {
                    var code = json.code || 0;
                    if (code == 1001) {
                        alert('抱歉，您尚未登录或登录已失效！请登录后重试!');
                        window.top.location.href = '/login.html';
                        return;
                    }
                    $.Error(json.message || 'error!');
                } else {
                    callback && callback(json);
                }
            }).fail(function () { $.Error('ajax post failed!'); });
        }
    });

    $.fn.extend({
        setNumberField: function () {
            this.on('input propertychange', function () {
                $(this).val($(this).val().replace(/[^0-9]/, '').Trim());
            });
            return this;
        },
        setLowLetterField: function () {
            this.on('input propertychange', function () {
                $(this).val($(this).val().replace(/[^a-z]/, '').Trim());
            });
            return this;
        },
        setUpperLetterField: function () {
            this.on('input propertychange', function () {
                $(this).val($(this).val().replace(/[^A-Z]/, '').Trim());
            });
            return this;
        },
        setLetterField: function () {
            this.on('input propertychange', function () {
                $(this).val($(this).val().replace(/[^a-zA-Z]/, '').Trim());
            });
            return this;
        },
        placeholder: function () {
            if ($.Browser.IE) {
                var _args = arguments.length > 0 ? arguments[0] : null,
                    _hasMsg = _args && _args.length == this.length;

                this.each(function (idx, em) {
                    (function (idx, em) {
                        var obj = $(em),
                            tagName = obj[0].tagName.toLowerCase(),
                            type = obj[0].type.toLowerCase();

                        if ((tagName == 'input' && (type == 'text' || type == 'password')) || tagName == 'textarea') {
                            var isPasswordEl = type == 'password';
                            var msg = obj.attr('placeholder') || (_hasMsg ? _args[idx] : null);
                            if (msg) {
                                var name = obj.attr('name') || ('input_' + idx),
                                    className = obj.attr('class') || '';

                                obj.removeAttr('placeholder');
                                var tmpEl = $('<input>').attr({ 'type': 'text', 'value': msg, 'name': 'ph_' + name, 'class': className }).css('color', '#999');
                                obj.before(tmpEl);

                                var _val = obj.val();
                                if (!isPasswordEl)
                                    _val = $.trim(_val);

                                if (_val.length == 0) {
                                    obj.hide();
                                } else {
                                    tmpEl.hide();
                                }

                                tmpEl.on('focus', function () {
                                    $(this).hide();
                                    obj.show();
                                    obj[0].focus();
                                });

                                obj.on('blur', function () {
                                    var _this = $(this);
                                    var _val = $(this).val();
                                    if (!isPasswordEl)
                                        _val = $.trim(_val);

                                    if (_val.length == 0) {
                                        _this.hide();
                                        tmpEl.show();
                                    }
                                });
                            }
                        }
                    })(idx, em);
                });
            }

            return this;
        },
        picurePreview: function (picureUrl, ownerWindow) {
            ownerWindow = ownerWindow || window;
            var pictures = [], tmpUrl;
            typeof picureUrl === 'string' && (pictures = [picureUrl]);
            typeof picureUrl === 'object' && source instanceof Array && (pictures = picureUrl);

            this.each(function (idx, el) {
                (function (idx, el) {
                    tmpUrl = pictures[idx] || '';
                    window.top.dialog && window.top.dialog.picurePreview(el, tmpUrl, ownerWindow);
                })(idx, $(el));
            });

            return this;
        },
        getOffset: function (ownerWindow) {
            var sender = this.length > 1 ? this.eq(0) : this,
                offset = sender.offset();

            //------> current elements
            if (!(window.frameElement && ownerWindow)) return offset;

            //------> elements in iframe
            var getPosInIframe = function (ownerWindow) {
                var ifrWindow = ownerWindow || window,
                    left = 0,
                    top = 0;

                while (ifrWindow != window.top) {
                    var ifs = ifrWindow.parent.document.getElementsByTagName('iframe');
                    for (var i in ifs) {
                        try {
                            if (ifs[i].contentWindow === ifrWindow.window) {
                                left += $(ifs[i]).offset().left;
                                top += $(ifs[i]).offset().top;
                            }
                        } catch (e) { continue; }
                    }
                    ifrWindow = ifrWindow.parent;
                }
                return { 'left': left, 'top': top };
            };

            var getScroll = function (sourceWindow) {
                var doc = sourceWindow.document, docEl = doc.documentElement;
                return {
                    'top': docEl ? docEl.scrollTop : doc.body.scrollTop,
                    'left': docEl ? docEl.scrollLeft : doc.body.scrollLeft
                };
            };

            var top = offset.top,
                left = offset.left,
                posScroll = getScroll(ownerWindow),
                posIframe = getPosInIframe(ownerWindow);
            
            posScroll.top > 0 && (top -= posScroll.top);
            posScroll.left > 0 && (left -= posScroll.left);
            posIframe.top > 0 && (top += posIframe.top);
            posIframe.left > 0 && (left += posIframe.left);

            return { 'left': left, 'top': top };
        }
        /*,
        datePicker: function (format, range, ownerWindow) {
            this.each(function (idx, el) {
                (function (idx, el) {
                    el.on('click', function (e) {


                    });
                })(idx, $(el));
            });

            return this;
        },
        dateRender: function () {


        }*/
    });
}));