//登录页面JS脚本部分
$(function () {
    window.frameElement && (window.top.location.href = '/login.html');

    var msgBox = $('#p_message'),
        sourceMsg = msgBox.html(),
        msgErrClass = 'err',
        msgSucClass = 'suc',
        loginForm = $('#form_userLogin'),
        nameInput = $('#txt_userName'),
        passInput = $('#pwd_userPassword'),
        btnSubmit = $('#btn_submit'),
        submitUrl = '/service/login',
        formSubmit = function (e) {
            msgBox.hasClass(msgErrClass) && msgBox.removeClass(msgErrClass).html(sourceMsg);

            var username = $.trim(nameInput.val()),
                password = $.trim(passInput.val());

            if (username == '' || password == '') {
                msgBox.addClass(msgErrClass).html('用户名和密码不能为空！');
                return false;
            }

            e.preventDefault();

            var data = { 'username': username, 'password': password };
            $.post(submitUrl, data).done(submitSucceed).fail(submitError);
        },
        submitSucceed = function (data) {
            if (data && data.status) {
                msgBox.removeClass(msgErrClass).addClass(msgSucClass).html('登录成功！');
                window.location.href = '/admin/index.html';
            } else {
                msgBox.addClass(msgErrClass).html((data && data.message) || '');
            }
        },
        submitError = function () {
            msgBox.addClass(msgErrClass).html('网络不可用或请求出错，请稍候重试！');
        };

    loginForm.on('submit', formSubmit);
    btnSubmit.on('click', formSubmit);
});