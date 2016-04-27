//主框架页架构脚本，本文件必须依赖JQuery 和 common.js
(function (global, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'exports'], function ($, exports) {
            global.Framework = factory(exports, $);
        });
    } else if (typeof exports !== 'undefined') {
        var $ = require('jquery');
        factory(exports, $);
    } else {
        global.Framework = factory(global, (typeof (jQuery) != 'undefined') ? jQuery : window.Zepto);
    }
}(typeof window !== 'undefined' ? window : this, function (root, $) {
    'use strict';

    var framework = function () {
        //公开变量
        this.Config = arguments[0] || {};
        this.MenuData = this.Config.MenuData || [];
        this.MenuKey = this.Config.MenuKey || { id: 'menuId', title: 'menuName', icon: 'menuIcon', link: 'menuLink', leftUrl: 'leftPage', rightUrl: 'rightPage', childRen: 'childRen', neverClosed: 'neverClosed' };
        this.MenuErrorMessage = this.Config.MenuErrorMessage || '抱歉，打开菜单失败！';
        this.MaxTabLength = this.Config.MaxTabLength || 10;
        this.TabsOverflowMessage = this.Config.TabsOverflowMessage || '抱歉，最多只能打开不超过' + this.tabsLengthMax + '个标签页！';
        this.HeaderExtendHandle = this.Config.HeaderExtendHandle || null;

        //私有变量
        var _base = this,
            animationTime = 200,
            sideBarDisplayed = true,
            sideBarWidth = '250px',
            mainRenderMarginLeft = '252px',
            mainRenderBorderStyleNormal = '1px #c7c7c7 solid',
            mainRenderBorderStyleNone = 'none',
            defaultHref = 'javascript:void(0);';

        var header, menuRender, extendRender, sideBarRender, mainRender, tabRender, mainFrameRender;
        var tabJson = {}, tabIdxArray = [], currentTabIndex = null;

        //公开函数
        this.Init = function () {
            BuildFramework();
            BuildMainMenu();
            CallHeaderExtendFun();
        };

        this.Build = function () {
            BuildFramework();
        };

        this.BuildMenu = function (menuData) {
            this.MenuData = menuData;
            BuildMainMenu();
        };

        this.BindHeaderExtendHandle = function (extendFun) {
            this.HeaderExtendHandle = extendFun;
            CallHeaderExtendFun();
        };

        this.OpenTab = function (data) {
            OpenMenuInTab(data);
        };

        this.LeftFrameWindow = function () {
            if (currentTabIndex && tabJson[currentTabIndex] && tabJson[currentTabIndex].LeftRender && tabJson[currentTabIndex].LeftFrame) {
                return tabJson[currentTabIndex].LeftFrame[0].contentWindow;
            }
            return null;
        };

        this.MainFrameWindow = function () {
            if (currentTabIndex && tabJson[currentTabIndex] && tabJson[currentTabIndex].MainRender && tabJson[currentTabIndex].MainFrame) {
                return tabJson[currentTabIndex].MainFrame[0].contentWindow;
            }
            return null;
        };

        //私有函数
        var BuildFramework = function () {
            var root = $(document.body);

            header = $('<div>').addClass('header').append('<a class="logo" href="javascript:void(0);"></a>').appendTo(root);
            menuRender = $('<ul>').addClass('menu').appendTo(header);
            extendRender = $('<ul>').addClass('extend').appendTo(header);

            var wrapper = $('<div>').addClass('wrapper').appendTo(root);
            sideBarRender = $('<div>').addClass('sidebar').appendTo(wrapper);
            mainRender = $('<div>').addClass('content').appendTo(wrapper);
            tabRender = $('<ul>').appendTo(mainRender);
            mainFrameRender = $('<div>').addClass('container').appendTo(mainRender);

            $('<div>').addClass('footer').appendTo(root);

            //全屏浏览控制
            BuildFullViewController();
        };

        var BuildFullViewController = function () {
            $('<li>').addClass('fullView').append(
                $('<a>').attr({ 'herf': defaultHref, 'title': '全屏查看' }).on('click', function () {
                    var _this = $(this);
                    if (!_this.hasClass('dis')) {
                        _this.addClass('dis');

                        if (sideBarDisplayed) {
                            sideBarRender.animate({ 'width': '0' }, animationTime);
                            mainRender.animate({ 'margin-left': '0' }, animationTime, null, function () {
                                _this.attr('title', '取消全屏');
                                _this.removeClass('dis');
                                sideBarRender.hide();
                                mainRender.css('border-left', mainRenderBorderStyleNone);
                                sideBarDisplayed = false;
                            });
                        } else {
                            sideBarRender.show();
                            sideBarRender.animate({ 'width': sideBarWidth }, animationTime);
                            mainRender.animate({ 'margin-left': mainRenderMarginLeft }, animationTime, null, function () {
                                _this.attr('title', '全屏查看');
                                _this.removeClass('dis');
                                mainRender.css('border-left', mainRenderBorderStyleNormal);
                                sideBarDisplayed = true;
                            });
                        }
                    }
                })
            ).appendTo(extendRender);
        };

        var BuildMainMenu = function () {
            if (_base.MenuData && _base.MenuData.length > 0) {
                $.each(_base.MenuData, function (idx, el) {
                    (function (idx, el) {
                        var mLi = $('<li>').appendTo(menuRender);
                        var mRender = $('<a>').attr({ href: el[_base.MenuKey.link] || defaultHref, title: (el[_base.MenuKey.title] || '') }).appendTo(mLi);
                        el[_base.MenuKey.icon] && $('<i>').addClass(el[_base.MenuKey.icon]).appendTo(mRender);
                        el[_base.MenuKey.title] && $('<label>').html(el[_base.MenuKey.title]).appendTo(mRender);

                        //如果有子级菜单，则绑定为鼠标滑过弹出子菜单事件;否则，则绑定为点击打开菜单事件
                        if (el[_base.MenuKey.childRen] && el[_base.MenuKey.childRen].length > 0) {
                            BuildMenuFloatLayer.call(mLi, el[_base.MenuKey.childRen], 0);
                        } else {
                            !!!el.link && mRender.on('click', function () {
                                OpenMenuInTab(el);
                            });
                        }
                    })(idx, el);
                });
            }
        };

        var BuildMenuFloatLayer = function (data, level) {
            var root = this, layer = null, enterTimer = null, leaveTimer = null, render = $($('a', root).get(0));
            root.bind({
                'mouseenter': function () {
                    layer = $($('ul.dropdown-menu', root).get(0));
                    if (!(layer && layer.length > 0)) {
                        layer = $('<ul>').addClass('dropdown-menu').appendTo(root);
                        level > 0 && layer.addClass('menu-sub');
                        $.each(data, function (idx, el) {
                            (function (idx, el) {
                                var mLi = $('<li>').appendTo(layer);
                                var mRender = $('<a>').attr({ 'href': el.link || defaultHref, title: (el.name || '') }).appendTo(mLi);
                                el[_base.MenuKey.icon] && $('<i>').addClass(el[_base.MenuKey.icon]).appendTo(mRender);
                                el[_base.MenuKey.title] && $('<label>').html(el[_base.MenuKey.title]).appendTo(mRender);

                                //如果有子级菜单，则绑定为鼠标滑过弹出子菜单事件;没有子级菜单，如果符合点击打开菜单条件，则绑定点击打开标签页事件；如果都不符合，则不做任何处理（可以直接为链接类型）
                                if (el[_base.MenuKey.childRen] && el[_base.MenuKey.childRen].length > 0) {
                                    $('<span>').appendTo(mRender);
                                    BuildMenuFloatLayer.call(mLi, el[_base.MenuKey.childRen], level + 1);
                                } else {
                                    !!!el.link && mRender.on('click', function () {
                                        OpenMenuInTab(el);
                                        $('ul.dropdown-menu', menuRender).hide();
                                    });
                                }
                            })(idx, el);
                        });
                    }

                    enterTimer = window.setTimeout(function () {
                        layer.slideDown(animationTime, function () {
                            level > 0 && (!render.hasClass('active') && render.addClass('active'));
                        });
                    }, animationTime + 50);
                    leaveTimer && window.clearTimeout(leaveTimer);
                },
                'mouseleave': function () {
                    leaveTimer = window.setTimeout(function () {
                        layer.slideUp(animationTime);
                    }, animationTime + 50);
                    enterTimer && window.clearTimeout(enterTimer);
                    level > 0 && (render.hasClass('active') && render.removeClass('active'));
                }
            });
        };

        var CallHeaderExtendFun = function () {
            _base.HeaderExtendHandle && _base.HeaderExtendHandle.call(extendRender);
        };

        var CreateTabIndex = function (menu) {
            return $.MD5((menu[_base.MenuKey.id] || 0) + (menu[_base.MenuKey.title] || '') + (menu[_base.MenuKey.leftUrl] || '') + (menu[_base.MenuKey.rightUrl] || '') + 'frameMenu');
        };

        var OpenMenuInTab = function (menu) {
            if (menu && menu[_base.MenuKey.title] && menu[_base.MenuKey.title].Trim().length > 0 && (!!menu[_base.MenuKey.leftUrl] || !!menu[_base.MenuKey.rightUrl])) {
                var tabIndex = CreateTabIndex(menu);
                var idx = $.inArray(tabIndex, tabIdxArray);
                if (idx > 0) {
                    //激活已打开的标签页
                    SetTabActive(tabIndex);
                } else {
                    //创建新的标签页
                    if (tabIdxArray.length >= _base.MaxTabLength) {
                        _base.TabsOverflowMessage && alert(_base.TabsOverflowMessage);
                        return;
                    }

                    CreateNewTab(tabIndex, menu);
                }
            } else {
                _base.MenuErrorMessage && alert(_base.MenuErrorMessage);
                return;
            };
        };

        var CreateNewTab = function (tabIndex, menu) {
            //tab
            var tabLi = $('<li>').appendTo(tabRender);
            (menu[_base.MenuKey.neverClosed] && menu[_base.MenuKey.neverClosed] == true) && tabLi.addClass('noClosed');
            menu[_base.MenuKey.icon] && $('<i>').addClass(menu[_base.MenuKey.icon]).appendTo(tabLi);
            menu[_base.MenuKey.title] && $('<label>').html(menu[_base.MenuKey.title]).appendTo(tabLi);
            if (!(menu[_base.MenuKey.neverClosed] && menu[_base.MenuKey.neverClosed] == true)) {
                $('<span>').appendTo(tabLi).on('click', function () { CloseTab(tabIndex); });
                tabLi.on('dblclick', function () { CloseTab(tabIndex); });
            }
            tabLi.on('click', function () { SetTabActive(tabIndex); });

            //left
            var leftRender = null, leftFrameContent = null;
            if (menu[_base.MenuKey.leftUrl] && menu[_base.MenuKey.leftUrl].Trim().length > 0) {
                var _icon = menu[_base.MenuKey.icon] ? '<i class="' + menu[_base.MenuKey.icon] + '"></i>' : '',
                    _title = menu[_base.MenuKey.title] ? '<label>' + menu[_base.MenuKey.title] + '</label>' : '',
                    leftTitleHtml = '<ul><li>' + _icon + _title + '</li></ul>',
                    leftFrameBox = $('<div>').addClass('sideFrameRender');

                leftFrameContent = $('<iframe>').attr('src', menu[_base.MenuKey.leftUrl].Trim()).appendTo(leftFrameBox);
                leftRender = $('<div>').addClass('container').append(leftTitleHtml, leftFrameBox).appendTo(sideBarRender);
            }

            //main frame
            var mainFrameBox = null, mainFrameContent = null;
            if (menu[_base.MenuKey.rightUrl] && menu[_base.MenuKey.rightUrl].Trim().length > 0) {
                mainFrameContent = $('<iframe>').attr('src', menu[_base.MenuKey.rightUrl].Trim());
                mainFrameBox = $('<div>').addClass('mainFrameRender').append(mainFrameContent).appendTo(mainFrameRender);
            }

            //加入记录
            tabIdxArray.push(tabIndex);
            tabJson[tabIndex] = { LeftRender: leftRender, LeftFrame: leftFrameContent, TabRender: tabLi, MainRender: mainFrameBox, MainFrame: mainFrameContent };

            //激活当前标签页
            tabLi.click();
        };

        var SetTabActive = function (tabIndex) {
            if (tabIndex && tabJson[tabIndex]) {
                if (currentTabIndex && tabJson[currentTabIndex]) {
                    if (currentTabIndex != tabIndex) {
                        tabJson[currentTabIndex].LeftRender && tabJson[currentTabIndex].LeftRender.hide();
                        tabJson[currentTabIndex].MainRender && tabJson[currentTabIndex].MainRender.hide();
                        tabJson[currentTabIndex].TabRender.removeClass('active');

                        tabJson[tabIndex].LeftRender && tabJson[tabIndex].LeftRender.show();
                        tabJson[tabIndex].MainRender && tabJson[tabIndex].MainRender.show();
                        tabJson[tabIndex].TabRender.addClass('active');
                        currentTabIndex = tabIndex;
                    }
                } else {
                    tabJson[tabIndex].LeftRender && tabJson[tabIndex].LeftRender.show();
                    tabJson[tabIndex].MainRender && tabJson[tabIndex].MainRender.show();
                    tabJson[tabIndex].TabRender.addClass('active');
                    currentTabIndex = tabIndex;
                }
            }
        };

        var CloseTab = function (tabIndex) {
            if (tabIndex && tabJson[tabIndex]) {
                tabJson[tabIndex].LeftRender && tabJson[tabIndex].LeftRender.remove();
                tabJson[tabIndex].MainRender && tabJson[tabIndex].MainRender.remove();
                tabJson[tabIndex].TabRender.remove();
                tabIdxArray.splice($.inArray(tabIndex, tabIdxArray), 1);
                delete tabJson[tabIndex];
                tabIdxArray.length == 0 && (tabJson = {}) && (currentTabIndex = null);

                if (currentTabIndex && currentTabIndex == tabIndex) {
                    if (tabIdxArray.length > 0) {
                        SetTabActive(tabIdxArray[tabIdxArray.length - 1]);
                    }
                };
            }
        };
    };

    //返回外部调用
    return framework;
}));