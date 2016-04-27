/* 
   对话弹层（包含：alert,confirm,openWindow,tips,toast,message）脚本部分
   本文件依赖JQuery、jquery.drag.js 和 common.js
*/
(function (global, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'exports'], function ($, exports) {
            global.dialog = factory(exports, $);
        });
    } else if (typeof exports !== 'undefined') {
        var $ = require('jquery');
        factory(exports, $);
    } else {
        global.dialog = factory(global, (typeof (jQuery) != 'undefined') ? jQuery : window.Zepto);
    }
}(typeof window !== 'undefined' ? window : this, function (root, $) {
    'use strict';

    var config = { animateTime: 200, boderWidth: 1, titleHeight: 40, bottomHeight: 48, contentPadding: 8, iconWidth: 48, layerZIndex: 999999, layerIndex: 10, layerIdPrefixed: 'dialogLayer_Shadow_', layerFramePrefixed: 'dialogLayer_Frame_' };

    var windowSize = function () {
        return { width: $(window).width(), height: $(window).height() };
    };

    var createDialogLayer = function (title, width, height, canZoom, contentRender, buttonRender, loadingRender, frame, closeHandler) {
        config.layerZIndex += 10;
        config.layerIndex += 10;

        var winSize = windowSize(),
            wrapperWidth = width + config.boderWidth * 2,
            //wapperHeight = height + config.boderWidth * 2,
            wapperHeight = height + config.titleHeight,
            layerCanMove = true,
            layerZIndex = config.layerZIndex,
            shadowLayerId = config.layerIdPrefixed + config.layerIndex,
            shadowLayer = $('<div>').addClass('dlayer-layer').css({ 'z-index': layerZIndex }).attr({ 'id': shadowLayerId }),
            wrapperLayer = $('<div>').addClass('wapper').css({ 'width': width + 'px', 'height': wapperHeight + 'px', 'left': ((winSize.width - wrapperWidth) / 2) + 'px', 'top': ((winSize.height - wapperHeight) / 2) + 'px' }),
            titleRender = $('<div>').addClass('title').append('<h1>' + title + '</h1>').appendTo(wrapperLayer),
            ctrlRender = $('<p>').append().appendTo(titleRender),
            ctrlZoom = null;

        //关闭
        $('<a>').addClass('close').attr({ 'href': 'javascript:void(0)', 'title': '关闭' }).on('click', function () { layerClose(closeHandler); }).appendTo(ctrlRender);

        //最大化、还原
        if (canZoom) {
            //contentRender && contentRender.css({ 'height': height - config.titleHeight });
            contentRender && contentRender.css({ 'height': height });
            frame && frame.attr({ 'id': config.layerFramePrefixed + config.layerIndex });

            ctrlZoom = $('<a>').addClass('minSize').attr({ 'href': 'javascript:void(0)', 'title': '全屏查看' }).on('click', function () {
                wapperZoom(wrapperLayer, ctrlZoom, wrapperWidth, wapperHeight, contentRender, function (result) {
                    layerCanMove = result;
                });
            }).appendTo(ctrlRender);
        } else {
            //contentRender && contentRender.css({ 'height': height - config.titleHeight - config.bottomHeight - config.contentPadding * 2 });
            contentRender && contentRender.css({ 'height': height - config.bottomHeight - config.contentPadding * 2 });
        }

        //移动事件
        titleRender.on('dragstart', function (e) {
            layerCanMove && setWrapperOffset('start', e, wrapperLayer, wrapperWidth, wapperHeight);
            if (layerCanMove && canZoom && loadingRender && frame) {
                frame.hide();
                loadingRender.show();
            }
        }).on('drag', function (e) {
            layerCanMove && setWrapperOffset('moving', e, wrapperLayer, wrapperWidth, wapperHeight);
        }).on('dragend', function (e) {
            layerCanMove && setWrapperOffset('end', e, wrapperLayer, wrapperWidth, wapperHeight);
            if (layerCanMove && canZoom && loadingRender && frame) {
                loadingRender.hide();
                frame.show();
            }
        }).on('dblclick', function () {
            ctrlZoom && wapperZoom(wrapperLayer, ctrlZoom, wrapperWidth, wapperHeight, contentRender, function (result) {
                layerCanMove = result;
            });
        })

        shadowLayer.append(wrapperLayer.append(contentRender || '', buttonRender || '')).appendTo(document.body).fadeIn(config.animateTime);
    };

    var setWrapperOffset = function (ts, event, wrapperLayer, wrapperWidth, wapperHeight) {
        var tx = 0, ty = 0, winSize = windowSize();
        if (ts == 'start') {
            tx = (winSize.width - wrapperWidth) / 2;
            ty = (winSize.height - wapperHeight) / 2;
        } else {
            tx = event.offsetX;
            (tx < 5) && (tx = 5);
            (tx + wrapperWidth + 5 > winSize.width) && (tx = winSize.width - wrapperWidth - 5);

            ty = event.offsetY;
            (ty < 5) && (ty = 5);
            (ty + wapperHeight + 5 > winSize.height) && (ty = winSize.height - wapperHeight - 5);
        }

        wrapperLayer.css({ 'left': tx + 'px', 'top': ty + 'px' });
    };

    var wapperZoom = function (wrapperLayer, ctrlZoom, wrapperWidth, wapperHeight, contentRender, zoomEnded) {
        if (!ctrlZoom.hasClass('dis')) {
            ctrlZoom.addClass('dis');

            var winSize = windowSize(),
                toWidth = 0,
                toHeight = 0;

            if (ctrlZoom.hasClass('minSize')) {
                toWidth = winSize.width - 10 - config.boderWidth * 2;
                toHeight = winSize.height - 10 - config.boderWidth * 2;
                wrapperLayer.animate({ 'left': '5px', 'top': '5px', 'width': toWidth + 'px', 'height': toHeight + 'px' }, config.animateTime, null, function () {
                    ctrlZoom.removeClass('dis').removeClass('minSize').addClass('maxSize').attr('title', '退出全屏');
                    contentRender && contentRender.css({ 'height': (toHeight - config.titleHeight) + 'px' });
                    zoomEnded && zoomEnded(false);
                });
            }

            if (ctrlZoom.hasClass('maxSize')) {
                toWidth = wrapperWidth - config.boderWidth * 2;
                toHeight = wapperHeight - config.boderWidth * 2;
                var tx = (winSize.width - wrapperWidth) / 2,
                    ty = (winSize.height - wapperHeight) / 2;

                wrapperLayer.animate({ 'left': tx + 'px', 'top': ty + 'px', 'width': toWidth + 'px', 'height': toHeight + 'px' }, config.animateTime, null, function () {
                    ctrlZoom.removeClass('dis').removeClass('maxSize').addClass('minSize').attr('title', '全屏查看');
                    contentRender && contentRender.css({ 'height': (toHeight - config.titleHeight) + 'px' });
                    zoomEnded && zoomEnded(true);
                });
            }
        }
    };

    var layerClose = function (closeHandler) {
        var layer = $('#' + config.layerIdPrefixed + config.layerIndex);
        layer && layer.length > 0 && layer.fadeOut(config.animateTime, function () {
            config.layerZIndex -= 10;
            config.layerIndex -= 10;
            layer.remove();
            closeHandler && closeHandler();
        });
    };

    var dialogMessage = function (title, icon, message, width, height, buttonOkTxt, buttonOkStyle, buttonOkHandler, buttonCancelTxt, buttonCancelStyle, buttonCancelHandler) {
        var contentRender = $('<div>').addClass('content'),
            iconRender = $('<p>').addClass(icon).appendTo(contentRender),
            txtRender = $('<div>').css({ 'width': (width - config.boderWidth * 2 - config.contentPadding * 2 - config.iconWidth) + 'px' }).html('<div>' + message + '</div>').appendTo(contentRender),
            buttonRender = $('<div>').addClass('bottom'),
            btnOk = $('<button>').html(buttonOkTxt).appendTo(buttonRender);

        buttonOkStyle && btnOk.addClass(buttonOkStyle);
        btnOk.on('click', function () { layerClose(buttonOkHandler); });

        if (buttonCancelTxt) {
            var btnCancel = $('<button>').html(buttonCancelTxt).appendTo(buttonRender);
            buttonCancelStyle && btnCancel.addClass(buttonCancelStyle);
            btnCancel.on('click', function () { layerClose(buttonCancelHandler); });
        }

        createDialogLayer(title, width, height, false, contentRender, buttonRender, null, null, buttonCancelHandler || buttonOkHandler);
    };

    var dialogAlert = function (message) {
        var content = message || '提示信息',
            config = arguments[1] || {},
            title = config.title || '页面提示',
            width = ~~config.width || 300,
            height = ~~config.height || 150,
            buttonTxt = config.buttonTxt || '确定',
            buttonStyle = config.buttonStyle || '',
            callback = config.callback || null;

        dialogMessage(title, 'alert', content, width, height, buttonTxt, buttonStyle, callback, null, null, null);
    };

    var dialogConfirm = function (message) {
        var content = message || '确认信息',
            config = arguments[1] || {},
            title = config.title || '页面提示',
            width = ~~config.width || 300,
            height = ~~config.height || 150,
            buttonOkTxt = config.buttonOkTxt || '确定',
            buttonOkStyle = config.buttonOkStyle || '',
            buttonOkClicked = config.buttonOkClicked || null,
            buttonCancelTxt = config.buttonCancelTxt || '取消',
            buttonCancelStyle = config.buttonCancelStyle || '',
            buttonCancelClicked = config.buttonCancelClicked || null;

        dialogMessage(title, 'confirm', content, width, height, buttonOkTxt, buttonOkStyle, buttonOkClicked, buttonCancelTxt, buttonCancelStyle, buttonCancelClicked);
    };

    var dialogError = function (message) {
        var content = message || '提示信息',
            config = arguments[1] || {},
            title = config.title || '页面提示',
            width = ~~config.width || 300,
            height = ~~config.height || 150,
            buttonTxt = config.buttonTxt || '知道了',
            buttonStyle = config.buttonStyle || '',
            callback = config.callback || null;

        dialogMessage(title, 'error', content, width, height, buttonTxt, buttonStyle, callback, null, null, null);
    };

    var dialogSucced = function (message) {
        var content = message || '提示信息',
            config = arguments[1] || {},
            title = config.title || '页面提示',
            width = ~~config.width || 300,
            height = ~~config.height || 150,
            buttonTxt = config.buttonTxt || '知道了',
            buttonStyle = config.buttonStyle || '',
            callback = config.callback || null;

        dialogMessage(title, 'right', content, width, height, buttonTxt, buttonStyle, callback, null, null, null);
    };

    var openUrl = function (url, title, width, height, callback) {
        if (!!!url) {
            dialogAlert('请指定页面！');
            return;
        }

        var contentRender = $('<div>').addClass('frame'),
            loadingRender = $('<div>').addClass('loading').appendTo(contentRender),
            frame = $('<iframe>').attr({ 'src': url, 'frameborder': 0, 'width': '100%', 'height': '100%', 'scroll': 'auto' }).css('display', 'none').appendTo(contentRender),
            frameDom = frame[0];

        if (frameDom.attachEvent)
            frameDom.attachEvent('onload', function () { window.setTimeout(function () { loadingRender.hide(); frame.show() }), config.animateTime });
        else
            frameDom.onload = function () { window.setTimeout(function () { loadingRender.hide(); frame.show() }), config.animateTime };

        callback && (frameDom.callback = callback);
        createDialogLayer(title, width, height, true, contentRender, null, loadingRender, frame, callback);
    };

    var openWindow = function (url, title, width, height, callback) {
        openUrl(url, title || '打开窗口', ~~width || 800, ~~height || 600, callback);
    };

    var fileView = function (url, title, width, height, callback) {
        openUrl(url, title || '选择文件', ~~width || 800, ~~height || 600, callback);
    };

    var getOpenWindow = function () {
        var ifrId = $('#' + config.layerFramePrefixed + config.layerIndex);
        if (ifrId && ifrId.length > 0) {
            return ifrId[0].contentWindow;
        }
        return null;
    };

    //toast
    var toast = function (message) {
        var config = arguments[1] || {},
            width = config.width || 268,
            height = config.height || 48,
            lineHeight = config.lineHeight || 48,
            bottom = config.bottom || 120,
            time = (typeof config.showTime === 'number') ? ~~config.showTime : 3000,
            callback = config.callback || null,
            css = {
                'width': width + 'px',
                'min-height': height + 'px',
                'line-height': lineHeight + 'px',
                'margin-left': -((width + 32) / 2) + 'px',
                'bottom': bottom + 'px'
            },
            box = $('<div>').addClass('dlayer-toast').css(css).html(message).appendTo(document.body);

        if (time > 0) {
            window.setTimeout(function () {
                box.hide().remove();
                callback && callback();
            }, time);
        } else {
            callback && callback.call(box);
        }
    };

    //picurePreview
    var picurePreview = function (sender, picureUrl, ownerWindow) {
        var layer = null,
            layerWidth = 300,
            layerHeight = 300,
            timer = null,
            createLayer = function () {
                layer = $('#Top_Layer_PicturePreview');
                if (layer && layer.length > 0) {
                    layer.children().remove() && layer.hide();
                } else {
                    layer = $('<div>').addClass('dlayer-picturePreview').attr('id', 'Top_Layer_PicturePreview').appendTo(document.body);
                }

                layer.on('mouseenter', function () {
                    timer && window.top.clearTimeout(timer);
                }).on('mouseleave', function () {
                    timer = window.top.setTimeout(function () {
                        layer && layer.children().remove() && layer.hide();
                    }, 50);
                });
            },
            mouseIn = function () {
                !!!picureUrl && sender[0].tagName.toLowerCase() === 'input' && (picureUrl = sender.val());
                if (!!!picureUrl) return;

                var offset = sender.getOffset(ownerWindow),
                    sWidth = sender.outerWidth(),
                    sHeight = sender.outerHeight(),
                    winSize = windowSize(),
                    top = offset.top + sHeight + 4,
                    left = offset.left,
                    topPad = offset.top,
                    bottomPad = winSize.height - top,
                    tWidth = layerWidth,
                    tHeight = layerHeight;

                if (bottomPad < layerHeight) {
                    if (topPad > layerHeight) {
                        top = topPad - layerHeight;
                    } else {
                        if (bottomPad >= topPad) {
                            tWidth = tHeight = bottomPad;
                        } else {
                            tWidth = tHeight = topPad;
                            top = 0;
                        }
                    }
                }

                if ((left + tWidth) > winSize.width) {
                    left = winSize.width - tWidth;
                    left <= 0 && (left = 0);
                }

                var html = '<a href="' + picureUrl + '" target="_blank"><img src="' + picureUrl + '" ></a>',
                    css = { 'left': left + 'px', 'top': top + 'px', 'width': (tWidth - 10) + 'px', 'height': (tHeight - 10) + 'px', 'line-height': (tHeight - 10) + 'px' };

                createLayer();
                layer.append(html).css(css).show();
                timer && window.top.clearTimeout(timer);
            },
            mouseOut = function () {
                timer = window.top.setTimeout(function () {
                    layer && layer.children().remove() && layer.hide();
                }, 50);
            };

        sender.on('mouseenter', mouseIn).on('mouseleave', mouseOut);
    };

    return {
        alert: dialogAlert,
        confirm: dialogConfirm,
        error: dialogError,
        success: dialogSucced,
        openWindow: openWindow,
        fileView: fileView,
        dialogWindow: getOpenWindow,
        close: layerClose,
        toast: toast,
        picurePreview: picurePreview
    };
}));