﻿!function(e,n){"use strict";if("function"==typeof define&&define.amd)define(["jquery","exports"],function(i,a){e.Framework=n(a,i)});else if("undefined"!=typeof exports){var i=require("jquery");n(exports,i)}else e.Framework=n(e,"undefined"!=typeof jQuery?jQuery:window.Zepto)}("undefined"!=typeof window?window:this,function(e,n){"use strict";var i=function(){var e,i,a,t,d,l,r,o,s,u,c,f,p,M,h,m,y,v,T,g,K,C,w,R,b,L,x,k;this.Config=arguments[0]||{},this.MenuData=this.Config.MenuData||[],this.MenuKey=this.Config.MenuKey||{id:"menuId",title:"menuName",icon:"menuIcon",link:"menuLink",leftUrl:"leftPage",rightUrl:"rightPage",childRen:"childRen",neverClosed:"neverClosed"},this.MenuErrorMessage=this.Config.MenuErrorMessage||"\u62b1\u6b49\uff0c\u6253\u5f00\u83dc\u5355\u5931\u8d25\uff01",this.MaxTabLength=this.Config.MaxTabLength||10,this.TabsOverflowMessage=this.Config.TabsOverflowMessage||"\u62b1\u6b49\uff0c\u6700\u591a\u53ea\u80fd\u6253\u5f00\u4e0d\u8d85\u8fc7"+this.tabsLengthMax+"\u4e2a\u6807\u7b7e\u9875\uff01",this.HeaderExtendHandle=this.Config.HeaderExtendHandle||null,e=this,i=200,a=!0,t="250px",d="252px",l="1px #c7c7c7 solid",r="none",o="javascript:void(0);",m={},y=[],v=null,this.Init=function(){T(),K(),w()},this.Build=function(){T()},this.BuildMenu=function(e){this.MenuData=e,K()},this.BindHeaderExtendHandle=function(e){this.HeaderExtendHandle=e,w()},this.OpenTab=function(e){b(e)},this.LeftFrameWindow=function(){return v&&m[v]&&m[v].LeftRender&&m[v].LeftFrame?m[v].LeftFrame[0].contentWindow:null},this.MainFrameWindow=function(){return v&&m[v]&&m[v].MainRender&&m[v].MainFrame?m[v].MainFrame[0].contentWindow:null},T=function(){var e,i=n(document.body);s=n("<div>").addClass("header").append('<a class="logo" href="javascript:void(0);"></a>').appendTo(i),u=n("<ul>").addClass("menu").appendTo(s),c=n("<ul>").addClass("extend").appendTo(s),e=n("<div>").addClass("wrapper").appendTo(i),f=n("<div>").addClass("sidebar").appendTo(e),p=n("<div>").addClass("content").appendTo(e),M=n("<ul>").appendTo(p),h=n("<div>").addClass("container").appendTo(p),n("<div>").addClass("footer").appendTo(i),g()},g=function(){n("<li>").addClass("fullView").append(n("<a>").attr({herf:o,title:"\u5168\u5c4f\u67e5\u770b"}).on("click",function(){var e=n(this);e.hasClass("dis")||(e.addClass("dis"),a?(f.animate({width:"0"},i),p.animate({"margin-left":"0"},i,null,function(){e.attr("title","\u53d6\u6d88\u5168\u5c4f"),e.removeClass("dis"),f.hide(),p.css("border-left",r),a=!1})):(f.show(),f.animate({width:t},i),p.animate({"margin-left":d},i,null,function(){e.attr("title","\u5168\u5c4f\u67e5\u770b"),e.removeClass("dis"),p.css("border-left",l),a=!0})))})).appendTo(c)},K=function(){e.MenuData&&e.MenuData.length>0&&n.each(e.MenuData,function(i,a){!function(i,a){var t=n("<li>").appendTo(u),d=n("<a>").attr({href:a[e.MenuKey.link]||o,title:a[e.MenuKey.title]||""}).appendTo(t);a[e.MenuKey.icon]&&n("<i>").addClass(a[e.MenuKey.icon]).appendTo(d),a[e.MenuKey.title]&&n("<label>").html(a[e.MenuKey.title]).appendTo(d),a[e.MenuKey.childRen]&&a[e.MenuKey.childRen].length>0?C.call(t,a[e.MenuKey.childRen],0):!a.link&&d.on("click",function(){b(a)})}(i,a)})},C=function(a,t){var d=this,l=null,r=null,s=null,c=n(n("a",d).get(0));d.bind({mouseenter:function(){l=n(n("ul.dropdown-menu",d).get(0)),l&&l.length>0||(l=n("<ul>").addClass("dropdown-menu").appendTo(d),t>0&&l.addClass("menu-sub"),n.each(a,function(i,a){!function(i,a){var d=n("<li>").appendTo(l),r=n("<a>").attr({href:a.link||o,title:a.name||""}).appendTo(d);a[e.MenuKey.icon]&&n("<i>").addClass(a[e.MenuKey.icon]).appendTo(r),a[e.MenuKey.title]&&n("<label>").html(a[e.MenuKey.title]).appendTo(r),a[e.MenuKey.childRen]&&a[e.MenuKey.childRen].length>0?(n("<span>").appendTo(r),C.call(d,a[e.MenuKey.childRen],t+1)):!a.link&&r.on("click",function(){b(a),n("ul.dropdown-menu",u).hide()})}(i,a)})),r=window.setTimeout(function(){l.slideDown(i,function(){t>0&&!c.hasClass("active")&&c.addClass("active")})},i+50),s&&window.clearTimeout(s)},mouseleave:function(){s=window.setTimeout(function(){l.slideUp(i)},i+50),r&&window.clearTimeout(r),t>0&&c.hasClass("active")&&c.removeClass("active")}})},w=function(){e.HeaderExtendHandle&&e.HeaderExtendHandle.call(c)},R=function(i){return n.MD5((i[e.MenuKey.id]||0)+(i[e.MenuKey.title]||"")+(i[e.MenuKey.leftUrl]||"")+(i[e.MenuKey.rightUrl]||"")+"frameMenu")},b=function(i){var a,t;if(!(i&&i[e.MenuKey.title]&&i[e.MenuKey.title].Trim().length>0&&(i[e.MenuKey.leftUrl]||i[e.MenuKey.rightUrl])))return void(e.MenuErrorMessage&&alert(e.MenuErrorMessage));if(a=R(i),t=n.inArray(a,y),t>0)x(a);else{if(y.length>=e.MaxTabLength)return void(e.TabsOverflowMessage&&alert(e.TabsOverflowMessage));L(a,i)}},L=function(i,a){var t,d,l,r,o,s,u,c,p=n("<li>").appendTo(M);a[e.MenuKey.neverClosed]&&1==a[e.MenuKey.neverClosed]&&p.addClass("noClosed"),a[e.MenuKey.icon]&&n("<i>").addClass(a[e.MenuKey.icon]).appendTo(p),a[e.MenuKey.title]&&n("<label>").html(a[e.MenuKey.title]).appendTo(p),a[e.MenuKey.neverClosed]&&1==a[e.MenuKey.neverClosed]||(n("<span>").appendTo(p).on("click",function(){k(i)}),p.on("dblclick",function(){k(i)})),p.on("click",function(){x(i)}),t=null,d=null,a[e.MenuKey.leftUrl]&&a[e.MenuKey.leftUrl].Trim().length>0&&(l=a[e.MenuKey.icon]?'<i class="'+a[e.MenuKey.icon]+'"></i>':"",r=a[e.MenuKey.title]?"<label>"+a[e.MenuKey.title]+"</label>":"",o="<ul><li>"+l+r+"</li></ul>",s=n("<div>").addClass("sideFrameRender"),d=n("<iframe>").attr("src",a[e.MenuKey.leftUrl].Trim()).appendTo(s),t=n("<div>").addClass("container").append(o,s).appendTo(f)),u=null,c=null,a[e.MenuKey.rightUrl]&&a[e.MenuKey.rightUrl].Trim().length>0&&(c=n("<iframe>").attr("src",a[e.MenuKey.rightUrl].Trim()),u=n("<div>").addClass("mainFrameRender").append(c).appendTo(h)),y.push(i),m[i]={LeftRender:t,LeftFrame:d,TabRender:p,MainRender:u,MainFrame:c},p.click()},x=function(e){e&&m[e]&&(v&&m[v]?v!=e&&(m[v].LeftRender&&m[v].LeftRender.hide(),m[v].MainRender&&m[v].MainRender.hide(),m[v].TabRender.removeClass("active"),m[e].LeftRender&&m[e].LeftRender.show(),m[e].MainRender&&m[e].MainRender.show(),m[e].TabRender.addClass("active"),v=e):(m[e].LeftRender&&m[e].LeftRender.show(),m[e].MainRender&&m[e].MainRender.show(),m[e].TabRender.addClass("active"),v=e))},k=function(e){e&&m[e]&&(m[e].LeftRender&&m[e].LeftRender.remove(),m[e].MainRender&&m[e].MainRender.remove(),m[e].TabRender.remove(),y.splice(n.inArray(e,y),1),delete m[e],0==y.length&&(m={})&&(v=null),v&&v==e&&y.length>0&&x(y[y.length-1]))}};return i});