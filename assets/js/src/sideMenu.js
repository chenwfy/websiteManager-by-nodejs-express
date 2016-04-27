/* 
   管理平台 - 左侧菜单页面(通常为功能菜单列表)脚本
   功能菜单分两种呈现方式：
   1：手风琴式菜单，最多三级，所有数据一次行全部加载
   2：无限级树状菜单，数据逐级加载
   *** 本文件必须依赖JQuery 和 common.js ***
*/
(function (global, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'exports'], function ($, exports) {
            global.sideMenu = factory(exports, $);
        });
    } else if (typeof exports !== 'undefined') {
        var $ = require('jquery');
        factory(exports, $);
    } else {
        global.sideMenu = factory(global, (typeof (jQuery) != 'undefined') ? jQuery : window.Zepto);
    }
}(typeof window !== 'undefined' ? window : this, function (root, $) {
    'use strict';

    //手风琴式
    var initAccordion = function (config) {
        var menuData = config.menuData || [],
            menuKey = config.menuKey || { title: 'menuName', icon: 'menuIcon', childRen: 'childRen' },
            menuRender = config.menuRender || null,
            menuHandler = config.menuHandler || null,
            firstSelected = typeof config.firstSelected === 'boolean' ? config.firstSelected : false;

        if (menuData && menuData.length > 0 && menuRender && menuRender.length > 0) {
            $.each(menuData, function (idx, el) {
                var item = $('<a>').attr({ 'title': (el[menuKey.title] || ''), 'href': 'javascript:void(0);' });
                el[menuKey.icon] && $('<i>').addClass(el[menuKey.icon]).appendTo(item);
                el[menuKey.title] && $('<label>').html(el[menuKey.title]).appendTo(item);
                (el[menuKey.childRen] && el[menuKey.childRen].length > 0) && $('<span>').appendTo(item);

                idx == 0 && firstSelected && item.addClass('active');
                var menuRow = $('<li>').append(item).appendTo(menuRender);
                nodeHandler.call(item, menuRow, menuRender, el, menuKey, menuHandler);
            });
            menuRender.slideDown(200);
        }
    };

    var nodeHandler = function (row, render, data, menuKey, menuHandler) {
        var sender = this;
        this.on('click', function () {
            if (!$(this).hasClass('active')) {
                var sourceAct = $(' > li > a.active', render);
                if (sourceAct && sourceAct.length > 0) {
                    sourceAct.each(function (idx, el) {
                        (function (idx, el) {
                            $('.dis', el).removeClass('dis');
                            $('.active', el).removeClass('active');
                            $('.unfolded', el).removeClass('unfolded');
                            $('ul', el).hide();
                        })(idx, $(el).parent());
                    });
                    sourceAct.removeClass('active');
                }
                $(this).addClass('active');
            }

            var subData = data[menuKey.childRen],
                hasChildren = subData && subData.length > 0;

            if (hasChildren) {
                var subRender = $(' > ul', row);
                if (!(subRender && subRender.length > 0)) {
                    subRender = $('<ul>').appendTo(row);
                    $.each(subData, function (idx, el) {
                        var subItem = $('<a>').attr({ 'title': (el[menuKey.title] || ''), 'href': 'javascript:void(0);' });
                        $('<i>').appendTo(subItem);
                        el[menuKey.title] && $('<label>').html(el[menuKey.title]).appendTo(subItem);
                        (el[menuKey.childRen] && el[menuKey.childRen].length > 0) && $('<span>').appendTo(subItem);
                        var subRow = $('<li>').append(subItem).appendTo(subRender);
                        nodeHandler.call(subItem, subRow, subRender, el, menuKey, menuHandler);
                    });
                }

                if (!$(this).hasClass('dis')) {
                    var _this = $(this);
                    $(this).addClass('dis')
                    if (!$(this).hasClass('unfolded')) {
                        subRender.slideDown(200, function () {
                            _this.removeClass('dis').addClass('unfolded');
                        });
                    } else {
                        subRender.slideUp(200, function () {
                            _this.removeClass('dis').removeClass('unfolded');
                        });
                    }
                }
            } else {
                menuHandler && menuHandler.call(data);
            }
        });
    };

    //无限级树状菜单
    var build = function (data, colIdxs, render, icon, nodeHandler, textHandler, nodeChecked, extended) {
        render.children().remove();

        if (data && data.length > 0) {
            var count = data.length - 1;
            $.each(data, function (idx, el) {
                (function (idx, el) {
                    var folder = $('<i>'),
                        contentRender = $('<p>'),
                        nodeRender = $('<div>').append(folder, contentRender),
                        nodeWrapper = $('<li>').append(nodeRender).appendTo(render),
                        nodeTxtColIdx = colIdxs.nodeText || '',
                        nodeTxt = (/\{.*?\}/g.test(nodeTxtColIdx) ? $.DataFormat(nodeTxtColIdx, el) : el[nodeTxtColIdx]) || '啊哦，节点配置或读取数据出错鸟！',
                        hasSub = el[colIdxs.hasSubNode];

                    var checkboxType = typeof nodeChecked;
                    if (checkboxType === 'boolean' || checkboxType === 'function') {
                        var checked = checkboxType === 'boolean' ? nodeChecked : nodeChecked.call(el),
                            checkboxClass = checked ? 'check-all' : 'check-none',
                            checkboxValIdx = colIdxs.checkboxValue || '',
                            checkboxVal = (/\{.*?\}/g.test(checkboxValIdx) ? $.DataFormat(checkboxValIdx, el) : el[checkboxValIdx]) || '',
                            clickRecursive = function (currentCheckbox, childNodes, ct) {
                                var _currentNode = currentCheckbox.parent().parent().parent(),
                                    _parentNode = _currentNode.parent();

                                if (_parentNode.length > 0) {
                                    var _parentCheckbox = _parentNode.prev().find(' > p > i.checkbox');
                                    if (_parentCheckbox.length > 0) {
                                        if (ct == 'none') {
                                            var _otherBox = (_parentNode.find('li').not(_currentNode).not(childNodes)).find('i.check-portion, i.check-all');
                                            _otherBox.length == 0 && _parentCheckbox.removeClass('check-portion').removeClass('check-all').addClass('check-none');
                                            _otherBox.length > 0 && _parentCheckbox.removeClass('check-none').removeClass('check-all').addClass('check-portion');
                                        }

                                        if (ct == 'all') {
                                            var _otherBox = (_parentNode.find('li').not(_currentNode).not(childNodes)).find('i.check-portion, i.check-none');
                                            _otherBox.length == 0 && _parentCheckbox.removeClass('check-portion').removeClass('check-none').addClass('check-all');
                                            _otherBox.length > 0 && _parentCheckbox.removeClass('check-none').removeClass('check-all').addClass('check-portion');
                                        }
                                    }
                                    clickRecursive(_parentCheckbox, childNodes, ct);
                                }
                            },
                            showRecursive = function (currentCheckbox) {
                                var _parentNode = currentCheckbox.parent().parent().parent().parent();
                                if (_parentNode.length > 0) {
                                    var _parentCheckbox = _parentNode.prev().find(' > p > i.checkbox');
                                    if (_parentCheckbox.length > 0) {
                                        var _otherBox = _parentNode.find('li').find('i.checkbox'),
                                            _noneBox = _otherBox.filter('.check-none'),
                                            _allBox = _otherBox.filter('.check-all');
                                        _parentCheckbox.removeClass('check-none').removeClass('check-all').addClass('check-portion');
                                        _noneBox.length == _otherBox.length && _parentCheckbox.removeClass('check-portion').removeClass('check-all').addClass('check-none');
                                        _allBox.length == _otherBox.length && _parentCheckbox.removeClass('check-portion').removeClass('check-none').addClass('check-all');                                        
                                    }
                                    showRecursive(_parentCheckbox);
                                }
                            },
                            _checkbox = $('<i>').addClass('checkbox').addClass(checkboxClass).attr({ 'data-source': checkboxVal }).on('click', function () {
                                var _childNodes = $(this).parent().parent().next().find('li'),
                                    _childCheckboxs = _childNodes && _childNodes.length > 0 ? _childNodes.find('i.checkbox') : null;

                                if ($(this).hasClass('check-all')) {
                                    $(this).removeClass('check-all').addClass('check-none');
                                    _childCheckboxs && _childCheckboxs.removeClass('check-portion').removeClass('check-all').addClass('check-none');
                                    clickRecursive($(this), _childNodes, 'none');
                                } else {
                                    $(this).removeClass('check-none').removeClass('check-portion').addClass('check-all');
                                    _childCheckboxs && _childCheckboxs.removeClass('check-portion').removeClass('check-none').addClass('check-all');
                                    clickRecursive($(this), _childNodes, 'all');
                                }                                
                            }).appendTo(contentRender);

                        showRecursive(_checkbox);
                    }

                    if (typeof icon === 'string' && icon != '') {
                        if (icon.toLowerCase().substring(0, 1) != '<')
                            $('<img>').attr('src', icon).appendTo(contentRender);
                        else
                            contentRender.append(icon);
                    }
                    (typeof icon === 'function') && contentRender.append(icon.call(el));
                    
                    $('<span>').attr('title', nodeTxt).html(nodeTxt).appendTo(contentRender).on('click', function () {
                        if (!$(this).hasClass('active')) {
                            $('.active').removeClass('active');
                            $(this).addClass('active');
                            window['_CurrentTreeNode_'] = $(this).parent().parent().parent();
                            textHandler && textHandler.call(el);
                        }
                    });

                    if (hasSub) {
                        folder.addClass('folder').on('click', function () {
                            var _this = $(this);
                            if (!_this.hasClass('dis')) {
                                _this.addClass('dis');

                                var subRender = $(' > ul', _this.parent().parent()),
                                    loading = $(' > li.loading', subRender),
                                    subRows = $(' > li', subRender).not(loading);

                                _this.hasClass('unfolder') && subRender.slideUp(200, function () { _this.removeClass('dis').removeClass('unfolder').addClass('folder'); });

                                if (_this.hasClass('folder')) {
                                    if (subRows.length < 1 || _this.hasClass('refresh')) {
                                        subRows.length > 0 && subRows.remove();
                                        loading.length < 1 && $('<li class="loading">加载中，请稍后……</li>').appendTo(subRender);
                                        subRender.show();
                                        nodeHandler && nodeHandler.call(null, subRender, el);
                                    }
                                    subRender.slideDown(200, function () { _this.removeClass('dis').removeClass('folder').removeClass('refresh').addClass('unfolder'); });
                                }
                            }
                        });

                        $('<ul>').append('<li class="loading">加载中，请稍后……</li>').appendTo(nodeWrapper).hide();

                        //自动展开
                        typeof extended === 'boolean' && extended && window.setTimeout(function () { folder.click(); }, 50);
                    } else {
                        folder.addClass('single');
                    }
                })(idx, el);
            });
        }
    };

    //全部折叠
    var foldedAll = function (root) {
        if (!(root && root.length > 0)) root = $('.treeRoot');

        root.find('.unfolder').each(function () {
            $(this).click();
        });
    };

    //获取选中的节点值--数组形式
    var nodeChecked = function (root, prefix) {
        if (!(root && root.length > 0)) root = $('.treeRoot');
        
        var checked = [],
            checkedNodes = root.find('i.check-portion, i.check-all');
        (typeof prefix === 'string' && prefix != '') && (checkedNodes = root.find('i.checkbox[data-source^="' + prefix + '"]').filter('.check-portion, .check-all'));

        checkedNodes.each(function () {
            checked.push($(this).attr('data-source').replace(prefix, ''));
        });

        return checked;
    };

    //刷新当前节点
    var refresh = function () {
        var node = null;
        if (arguments.length > 0) {
            node = arguments[0].jquery ? arguments[0] : $(arguments[0]);
        } else {
            if (window['_CurrentTreeNode_']) {
                node = window['_CurrentTreeNode_'].jquery ? window['_CurrentTreeNode_'] : $(window['_CurrentTreeNode_']);
            }
        }

        if (node && node.length > 0) {
            var folder = $(' > div > i', node);
            if (folder && folder.length > 0) {
                if (folder.hasClass('folder') || folder.hasClass('unfolder')) {
                    folder.addClass('refresh');
                    folder.hasClass('folder') && folder.click();
                    folder.hasClass('unfolder') && folder.click().click();
                }
                if (folder.hasClass('single')) {
                    folder = $(' > div > i', node.parent().parent());
                    if (folder && folder.length > 0) {
                        if (folder.hasClass('folder') || folder.hasClass('unfolder')) {
                            folder.addClass('refresh');
                            folder.hasClass('folder') && folder.click();
                            folder.hasClass('unfolder') && folder.click().click();
                        }
                    } else {
                        window.location.reload();
                    }
                }
            }
        } else {
            window.location.reload();
        }
    };

    return {
        accordion: initAccordion,
        tree: { build: build, foldedAll: foldedAll, getChecked: nodeChecked, refresh: refresh }
    };
}));