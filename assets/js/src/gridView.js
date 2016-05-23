//数据列表TABLE脚本，本文件必须依赖JQuery 和 common.js
(function (global, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], function ($) {
            global.gridView = factory($);
        });
    } else if (typeof exports !== 'undefined') {
        var $ = require('jquery');
        factory($);
    } else {
        global.gridView = factory((typeof (jQuery) != 'undefined') ? jQuery : window.Zepto);
    }
}(typeof window !== 'undefined' ? window : this, function ($) {
    'use strict';

    return function () {
        this.options = arguments[0] || {};
        this.dataLoader = this.options.dataLoader || {};
        this.dataReader = this.options.dataReader || { dataRoot: 'data', pageCount: 'pageCount', recordCount: 'recordCount', pageSize: 'pageSize', pageIndex: 'pageIndex' };
        this.columns = this.options.columns || [];
        this.pageSize = ~~this.options.pageSize || 20;
        this.tableRenderTo = this.options.tableRenderTo || '';
        this.rowSelection = (typeof this.options.rowSelection === 'boolean') ? this.options.rowSelection : true;
        this.pagerNavigation = (typeof this.options.pagerNavigation === 'boolean') ? this.options.pagerNavigation : true;
        this.pagerRenderTo = this.options.pagerRenderTo || '';

        //私有变量
        var _self = this,
            _tableOptions = { renderTo: null, table: null, thead: null, selectAll: null, tbody: null },
            _pagerOptions = { renderTo: null, pagerWrapper: null, recordCountRenderTo: null, pageCountRenderTo: null, pageIndexRenderTo: null, pageRefreshSender: null, pagerNavRenderTo: null, pageSizeSelection: null },
            _pagers = { pageCount: 1, recordCount: 0, pageSize: _self.pageSize, pageIndex: 1 },
            _loadingLayer = null,
            _rowSelected = {},
            _dataRows = [];

        //绘制表格
        this.drawTable = function () {
            init();
            _self.pagerNavigation && fitHeight();
        };

        //加载数据
        this.load = function () {
            init();
            loadData();
        };

        //重新加载数据，通常用于数据筛选条件变更等
        this.reload = function () {
            init();
            _pagers.pageIndex = 1;
            loadData();
        };

        //刷新当前页数据
        this.refresh = function () {
            init();
            loadData();
        };

        //获取列表被选中的行
        this.selectedRows = function (dataIndex) {
            var selArray = [];
            if (this.rowSelection && _dataRows.length > 0) {
                for (var idx in _rowSelected) {
                    var data = _dataRows[_rowSelected[idx]];
                    if (data) {
                        if (dataIndex)
                            data[dataIndex] && selArray.push(data[dataIndex]);
                        else
                            selArray.push(data);
                    }
                }
            }
            return selArray;
        };

        //内部函数
        var init = function () {
            baseCheck();
            createTable();
            createPaging();
            createTableLoading();
            pagersAdjust();
        };

        var baseCheck = function () {
            if (!_self.dataLoader.url) throw '请指定数据请求URL！';
            if (_self.columns.length < 1) throw '请指设列表数据列配置！';
        };

        var createTable = function () {
            if (!!!_tableOptions.renderTo) {
                var _tRender = createJqNode(_self.tableRenderTo);
                !(_tRender && _tRender.length > 0) && (_tRender = $('<div>').addClass('wrap').appendTo(document.body));
                _tableOptions.renderTo = _tRender.css('overflow', 'auto');
            }

            if (!!!_tableOptions.table) {
                _tableOptions.thead = $('<thead>');
                _tableOptions.tbody = $('<tbody>');
                _tableOptions.table = $('<table>').addClass('listTable').attr({ 'border': 0, 'cellpadding': 0, 'cellspacing': 1 }).append(_tableOptions.thead, _tableOptions.tbody).appendTo(_tableOptions.renderTo);
            }

            if (_tableOptions.thead.find('tr').length == 0) {
                var headRow = $('<tr>'),
                    headCell = null;

                if (_self.rowSelection) {
                    headCell = $('<th>').addClass('th5').addClass('center').appendTo(headRow);
                    _tableOptions.selectAll = $('<input>').attr({ 'type': 'checkbox', 'name': 'chk_tableList_checkAll' }).on('click', function () {
                        var _checkAll = $(this).prop('checked');
                        $(' > tr > td > input[type=checkbox][name^=chk_tableList_row_]', _tableOptions.tbody).each(function (n, el) {
                            $(el).prop('checked', _checkAll);
                            var _idx = parseInt($(el).attr('value'), 10);
                            _checkAll && (_rowSelected[_idx.toString()] = _idx);
                            !_checkAll && _rowSelected[_idx.toString()] && delete _rowSelected[_idx.toString()];
                        });
                    }).appendTo(headCell);
                }

                $.each(_self.columns, function (idx, col) {
                    headCell = $('<th>').addClass(col.className || 'th5').html(col.columnName || '').appendTo(headRow);
                });

                headRow.appendTo(_tableOptions.thead);
            }
        };

        var createPaging = function () {
            if (_self.pagerNavigation && !!!_pagerOptions.pagerWrapper) {
                var _pRender = createJqNode(_self.pagerRenderTo);
                !(_pRender && _pRender.length > 0) && (_pagerOptions.renderTo = document.body);

                _pagerOptions.recordCountRenderTo = $('<b>').html(0);
                _pagerOptions.pageCountRenderTo = $('<b>').html(0);
                _pagerOptions.pageIndexRenderTo = $('<b>').html(0);
                _pagerOptions.pageRefreshSender = $('<i>').addClass('icon-Awesome-refresh').addClass('dis').attr('title', '点击刷新列表');
                var pagerTxtLi = $('<li>').addClass('txt').append(
                    _pagerOptions.recordCountRenderTo,
                    '条数据共',
                    _pagerOptions.pageCountRenderTo,
                    '页，当前第',
                    _pagerOptions.pageIndexRenderTo,
                    '页',
                    _pagerOptions.pageRefreshSender
                );

                _pagerOptions.pagerNavRenderTo = $('<li>').addClass('box');

                var sizeSelection = $('<select>').append('<option value="5">5</option><option value="10">10</option><option value="15">15</option><option value="20" selected>20</option><option value="25">25</option><option value="30">30</option><option value="35">35</option><option value="40">40</option><option value="45">45</option><option value="50">50</option>').on('change', function () {
                    _pagers.pageSize = parseInt($(this).val() || 20, 10);
                    _self.reload();
                });
                var sizeSelectionLi = $('<li>').addClass('size').append('每页显示', sizeSelection, '条');

                _pagerOptions.pagerWrapper = $('<ul>').append(pagerTxtLi, _pagerOptions.pagerNavRenderTo, sizeSelectionLi);
                $('<div>').addClass('paging').append(_pagerOptions.pagerWrapper).appendTo(_pagerOptions.renderTo);
            }
        };

        var createJqNode = function (source) {
            if (typeof source === 'string' && source != '') {
                return source.substring(0, 1) == '#' ? $(source) : $('#' + source);
            }

            if (typeof source === 'object') {
                if (source.ownerDocument) return $(source);
                if (source instanceof jQuery) return source;
            }

            return null;
        };

        var pagersAdjust = function () {
            _pagers.pageSize = ~~_pagers.pageSize || 20;
            _pagers.recordCount = ~~_pagers.recordCount || 0;
            _pagers.pageCount = Math.floor(_pagers.recordCount / _pagers.pageSize);
            _pagers.recordCount % _pagers.pageSize > 0 && _pagers.pageCount++;
            _pagers.pageIndex > _pagers.pageCount && (_pagers.pageIndex = _pagers.pageCount);
            _pagers.pageIndex < 1 && (_pagers.pageIndex = 1);
        };

        var createTableLoading = function () {
            !!!_loadingLayer && (_loadingLayer = $('<div>').addClass('loading').html('数据加载中，请稍候……').appendTo(_tableOptions.renderTo).hide());
        };

        var loadData = function () {
            _loadingLayer && _loadingLayer.show();

            var data = _self.dataLoader.data || {};
            data.pageSize = _pagers.pageSize;
            data.pageIndex = _pagers.pageIndex;

            //$.when($.ajaxPost(_self.dataLoader.url, data)).done(dataChanged);
            $.ajaxPost(_self.dataLoader.url, data, dataChanged);
        };

        var dataChanged = function (response) {
            clearRows();
            _dataRows = response[_self.dataReader.dataRoot] || [];
            drawTable();
            updatePages(response);
            _self.pagerNavigation && fitHeight();
            _loadingLayer && _loadingLayer.hide();
            //2016-05-18 修改
            if (_dataRows.length == 0 && _pagers.recordCount > 0 && _pagers.pageIndex >= _pagers.pageCount) {
                _pagers.pageIndex > 1 && (_pagers.pageIndex--);
                loadData();
            }
        };

        var drawTable = function () {
            var row = null,
                cell = null;
        
            _dataRows.length > 0 && _tableOptions.tbody.show() && (_pagerOptions.pageRefreshSender && _pagerOptions.pageRefreshSender.removeClass('dis') && _pagerOptions.pageRefreshSender.one('click', function () {
                _self.refresh();
            }));
            _dataRows.length < 1 && _tableOptions.tbody.hide() && (_pagerOptions.pageRefreshSender && _pagerOptions.pageRefreshSender.addClass('dis') && _pagerOptions.pageRefreshSender.unbind('click'));

            $.each(_dataRows, function (index, data) {
                row = $('<tr>').on('click', function () {
                    _tableOptions.tbody.find('tr.active').removeClass('active');
                    !$(this).hasClass('active') && $(this).addClass('active');
                });

                if (_self.rowSelection) {
                    cell = $('<td>').addClass('center').appendTo(row);
                    $('<input>').attr({ 'type': 'checkbox', 'name': 'chk_tableList_row_' + index, 'value': index }).on('click', function () {
                        var _idx = parseInt($(this).attr('value'), 10);
                        if ($(this).prop('checked')) {
                            _rowSelected[_idx.toString()] = _idx;
                        } else {
                            //_rowSelected[_idx.toString()] && delete _rowSelected[_idx.toString()];
                            delete _rowSelected[_idx.toString()];
                        }
                    }).appendTo(cell);
                }

                $.each(_self.columns, function (c, col) {
                    cell = $('<td>').appendTo(row);
                    var content = '';

                    if (col.render) {
                        switch (typeof col.render) {
                            case 'string':
                                content = col.render;
                                var matchs = content.match(/\{.*?\}/g);
                                if (matchs) {
                                    for (var j = 0; j < matchs.length; j++) {
                                        content = content.replace(matchs[j], data[matchs[j].substring(1, matchs[j].length - 1)]);
                                    }
                                }
                                break;
                            case 'function':
                                content = col.render.call(data[col.dataIndex], data, index);
                                break;
                            case 'object':
                                content = col.render[data[col.dataIndex]];
                                break;
                        }
                    } else {
                        content = data[col.dataIndex];
                    }

                    //content && cell.append(content);
                    cell.append(content);
                });

                row.appendTo(_tableOptions.tbody);
            });
        };

        var updatePages = function (response) {
            _pagers.recordCount = ~~response[_self.dataReader.recordCount] || 0;
            _pagers.pageIndex = ~~response[_self.dataReader.pageIndex] || 1;
            _pagers.pageCount = ~~response[_self.dataReader.pageCount] || 0;
            _pagers.pageIndex >= _pagers.pageCount && (_pagers.pageIndex = _pagers.pageCount);
            _pagers.pageIndex < 1 && (_pagers.pageIndex = 1);

            if (_self.pagerNavigation && !!_pagerOptions.pagerWrapper) {
                !!_pagerOptions.recordCountRenderTo && _pagerOptions.recordCountRenderTo.html(_pagers.recordCount);
                !!_pagerOptions.pageCountRenderTo && _pagerOptions.pageCountRenderTo.html(_pagers.pageCount);
                !!_pagerOptions.pageIndexRenderTo && _pagerOptions.pageIndexRenderTo.html(_pagers.pageIndex);
                !!_pagerOptions.pagerNavRenderTo && _pagerOptions.pagerNavRenderTo.children().remove() && updatePagings();
            }
        };

        var updatePagings = function () {
            //2016-05-18 修改
            if (_pagers.pageCount >= 1 && _pagers.recordCount > 0) {
            //if (_pagers.recordCount > 0) {

                //上一页
                _pagers.pageIndex <= 1 && $('<a href="javascript:void(0);" title="转至上一页">上一页</a>').appendTo(_pagerOptions.pagerNavRenderTo);
                _pagers.pageIndex > 1 && $('<a href="javascript:void(0);" title="转至上一页">上一页</a>').one('click', function () { (_pagers.pageIndex--) && loadData(); }).appendTo(_pagerOptions.pagerNavRenderTo);

                //中间 - 当前页 前面
                var pNumbers = [];
                for (var i = 1; i < _pagers.pageIndex; i++) {
                    pNumbers.push(i);
                }
                if (pNumbers.length > 0) {
                    if (pNumbers.length <= 3) {
                        fillPagings(pNumbers);
                    } else {
                        fillPagings([1]);
                        $('<b>......</b>').appendTo(_pagerOptions.pagerNavRenderTo);
                        pNumbers.splice(0, pNumbers.length - 2);
                        fillPagings(pNumbers);
                    }
                }

                //当前页
                //2016-05-18 修改
                $('<a href="javascript:void(0)" class="current">' + _pagers.pageIndex + '</a>').appendTo(_pagerOptions.pagerNavRenderTo);
                //$('<a href="javascript:void(0)" class="current">' + _pagers.pageIndex + '</a>').one('click', function () { loadData(); }).appendTo(_pagerOptions.pagerNavRenderTo);

                //中间 - 当前页 后面
                pNumbers = [];
                for (var i = _pagers.pageIndex + 1; i <= _pagers.pageCount; i++) {
                    pNumbers.push(i);
                }
                if (pNumbers.length > 0) {
                    if (pNumbers.length <= 3) {
                        fillPagings(pNumbers);
                    } else {
                        pNumbers.splice(2, pNumbers.length - 2);
                        fillPagings(pNumbers);
                        $('<b>......</b>').appendTo(_pagerOptions.pagerNavRenderTo);
                        fillPagings([_pagers.pageCount]);
                    }
                }

                //下一页
                _pagers.pageIndex >= _pagers.pageCount && $('<a href="javascript:void(0);" title="转至下一页">下一页</a>').appendTo(_pagerOptions.pagerNavRenderTo);
                _pagers.pageIndex < _pagers.pageCount && $('<a href="javascript:void(0);" title="转至下一页">下一页</a>').one('click', function () { (_pagers.pageIndex++) && loadData(); }).appendTo(_pagerOptions.pagerNavRenderTo);
            }
        };

        var fillPagings = function (pageNumbers) {
            $.each(pageNumbers, function (i, e) {
                (function (i, e) {
                    $('<a href="javascript:void(0);" title="转至第' + e + '页">' + e + '</a>').one('click', function () {
                        _pagers.pageIndex = e;
                        loadData();
                    }).appendTo(_pagerOptions.pagerNavRenderTo);
                })(i, e);
            });
        };

        var clearRows = function () {
            !!_tableOptions.tbody && _tableOptions.tbody.children().remove();
            _dataRows = [];
            _rowSelected && (_rowSelected = {});
            _self.rowSelection && !!_tableOptions.selectAll && _tableOptions.selectAll.prop('checked', false);
        };

        var fitHeight = function () {
            var table = (_tableOptions.table)[0],
                win = table.ownerDocument.parentWindow || table.ownerDocument.defaultView;

            win.onresize = function () {
                $(table.ownerDocument.body).width('auto');
                $(table.ownerDocument.body).height('auto');
                var newHeight = $(table.parentNode).height() + ($(this).height() - $(table.ownerDocument.body).outerHeight(true))
                //if (newHeight < 51) {
                //    newHeight = 'auto';
                //    $(table.ownerDocument.body).width($(table.ownerDocument.body).width() - 17);
                //}
                $(table.parentNode).height(newHeight);
            };
            if (win.frameElement) {
                win.frameElement.onresize = function () { win.onresize() };
                win.onunload = function () { win.frameElement ? win.frameElement.onresize = function () { } : win.onresize = function () { }; };
            }
            win.onresize();
        };
    };
}));