//日期选择器脚本，本文件必须依赖JQuery 、 common.js
(function (global, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['jquery', 'exports'], function ($, exports) {
            global.datePicker = factory(exports, $);
        });
    } else if (typeof exports !== 'undefined') {
        var $ = require('jquery');
        factory(exports, $);
    } else {
        global.datePicker = factory(global, (typeof (jQuery) != 'undefined') ? jQuery : window.Zepto);
    }
}(typeof window !== 'undefined' ? window : this, function (root, $) {
    'use strict';

    var cancelEvent = function (sender, event) {
        if (sender.event)
            sender.event.cancelBubble = true;
        else
            event.stopPropagation();
    };

    var datePicker = function () {
        var options = arguments[0] || {},
            ownerWindow = arguments[1] || window,
            event = arguments[2] || window.event,
            dtNow = new Date();

        if (!(options.elment)) {
            throw 'datePicker error: please specify " options.elment " as a JQuery object';
            return;
        }

        var getElmentValue = function (el) {
            if (el) {
                var tag = el[0].tagName.toLowerCase();
                return ['input', 'textarea'].indexOf(tag) >= 0 ? el.val() : el.text();
            }
            return '';
        };

        var setElementValue = function (el, val) {
            if (el) {
                var tag = el[0].tagName.toLowerCase(),
                    input = ['input', 'textarea'].indexOf(tag) >= 0;

                val = val || '';
                input && el.val(val);
                !input && el.text(val);
            }
        };

        var getRangeSetting = function (setter, defaultValue, suffix) {
            var result = defaultValue,
                settingVal = typeof setter === 'string' ? setter : getElmentValue(setter);

            settingVal.IsDate() && (settingVal += suffix);
            settingVal.IsDateTime() && (result = settingVal);
            return result.ConvertToDateTime();
        };

        var getPickerLayerPosition = function (reference, ownerWindow) {
            var layerHeight = 313,
                layerWidth = 263,
                offset = reference.getOffset(ownerWindow),
                sHeight = reference.outerHeight(),
                winWidth = $(window).width(),
                winHeight = $(window).height(),
                top = offset.top + sHeight + 4,
                left = offset.left,
                topPad = offset.top,
                bottomPad = winHeight - top;

            if (bottomPad < layerHeight && topPad >= layerHeight) {
                top = topPad - layerHeight;
            }

            if ((left + layerWidth) > winWidth) {
                left = winWidth - layerWidth;
                left <= 0 && (left = 0);
            }

            return { left: left, top: top };
        };

        var closeLayer = function (layer) {
            layer && layer.fadeOut(200, function () {
                layer.children().remove();
            });
        };

        var bindLayerClosed = function (layer) {
            $(document).on('click', function () { closeLayer(layer); });
            window.top.FWK.LeftFrameWindow() && $(window.top.FWK.LeftFrameWindow().document).on('click', function () { closeLayer(layer); });
            window.top.FWK.MainFrameWindow() && $(window.top.FWK.MainFrameWindow().document).on('click', function () { closeLayer(layer); });
            window.top.dialog && window.top.dialog.dialogWindow() && $(window.top.dialog.dialogWindow().document).on('click', function () { closeLayer(layer); });
        };

        var pickElement = options.elment,
            pickModel = options.model || 'picker',
            rangeMinDate = getRangeSetting(options.rangeMin, '1900-1-1 0:0:0', ' 0:0:0'),
            rangeMaxDate = getRangeSetting(options.rangeMax, '2099-12-31 23:59:59', ' 23:59:59'),
            defaultDate = getRangeSetting(pickElement, dtNow.Format('yyyy-MM-dd HH:mm:ss'), dtNow.Format(' HH:mm:ss')),
            dateFormat = options.format || 'yyyy-MM-dd HH:mm:ss',
            pickHandler = options.pickHandler || null;
        
        if (rangeMaxDate <= rangeMinDate) {
            throw 'datePicker error: date ranage error！';
            return;
        }
        defaultDate < rangeMinDate && (defaultDate = rangeMinDate);
        defaultDate > rangeMaxDate && (defaultDate = rangeMaxDate);

        var calendarRender = null,
            calendarCloseHandler = function () {
                closeLayer(calendarRender);
            },
            datePickedHandler = function (date) {
                calendarCloseHandler && calendarCloseHandler();
                //填充选择结果
                setElementValue(pickElement, date);
                pickHandler && pickHandler(date);
            };

        if (pickModel == 'render') {
            calendarRender = pickElement;
            calendarCloseHandler = null;
            datePickedHandler = pickHandler;
        }

        if (pickModel == 'picker') {
            cancelEvent(ownerWindow, event);

            calendarRender = $('#DatePicker_Layer');

            if (calendarRender && calendarRender.length > 0) {
                calendarRender.children().remove().hide();
            } else {
                calendarRender = $('<div>').addClass('dp-layer').attr({ 'id': 'DatePicker_Layer' }).on('click', function (e) { cancelEvent(ownerWindow, e); }).appendTo(document.body);
                bindLayerClosed(calendarRender);
            }

            var offset = getPickerLayerPosition(pickElement, ownerWindow);
            calendarRender.css({ 'left': offset.left + 'px', 'top': offset.top + 'px' }).fadeIn(200);
        }

        var calendarConfig = {
            render: calendarRender,
            minDate: rangeMinDate,
            maxDate: rangeMaxDate,
            currentDate: defaultDate,
            format: dateFormat,
            pickedHandler: datePickedHandler,
            closerHandler: calendarCloseHandler,
            showButtons: pickModel == 'picker'
        };

        new calendar(calendarConfig);
    };

    var calendar = function (options) {
        var _self = this,
            render = options.render,
            minDate = options.minDate,
            maxDate = options.maxDate,
            currentDate = options.currentDate,
            format = options.format,
            pickedHandler = options.pickedHandler,
            closerHandler = options.closerHandler,
            showButtons = options.showButtons;

        var minDateJson = minDate.DateTimeToJson(),
            maxDateJson = maxDate.DateTimeToJson(),
            currentDateJson = currentDate.DateTimeToJson(),
            datePicked = { year: currentDateJson.Year, month: currentDateJson.Month, day: currentDateJson.Day, hour: currentDateJson.Hour, minute: currentDateJson.Minute, second: currentDateJson.Second };

        var rootWrapper, dayLis = [42];

        var build = function () {
            rootWrapper = $('<div>').addClass('dp-wrapper').on('click', function (e) {
                $('.ym-layer, .time-layer').hide();
            });

            buildYearAndMonthRow();
            buildWeekRow();
            buildDayWrapper();
            buildTimeRow();
            buildButtonRow();

            rootWrapper.appendTo(render);
        };

        var buildYearAndMonthRow = function () {
            var yearLi, monthLi;
            var prevYear, curYear, nextYear, prevMonth, curMonth, nextMonth;
            var ymMinDate = new Date(minDateJson.Year, minDateJson.Month - 1, 1),
                ymMaxDate = new Date(maxDateJson.Year, maxDateJson.Month - 1, 1),
                tmCurDate = new Date(currentDateJson.Year, currentDateJson.Month - 1, 1);
            var tmpDate;

            var fillYearsLayer = function (render, minYear, maxYear, upSender, downSender) {
                render.children().remove();
                minYear <= minDateJson.Year && upSender.addClass('up-dis');
                maxYear >= maxDateJson.Year && downSender.addClass('down-dis');
                var cellClass = '';

                for (var y = minYear; y <= maxYear; y++) {
                    (function (y) {
                        cellClass = '';
                        (y < minDateJson.Year || y > maxDateJson.Year) && (cellClass = 'dis');
                        y == datePicked.year && (cellClass = 'active');

                        $('<label>').addClass(cellClass).html(y + '年').on('click', function () {
                            if (!$(this).hasClass('dis')) {
                                y <= minDateJson.Year && prevYear.addClass('prev-dis');
                                y > minDateJson.Year && prevYear.removeClass('prev-dis');
                                y >= maxDateJson.year && nextYear.addClass('next-dis');
                                y < maxDateJson.year && nextYear.removeClass('next-dis');

                                datePicked.year = y;
                                curYear.html(y + '年');

                                var pickedYMDate = new Date(datePicked.year, datePicked.month - 1, 1);
                                if (pickedYMDate < ymMinDate) {
                                    datePicked.month = minDateJson.Month;
                                    curMonth.html(datePicked.month + '月');
                                    prevMonth.addClass('prev-dis');
                                }

                                if (pickedYMDate >= ymMaxDate) {
                                    datePicked.month = maxDateJson.Month;
                                    curMonth.html(datePicked.month + '月');
                                    nextMonth.addClass('next-dis');
                                }

                                fillDays(datePicked.year, datePicked.month);
                            }
                        }).appendTo(render);
                    })(y);
                }
            };

            prevYear = $('<span>').addClass('prev').on('click', function () {
                if (!$(this).hasClass('prev-dis')) {
                    datePicked.year--;
                    nextYear.hasClass('next-dis') && datePicked.year < maxDateJson.Year && nextYear.removeClass('next-dis');
                    datePicked.year <= minDateJson.Year && $(this).addClass('prev-dis');
                    curYear.html(datePicked.year + '年');
                    
                    if (new Date(datePicked.year, datePicked.month - 1, 1) <= ymMinDate) {
                        datePicked.month = minDateJson.Month;
                        curMonth.html(datePicked.month + '月');
                        prevMonth.addClass('prev-dis');
                    }
                    fillDays(datePicked.year, datePicked.month);
                }
            });
            currentDateJson.Year <= minDateJson.Year && prevYear.addClass('prev-dis');

            curYear = $('<p>').html(currentDateJson.Year + '年').on('click', function (e) {
                cancelEvent(window, e);
                $(this).attr({ 'data-minYear': datePicked.year - 3, 'data-maxYear': datePicked.year + 4 });
                var yLayer = yearLi.find('.ym-layer'), spUp, spDown, yRender;
                if (!(yLayer && yLayer.length > 0)) {
                    yLayer = $('<div>').addClass('ym-layer').appendTo(yearLi);

                    spUp = $('<span>').addClass('up').on('click', function (e) {
                        cancelEvent(window, e);

                        if (!$(this).hasClass('up-dis')) {
                            var tmpMinYear = parseInt(curYear.attr('data-minYear'), 10) - 8;
                            var tmpMaxYear = parseInt(curYear.attr('data-maxYear'), 10) - 8;
                            curYear.attr({ 'data-minYear': tmpMinYear, 'data-maxYear': tmpMaxYear });
                            fillYearsLayer(yRender, tmpMinYear, tmpMaxYear, $(this), spDown);
                        }
                    }).appendTo(yLayer);

                    yRender = $('<p>').appendTo(yLayer);

                    spDown = $('<span>').addClass('down').on('click', function (e) {
                        cancelEvent(window, e);

                        if (!$(this).hasClass('down-dis')) {
                            var tmpMinYear = parseInt(curYear.attr('data-minYear'), 10) + 8;
                            var tmpMaxYear = parseInt(curYear.attr('data-maxYear'), 10) + 8;
                            curYear.attr({ 'data-minYear': tmpMinYear, 'data-maxYear': tmpMaxYear });
                            fillYearsLayer(yRender, tmpMinYear, tmpMaxYear, spUp, $(this));
                        }
                    }).appendTo(yLayer);
                } else {
                    spUp = yLayer.find('span.up').removeClass('up-dis');
                    yRender = yLayer.find('p').eq(0);
                    spDown = yLayer.find('span.down').removeClass('down-dis');
                }
                yLayer.show();
                window.setTimeout(function () { fillYearsLayer(yRender, parseInt(curYear.attr('data-minYear'), 10), parseInt(curYear.attr('data-maxYear'), 10), spUp, spDown); }, 10);
            });

            nextYear = $('<span>').addClass('next').on('click', function () {
                if (!$(this).hasClass('next-dis')) {
                    datePicked.year++;
                    prevYear.hasClass('prev-dis') && datePicked.year > minDateJson.Year && prevYear.removeClass('prev-dis');
                    datePicked.year >= maxDateJson.Year && $(this).addClass('next-dis');
                    curYear.html(datePicked.year + '年');
                    if (new Date(datePicked.year, datePicked.month - 1, 1) >= ymMaxDate) {
                        datePicked.month = maxDateJson.Month;
                        curMonth.html(datePicked.month + '月');
                        nextMonth.addClass('next-dis');
                    }
                    fillDays(datePicked.year, datePicked.month);
                }
            });
            currentDateJson.Year >= maxDateJson.Year && nextYear.addClass('next-dis');

            prevMonth = $('<span>').addClass('prev').on('click', function () {
                if (!$(this).hasClass('prev-dis')) {
                    if (datePicked.month == 1) {
                        datePicked.month = 12;
                        datePicked.year--;
                        nextYear.hasClass('next-dis') && datePicked.year < maxDateJson.Year && nextYear.removeClass('next-dis');
                        datePicked.year <= minDateJson.Year && prevYear.addClass('prev-dis');
                        curYear.html(datePicked.year + '年');
                    } else {
                        datePicked.month--;
                    }

                    tmpDate = new Date(datePicked.year, datePicked.month - 1, 1);
                    nextMonth.hasClass('next-dis') && tmpDate < ymMaxDate && nextMonth.removeClass('next-dis');
                    tmpDate <= ymMinDate && $(this).addClass('prev-dis');
                    curMonth.html(datePicked.month + '月');
                    fillDays(datePicked.year, datePicked.month);
                }
            });
            tmCurDate <= ymMinDate && prevMonth.addClass('prev-dis');

            curMonth = $('<p>').html(currentDateJson.Month + '月').on('click', function (e) {
                cancelEvent(window, e);

                var mLayer = monthLi.find('.ym-layer'), mRender, mCellClass = '', tmpMin, tmpMax;
                !(mLayer && mLayer.length > 0) && (mLayer = $('<div>').addClass('ym-layer').appendTo(monthLi));
                mLayer.children().remove().hide();
                mRender = $('<p>').appendTo(mLayer);

                for (var m = 1; m <= 12; m++) {
                    (function (m) {
                        mCellClass = '';
                        tmpDate = new Date(datePicked.year, m - 1, 1);
                        (tmpDate < ymMinDate || tmpDate > ymMaxDate) && (mCellClass = 'dis');
                        m == datePicked.month && (mCellClass = 'active');

                        $('<label>').addClass(mCellClass).html(m + '月').on('click', function () {
                            if (!$(this).hasClass('dis')) {
                                tmpDate <= ymMinDate && prevMonth.addClass('prev-dis');
                                tmpDate > ymMinDate && prevMonth.removeClass('prev-dis');
                                tmpDate >= ymMaxDate && nextMonth.addClass('next-dis');
                                tmpDate < ymMaxDate && nextMonth.removeClass('next-dis');

                                datePicked.month = m;
                                curMonth.html(datePicked.month + '月');
                                fillDays(datePicked.year, datePicked.month);
                            }
                        }).appendTo(mRender);
                    })(m);
                }
                mLayer.show();
            });

            nextMonth = $('<span>').addClass('next').on('click', function () {
                if (!$(this).hasClass('next-dis')) {
                    if (datePicked.month == 12) {
                        datePicked.month = 1;
                        datePicked.year++;
                        prevYear.hasClass('prev-dis') && datePicked.year > minDateJson.Year && prevYear.removeClass('prev-dis');
                        datePicked.year >= maxDateJson.Year && nextYear.addClass('next-dis');
                        curYear.html(datePicked.year + '年');
                    } else {
                        datePicked.month++;
                    }

                    tmpDate = new Date(datePicked.year, datePicked.month - 1, 1);
                    prevMonth.hasClass('prev-dis') && tmpDate > ymMinDate && prevMonth.removeClass('prev-dis');
                    tmpDate >= ymMaxDate && $(this).addClass('next-dis');
                    curMonth.html(datePicked.month + '月');
                    fillDays(datePicked.year, datePicked.month);
                }
            });
            tmCurDate >= ymMaxDate && nextMonth.addClass('next-dis');

            yearLi = $('<li>').addClass('year').append(prevYear, curYear, nextYear);
            monthLi = $('<li>').addClass('month').append(prevMonth, curMonth, nextMonth);
            $('<ul>').addClass('year-month').append(yearLi, monthLi).appendTo(rootWrapper);
        };

        var buildWeekRow = function () {
            rootWrapper.append('<ul class="week"><li>日</li><li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li></ul>');
        };

        var buildDayWrapper = function () {
            var dayRow = $('<ul>').addClass('day');
            for (var i = 0; i <= 41; i++) {
                var dayLi = $('<li>').on('click', function () {
                    if (!$(this).hasClass('dis') && $(this).attr('data-year') && $(this).attr('data-month')) {
                        var year = ~~parseInt($(this).attr('data-year'), 10),
                            month = ~~parseInt($(this).attr('data-month'), 10),
                            day = ~~parseInt($(this).text(), 10);

                        if (year > 0 && month > 0 && day > 0) {
                            datePicked.year = year;
                            datePicked.month = month;
                            datePicked.day = day;
                            getAndReturnPciked();
                        }
                    }
                }).appendTo(dayRow);

                dayLis[i] = dayLi;
            }
            dayRow.appendTo(rootWrapper);
        };

        var buildTimeRow = function () {
            var timeLi,
                labelHour = $('<label>').html(currentDateJson.Hour).on('click', function (e) { fillTimeLayer(e, timeLi, $(this), 'hour', 0, 23); }),
                labelMinute = $('<label>').html(currentDateJson.Minute).on('click', function (e) { fillTimeLayer(e, timeLi, $(this), 'minute', 0, 59); }),
                labelSecond = $('<label>').html(currentDateJson.Second).on('click', function (e) { fillTimeLayer(e, timeLi, $(this), 'second', 0, 59); });

            timeLi = $('<li>').addClass('timer').append(labelHour, '<label class="short">：</label>', labelMinute, '<label class="short">：</label>', labelSecond)
            $('<ul>').addClass('time').append('<li class="txt">当前时间：</li>', timeLi).appendTo(rootWrapper);
        };

        var fillTimeLayer = function (e, render, sender, setter, min, max) {
            cancelEvent(window, e);

            var tLayer = render.find('.time-layer'), cellClass = '';
            !(tLayer && tLayer.length > 0) && (tLayer = $('<div>').addClass('time-layer').appendTo(render));
            tLayer.children().remove().hide();
            for (var t = min; t <= max; t++) {
                (function (t) {
                    cellClass = t == datePicked[setter] ? 'active' : '';
                    $('<span>').addClass(cellClass).html(t).on('click', function () {
                        if (!$(this).hasClass('dis')) {
                            sender.html(t);
                            datePicked[setter] = t;
                        }
                    }).appendTo(tLayer);
                })(t);
            }
            tLayer.show();
        };

        var buildButtonRow = function () {
            if (showButtons) {
                var btnLi = $('<li>');

                $('<input type="button" name="btn_01" id="btn_01" value="取消">').on('click', function () { closerHandler && closerHandler(); }).appendTo(btnLi);
                $('<input type="button" name="btn_02" id="btn_02" value="清空">').on('click', function () { returnDatePicked(''); }).appendTo(btnLi);
                $('<input type="button" name="btn_03" id="btn_03" value="今天">').on('click', function () { returnDatePicked((new Date()).Format(format)); }).appendTo(btnLi);
                $('<input type="button" name="btn_04" id="btn_04" value="确定">').on('click', function () { getAndReturnPciked(); }).appendTo(btnLi);

                $('<ul>').addClass('button').append(btnLi).appendTo(rootWrapper);
            }
        };

        var fillDays = function (year, month) {
            var prevYear = month <= 1 ? year - 1 : year,
                prevMonth = month <= 1 ? 12 : month - 1,
                prevMonthDays = getMonthDays(prevYear, prevMonth),
                curMonthDays = getMonthDays(year, month),
                curMonthWkIdx = new Date(year, month - 1, 1).getDay(),
                nextYear = month >= 12 ? year + 1 : year,
                nextMonth = month >= 12 ? 1 : month + 1,
                days = [42];

            for (var d = curMonthWkIdx; d >= 0 ; d--) {
                days[d] = { year: prevYear, month: prevMonth, day: prevMonthDays - (curMonthWkIdx - d), className: 'attach' };
            }

            for (var d = 1; d <= curMonthDays; d++) {
                days[curMonthWkIdx + (d - 1)] = { year: year, month: month, day: d, className: (year == currentDateJson.Year && month == currentDateJson.Month && d == currentDateJson.Day) ? 'active' : '' };
            }

            for (var d = curMonthDays + curMonthWkIdx; d < 42; d++) {
                days[d] = { year: nextYear, month: nextMonth, day: d - curMonthDays - curMonthWkIdx + 1, className: 'attach' };
            }

            var tmp, tmpDate;
            for (var i = 0; i < 42; i++) {
                tmp = days[i];
                tmpDate = new Date(tmp.year, tmp.month - 1, tmp.day, datePicked.hour, datePicked.minute, datePicked.second);

                if (tmpDate < minDate || tmpDate > maxDate)
                    tmp.className = 'dis';

                dayLis[i].attr({ 'data-year': tmp.year, 'data-month': tmp.month, 'class': (tmp.className || '') }).text(tmp.day);
            }
        };

        var getMonthDays = function (year, month) {
            if (2 == month) return (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) ? 29 : 28;
            if ([1, 3, 5, 7, 8, 10, 12].indexOf(month) >= 0) return 31;
            if ([4, 6, 9, 11].indexOf(month) >= 0) return 30;
        };

        var getAndReturnPciked = function () {
            var date = new Date(datePicked.year, datePicked.month - 1, datePicked.day, datePicked.hour, datePicked.minute, datePicked.second);
            date < minDate && (date = minDate);
            date > maxDate && (date = maxDate);
            returnDatePicked(date.Format(format));
        };

        var returnDatePicked = function (date) {
            pickedHandler && pickedHandler(date);
        };

        build();
        fillDays(currentDateJson.Year, currentDateJson.Month);
    };

    return datePicker;
}));