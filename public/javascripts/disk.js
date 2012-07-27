function BreadCrumb() {
    return {
        parsePath: function(path) {
            if(path.trim() === '') return;

            var pathPart = path.split('\\');

            var $bcRoot = $('#bc-root');
            $bcRoot.text('');
            if(pathPart.length)
                $bcRoot.append('<a href="/disk">Disk</a> <span class="divider">/</span>').removeClass('active');
            else
                $bcRoot.append('Disk').addClass('active');

            var $bc = $('.breadcrumb');
            this.removeAllItemAfter('Disk');
            for(var i = 0; i < pathPart.length; i++) {
                var part = pathPart[i];

                if(i == pathPart.length - 1)
                    $bc.append('<li class="active" id="bc-root">' + part + '</li>');
                else
                    $bc.append('<li><a href="#">' + part + '<input type="hidden" value="' + pathPart.slice(0, i + 1).join('\\') + '"/></a> <span class="divider">/</span></li>')
            }
            $bc.find('a').click(function() {
                disk.listFolder($(this).children('input').val());
            });
        },
        removeItem: function(name) {
            $('.breadcrumb li:contains(' + name + ')').remove();
        },
        removeAllItemAfter: function(name) {
            $('.breadcrumb li:contains(' + name + ')').nextAll().remove();
        }
    }
};
$.breadcrumb = new BreadCrumb();

function Disk() {
    //constructor
    socket.on('disk-list', function(data) {
        var d = JSON.parse(data);

        var $disk = $('#disk');
        $disk.children().remove();

        $.breadcrumb.parsePath(d.path);

        var $row = undefined;
        for(var ii = 0; ii < d.items.length; ii++) {

            //create a row
            if($row == undefined) {
                $row = $('<div class="row"></div>');
                $disk.append($row);
            }

            //create a span3 item
            var item = d.items[ii];

            var $div = $('<div>');
            $div.addClass('span3');
            var $a = $('<a>');
            $a.attr('href', '#');
            $a.addClass('button-item');

            var $p = $('<p>' + item.name + '</p>');
            var $hidden = $('<input type="hidden" value="' + item.path + '"/>');
            var $img;

            if(item.type === 'drive')
                $img = $("<img src='/images/disk/HDD.png'>");
            else if(item.type === 'music')
                $img = $("<img src='/images/disk/music.png'>");
            else if(item.type === 'video') {
                $a.attr('href', '#div-vlc');
                $a.attr('rel', 'nyro');
                $img = $("<img src='/images/disk/video.png'>");
            }
            else if(item.type === 'folder')
                $img = $("<img src='/images/disk/folder.png'>");

            $a.append($img);
            $a.append($p);
            $a.append($hidden);
            $div.append($a);
            //create on item
            $row.append($div);

            if((ii + 1) % 4 == 0 && ii) //ii > 0
                $row = undefined;
        }

        $('.button-item:first').addClass('selected');

        $('a[rel^=nyro]').nyroModal({
            modal: true,
            showCloseButton: false,
            galleryCounts: false
        });

        $('a.button-item').on('click', function() {
            if($(this).attr('rel') === 'nyro') {
                var src = $a.children(':hidden').val();
                document.vlc.setAttribute('target', 'file:///' + src);
                remote.enableCross = false;
            }
            else {
                $.loadingStart();
                disk.$selected = $(this);
                disk.listFolder(disk.$selected.children('input').val());
            }
            return false;
        });

        $disk.fadeIn();

        $.loadingStop();

        $('html, body').animate({
            scrollTop: 0
        }, 'fast');
    });

    remote.onEnter = function($selected) {
        if(!$.nmTop())
            $selected.click();
    };

    remote.onReturn = function() {
        if($.nmTop()) {
            $.nmTop().close();
            remote.closeTime();
            remote.enableCross = true;
        }
        else {
            $.loadingStart();
            disk.$disk.fadeOut('normal', function() {
                var p = $('p.path').text();
                var sIndex = p.indexOf('\\');
                p = p.substr(0, sIndex);
                socket.emit('disk-list-folders', p);
            });
        }
    };

    remote.onPause = function() {
        if(document.vlc)
            document.vlc.playlist.togglePause();
    };

    remote.onPlay = function() {
        if(document.vlc)
            document.vlc.playlist.play();
    };

    remote.onMute = function() {
        if(document.vlc)
            document.vlc.audio.mute = true;
    };

    remote.onUnMute = function() {
        if(document.vlc)
            document.vlc.audio.mute = false;
    };

    remote.onFastBackward = function() {
        if(document.vlc)
            document.vlc.input.time -= 10000
    };

    remote.onFastForward = function() {
        if(document.vlc)
            document.vlc.input.time += 10000
    };

    remote.onFullscreen = function() {
        if(document.vlc)
            document.vlc.video.toggleFullscreen();
    };

    return {
        init: function() {
            $('#disk').before('<div class="span12" id="loadingVlc"><p>Loading VLC...<p/><div class="progress progress-danger progress-striped active"><div class="bar" style="width: 0%"></div></div></div>');
            $('#div-vlc').show().hide(); //tweak to load VLC active X
            $('#loadingVlc .bar').css('width', '100%');
            $('#loadingVlc').fadeOut();

            document.vlc.addEventListener('MediaPlayerOpening', function() { alert('open'); remote.openTime(document.vlc.input.length); });
            //document.vlc.attachEvent('MediaPlayerPositionChanged', function() { remote.setTime(document.vlc.input.length); })
            document.vlc.addEventListener('MediaPlayerEndReached', function() { remote.closeTime(); });
        },
        listDrives: function() {
            socket.emit('disk-list-drives');
        },
        listFolder: function(folder) {
            $('#disk').fadeOut('normal', function() {
                socket.emit('disk-list-folders', folder);
            });
        }
    };

    //socket.on('remote-cross-enter', function() {
    //    var $liSelected = $('li.selected');
    //    var $a = $liSelected.children('a[rel^=nyro]');
    //    if($a.length) {
    //        var src = $a.children(':hidden').val();
    //        document.vlc.setAttribute('target', 'file:///' + src);
    //        socket.emit('remote-change-remote', 'remote-player');
    //        $a.click();
    //    }
    //    else {
    //        $.loadingStart();
    //        $("#content").fadeOut('normal', function() {
    //            socket.emit('disk-list-folders', $('li.selected input').val());
    //        });
    //    }
    //});

    //remote.onEnter = function() {
    //    if($.nmTop()) {
    //        $.nmTop().close();
    //    }
    //    else {
    //        $.loadingStart();
    //        $("#content").fadeOut('normal', function() {
    //            var p = $('p.path').text();
    //            var sIndex = p.indexOf('\\');
    //            p = p.substr(0, sIndex);
    //            socket.emit('disk-list-folders', p);
    //        });
    //    }
    //};

    //remote.onRefresh = function() {
    //    $.loadingStart();
    //    $("#content").fadeOut('normal', function() {
    //        socket.emit('disk-list-folders', { path: $('p.path').text() });
    //    });
    //}

    //function scrollTo($item) {
    //    $('html, body').animate({
    //        scrollTop: $item.offset().top - $item.outerHeight(true) / 2
    //    }, 2000);
    //}

    //function findLiAt(position) {
    //    var $liSelected = $('.table li.selected');
    //    var liH = $liSelected.outerHeight(true);
    //    var posSelected = $liSelected.offset();

    //    var top;

    //    if(position === 'up')
    //        top = posSelected.top - document.body.scrollTop - (liH / 3);
    //    else
    //        top = posSelected.top + liH - document.body.scrollTop;

    //    return $(document.elementFromPoint(posSelected.left, top)).parent('li');
    //}
}

var disk = new Disk();

$(document).ready(function() {
    $.loadingStart();
    disk.init();
    disk.listDrives();
});