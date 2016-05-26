﻿!function(t){"use strict";if("function"==typeof define&&define.amd)define(["jquery"],t);else if("undefined"!=typeof exports){var e=require("jquery");t(e)}else t("undefined"!=typeof jQuery?jQuery:window.Zepto)}(function(t){"use strict";String.prototype.Trim=function(){return(this||"").replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g,"")},String.prototype.StartWith=function(t){var e=this||"";return e.length>=t.length&&0==e.indexOf(t)?!0:!1},String.prototype.EndWith=function(t){var e=this||"";return e.length>=t.length&&e.lastIndexOf(t)==e.length-t.length?!0:!1},String.prototype.TrimStart=function(t){for(var e=this||"";e.StartWith(t);)e=e.substring(t.length);return e},String.prototype.TrimEnd=function(t){for(var e=this||"";e.EndWith(t);)e=e.substring(0,e.length-t.length);return e},String.prototype.RemoveHTML=function(t){var e=this||"";return e=e.replace(/<\/?[^>]*>/g,""),e=e.replace(/[ | ]*\n/g,"\n"),e=e.replace(/&nbsp;/gi,"")},String.prototype.IsMobileNumber=function(){var t=this||"",e=/^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|17[0-9]|14[57])[0-9]{8}$/;return e.test(t)},String.prototype.IsTelphoneNumber=function(){var t=this||"",e=/^((\+?86)|(\(\+86\)))?0\d{2,3}-\d{7,8}(-\d{3,4})?$/;return e.test(t)},String.prototype.IsEmail=function(){var t=this||"",e=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;return e.test(t)},Number.prototype.ToLocaleDateString=function(t){var e=6e4*(new Date).getTimezoneOffset(),r=Math.floor(((this||0)-e)/1e3),n=new Date(1970,0,1,0,0,0).DateAdd("s",r);return n.Format(t)},String.prototype.IsDate=function(){var t,e,r,n,o=(this||"").replace(/-/g,"/"),i=/^(\d{4})\/(\d{1,2})\/(\d{1,2})?$/;return i.test(o)?(t=parseInt(RegExp.$1,10),e=parseInt(RegExp.$2,10)-1,r=parseInt(RegExp.$3,10),n=new Date(t,e,r),n.getFullYear()!=t||n.getMonth()!=e||n.getDate()!=r?!1:!0):!1},String.prototype.IsDateTime=function(){var t,e,r,n,o,i,a,s=(this||"").replace(/-/g,"/"),u=/^(\d{4})\/(\d{1,2})\/(\d{1,2})(\s(\d{1,2}):(\d{1,2}):(\d{1,2}))$/;return u.test(s)?(t=parseInt(RegExp.$1,10),e=parseInt(RegExp.$2,10)-1,r=parseInt(RegExp.$3,10),n=parseInt(RegExp.$5,10),o=parseInt(RegExp.$6,10),i=parseInt(RegExp.$7,10),a=new Date(t,e,r,n,o,i),a.getFullYear()!=t||a.getMonth()!=e||a.getDate()!=r||a.getHours()!=n||a.getMinutes()!=o||a.getSeconds()!=i?!1:!0):!1},String.prototype.ConvertToDate=function(){var t=(this||"").replace(/-/g,"/");return t.IsDate()?(/^(\d{4})\/(\d{1,2})\/(\d{1,2})?$/.test(t),new Date(parseInt(RegExp.$1,10),parseInt(RegExp.$2,10)-1,parseInt(RegExp.$3,10))):new Date},String.prototype.ConvertToDateTime=function(){var t=(this||"").replace(/-/g,"/");return t.IsDateTime()?(/^(\d{4})\/(\d{1,2})\/(\d{1,2})(\s(\d{1,2}):(\d{1,2}):(\d{1,2}))$/.test(t),new Date(parseInt(RegExp.$1,10),parseInt(RegExp.$2,10)-1,parseInt(RegExp.$3,10),parseInt(RegExp.$5,10),parseInt(RegExp.$6,10),parseInt(RegExp.$7,10))):new Date},Date.prototype.DateToJson=function(){return{Year:this.getFullYear(),Month:this.getMonth()+1,Day:this.getDate()}},Date.prototype.DateTimeToJson=function(){return{Year:this.getFullYear(),Month:this.getMonth()+1,Day:this.getDate(),Hour:this.getHours(),Minute:this.getMinutes(),Second:this.getSeconds()}},Date.prototype.DateDiff=function(t,e){var r,n=1;switch(e){case"ms":n=1;break;case"s":n=1e3;break;case"m":n=6e4;break;case"h":n=36e5;break;case"d":n=864e5}return r=Math.floor((this.getTime()-t.getTime())/n),0>r?r+1:r},Date.prototype.DateAdd=function(t,e){var r=this;switch(t.toLowerCase()){case"y":r.setFullYear(r.getFullYear()+e);break;case"mm":r.setMonth(r.getMonth()+e);break;case"d":r.setDate(r.getDate()+e);break;case"h":r.setHours(r.getHours()+e);break;case"m":r.setMinutes(r.getMinutes()+e);break;case"s":r.setSeconds(r.getSeconds()+e)}return r},Date.prototype.Format=function(t){var e=this,r=function(t,e){e||(e=2),t=new String(t);for(var r=0,n="";r<e-t.length;r++)n+="0";return n+t},n=["\u65e5","\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d"],o=["\u4e00\u6708","\u4e8c\u6708","\u4e09\u6708","\u56db\u6708","\u4e94\u6708","\u516d\u6708","\u4e03\u6708","\u516b\u6708","\u4e5d\u6708","\u5341\u6708","\u5341\u4e00\u6708","\u5341\u4e8c\u6708"];return t.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHms])\1?)\b/g,function(t){switch(t){case"d":return e.getDate();case"dd":return r(e.getDate());case"ddd":return n[e.getDay()];case"dddd":return"\u661f\u671f"+n[e.getDay()];case"M":return e.getMonth()+1;case"MM":return r(e.getMonth()+1);case"MMM":return o[e.getMonth()];case"yy":return new String(e.getFullYear()).substr(2);case"yyyy":return e.getFullYear();case"H":return e.getHours();case"HH":return r(e.getHours());case"m":return e.getMinutes();case"mm":return r(e.getMinutes());case"s":return e.getSeconds();case"ss":return r(e.getSeconds())}})},Array.prototype.indexOf||(Array.prototype.indexOf=function(t){var e=this.length>>>0,r=Number(arguments[1])||0;for(r=0>r?Math.ceil(r):Math.floor(r),0>r&&(r+=e);e>r;r++)if(r in this&&this[r]===t)return r;return-1}),t.extend({queryString:function(){var t,e,r,n,o;for(t=arguments.length>0?arguments[0]:window,e=t.location.search.substr(1).split("&"),r={},n=0;n<e.length;n++)if(o=e[n].split("="),2==o.length)try{r[o[0]]=decodeURIComponent(o[1])}catch(i){r[o[0]]=o[1]}return r},MD5:function(t){function e(t,e){return t<<e|t>>>32-e}function r(t,e){var r,n,o,i,a;return o=2147483648&t,i=2147483648&e,r=1073741824&t,n=1073741824&e,a=(1073741823&t)+(1073741823&e),r&n?2147483648^a^o^i:r|n?1073741824&a?3221225472^a^o^i:1073741824^a^o^i:a^o^i}function n(t,e,r){return t&e|~t&r}function o(t,e,r){return t&r|e&~r}function i(t,e,r){return t^e^r}function a(t,e,r){return e^(t|~r)}function s(t,o,i,a,s,u,c){return t=r(t,r(r(n(o,i,a),s),c)),r(e(t,u),o)}function u(t,n,i,a,s,u,c){return t=r(t,r(r(o(n,i,a),s),c)),r(e(t,u),n)}function c(t,n,o,a,s,u,c){return t=r(t,r(r(i(n,o,a),s),c)),r(e(t,u),n)}function p(t,n,o,i,s,u,c){return t=r(t,r(r(a(n,o,i),s),c)),r(e(t,u),n)}function g(t){for(var e,r=t.length,n=r+8,o=(n-n%64)/64,i=16*(o+1),a=Array(i-1),s=0,u=0;r>u;)e=(u-u%4)/4,s=u%4*8,a[e]=a[e]|t.charCodeAt(u)<<s,u++;return e=(u-u%4)/4,s=u%4*8,a[e]=a[e]|128<<s,a[i-2]=r<<3,a[i-1]=r>>>29,a}function l(t){var e,r,n="",o="";for(r=0;3>=r;r++)e=t>>>8*r&255,o="0"+e.toString(16),n+=o.substr(o.length-2,2);return n}function d(t){var e,r,n;for(t=t.replace(/\r\n/g,"\n"),e="",r=0;r<t.length;r++)n=t.charCodeAt(r),128>n?e+=String.fromCharCode(n):n>127&&2048>n?(e+=String.fromCharCode(n>>6|192),e+=String.fromCharCode(63&n|128)):(e+=String.fromCharCode(n>>12|224),e+=String.fromCharCode(n>>6&63|128),e+=String.fromCharCode(63&n|128));return e}var f,h,w,m,v,y,D,E,S,I,x=Array(),M=7,b=12,$=17,T=22,C=5,R=9,A=14,F=20,L=4,H=11,Y=16,j=23,k=6,O=10,W=15,N=21;for(t=d(t),x=g(t),y=1732584193,D=4023233417,E=2562383102,S=271733878,f=0;f<x.length;f+=16)h=y,w=D,m=E,v=S,y=s(y,D,E,S,x[f+0],M,3614090360),S=s(S,y,D,E,x[f+1],b,3905402710),E=s(E,S,y,D,x[f+2],$,606105819),D=s(D,E,S,y,x[f+3],T,3250441966),y=s(y,D,E,S,x[f+4],M,4118548399),S=s(S,y,D,E,x[f+5],b,1200080426),E=s(E,S,y,D,x[f+6],$,2821735955),D=s(D,E,S,y,x[f+7],T,4249261313),y=s(y,D,E,S,x[f+8],M,1770035416),S=s(S,y,D,E,x[f+9],b,2336552879),E=s(E,S,y,D,x[f+10],$,4294925233),D=s(D,E,S,y,x[f+11],T,2304563134),y=s(y,D,E,S,x[f+12],M,1804603682),S=s(S,y,D,E,x[f+13],b,4254626195),E=s(E,S,y,D,x[f+14],$,2792965006),D=s(D,E,S,y,x[f+15],T,1236535329),y=u(y,D,E,S,x[f+1],C,4129170786),S=u(S,y,D,E,x[f+6],R,3225465664),E=u(E,S,y,D,x[f+11],A,643717713),D=u(D,E,S,y,x[f+0],F,3921069994),y=u(y,D,E,S,x[f+5],C,3593408605),S=u(S,y,D,E,x[f+10],R,38016083),E=u(E,S,y,D,x[f+15],A,3634488961),D=u(D,E,S,y,x[f+4],F,3889429448),y=u(y,D,E,S,x[f+9],C,568446438),S=u(S,y,D,E,x[f+14],R,3275163606),E=u(E,S,y,D,x[f+3],A,4107603335),D=u(D,E,S,y,x[f+8],F,1163531501),y=u(y,D,E,S,x[f+13],C,2850285829),S=u(S,y,D,E,x[f+2],R,4243563512),E=u(E,S,y,D,x[f+7],A,1735328473),D=u(D,E,S,y,x[f+12],F,2368359562),y=c(y,D,E,S,x[f+5],L,4294588738),S=c(S,y,D,E,x[f+8],H,2272392833),E=c(E,S,y,D,x[f+11],Y,1839030562),D=c(D,E,S,y,x[f+14],j,4259657740),y=c(y,D,E,S,x[f+1],L,2763975236),S=c(S,y,D,E,x[f+4],H,1272893353),E=c(E,S,y,D,x[f+7],Y,4139469664),D=c(D,E,S,y,x[f+10],j,3200236656),y=c(y,D,E,S,x[f+13],L,681279174),S=c(S,y,D,E,x[f+0],H,3936430074),E=c(E,S,y,D,x[f+3],Y,3572445317),D=c(D,E,S,y,x[f+6],j,76029189),y=c(y,D,E,S,x[f+9],L,3654602809),S=c(S,y,D,E,x[f+12],H,3873151461),E=c(E,S,y,D,x[f+15],Y,530742520),D=c(D,E,S,y,x[f+2],j,3299628645),y=p(y,D,E,S,x[f+0],k,4096336452),S=p(S,y,D,E,x[f+7],O,1126891415),E=p(E,S,y,D,x[f+14],W,2878612391),D=p(D,E,S,y,x[f+5],N,4237533241),y=p(y,D,E,S,x[f+12],k,1700485571),S=p(S,y,D,E,x[f+3],O,2399980690),E=p(E,S,y,D,x[f+10],W,4293915773),D=p(D,E,S,y,x[f+1],N,2240044497),y=p(y,D,E,S,x[f+8],k,1873313359),S=p(S,y,D,E,x[f+15],O,4264355552),E=p(E,S,y,D,x[f+6],W,2734768916),D=p(D,E,S,y,x[f+13],N,1309151649),y=p(y,D,E,S,x[f+4],k,4149444226),S=p(S,y,D,E,x[f+11],O,3174756917),E=p(E,S,y,D,x[f+2],W,718787259),D=p(D,E,S,y,x[f+9],N,3951481745),y=r(y,h),D=r(D,w),E=r(E,m),S=r(S,v);return I=l(y)+l(D)+l(E)+l(S),I.toLowerCase()},Browser:function(){var t=arguments.length>0?arguments[0]:window,e=t.navigator.userAgent.toLowerCase(),r=e.match(/firefox\/([\d.]+)/),n=e.match(/chrome\/([\d.]+)/),o=e.match(/opera.([\d.]+)/),i=e.match(/version\/([\d.]+).*safari/),a=e.match(/(msie\s|trident.*rv:)([\w.]+)/),s=e.match(/edge\/([\d.]+)/),u=a&&"6.0"==a[2],c=a&&"7.0"==a[2],p=a&&"8.0"==a[2],g=a&&"9.0"==a[2],l=a&&"10.0"==a[2],d=a&&"11.0"==a[2];return{IE:a,IE6:u,IE7:c,IE8:p,IE9:g,IE10:l,IE11:d,Edge:s,Firefox:r,Chrome:n,Opera:o,Safari:i}},DataFormat:function(t,e){var r,n,o,i=t,a=i.match(/\{.*?\}/g);if(e=e||{},a)for(o=0;o<a.length;o++)r=a[o],n=r.substring(1,r.length-1),i=i.replace(r,e[n]);return i},Alert:function(t){var e=arguments[1]||null;window.top.dialog&&window.top.dialog.alert?window.top.dialog.alert(t,e):alert(t)},Confirm:function(t){var e=arguments[1]||null;window.top.dialog&&window.top.dialog.confirm?window.top.dialog.confirm(t,e):confirm(t)},Error:function(t){var e=arguments[1]||null;window.top.dialog&&window.top.dialog.error?window.top.dialog.error(t,e):alert(t)},Success:function(t){var e=arguments[1]||null;window.top.dialog&&window.top.dialog.success?window.top.dialog.success(t,e):alert(t)},Toast:function(t){var e=arguments[1]||null;window.top.dialog&&window.top.dialog.toast?window.top.dialog.toast(t,e):alert(t)},OpenWindow:function(t,e,r,n,o){window.top.dialog&&window.top.dialog.openWindow?window.top.dialog.openWindow(t,e,r,n,o):window.open(t)},FileView:function(t,e,r,n,o){window.top.dialog&&window.top.dialog.fileView?window.top.dialog.fileView(t,e,r,n,o):window.open(t)},ajaxGet:function(e,r,n){return t.get(e,r).done(function(e){if(0==e.status){var r=e.code||0;if(1001==r)return alert("\u62b1\u6b49\uff0c\u60a8\u5c1a\u672a\u767b\u5f55\u6216\u767b\u5f55\u5df2\u5931\u6548\uff01\u8bf7\u767b\u5f55\u540e\u91cd\u8bd5!"),void(window.top.location.href="/login.html");t.Error(e.message||"error!")}else n&&n(e)}).fail(function(){t.Error("ajax get failed!")})},ajaxPost:function(e,r,n){return t.post(e,r).done(function(e){if(0==e.status){var r=e.code||0;if(1001==r)return alert("\u62b1\u6b49\uff0c\u60a8\u5c1a\u672a\u767b\u5f55\u6216\u767b\u5f55\u5df2\u5931\u6548\uff01\u8bf7\u767b\u5f55\u540e\u91cd\u8bd5!"),void(window.top.location.href="/login.html");t.Error(e.message||"error!")}else n&&n(e)}).fail(function(){t.Error("ajax post failed!")})}}),t.fn.extend({setNumberField:function(){return this.on("input propertychange",function(){t(this).val(t(this).val().replace(/[^0-9]/,"").Trim())}),this},setLowLetterField:function(){return this.on("input propertychange",function(){t(this).val(t(this).val().replace(/[^a-z]/,"").Trim())}),this},setUpperLetterField:function(){return this.on("input propertychange",function(){t(this).val(t(this).val().replace(/[^A-Z]/,"").Trim())}),this},setLetterField:function(){return this.on("input propertychange",function(){t(this).val(t(this).val().replace(/[^a-zA-Z]/,"").Trim())}),this},placeholder:function(){if(t.Browser.IE){var e=arguments.length>0?arguments[0]:null,r=e&&e.length==this.length;this.each(function(n,o){!function(n,o){var i,a,s,u,c,p,g=t(o),l=g[0].tagName.toLowerCase(),d=g[0].type.toLowerCase();("input"==l&&("text"==d||"password"==d)||"textarea"==l)&&(i="password"==d,a=g.attr("placeholder")||(r?e[n]:null),a&&(s=g.attr("name")||"input_"+n,u=g.attr("class")||"",g.removeAttr("placeholder"),c=t("<input>").attr({type:"text",value:a,name:"ph_"+s,"class":u}).css("color","#999"),g.before(c),p=g.val(),i||(p=t.trim(p)),0==p.length?g.hide():c.hide(),c.on("focus",function(){t(this).hide(),g.show(),g[0].focus()}),g.on("blur",function(){var e=t(this),r=t(this).val();i||(r=t.trim(r)),0==r.length&&(e.hide(),c.show())})))}(n,o)})}return this},picurePreview:function(e,r){r=r||window;var n,o=[];return"string"==typeof e&&(o=[e]),"object"==typeof e&&o instanceof Array&&(o=e),this.each(function(e,i){!function(t,e){n=o[t]||"",window.top.dialog&&window.top.dialog.picurePreview(e,n,r)}(e,t(i))}),this},getOffset:function(e){var r,n,o,i,a,s,u=this.length>1?this.eq(0):this,c=u.offset();return window.frameElement&&e?(r=function(e){for(var r,n,o=e||window,i=0,a=0;o!=window.top;){r=o.parent.document.getElementsByTagName("iframe");for(n in r)try{r[n].contentWindow===o.window&&(i+=t(r[n]).offset().left,a+=t(r[n]).offset().top)}catch(s){continue}o=o.parent}return{left:i,top:a}},n=function(t){var e=t.document,r=e.documentElement;return{top:r?r.scrollTop:e.body.scrollTop,left:r?r.scrollLeft:e.body.scrollLeft}},o=c.top,i=c.left,a=n(e),s=r(e),a.top>0&&(o-=a.top),a.left>0&&(i-=a.left),s.top>0&&(o+=s.top),s.left>0&&(i+=s.left),{left:i,top:o}):c}})});