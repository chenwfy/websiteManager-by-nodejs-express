//文件选择、上传页面脚本，本文件必须依赖JQuery 、 common.js 、fileTypeFilter.js 、webuploader.min.js
(function ($) {
    var uploadRoot = window.top.UploadRoot;
    var queryRoot, queryType, uploader, uploadStatus = 'pending';
    var uploadLayer, uploadQueueWrapper;

    $(function () {
        queryRoot = $.queryString()['root'] || uploadRoot;
        queryType = $.queryString()['fileType'] || 'All';
        if (!queryRoot.StartWith(uploadRoot)) {
            $.Alert('抱歉，只能选择“' + uploadRoot + '”目录下的文件！');
            return;
        }

        $('#li_dirName').html('当前目录：' + queryRoot);
        uploadLayer = $('#div_uploaderLayer').hide();
        uploadQueueWrapper = $('#div_queueWrapper');

        loadFileList();
        initUploader();
        bindElements();
    });

    var initUploader = function () {
        var option = fileTypeFilter.filterOptions[queryType];
        !!!option && (option = fileTypeFilter.filterOptions.All);

        uploader = WebUploader.create({
            auto: false,
            resize: false,
            swf: '/assets/js/lib/Uploader.swf',
            server: '/service/fileView/uploadFile',
            accept: {
                title: option.title,
                extensions: option.extensions.replace(/\|/g, ','),
                mimeTypes: option.mimeTypes
            },
            formData: {
                root: queryRoot,
                filter: queryType
            },
            disableGlobalDnd: true,
            fileNumLimit: 10,
            fileSizeLimit: 200 * 1024 * 1024,
            fileSingleSizeLimit: 20 * 1024 * 1024,
            pick: { id: '#fliePicker', innerHTML: '<i class="icon-Awesome-plus-circle"></i>&nbsp;选择文件' }
        });

        uploader.on('beforeFileQueued', function (file) {
            var fileFilter = new fileTypeFilter.filter(queryType),
                isAllow = fileFilter.allowable(file.name);

            !isAllow && $.Alert('抱歉，文件 “ ' + file.name + ' ” 类型不被支持！');
            return isAllow;
        });

        uploader.on('fileQueued', function (file) {
            var _row = $('<p>').attr({ 'id': 'p_' + file.id });
            $('<label>').addClass('name').html(file.name).appendTo(_row);
            $('<label>').addClass('info').html('等待上传').appendTo(_row);
            $('<i>').addClass('icon-Awesome-remove').on('click', function () {
                uploader.cancelFile(file);
                uploader.removeFile(file, true);
                _row.remove();
            }).appendTo(_row);
            $('<span>').appendTo(_row);
            _row.appendTo(uploadQueueWrapper);
        });

        uploader.on('uploadProgress', function (file, percentage) {
            var _row = uploadQueueWrapper.find('p#p_' + file.id).eq(0);
            if (_row && _row.length > 0) {
                _row.find('label.info').removeClass('error').html('上传中……！');
                _row.find('span').css('width', percentage * 100 + '%');
            }
        });

        uploader.on('uploadSuccess', function (file) {
            var _row = uploadQueueWrapper.find('p#p_' + file.id).eq(0);
            _row && _row.length > 0 && _row.remove();
        });

        uploader.on('uploadError', function (file, reason) {
            var _row = uploadQueueWrapper.find('p#p_' + file.id).eq(0);
            _row && _row.length > 0 && _row.find('label.info').addClass('error').html('上传出错！');
            console.log(reason);
        });

        uploader.on('uploadComplete', function (file) {
            var _row = uploadQueueWrapper.find('p#p_' + file.id).eq(0);
            _row && _row.length > 0 && _row.find('label.info').removeClass('error').html('上传完成！');
        });

        uploader.on('all', function (type) {
            if (type === 'startUpload') {
                uploadStatus = 'uploading';
            } else if (type === 'stopUpload') {
                uploadStatus = 'paused';
            } else if (type === 'uploadFinished') {
                uploadStatus = 'done';

                window.setTimeout(function () {
                    $.Alert('上传完成，共成功上传 ' + uploader.getStats().successNum + ' 个文件!');
                    uploader.reset();
                    uploadQueueWrapper.children().remove();
                    uploadLayer.hide();
                    loadFileList();
                }, 50);
            }
        });
    };

    var bindElements = function () {
        $('#btn_upload').on('click', function () {
            uploadLayer.show();
        });

        $('#btn_refresh').on('click', function () {
            loadFileList();
        });

        $('#btn_cancelUpload').on('click', function () {
            uploader && uploader.isInProgress() && uploader.stop(true);
            uploadQueueWrapper.children().remove();
            uploadLayer.hide();
            loadFileList();
        });

        $('#btn_startUpload').on('click', function () {
            uploader && uploader.getFiles().length > 0 && uploader.upload();
        });
    };

    var loadFileList = function () {
        var listWrapper = $('#ul_listWrapper'),
            loading = listWrapper.find('li.loading'),
            noFileTip = '<li class="nofile">当前目录没有文件!</li>';

        listWrapper.children().not(loading).remove() && loading.show();
        $.ajaxPost('/service/fileView/readDir', { root: queryRoot, filter: queryType }, function (json) {
            var data = json.data,
                count = data.length,
                fileFilter = new fileTypeFilter.filter('Images');

            0 == count && $(noFileTip).appendTo(listWrapper);
            0 < count && $.each(data, function (n, d) {
                (function (n, d) {
                    var _fileIcon = getFileIconByExtName(d),
                        _fileRow = $('<li>'),
                        _titleRender = $('<a>').attr({ 'href': 'javascript:void(0);' }).append('<i class="' + _fileIcon + '"></i>', d).on('click', function () {
                            var value = (queryRoot + '/' + d).replace(/\/\//g, '\/');
                            window.frameElement.callback(value);
                            window.top.dialog.close();
                        }),
                        _btnRender = $('<p>').append(
                            //$('<i>').addClass('icon-Awesome-edit').on('click', function () {

                            //}),
                            $('<i>').addClass('icon-Awesome-remove').on('click', function () {
                                $.Confirm('确认要删除文件： ' + d + ' 吗？', {
                                    buttonOkClicked: function () {
                                        $.ajaxPost('/service/fileView/removeFile', { root: queryRoot, file: encodeURIComponent(d) }, function () {
                                            _fileRow.remove();
                                            listWrapper.children().not(loading).length == 0 && $(noFileTip).appendTo(listWrapper);
                                        });
                                    }
                                });
                            })
                        );

                    fileFilter.allowable(d) && _titleRender.picurePreview((queryRoot + '/' + d).replace(/\/\//g, '\/'));
                    loading.before(_fileRow.append(_titleRender, _btnRender));
                })(n, d);
            });
            loading.hide();
        });
    };

    var getFileIconByExtName = function (fileName) {
        var iconConfig = {
            'icon-Awesome-file-photo-o': ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg'],
            'icon-Awesome-file-sound-o': ['.mid', '.mp3', '.wav', '.wma', 'm4a', '.mp4a', '.flc', '.aac', '.ogg'],
            'icon-Awesome-file-movie-o': ['.wmv', '.rm', '.rmvb', '.avi', '.mp4', '.mpeg'],
            'icon-Awesome-file-word-o': ['.doc', '.docx'],
            'icon-Awesome-file-excel-o': ['.xls', '.xlsx'],
            'icon-Awesome-file-powerpoint-o': ['.ppt', '.pptx'],
            'icon-Awesome-file-pdf-o': ['.pdf'],
            'icon-Awesome-file-zip-o': ['.zip', '.7z', '.rar'],
            'icon-Awesome-file-code-o': ['.html', '.htm', '.cs', '.css', '.js', '.json', '.java', '.m', '.h', '.cpp', '.aspx', '.ashx', '.php', '.config', '.xml'],
            'icon-Awesome-flash': ['.fla', '.swf', '.flv'],
            'icon-Awesome-umbrella': ['.exe']
        },
        defaultIcon = 'icon-Awesome-file-o',
        extName = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

        if (extName) {
            for (var j in iconConfig) {
                if (iconConfig[j].indexOf(extName) >= 0)
                    return j;
            }
        }
        return defaultIcon;
    };
})($);