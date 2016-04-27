(function (global, factory) {
    'use strict';

    if (typeof define === 'function' && define['amd'])
        define([], factory);
    else if (typeof require === 'function' && typeof module === 'object' && module && module['exports'])
        module['exports'] = factory();
    else
        global.fileTypeFilter = factory();
})(this, function () {
    'use strict';

    var config = {
        All: { title: 'AllFile', mimeTypes: '*', extensions: '*' },
        Images: { title: 'Images', mimeTypes: 'image/jpeg, image/gif, image/png, image/bmp', extensions: 'png|jpg|jpeg|gif|bmp' },
        Flash: { title: 'Flash', mimeTypes: 'application/x-shockwave-flash, application/x-flv', extensions: 'swf|flv' },
        Audio: { title: 'Audio', mimeTypes: 'audio/mpeg, audio/mid, audio/x-wav, audio/x-ms-wma, audio/x-midi, video/mp4', extensions: 'mp3|wma|m4a|mp4a|mid|wav' },
        Video: { title: 'Video', mimeTypes: 'video/mp4, video/mpeg, video/x-msvideo, audio/x-pn-realaudio, audio/x-pn-realaudio, video/quicktime, audio/x-ms-wmv', extensions: 'avi|mov|mp4|rmvb|wmv' },
        Doc: { title: 'Doc', mimeTypes: 'application/msword, application/vnd.ms-powerpoint, application/vnd.ms-excel, application/pdf', extensions: 'doc|docx|xls|xlsx|ppt|pptx|pdf' },
        Zip: { title: 'Zip', mimeTypes: 'application/zip, application/x-rar-compressed, application/x-7z-compressed', extensions: 'zip|rar|7z' }
    };

    var fileFilter = function (type) {
        this.filterType = type || 'All';
        var allowExt = (config[this.filterType] || config['All']).extensions,
            regex = allowExt === '*' ? null : new RegExp('\.(' + allowExt + ')$', 'i');

        this.allowable = function (file) {
            if (!!!file) return false;
            return allowExt === '*' || (regex.test(file));
        };
    };

    return {
        filterOptions: config,
        filter: fileFilter
    };
});