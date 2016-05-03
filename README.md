# 相关文件说明
### 主体框架 （framework.js）
##### 相关文件及依赖
JS：dialog.js （依赖：jquery-2.2.0.min.js 、 common.js）
CSS：dialog.css （依赖：common.css）
##### 引入方式
框架主页面直接引入，各子框架页面直接调用
##### 调用方法
``` javascript
var FWK = window.FWK = new Framework(fwkConfig);
//子页面调用
window.top.FWK....
```
### 常用扩展及jQeury插件 （common.js）
##### 相关文件及依赖
JS：common.js （依赖：jquery-2.2.0.min.js）
##### 引入方式
需要各子页面分别引入（引入顺序： jquery.js --> common.js）
#### 常用扩展（Strng 字符串扩展）
**1: Trim()**
``` javascript
//去除字符串前后空格
String.prototype.Trim = function(){....};
//使用
' abcd '.Trim() --> 'abcd';
```
**2: StartWith()**
``` javascript
//判断字符串是否以指定的字符串开头
String.prototype.StartWith = function(s){....};
//使用
'abcdefgh'.StartWith('a') --> true;
```
**3: EndWith()**
``` javascript
//判断字符串是否以指定的字符串结尾
String.prototype.EndWith = function(e){....};
//使用
'abcdefgh'.StartWith('gh') --> true;
```
**4: TrimStart()**
``` javascript
//去除字符串开头部分指定的字符
String.prototype.TrimStart = function(s){....};
//使用
'abcdefgh'.TrimStart('ab') --> 'cdefgh';
```
**5: TrimEnd()**
``` javascript
//去除字符串开头部分指定的字符
String.prototype.TrimEnd = function(e){....};
//使用
'abcdefgh'.TrimEnd('fgh') --> 'abcde';
```
**6: RemoveHTML()**
``` javascript
//去除字符串中的HTML标签
String.prototype.RemoveHTML = function(){....};
//使用
'<i>abcd</i>'.RemoveHTML() --> 'abcd';
```
**7: IsMobileNumber()**
``` javascript
//判断字符串是否为合法的手机号码
String.prototype.IsMobileNumber = function(){....};
//使用
'13012345678'.IsMobileNumber() --> true;
```
**8: IsTelphoneNumber()**
``` javascript
//判断字符串是否为合法的电话号码
String.prototype.IsTelphoneNumber = function(){....};
//使用
'+86-028-7654321'.IsTelphoneNumber() --> true;
```
**9: IsEmail()**
``` javascript
//判断字符串是否为合法的电子邮件账号(不严格)
String.prototype.IsEmail = function(){....};
//使用
'abce@qq.com'.IsEmail() --> true;
```
**10: IsDate()**
``` javascript
//判断字符串是否为日期格式（不带时分秒）
String.prototype.IsDate = function(){....};
//使用
'2016-11-11'.IsDate() --> true;
```
**11: IsDateTime()**
``` javascript
//判断字符串是否为日期格式（带时分秒）
String.prototype.IsDateTime = function(){....};
//使用
'2016-11-11 20:25:42'.IsDate() --> true;
```
**12: ConvertToDate()**
``` javascript
//将字符串转换为日期格式（不带时分秒）
String.prototype.ConvertToDate = function(){....};
//使用
'2016-11-11'.ConvertToDate() --> new Date(2016, 10, 11);
```
**13: ConvertToDateTime()**
``` javascript
//将字符串转换为日期格式（带时分秒）
String.prototype.ConvertToDateTime = function(){....};
//使用
'2016-11-11 20:25:42'.ConvertToDateTime() --> new Date(2016, 10, 11, 20, 25, 42);
```
#### 常用扩展（Date 日期扩展）
**1: DateToJson()**
``` javascript
//将日期换为json（不带时分秒）
Date.prototype.DateToJson = function(){....};
//使用
new Date(2016, 10, 11).DateToJson() --> {Year:2016, Month: 11, Day: 11}
```
**2: DateTimeToJson()**
``` javascript
//将日期换为json（带时分秒）
Date.prototype.DateTimeToJson = function(){....};
//使用
new Date(2016, 10, 11, 20, 25, 42).DateTimeToJson() --> {Year:2016, Month: 11, Day: 11, Hour: 20, Minute: 25, Second: 42}
```
**3: DateDiff()**
``` javascript
//计算时间差
Date.prototype.DateDiff = function(date, timePart){....};
date: 指定时间
timePart：指定时间差单位（ms-毫秒， s-秒， m-分钟, h-小时， d-天）
//使用
new Date(2016, 10, 11, 20, 25, 42).DateDiff(new Date(2016, 10, 11, 19, 25, 42), 'h') --> 1
```
**4: DateAdd()**
``` javascript
//计算时间和
Date.prototype.DateAdd = function(datePart, addValue){....};
timePart：指定时间单位（s-秒， m-分钟, h-小时， d-天, mm-月, y-年）
addValue：增加的值
//使用
new Date(2016, 10, 11, 20, 25, 42).DateAdd('h', 1) --> new Date(2016, 10, 11, 21, 25, 42)
```
**5: Format()**
``` javascript
//将日期格式化为指定格式的字符串
Date.prototype.Format = function(format){....};
format：[string] 格式
'd':		//天，10以内不补零
'dd':		//天，10以内自动前补零
'ddd':		//星期：'日', '一', '二', '三', '四', '五', '六'
'dddd':		//星期 + '日', '一', '二', '三', '四', '五', '六'
'M':		//月份，不补零
'MM':		//月份，不足2位自动补零
'MMM':		//中文月份：'一月', '二月', '三月' ... '十二月'
'yy':		//年，后两位
'yyyy':		//年，完整四位
'H':		//小时，不补零
'HH':		//小时，自动补零
'm':		//分钟，不足2位不补零
'mm':		//分钟，不足2位自动补零
's':		//秒，不足2位不补零
'ss':		//秒，不足2位自动补零
//使用
new Date(2016, 10, 11, 20, 25, 42).Format('yyyy-MM-dd HH:mm:ss') --> 2016-11-11 20:25:42
```
#### 常用扩展（数字 --> 日期扩展）
**1: ToLocaleDateString()**
``` javascript
//将指定的数字转换为指定格式的日期字符串
Number.prototype.ToLocaleDateString = function(format){....};
//此数字一定是一个时间距离 1970-1-1 0：0：0.000 的时间差的毫秒数
//使用
(1460689838234).ToLocaleDateString('yyyy-MM-dd HH:mm:ss') --> 2016-04-15 11:08:35
```
#### JQUERY扩展（方法扩展）
**1: $.queryString()**
``` javascript
//获取当前页面URL中的参数（即url中“？”后的部分），以JSON格式返回
url: http://....../a.html?a=a&b=b&c=c
var queryString = $.queryString(); -- > {a:'a', b:'b', c:'c'}
```
**2: $.MD5()**
``` javascript
//基于JS的MD5加密
var passowrd = $.MD5('111111');  --> 96e79218965eb72c92a549dd5a330112
```
**3: $.Browser()**
``` javascript
//判断当前浏览类型，以JSON格式返回
var b = $.Browser() --> {
                            IE: ie,
                            IE6: ie6,
                            IE7: ie7,
                            IE8: ie8,
                            IE9: ie9,
                            IE10: ie10,
                            IE11: ie11,
                            Edge: edge,
                            Firefox: firefox,
                            Chrome: chrome,
                            Opera: opera,
                            Safari: safari
                        }
if (b.IE){
	//todo
}
```
#### JQUERY扩展（jQuery对象扩展）
**1: setNumberField()**
``` javascript
//将控件设定为只能输入数字
$('input').setNumberField();
```
**2: setLowLetterField()**
``` javascript
//将控件设定为只能输入小写字母
$('input').setLowLetterField();
```
**3: setUpperLetterField()**
``` javascript
//将控件设定为只能输入大写字母
$('input').setUpperLetterField();
```
**4: setLetterField()**
``` javascript
//将控件设定为只能输入字母
$('input').setLetterField();
```
**4: placeholder()**
``` javascript
//针对低版本IE等不支持placeholder属性的浏览器，模拟placeholder方法
$('input').placeholder();
```
### UI组件 - 对话框 （dialog.js）
##### 相关文件及依赖
JS：dialog.js （依赖：jquery-2.2.0.min.js 、 jquery.drag.min.js 、 common.js）
CSS：dialog.css （依赖：common.css）
##### 引入方式
框架主页面直接引入，各子框架页面直接调用
#### 1： Alert（提醒消息）
##### 调用方法
**直接调用：** window.top.dialog.alert(message, options);
**快捷调用：** $.Alert(message, options);
##### 参数说明
**message：必填** 要提示的消息内容，可以是纯文字，也可以是HTML代码；
**options：可选 **
``` javascript
{
    title: [string], 			//弹框标题，默认值：提示信息
    width: [number], 			//弹框宽度，默认值：300
    height: [number], 			//弹框高，默认值：150
    buttonTxt: [string], 		//确定按钮文字，默认值：确定
    buttonStyle: [string], 		//确定按钮样式（class），默认值：空，可选值：[ blue | orange | green | 空 ]
    callback: [function]		//点击确定后的回调函数，默认值：null
}
```
##### 示例
```javascript
$.Alert('这是一个示例', {
    title: '',
    width: 300,
    height: 150,
    buttonTxt: '确定',
    buttonStyle: '',
    callback: null
});
```
#### 2： Confirm （确认消息）
##### 调用方法
**直接调用：** window.top.dialog.confirm(message, options);
**快捷调用：** $.Confirm(message, options);
##### 参数说明
**message：必填** 要提示的消息内容，可以是纯文字，也可以是HTML代码；
**options：可选 **
``` javascript
{
    title: [string], 						//弹框标题，默认值：页面提示
    width: [number], 						//弹框宽度，默认值：300
    height: [number], 						//弹框高，默认值：150
    buttonOkTxt: [string], 					//确定按钮文字，默认值：确定
    buttonOkStyle: [string], 				//确定按钮样式（class），默认值：空，可选值：[ blue | orange | green | 空 ]
    buttonOkClicked: [function]				//确定按钮点击事件回调函数，默认值 null
    buttonCancelTxt: [string], 				//取消按钮文字，默认值：取消
    buttonCancelStyle : [string], 			//取消按钮样式（class），默认值：空，可选值：[ blue | orange | green | 空 ]
    buttonCancelClicked: [function]			//取消按钮点击事件回调函数，默认值：null
}
```
##### 示例
```javascript
$.Confirm('确定要继续操作吗？', {
    title: '',
    width: 300,
    height: 150,
    buttonOkTxt: '确定',
    buttonOkStyle: 'blue',
    buttonOkClicked: function(){ alert('你选择了确定'); },
    buttonCancelTxt: '取消',
    buttonCancelStyle: '',
    buttonCancelClicked: function(){ alert('你选择了取消'); }
});
```
#### 3： Error / Success （提示消息）
##### 调用方法
**直接调用：** window.top.dialog.error(message, options);  /  window.top.dialog.success(message, options);
**快捷调用：** $.Error(message, options); / $.Success(message, options);
##### 参数说明
**message：必填** 要提示的消息内容，可以是纯文字，也可以是HTML代码；
**options：可选 **
``` javascript
{
    title: [string], 			//弹框标题，默认值：页面提示
    width: [number], 			//弹框宽度，默认值：300
    height: [number], 			//弹框高，默认值：150
    buttonTxt: [string], 		//确定按钮文字，默认值：知道了
    buttonStyle: [string], 		//确定按钮样式（class），默认值：空，可选值：[ blue | orange | green | 空 ]
    callback: [function]		//点击确定后的回调函数，默认值：null
}
```
##### 示例
```javascript
$.Error('操作错误！', {
    title: '',
    width: 300,
    height: 150,
    buttonTxt: '知道了',
    buttonStyle: '',
    callback: null
});
```
```javascript
$.Success('操作成功！', {
    title: '',
    width: 300,
    height: 150,
    buttonTxt: '知道了',
    buttonStyle: '',
    callback: null
});
```
#### 4： 弹窗（openwindow）
##### 调用方法
**直接调用：** window.top.dialog.openWindow(url, title, width, height, callback);
**快捷调用：** $.OpenWindow(url, title, width, height, callback);
##### 参数说明
**url：[string] 必填** 要打开的页面URL（文件路径应该相对于框架首页的访问路径）
**title：[string] 必填** 打开的页面标题
**width：[number] 必填** 打开的页面的弹层宽度
**height：[number] 必填** 打开的页面的弹层高度
**callback：[function] 可选** 打开的页面操作完成后的回调函数，通常需要在打开的页面中进行相关编码配合
#### 5： 文件选择（fileView）
##### 调用方法
**直接调用：** window.top.dialog.fileView(url, title, width, height, callback);
**快捷调用：** $.FileView(url, title, width, height, callback);
##### 参数说明
**url：[string] 必填** 要打开的页面URL（通常在一个项目中，这个URL应该是固定的，用于浏览并选择文件）
**title：[string] 必填** 打开的页面标题
**width：[number] 必填** 打开的页面的弹层宽度
**height：[number] 必填** 打开的页面的弹层高度
**callback：[function] 可选** 打开的页面操作完成后的回调函数，通常需要在打开的页面中进行相关编码配合
#### 6： toast （toast提示）
##### 调用方法
**直接调用：** window.top.dialog.toast(message, options);
**快捷调用：** $.Toast(message, options);
##### 参数说明
**message：必填** 要提示的消息内容，可以是纯文字，也可以是HTML代码；
**options：可选 **
``` javascript
{
    width：[number],						//提示框宽度
    height：[number],					//提示框高度
    lineHeight：[number],				//提示框文字内容行高
    bottom：[number],					//提示框距离页面底部距离
    showTime：[number],					//提示显示时间（单位：毫秒）
    callback：[function]    				//显示完成后回调函数
}
```
#### 7： 图片预览（单张） （picurePreview）
##### 调用方法
**直接调用：** window.top.dialog.picurePreview(sender, picureUrl, ownerWindow);
##### 参数说明
``` javascript
{
    sender：[jQuery对象],						//事件发出者（即需要将预览时间绑定至的对象）
    picureUrl：[string],						//预览图片的URL（绝对路径）
    ownerWindow：[window对象],					//当前页面的window对象
}
```
### UI组件 - 日期选择器 （datePicker.js）
##### 相关文件及依赖
JS：datePicker.js （依赖：jquery-2.2.0.min.js 、 common.js）
CSS：datePicker.css （依赖：common.css）
##### 引入方式
框架主页面直接引入，各子框架页面直接调用
#####  调用方法
``` javascript
window.top.datePicker(options, window, event);
```
#####  参数说明
**options： 必须**
``` javascript
{
    elment: [jquery对象],							//日期选择结果写入对象
    model: [string],							 //打开模式：[picker | render]
    rangeMin: [jquery对象 | string],			    //日期可选范围下限
    rangeMax: [jquery对象 | string],				//日期可选范围上限
    format: [string],							 //返回结果格式（参见Date.Format格式设置）
    pickHandler: [function]						//日期选择后的回调函数，默认参数为选择的日期
}
```
**window： 必须** 当前页面的window对象
**event： 必须** 当前事件对象
### UI组件 - 列表控件 （gridView.js）
##### 相关文件及依赖
JS：gridView.js （依赖：jquery-2.2.0.min.js 、 common.js）
CSS：main.css （依赖：common.css）
##### 引入方式
各子框架页面需要分别引入
#####  调用方法
``` javascript
var grid = new gridView(listOptions);
grid.load();
```
#####  参数说明
**listOptions： 必须**
``` javascript
{
    dataLoader: [json],					//数据加载AJAX源设置（url:[string] AJAX请求地址， data:[json] 请求参数）
    tableRenderTo: [string],			//列表TABLE控件写入对象：控件ID，控件JQUERY对象均可
    rowSelection: [boolean],			//是否可以选择行，默认true
    pagerNavigation: [boolean],			//是否可分页（出现分页导航条），默认为TRUE
    columns: [array]					//表头及列数据设置
}
//更多内容请参考示例页面
```
### UI组件 - 菜单控件 （sideMenu.js）
##### 相关文件及依赖
JS：sideMenu.js （依赖：jquery-2.2.0.min.js 、 common.js）
CSS：sideMenu.css （依赖：common.css）
##### 引入方式
各子框架页面需要分别引入
#####  手风琴式菜单（一次性加载所有数据，最多限定三级）
``` javascript
sideMenu.accordion(options);

options
{
    menuData: [array],					//菜单数据
    menuKey: [json],					//菜单数据显示索引配置
    menuRender: [jquery对象],			//菜单写入对象
    menuHandler: [function],			//菜单点击事件回调函数
    firstSelected: [boolean]			//第一个菜单项是否默认选中状态
}

//更多内容请参考示例页面
```
#####  无限级树形菜单
``` javascript
//构建菜单
sideMenu.tree.build(menuData, dataKeys, render, menuIcon, nodeEvent, textEvent, checked, extended);
menuData:[array]				//当前层级菜单数据
dataKeys：[json]					//当前层级菜单数据提取索引配置
render：[jQuery对象]				//当前层级菜单写入对象（通常除了第一级初始菜单需要配置之外，其他层级菜单将自动生成）
menuIcon: [string | function]		//当前层级菜单节点的图标配置
nodeEvent：[function]				//当前层级菜单收缩节点点击事件函数
textEvent：[function]				//当前层级菜单节点显示文字点击事件函数
checked：[boolean | function]		//当前节点CHECKBOX选中状态(true, false ,function也一定是返回的true 或 false)。为其他值，则不显示CHECKBOX
extended：[boolean]					//当前层级菜单节点如果仍有下级菜单时，是否自动展开，默认false

//更多内容请参考示例页面
```