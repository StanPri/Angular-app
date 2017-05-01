var notPermitted = "You do not have permission to use this function.";
var downloadFileMessage = "Download the selected item(s) to your computer.";
var deleteFolderMesssage = "Delete the currently selected item(s). If a folder is selected, all subfolders and items within the folder will also be deleted.";
var cannotDeleteMessage = "You must select a file or folder to use this function.";
var cannotDownloadMessage = "You must select a file before you can use this function.";
var uploadFileMessage = "Upload documents into the current folder.";
var addFolderMessage = "Create a subfolder within the current folder.";
var folderPermissionMessage = "See who has access to the current folder. Users with administrative privileges can add or remove users from the folder."
var shareFileAuthErrorMessage = "Please re-enter credentials for security purposes";
var invalidLoginCredentialsMessage = "Auth failed: The email address and password entered do not match. Please re-enter and try again.";
var invalidEmailFormatMessage = "Invalid email format: The email address entered is invalid. Please enter an email address in standard format (i.e., name@company.com)";
var emptyFolderMessage = "This folder is currently empty. Drag and Drop files here or use the Upload button on the right.";

var fileExtensionsIcons = {
    "docx": "icon-file-word-o",
    "pdf": "icon-file-pdf",
    "xlsx": "icon-file-excel"
}

var isPlaying = false;
var isOnPause = true;

var doPushState = false;

$(document).ready(function () {

    $('[data-toggle="tooltip"]').tooltip({
        trigger: 'hover'
    });

    initControlButtons(false, false);

    $('.carousel').carousel({
        pause: true,
        interval: false
    });

    
    var isFilled = true;
    $('form input[required="required"]').on('keyup change', function () {
        $(this).closest('form').find('input[required="required"]').each(function () {
            if (($(this).val() == "")) {
                isFilled = false;
                return;
            }
        });

        var elem = $(this).closest('form').find('button[type="submit"]');
        if (isFilled) {
            elem.addClass('active');
        } else {
            elem.removeClass('active');
        }
        isFilled = true;
    });
    
    $('.files-panel .panel-body').on('click', 'form label', function () {
        if (!($(this).prev('input[type="checkbox"]').is(':checked'))) {
            $(this).closest('form').find('.form-submit.sharedFile').addClass('selected');
            $(this).css('display', 'inline');
        } else {
            $(this).closest('form').find('.form-submit.sharedFile').removeClass('selected');
            $(this).css('display', 'none');
        }
    });

    $('.files-panel .panel-body').on('click', '.form-submit.sharedFile span', function (e) {
        if (!($(this).parent('a').hasClass('isFile'))) {
            doPushState = true;
            $(this).closest('form').submit();
        } else {
            $('.form-submit').removeClass('selected');
            $('input[type="checkbox"]').prop('checked', false);
            $('.files-panel label').css('display', 'none');
            $(this).parent('a').addClass('selected');
            downloadFile();
        }
    });

    $('.files-panel .panel-body').on('click', '.form-submit.sharedFile', function (e) {
        if (!($(this).hasClass('selected'))) {
            $(this).addClass('selected');
            $(this).closest('form').find('input[type="checkbox"]').prop('checked', true);
            $(this).prev('label').css('display', 'inline');
        } else {
            $(this).removeClass('selected');
            $(this).closest('form').find('input[type="checkbox"]').prop('checked', false);
            $(this).prev('label').css('display', 'none');
        }
    });

    $('.files-panel .panel-body').on('click', 'form', function () {
        var isFileSelected = false;
        var isFolderSelected = false;
        $('.files-panel .panel-body form a').each(function () {
            if ($(this).hasClass('selected') && !($(this).hasClass('isFile'))) {
                isFolderSelected = true;
            } else if ($(this).hasClass('selected') && $(this).hasClass('isFile')) {
                isFileSelected = true;
            }
        });

        initControlButtons(isFolderSelected, isFileSelected);

    });

    $('.files-panel .panel-body').on('dblclick', '.form-submit.sharedFile', function () {
        if (!($(this).hasClass('isFile'))) {
            doPushState = true;
            $(this).closest('form').submit();
        }
    });

    $('.breadcrumb').on('click', '.form-submit', function () {
        doPushState = true;
        $(this).closest('form').submit();
    });

    $('#updateFolderAceess').on('click', function () {
        $('#updateFolderAceess').removeClass('active');
        $('#accessControlModal .updateFoderAccessForm').submit();
    });

    $('#deleteFolderAccess').on('click', function (e) {
        e.preventDefault();
        $('#accessControlModal .deleteFolderAccessForm').submit();
    });

    $("#formSubmitButton").click(function () {
        $(".mainForm").validate();
        if (!$(".mainForm").valid()) {
            $(".mainForm .alert.alert-warning").show();
        } else {
            $(".mainForm").submit();
        }
    });

    $('.btn-add-user').on('click', function (e) {
        e.preventDefault();
        var flag = false;
        var elem = $(this).closest('form');
        var email = $(elem).find('input[type="email"]').val();
        $('.user-list .user-access-info').each(function () {
            if ($(this).find('a').text() == email) {
                flag = true;
            }
        });
        if (!(flag)) {
            $(elem).submit();
        } else {
            alert("Email address already exists.");
        }
    });

    $('#accessControlModal form input[type="checkbox"]').on('change', function () {
        $('#updateFolderAceess').addClass('active');
    });

    /* File Uploader */

    var fileUploaderElement = $('#fileuploader');
    if (fileUploaderElement.length) {
        var uploadObj = fileUploaderElement.uploadFile({
            url: '/Files/UploadFile',
            showFileCounter: false,
            showFileSize: false,
            showError: true,
            sequential: false,
            autoSubmit: true,
            uploadStr: '<span class="text-center text-danger">or</span> Browse',
            returnType: "json",
            dragDropStr: '<span class="text-center text-danger">Drag And Drop Files Here</span>',
            dynamicFormData: function () {
                var data = { folderId: $('#downloadFileForm form #ParentFolderId').val() }
                return data;
            },
            customProgressBar: function (obj, s) {
                this.statusbar = $('<div class="row"></div>');
                this.filename = $('<div class="col-xs-7 upload-file-name"></div>').appendTo(this.statusbar);
                this.progressDiv = $("<div class='col-xs-4 upload-file-progress'>").appendTo(this.statusbar).hide();
                this.progressbar = $("<div class='ajax-file-upload-bar'></div>").appendTo(this.progressDiv);
                this.abort = $('<div class="col-xs-1 abort"><i class="fa fa-times blue-text" aria-hidden="true"></i></div>').appendTo(this.statusbar).hide();
                this.cancel = $('<div class="col-xs-1 cancel"><i class="fa fa-times blue-text" aria-hidden="true"></i></div>').appendTo(this.statusbar).hide();
                this.done = $('<div class="col-xs-1 done"><i class="fa fa-times blue-text" aria-hidden="true"></i></div>').appendTo(this.statusbar).hide();
                this.del = $('<div class="col-xs-1 del"><i class="fa fa-times blue-text" aria-hidden="true"></i></div>').appendTo(this.statusbar).hide();
                return this;
            },
            onSuccess: function (files, data, xhr, pd) {
                pd.filename.addClass('done-upload').closest('.row').find('.file-duplicate-alert').hide();
                pd.progressDiv.hide();
            },
            onSelect: function (files) {
                $('.files-panel .panel-body').css('min-height', '152px');
                $('#btnUploadCancel').attr('file-uploaded', true);
                $('#btnDoneUpload').addClass('hidden');
                $('#btnUploadCancel').removeClass('hidden');

                var array = [];
                $(files).each(function () {
                    array.push(this.name);
                });

                array = JSON.stringify({ 'folderId': $('#downloadFileForm form #ParentFolderId').val(), 'fileNames': array });

                $.ajax({
                    type: "POST",
                    url: '/Files/CheckFileExists',
                    data: array,
                    dataType: 'json',
                    contentType: 'application/json; charset=utf-8',
                    success: function (Data) {
                        if (Data.result === "Success" && Data.duplicateList.length > 0) {
                            for (var i = 0; i < Data.duplicateList.length; i++) {
                                $('.ajax-file-upload-container .upload-file-name:contains("' + Data.duplicateList[i] + '")').closest('.row').append('<div class="col-xs-12 file-duplicate-alert"><p class="text-danger"><i class="fa fa-exclamation-triangle text-danger" aria-hidden="true"></i> File name already exists - will overwrite</p></div>');
                            }
                        }
                    }
                });
            },
            onError: function (files, status, errMsg, pd) {
                displayError(errMsg);
            },
            afterUploadAll: function () {
                $('#btnConfirmUploadCancel').addClass('hidden');
                $('#btnUploadCancel').removeClass('confirmed');
                $('.btn-area .alert').removeClass('alert-warning').find('.text-left').hide();
                if ($('#btnUploadCancel').attr('file-uploaded') == 'true') {
                    $('#btnUploadCancel').addClass('hidden');
                    $('#btnDoneUpload').removeClass('hidden');
                }
            },
        });
    }

    $('#btnDoneUpload').on('click', function (e) {
        e.preventDefault();
        $(this).addClass('hidden');
        resetFileUpload();
        uploadObj.reset();
    });

    $('#btnUploadCancel').on('click', function (e) {
        e.preventDefault();
        if ($(this).attr('file-uploaded') == 'false') {
            resetFileUpload();
        } else {
            if (!($(this).hasClass('confirmed'))) {
                $(this).addClass('confirmed');
                $('.btn-area .alert').addClass('alert-warning').find('.text-left').show();
                $('#btnConfirmUploadCancel').removeClass('hidden');
            } else {
                $(this).removeClass('confirmed');
                $('.btn-area .alert').removeClass('alert-warning').find('.text-left').hide();
                $('#btnConfirmUploadCancel').addClass('hidden');
            }
        }
    });

    $('#btnConfirmUploadCancel').on('click', function (e) {
        e.preventDefault();
        $(this).addClass('hidden');
        $('#btnUploadCancel').removeClass('confirmed').attr('file-uploaded', false);
        $('.btn-area .alert').removeClass('alert-warning').find('.text-left').hide();
        $('#fileuploader').css('min-height', '456px');
        uploadObj.stopUpload();
        uploadObj.reset();
    });

    $('.files-panel .files-list').on('dragenter', function (e) {
        $(this).hide();
        if ($('#btn-upload').attr("permission") == "true") {
            $('.files-panel .fileupload-area').show();
            $('#fileuploader .ajax-file-upload, #fileuploader .alert, #fileuploader .text-center.text-danger, .btn-area').css('pointer-events', 'none');
        } else {
            $('.files-panel .alert-area').show();
        }
    });

    $('.files-panel .alert-area').on('dragover', function (e) {
        e.originalEvent.dataTransfer.dropEffect = "none";
    });

    $('.files-panel .alert-area').on('dragleave drop', function () {
        $(this).hide();
        $('.files-panel .files-list').show();
    });
    
    $('.files-panel .fileupload-area').on('dragleave', function () {
        if (!($('#btn-upload').hasClass('active-orange'))) {
            $(this).hide();
            $('.files-panel .files-list').show();
            $('#fileuploader .ajax-file-upload, #fileuploader .alert, #fileuploader .text-center.text-danger, .btn-area').css('pointer-events', 'auto');
        }
    });
    
    $('.files-panel .fileupload-area').on('drop', function () {
        if (!($('#btn-upload').hasClass('active-orange'))) {
            showUploadScreen($('#btn-upload'));
            $('#fileuploader .ajax-file-upload, #fileuploader .alert, #fileuploader .text-center.text-danger, .btn-area').css('pointer-events', 'auto');
        }
    });
    
    /* Expand/Collapse all accordion */

    $('#accordion-toggle').on('click', function (e) {
        e.preventDefault();
        if (!($(this).hasClass('opened'))) {
            $(this).addClass('opened').text('Collapse all');
            $('.panel-collapse:not(".in")').collapse('show');
        } else {
            $(this).removeClass('opened').text('Expand all');
            $('.panel-collapse.in').collapse('hide');
        }
    });

    $('#toggle-eeo-insights').on('click', function (e) {
        e.preventDefault();
        if (!($(this).hasClass('opened'))) {
            $(this).addClass('opened').text('Collapse all');
            $('#insight .panel-body a').each(function () {
                $(this).text() == "More" ? $(this).click() : "";
            });
        } else {
            $(this).removeClass('opened').text('Expand all');
            $('#insight .panel-body a').each(function () {
                $(this).text() == "Less" ? $(this).click() : "";
            });
        }
    });

    /* Webinars Video */

    $('.open-video-modal').each(function () {
        var videoElement = $(this).find('video');
        var time = parseInt(videoElement.attr('posterTime'));
        
        videoElement.on('loadedmetadata', function () {
            this.currentTime = time;
        });

        videoElement.on('loadeddata', function () {
            var video = this;

            var canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

            var img = document.createElement("img");
            img.src = canvas.toDataURL();
            $(video).next('.thumbnail').append(img);
        });
    });

    $('.open-video-modal').on('click', function (e) {
        e.preventDefault();

        var dataUrl = $(this).attr('data-url');
        var videoTitle = $(this).next('p').text();
        var element = $('#video-container').html();

        $('#video-container #webinar-video').remove();
        $('#video-container').html(element);

        var video = $('#video-container #webinar-video');

        video.on('timeupdate', function () {
            $('#current-time').text(SecondToTime($(this).get(0).currentTime));
            $('#end-time').text(SecondToTime($(this).get(0).duration));
            var currentPos = video.get(0).currentTime;
            var maxduration = video.get(0).duration;
            var percentage = 100 * currentPos / maxduration;
            $('.timeBar').css('width', percentage + '%');
        });

        video.on('ended', function () {
            $('#btn-play').show();
            $('#btn-pause').hide();
        });

        var timeDrag = false;
        $('.progressBar').mousedown(function (e) {
            timeDrag = true;
            updatebar(e.pageX);
        });

        $('html').mouseup(function (e) {
            if (timeDrag) {
                timeDrag = false;
                updatebar(e.pageX);
            }
        });

        $('html').mousemove(function (e) {
            if (timeDrag) {
                updatebar(e.pageX);
            }
        });

        var updatebar = function (x) {
            var progress = $('.progressBar');
            var maxduration = video[0].duration;
            var position = x - progress.offset().left;
            var percentage = 100 * position / progress.width();
            if (percentage > 100) {
                percentage = 100;
            }
            if (percentage < 0) {
                percentage = 0;
            }
            $('.timeBar').css('width', percentage + '%');
            pauseVideo();
            video[0].currentTime = maxduration * percentage / 100;
            playVideo();
        };

        $('#btn-play').hide();
        $('#btn-pause').show();
        $('.timeBar').css('width', '0');

        $('#webinar-video source').attr('src', dataUrl);

        video[0].load();
        playVideo();

        $('#videoModal .panel-body h1').html(videoTitle);
        $('#videoModal').modal('show');
    });

    $('#videoModal').on('hide.bs.modal', function () {
        pauseVideo();
    });

    /* Calender */

    var array = [];
    $('.panel.news .nav > li').each(function () {
        var eventTitle = $(this).find('a .blue-text').html();
        var eventPubDate = $(this).find('a time').html();
        var date = new Date(eventPubDate);
        var formattedDate = ('0' + date.getDate()).slice(-2);
        var formattedMonth = date.getMonth() + 1;
        formattedMonth = ('0' + formattedMonth).slice(-2);
        var eventPubDate = date.getFullYear() + '-' + formattedMonth + '-' + formattedDate;
        var eventDescription = $(this).find('.feed-item-description').html();
        array.push({
            title: eventTitle,
            start: eventPubDate,
            detail: eventDescription,
        });
    });

    var calenderElem = $('#calendar');
    if (calenderElem.length) {
        calenderElem.fullCalendar({
            header: {
                left: 'prev, next, title',
                right: ''
            },
            week: true,
            day: true,
            columnFormat: 'dddd',
            eventLimit: true,
            views: {
                agenda: {
                    eventLimit: 3
                }
            },
            displayEventTime: false,
            eventSources: [
                {
                    events: array,
                    color: '#0991a3',
                }
            ],
            aspectRatio: 2,
            fixedWeekCount: false,
            eventClick: function (event, jsEvent) {
                jsEvent.stopPropagation();

                var popover_content = '<div class="inner-content" data-simplebar><button class="btn close-popover" onclick="closePopover()"><i class="fa fa-window-close-o" aria-hidden="true"></i></button>' + event.detail + '</div>';
                
                if (!($(this).hasClass('popover-added'))) {
                    $(this).popover({
                        content: popover_content,
                        html: true,
                        placement: "auto right",
                        trigger: 'manual',
                        container: 'body'
                    });

                    $('.portal-container').click();
                    $(this).addClass('popover-added').popover('show');

                }
                else {
                    $(this).popover('hide');
                    $(this).removeClass('popover-added');
                }
            }
        });
    }

    var elem = $('.offset-top');
    var height = elem.height();
    if (elem.length) {
        var offset = elem.offset().top;
        elem.css('height', $(window).height() - offset - 4);
    }

    $('.navbar.navbar-default').css('height', $('.content-holder').height());

    $('.portal-container').on('click', function () {
        $('.fc-day-grid-event').removeClass('popover-added');
        $('.popover').remove();
    });

    $('.toggleAddUserForm').on('click', function (e) {
        e.stopPropagation();
        $(this).addClass('hidden');
        $('.addUserForm').removeClass('hidden');
    });

    $('.addUserForm input[name="UserEmail"]').on('click', function (e) {
        e.stopPropagation();
    });

    $('#addFolderModal').on('hidden.bs.modal', function () {
        $('#addFolderModal .form-control').each(function () {
            $(this).val("");
        });
        $('#addFolderModal button[type="submit"]').removeClass('active');
    });

    $('#accessControlModal').on('hidden.bs.modal', function () {
        var form_elem = $('.tab-content .tab-pane form');
        form_elem.find('input[type="checkbox"]').prop('checked', false).prop('disabled', true);
        $('#updateFolderAceess, #deleteFolderAccess, #cancelFolderAccess').addClass('hidden');
        $('.user-access-info a.selected').removeClass('selected');
        $('#updateFolderAceess').removeClass('active');
    });

    $('html').on('click', function () {
        if (!($('.addUserForm').hasClass('hidden'))) {
            $('.addUserForm').addClass('hidden')
            $('.addUserForm').prev('.panel-body').find('a').removeClass('hidden');
        }
    });

    // handle browser history
    $(window).on('popstate', function (event) {
        doPushState = false;
        if (event.originalEvent.state) {
            submitResetFilesForm(event.originalEvent.state.folderId);
        } else {
            submitResetFilesForm("allshared");
        }
    });

    var folderId = window.location.hash.substring(1);
    if (folderId != "") {
        submitResetFilesForm(folderId);
    } else {
        submitResetFilesForm('allshared');
    }
});

var months = ["January", "February","March","April","May","June","July","August","September","October","November","December" ];

function closePopover(elem) {
    $('.portal-container').click();
}

function downloadFile() {
    var itemIds = "";
    var itemNames = "";
    $('.form-submit.selected').each(function () {
        if (itemIds != "") {
            itemIds += ",";
            itemNames += ",";
        }
        itemNames += $(this).find('span').text();
        itemIds += $(this).closest('form').find('#ItemId').val();
    });

    $('#downloadFileForm #ItemName').val(itemNames);
    $('#downloadFileForm #ItemId').val(itemIds);
    $('#downloadFileForm form').submit();
}

function deleteItem() {
    var itemIds = "";
    $('.form-submit.selected').each(function () {
        if (itemIds != "")
            itemIds += ",";
        itemIds += $(this).closest('form').find('#ItemId').val();
    });

    $('#deleteFileForm #ItemId').val(itemIds);
    $('#deleteFileForm form').submit();
}

function showUploadScreen(elem) {
    $(elem).addClass('active-orange');
    $('.breadcrumb a').addClass('disabled');
    $('.files-panel .panel-default').hide();
    $('.files-panel .fileupload-area').show();
    $('.control-buttons button').addClass('inactive');
}

function onPlaying() {
    isPlaying = true;
    isOnPause = false;
}

function onPause() {
    isPlaying = false;
    isOnPause = true;
}

function playVideo() {
    var video = document.getElementById("webinar-video");
    if (video.paused) {
        if (!isPlaying) {
            $('#btn-play').hide();
            $('#btn-pause').show();
            video.play();
        }
    }
}

function pauseVideo() {
    var video = document.getElementById("webinar-video");
    if (!video.paused) {
        if (!isOnPause) {
            $('#btn-pause').hide();
            $('#btn-play').show();
            video.pause();
        }
    }
}

function fastForwardVideo() {
    var video = document.getElementById('webinar-video');
    video.playbackRate = ++video.playbackRate;
}

function rewindVideo() {
    var video = document.getElementById('webinar-video');
    if (video.playbackRate > 1) {
        video.playbackRate = 1;
    } else {
        isPlaying = false;
        isOnPause = true;
        pauseVideo();
        video.load();
        playVideo();
        $('#btn-play').hide();
        $('#btn-pause').show();
    }
}

function SecondToTime(time) {
    var sec_num = parseInt(time, 10);
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
}

function fullScreenVideo() {
    var video = document.getElementById('webinar-video');
    if (video.requestFullscreen) {
        video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
        video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen();
    }
}

function showReadingPanelContent(elem) {

    var time = $(elem).find('time').text().split("/");
    var pubDate = months[time[0] - 1] + " " + time[1] + ", " + time[2];

    $(elem).next('.feed-item-description').find('time').html(pubDate);
   
    $('.tab-pane.reading-panel').html($(elem).next('.feed-item-description').html());
}

function toggleCalender(elem) {
    $(elem).html($(elem).text() == "List View" ? '<i class="fa icon-calendar" aria-hidden="true"></i>Calender View' :
        '<i class="fa fa-list-ul" aria-hidden="true"></i>List View');
    $('#calendar').closest('.offset-top').toggleClass('hidden');
    $('#calendar').fullCalendar('today');
    $(elem).closest('.row').find('.panel.news').toggleClass('hidden');
}

function lengthenArticle(elem) {
    $(elem).html($(elem).text() == "More" ? '<i class="fa fa-angle-double-up" aria-hidden="true"></i>Less' : '<i class="fa fa-angle-double-down" aria-hidden="true"></i>More');
    $(elem).closest('.row').find('.lengthen-article').toggleClass('hidden');
}

function toggleUserPermissions(element) {
    if (!$(element).hasClass('selected')) {
        $('.user-list .user-access-info a').removeClass('selected');
        $(element).addClass('selected');
        $('#updateFolderAceess, #deleteFolderAccess, #cancelFolderAccess').removeClass('hidden');
        $('.tab-content .tab-pane form input[type="checkbox"]').prop('disabled', false);
        var elem = $(element).closest('.user-access-info');
        $('.tab-content .tab-pane form input[name="UserEmail"]').val($(elem).find('input[name="UserEmail"]').val());
        $('.tab-content .tab-pane form input[name="CanUpload"]').prop('checked', ($(elem).find('input[name="CanUpload"]').val() == "true"));
        $('.tab-content .tab-pane form input[name="CanDownload"]').prop('checked', ($(elem).find('input[name="CanDownload"]').val() == "true"));
        $('.tab-content .tab-pane form input[name="CanDelete"]').prop('checked', ($(elem).find('input[name="CanDelete"]').val() == "true"));
        $('.tab-content .tab-pane form input[name="CanManagePermissions"]').prop('checked', ($(elem).find('input[name="CanManagePermissions"]').val() == "true"));
        $('.tab-content .tab-pane form input[name="NotifyOnDownload"]').prop('checked', ($(elem).find('input[name="NotifyOnDownload"]').val() == "true"));
        $('.tab-content .tab-pane form input[name="NotifyOnUpload"]').prop('checked', ($(elem).find('input[name="NotifyOnUpload"]').val() == "true"));
    }
}

var updateFolderAccess = function(data) {
    $('.ajax-loader').addClass('hidden');
    if (data.result == "Success") {
        var email = $('.tab-content .tab-pane form input[name="UserEmail"]').val();
        var elem = $('.user-list .user-access-info').find('input[value="' + email + '"]').closest('.user-access-info');
        var form_elem = $('.tab-content .tab-pane form');

        $('.tab-content .tab-pane form input[name="CanUpload"]').prop('checked', (data.permissionList["CanUpload"]));
        $('.tab-content .tab-pane form input[name="CanDownload"]').prop('checked', (data.permissionList["CanDownload"]));
        $('.tab-content .tab-pane form input[name="CanDelete"]').prop('checked', (data.permissionList["CanDelete"]));
        $('.tab-content .tab-pane form input[name="CanManagePermissions"]').prop('checked', (data.permissionList["CanManagePermissions"]));
        $('.tab-content .tab-pane form input[name="NotifyOnDownload"]').prop('checked', (data.permissionList["NotifyOnDownload"]));
        $('.tab-content .tab-pane form input[name="NotifyOnUpload"]').prop('checked', (data.permissionList["NotifyOnUpload"]));
        $('.tab-content .tab-pane form input[name="Recursive"]').prop('checked', false);

        form_elem.find('input[name="CanUpload"]').is(":checked") ? elem.find('input[name="CanUpload"]').val('true') : elem.find('input[name="CanUpload"]').val('false');
        form_elem.find('input[name="CanDownload"]').is(":checked") ? elem.find('input[name="CanDownload"]').val('true') : elem.find('input[name="CanDownload"]').val('false');
        form_elem.find('input[name="CanDelete"]').is(":checked") ? elem.find('input[name="CanDelete"]').val('true') : elem.find('input[name="CanDelete"]').val('false');
        form_elem.find('input[name="CanManagePermissions"]').is(":checked") ? elem.find('input[name="CanManagePermissions"]').val('true') : elem.find('input[name="CanManagePermissions"]').val('false');
        form_elem.find('input[name="NotifyOnDownload"]').is(":checked") ? elem.find('input[name="NotifyOnDownload"]').val('true') : elem.find('input[name="NotifyOnDownload"]').val('false');
        form_elem.find('input[name="NotifyOnUpload"]').is(":checked") ? elem.find('input[name="NotifyOnUpload"]').val('true') : elem.find('input[name="NotifyOnUpload"]').val('false');
    } else {
        alert(data.result);

        var elem = $('.user-list .user-access-info a.selected').closest('.user-access-info');
        $('.tab-content .tab-pane form input[name="CanUpload"]').prop('checked', ($(elem).find('input[name="CanUpload"]').val()));
        $('.tab-content .tab-pane form input[name="CanDownload"]').prop('checked', ($(elem).find('input[name="CanDownload"]').val()));
        $('.tab-content .tab-pane form input[name="CanDelete"]').prop('checked', ($(elem).find('input[name="CanDelete"]').val()));
        $('.tab-content .tab-pane form input[name="CanManagePermissions"]').prop('checked', ($(elem).find('input[name="CanManagePermissions"]').val()));
        $('.tab-content .tab-pane form input[name="NotifyOnDownload"]').prop('checked', ($(elem).find('input[name="NotifyOnDownload"]').val()));
        $('.tab-content .tab-pane form input[name="NotifyOnUpload"]').prop('checked', ($(elem).find('input[name="NotifyOnUpload"]').val()));
    }
}

var deleteFolderAccess = function(data) {
    $('.ajax-loader').addClass('hidden');
    if (data.result == "Success") {
        var email = $('.tab-content .tab-pane form input[name="UserEmail"]').val();
        var elem = $('.user-list .user-access-info').find('input[value="' + email + '"]').closest('.user-access-info').remove();
        var form_elem = $('.tab-content .tab-pane form');
        form_elem.find('input[type="checkbox"]').prop('checked', false).prop('disabled', true);
        $('#deleteFolderAccess').addClass('hidden');
        $('#updateFolderAceess').removeClass('active');
    } else {
        alert(data.result);
    }
}

var addUser = function(data) {
    $('.ajax-loader').addClass('hidden');
    if (data.result == "Success") {
        addNewUserInUserList(data.userEmail, data.userFullName);
    } else if (data.result == "UserDoesNotExist") {
        $('#accessControlModal').modal('hide');
        $('#createNewUserModal').modal('show');
        $('#createNewUserModal form input[name="Email"]').val(data.userEmail);
        $('#createNewUserModal .userEmailAddress').text(data.userEmail);
    } else {
        alert(data.result);
    }
}

var createNewUser = function(data) {
    $('.ajax-loader').addClass('hidden');
    if (data.result == "Success") {
        addNewUserInUserList(data.userEmail, data.userFullName);
        $('#createNewUserModal').modal('hide');
        $('#accessControlModal').modal('show');
    } else {
        alert(data.result);
    }
}

function addNewUserInUserList(email, fullName) {
    var elem = $('.user-list .user-access-info:first-child').clone();
    elem.find('input[name="UserEmail"]').val(email);
    elem.find('input[name="CanUpload"]').val(false);
    elem.find('input[name="CanDownload"]').val(true);
    elem.find('input[name="CanDelete"]').val(false);
    elem.find('input[name="CanManagePermissions"]').val(false);
    elem.find('input[name="NotifyOnDownload"]').val(false);
    elem.find('input[name="NotifyOnUpload"]').val(false);
    elem.find('input[name="Recursive"]').val(false);
    elem.find('a').text(fullName);
    $('.user-list .dynamic-user-list').append(elem);
    $('.user-list .user-access-info a').removeClass('selected');
    $('#updateFolderAceess').removeClass('active');
    toggleUserPermissions($(elem).find('a'));
}

/* -------------------------------------------------------------------- */
/*    Functions for updating data while browsing a subfolder            */
/* -------------------------------------------------------------------- */

var updateFilesView = function(data) {
    $('.ajax-loader').addClass('hidden');
    if (data.result == "Success") {
        $('#addFolderModal').modal('hide');

        updateBreadcrumb(data.viewModel.Breadcrumb);
        $('.breadcrumb .currentFolderName').text(data.viewModel.CurrentFolder.Name);
        updateFilesList(data.viewModel.CurrentFolder.Children);
        updateFolderPermission(data.viewModel.CurrentFolder.Info);
        updateAccessControl(data.viewModel.CurrentFolder.AccessControls);
        $('#ParentFolderId, .addUserForm input[name = "FolderId"], .updateFoderAccessForm input[name ="FolderId"], .deleteFolderAccessForm input[name ="FolderId"], #createNewUserModal input[name = "FolderId"], #resetFilesView #ItemId').val(data.viewModel.CurrentFolder.Id);
        if (doPushState) {
            history.pushState({ folderId: data.viewModel.CurrentFolder.Id }, $(document).find('title').text(), '#'+data.viewModel.CurrentFolder.Id);
            doPushState = false;
        }
    } else {
        alert(data.result);
    }
}

function updateBreadcrumb(data) {
    $('.breadcrumb .list').html("");
    var elem = $('#breadcrumbForm form');
    $(data).each(function () {
        elem.find('#ItemId').val($(this)[0].Id);
        elem.find('a').text($(this)[0].Name);
        $('.breadcrumb .list').prepend(elem.clone());
    });
}

function updateFilesList(data) {
    $('.files-panel .panel-body .simplebar-content').html("");

    if (data.length > 0) {
        $(data).each(function () {

            var anchor_class = "";
            var icon_class = "icon-folder2";

            if ($(this)[0].__type != 'ShareFile.Api.Models.Folder') {

                var extension = $(this)[0].Name.split('.').pop();

                if (fileExtensionsIcons[extension] != undefined) {
                    icon_class = fileExtensionsIcons[extension];
                } else {
                    icon_class = "fa-file-o";
                }

                anchor_class = "isFile";
            }

            var elem = "";
            elem = elem + '<form action="' + baseUrl + '/Files" data-ajax="true" data-ajax-begin="showAjaxLoader" data-ajax-method="POST" data-ajax-success="updateFilesView" data-ajax-failure="onAjaxError" id="form' + $(this)[0].Id + '" method="post">';
            elem = elem + '<input class="form-control" id="ItemId" name="ItemId" type="hidden" value="' + $(this)[0].Id + '">';
            elem = elem + '<input class="hidden" type="checkbox" id="' + $(this)[0].Id + '"><label class="" for="' + $(this)[0].Id + '" style="display: none;"></label>';
            elem = elem + '<a href="javascript:void(0)" class="form-submit sharedFile ' + anchor_class + '"><i class="fa ' + icon_class + '" aria-hidden="true"></i> &nbsp;<span>' + $(this)[0].Name + '</span></a>';
            elem = elem + '</form>';

            $('.files-panel .panel-body .simplebar-content').append(elem);
        });
    } else {
        var elem = '<p class="padding20">' + emptyFolderMessage + '</p>';
        $('.files-panel .panel-body .simplebar-content').append(elem);
    }
}

function updateFolderPermission(data) {
    $('.control-buttons #btn-download').attr('permission', data.CanDownload.toString());
    $('.control-buttons #btn-upload').attr('permission', data.CanUpload.toString());
    $('.control-buttons #btn-addFolder').attr('permission', data.CanAddFolder.toString());
    $('.control-buttons #btn-delete').attr('permission', data.CanDeleteChildItems.toString());
    $('.control-buttons #btn-folder-access').attr('permission', data.CanManagePermissions.toString());

    initControlButtons(false, false);
}

function updateAccessControl(data) {
    $('.dynamic-user-list').html("");
    $(data).each(function () {
        if ($(this)[0].Principal.Username != null) {

            var elem = "";
            elem = elem + '<div class="user-access-info">';
            elem = elem + '<input type="hidden" name="UserEmail" value="' + $(this)[0].Principal.Username + '" />';
            elem = elem + '<input type="hidden" name="CanDownload" value="' + $(this)[0].CanDownload + '" />';
            elem = elem + '<input type="hidden" name="CanUpload" value="' + $(this)[0].CanUpload + '" />';
            elem = elem + '<input type="hidden" name="CanDelete" value="' + $(this)[0].CanDelete + '" />';
            elem = elem + '<input type="hidden" name="CanManagePermissions" value="' + $(this)[0].CanManagePermissions + '" />';
            elem = elem + '<input type="hidden" name="NotifyOnDownload" value="' + $(this)[0].NotifyOnDownload + '" />';
            elem = elem + '<input type="hidden" name="NotifyOnUpload" value="' + $(this)[0].NotifyOnUpload + '" />';
            elem = elem + '<a href="javascript:void(0)" onclick="toggleUserPermissions(this)" class="">' + $(this)[0].Principal.FullName + '</a>';
            elem = elem + '</div>';

            $('.user-list .dynamic-user-list').append(elem);
        }
    });
}

function initControlButtons(isFolderSelected, isFileSelected) {
    $('.control-buttons button').each(function () {
        var permission = $(this).attr('permission');
        if (permission == "false") {
            $(this).removeClass('active').parent().attr('data-original-title', notPermitted).removeClass('grey');
        } else {
            if ($(this).attr('id') == 'btn-delete') {
                if (isFolderSelected || isFileSelected) {
                    $(this).addClass('active').parent().attr('data-original-title', deleteFolderMesssage).addClass('grey');
                } else {
                    $(this).removeClass('active').parent().attr('data-original-title', cannotDeleteMessage).removeClass('grey');
                }
            } else if ($(this).attr('id') == 'btn-download') {
                if (isFileSelected && !isFolderSelected) {
                    $(this).addClass('active').parent().attr('data-original-title', downloadFileMessage).addClass('grey');
                } else {
                    $(this).removeClass('active').parent().attr('data-original-title', cannotDownloadMessage).removeClass('grey');
                }
            } else if ($(this).attr('id') == 'btn-upload') {
                $(this).addClass('active').parent().attr('data-original-title', uploadFileMessage).addClass('grey');
            } else if ($(this).attr('id') == 'btn-addFolder') {
                $(this).addClass('active').parent().attr('data-original-title', addFolderMessage).addClass('grey');
            } else if ($(this).attr('id') == 'btn-folder-access') {
                $(this).addClass('active').parent().attr('data-original-title', folderPermissionMessage).addClass('grey');
            }
        }
    });
}

function subsribeToNewsBlog() {
    $('#NewsBlogSubscriptionForm').submit();
}

var showAjaxLoader = function () {
    $('.ajax-loader').removeClass('hidden');
}

function displayError(data) {
    $('.ajax-loader').addClass('hidden');
    $('.files-container').addClass('hidden');
    $('.modal').modal('hide');
    $('.error-container').removeClass('hidden');
    var elem = $('.error-container .alert-warning ul li');

    if (data == "ShareFileAuthFailed") {
        elem.html(shareFileAuthErrorMessage);
    } else if (data == "InvalidUserCredentials") {
        elem.html(invalidLoginCredentialsMessage);
    } else if (data == "InvalidEmailFormat") {
        elem.html(invalidEmailFormatMessage);
    } else {
        elem.html(data);
        $('.error-container form').addClass('hidden');
    }
}

var onAjaxError = function (data) {
    if (data.status == 500) {
        displayError(data.statusText);
    }
}

var securityLoginSuccess = function (data) {
    window.location.href = baseUrl + "/Files";
}

function submitResetFilesForm(folderId) {
    $('#resetFilesView #ItemId').val(folderId);
    $('#resetFilesView form').submit();
}

function resetFileUpload() {
    $('#btn-upload').removeClass('active-orange');
    $('.control-buttons button').removeClass('inactive');
    $('.files-panel .files-list').show();
    $('.panel-default.fileupload-area').hide();
    $('#btnUploadCancel').attr('file-uploaded', false).removeClass('hidden');
    $('#resetFilesView form').submit();
    $('#fileuploader').css('min-height', '456px');
}