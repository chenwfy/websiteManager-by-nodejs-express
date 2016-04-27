var dateFormat = require('dateformat');

var tools = module.exports = {
    now: function () {
        return dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    },
    ipAddrClear: function (ipAddr) {
        var ip = ipAddr || '127.0.0.1',
            idx = ip.lastIndexOf(':');
        idx = idx < 0 ? 0 : (idx + 1);
        return ip.substring(idx);
    },
    paging: function (recordCount, pageSize, pageIndex) {
        var _pageSize = ~~pageSize || 20,
            _recordCount = ~~recordCount || 0,
            _pageIndex = ~~pageIndex || 1,
            _pageCount = Math.floor(_recordCount / _pageSize);

        _recordCount % _pageSize > 0 && _pageCount++;
        _pageIndex > _pageCount && (_pageIndex = _pageCount);

        return {
            recordCount: _recordCount,
            pageCount: _pageCount,
            pageSize: _pageSize,
            pageIndex: _pageIndex
        };
    }
};