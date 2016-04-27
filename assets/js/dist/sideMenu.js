﻿!function(e,n){"use strict";if("function"==typeof define&&define.amd)define(["jquery","exports"],function(l,a){e.sideMenu=n(a,l)});else if("undefined"!=typeof exports){var l=require("jquery");n(exports,l)}else e.sideMenu=n(e,"undefined"!=typeof jQuery?jQuery:window.Zepto)}("undefined"!=typeof window?window:this,function(e,n){"use strict";var l=function(e){var l=e.menuData||[],s=e.menuKey||{title:"menuName",icon:"menuIcon",childRen:"childRen"},o=e.menuRender||null,t=e.menuHandler||null,i="boolean"==typeof e.firstSelected?e.firstSelected:!1;l&&l.length>0&&o&&o.length>0&&(n.each(l,function(e,l){var c,d=n("<a>").attr({title:l[s.title]||"",href:"javascript:void(0);"});l[s.icon]&&n("<i>").addClass(l[s.icon]).appendTo(d),l[s.title]&&n("<label>").html(l[s.title]).appendTo(d),l[s.childRen]&&l[s.childRen].length>0&&n("<span>").appendTo(d),0==e&&i&&d.addClass("active"),c=n("<li>").append(d).appendTo(o),a.call(d,c,o,l,s,t)}),o.slideDown(200))},a=function(e,l,s,o,t){this.on("click",function(){var i,c,d,r,h;n(this).hasClass("active")||(i=n(" > li > a.active",l),i&&i.length>0&&(i.each(function(e,l){!function(e,l){n(".dis",l).removeClass("dis"),n(".active",l).removeClass("active"),n(".unfolded",l).removeClass("unfolded"),n("ul",l).hide()}(e,n(l).parent())}),i.removeClass("active")),n(this).addClass("active")),c=s[o.childRen],d=c&&c.length>0,d?(r=n(" > ul",e),r&&r.length>0||(r=n("<ul>").appendTo(e),n.each(c,function(e,l){var s,i=n("<a>").attr({title:l[o.title]||"",href:"javascript:void(0);"});n("<i>").appendTo(i),l[o.title]&&n("<label>").html(l[o.title]).appendTo(i),l[o.childRen]&&l[o.childRen].length>0&&n("<span>").appendTo(i),s=n("<li>").append(i).appendTo(r),a.call(i,s,r,l,o,t)})),n(this).hasClass("dis")||(h=n(this),n(this).addClass("dis"),n(this).hasClass("unfolded")?r.slideUp(200,function(){h.removeClass("dis").removeClass("unfolded")}):r.slideDown(200,function(){h.removeClass("dis").addClass("unfolded")}))):t&&t.call(s)})},s=function(e,l,a,s,o,t,i,c){if(a.children().remove(),e&&e.length>0){e.length-1;n.each(e,function(e,d){!function(e,d){var r,h,p,f,u,C,v,k=n("<i>"),m=n("<p>"),g=n("<div>").append(k,m),w=n("<li>").append(g).appendTo(a),T=l.nodeText||"",y=(/\{.*?\}/g.test(T)?n.DataFormat(T,d):d[T])||"\u554a\u54e6\uff0c\u8282\u70b9\u914d\u7f6e\u6216\u8bfb\u53d6\u6570\u636e\u51fa\u9519\u9e1f\uff01",b=d[l.hasSubNode],x=typeof i;("boolean"===x||"function"===x)&&(r="boolean"===x?i:i.call(d),h=r?"check-all":"check-none",p=l.checkboxValue||"",f=(/\{.*?\}/g.test(p)?n.DataFormat(p,d):d[p])||"",u=function(e,n,l){var a,s,o=e.parent().parent().parent(),t=o.parent();t.length>0&&(a=t.prev().find(" > p > i.checkbox"),a.length>0&&("none"==l&&(s=t.find("li").not(o).not(n).find("i.check-portion, i.check-all"),0==s.length&&a.removeClass("check-portion").removeClass("check-all").addClass("check-none"),s.length>0&&a.removeClass("check-none").removeClass("check-all").addClass("check-portion")),"all"==l&&(s=t.find("li").not(o).not(n).find("i.check-portion, i.check-none"),0==s.length&&a.removeClass("check-portion").removeClass("check-none").addClass("check-all"),s.length>0&&a.removeClass("check-none").removeClass("check-all").addClass("check-portion"))),u(a,n,l))},C=function(e){var n,l,a,s,o=e.parent().parent().parent().parent();o.length>0&&(n=o.prev().find(" > p > i.checkbox"),n.length>0&&(l=o.find("li").find("i.checkbox"),a=l.filter(".check-none"),s=l.filter(".check-all"),n.removeClass("check-none").removeClass("check-all").addClass("check-portion"),a.length==l.length&&n.removeClass("check-portion").removeClass("check-all").addClass("check-none"),s.length==l.length&&n.removeClass("check-portion").removeClass("check-none").addClass("check-all")),C(n))},v=n("<i>").addClass("checkbox").addClass(h).attr({"data-source":f}).on("click",function(){var e=n(this).parent().parent().next().find("li"),l=e&&e.length>0?e.find("i.checkbox"):null;n(this).hasClass("check-all")?(n(this).removeClass("check-all").addClass("check-none"),l&&l.removeClass("check-portion").removeClass("check-all").addClass("check-none"),u(n(this),e,"none")):(n(this).removeClass("check-none").removeClass("check-portion").addClass("check-all"),l&&l.removeClass("check-portion").removeClass("check-none").addClass("check-all"),u(n(this),e,"all"))}).appendTo(m),C(v)),"string"==typeof s&&""!=s&&("<"!=s.toLowerCase().substring(0,1)?n("<img>").attr("src",s).appendTo(m):m.append(s)),"function"==typeof s&&m.append(s.call(d)),n("<span>").attr("title",y).html(y).appendTo(m).on("click",function(){n(this).hasClass("active")||(n(".active").removeClass("active"),n(this).addClass("active"),window._CurrentTreeNode_=n(this).parent().parent().parent(),t&&t.call(d))}),b?(k.addClass("folder").on("click",function(){var e,l,a,s=n(this);s.hasClass("dis")||(s.addClass("dis"),e=n(" > ul",s.parent().parent()),l=n(" > li.loading",e),a=n(" > li",e).not(l),s.hasClass("unfolder")&&e.slideUp(200,function(){s.removeClass("dis").removeClass("unfolder").addClass("folder")}),s.hasClass("folder")&&((a.length<1||s.hasClass("refresh"))&&(a.length>0&&a.remove(),l.length<1&&n('<li class="loading">\u52a0\u8f7d\u4e2d\uff0c\u8bf7\u7a0d\u540e\u2026\u2026</li>').appendTo(e),e.show(),o&&o.call(null,e,d)),e.slideDown(200,function(){s.removeClass("dis").removeClass("folder").removeClass("refresh").addClass("unfolder")})))}),n("<ul>").append('<li class="loading">\u52a0\u8f7d\u4e2d\uff0c\u8bf7\u7a0d\u540e\u2026\u2026</li>').appendTo(w).hide(),"boolean"==typeof c&&c&&window.setTimeout(function(){k.click()},50)):k.addClass("single")}(e,d)})}},o=function(e){e&&e.length>0||(e=n(".treeRoot")),e.find(".unfolder").each(function(){n(this).click()})},t=function(e,l){e&&e.length>0||(e=n(".treeRoot"));var a=[],s=e.find("i.check-portion, i.check-all");return"string"==typeof l&&""!=l&&(s=e.find('i.checkbox[data-source^="'+l+'"]').filter(".check-portion, .check-all")),s.each(function(){a.push(n(this).attr("data-source").replace(l,""))}),a},i=function(){var e,l=null;arguments.length>0?l=arguments[0].jquery?arguments[0]:n(arguments[0]):window._CurrentTreeNode_&&(l=window._CurrentTreeNode_.jquery?window._CurrentTreeNode_:n(window._CurrentTreeNode_)),l&&l.length>0?(e=n(" > div > i",l),e&&e.length>0&&((e.hasClass("folder")||e.hasClass("unfolder"))&&(e.addClass("refresh"),e.hasClass("folder")&&e.click(),e.hasClass("unfolder")&&e.click().click()),e.hasClass("single")&&(e=n(" > div > i",l.parent().parent()),e&&e.length>0?(e.hasClass("folder")||e.hasClass("unfolder"))&&(e.addClass("refresh"),e.hasClass("folder")&&e.click(),e.hasClass("unfolder")&&e.click().click()):window.location.reload()))):window.location.reload()};return{accordion:l,tree:{build:s,foldedAll:o,getChecked:t,refresh:i}}});