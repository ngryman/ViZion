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

function addEvent(obj, name, func) {
    if(window.addEventListener) {
        obj.addEventListener(name, func, false);
    } else {
        obj.attachEvent("on" + name, func);
    }
}

function VLC() {
    //constructor
    this.vlc = document.vlc;
    this.onLoadError = function() { };
    this.onLoadSuccess = function() { };

    return {
        _loaderVlc: function(percent) {
            if(this._$loaderVlc == undefined) {
                this._$loaderVlc = $('#loadingVlc');
                this._loaderVlcValue = this._$loaderVlc.find('.bar');
            }

            this._loaderVlcValue.css('width', percent + '%');

            if(percent >= 100) {
                this._$loaderVlc.fadeOut();
            }
        },
        _dispatchVlcEvent: function() {
            var vlcState = document.vlc.state;
            var ret = '';

            if(document.vlc.libvlc_Opening == vlcState) {
                ret = "Opening";
            } else if(document.vlc.libvlc_Buffering == vlcState) {
                ret = "Buffering";
            } else if(document.vlc.libvlc_Playing == vlcState) {
                ret = "Playing";
            } else if(document.vlc.libvlc_Paused == vlcState) {
                ret = "Paused";
            } else if(document.vlc.libvlc_Stopped == vlcState) {
                ret = "Stopped";
            } else if(document.vlc.libvlc_Ended == vlcState) {
                ret = "Ended";
            } else if(document.vlc.libvlc_Error == vlcState) {
                ret = "Error";
            }
        },
        init: function() {
            $('#disk').before('<div class="span12" id="loadingVlc"><p>Loading VLC...<p/><div class="progress progress-danger progress-striped active"><div class="bar" style="width: 0%"></div></div></div>');

            this._loaderVlc(10);

            $('#div-vlc').show();
            if(document.vlc.version == undefined) {
                this.onLoadError();
                $('#div-vlc').hide();
                this._loaderVlc(100);
            }
            else {
                $('#div-vlc').hide();
                $.loadingStart();

                addEvent(document.vlc, 'Play', this._dispatchVlcEvent);
                addEvent(document.vlc, 'Pause', this._dispatchVlcEvent);
                addEvent(document.vlc, 'Stop', this.dispatchVlcEvent);
                addEvent(document.vlc, 'MediaPlayerNothingSpecial', this._dispatchVlcEvent);
                addEvent(document.vlc, 'MediaPlayerOpening', this._dispatchVlcEvent);
                addEvent(document.vlc, 'MediaPlayerBuffering', this._dispatchVlcEvent);
                addEvent(document.vlc, 'MediaPlayerPlaying', this._dispatchVlcEvent);
                addEvent(document.vlc, 'MediaPlayerPaused', this._dispatchVlcEvent);
                addEvent(document.vlc, 'MediaPlayerStopped', this._dispatchVlcEvent);
                addEvent(document.vlc, 'MediaPlayerEnded', this._dispatchVlcEvent);
                addEvent(document.vlc, 'MediaPlayerError', this._dispatchVlcEvent);

                this.onLoadSuccess();

                $('#div-novlc').remove();
                $('#loadingVlc').remove();

                this._loaderVlc(100);
            }
        },
        pause: function() { if(document.vlc.playlist) document.vlc.playlist.togglePause(); },
        play: function() { if(document.vlc.playlist) document.vlc.playlist.play(); },
        stop: function() { if(document.vlc.playlist) document.vlc.playlist.stop(); },
        mute: function() { if(document.vlc.audio) document.vlc.audio.mute = true; },
        unMute: function() { if(document.vlc.audio) document.vlc.audio.mute = false; },
        fastBackward: function() { if(document.vlc.input) document.vlc.input.time -= 10000; },
        fastForward: function() { if(document.vlc.input) document.vlc.input.time += 10000; },
        toggleFullscreen: function() { if(document.vlc.video) document.vlc.video.toggleFullscreen(); }
    }
}
var vlc = new VLC();

function Disk() {
    //constructor
    socket.on('disk-list', function(data) {
        var d = JSON.parse(data);

        var $disk = $('#disk');
        var $row = $disk.children('.row');

        $row.children().remove();

        $.breadcrumb.parsePath(d.path);

        for(var ii = 0; ii < d.items.length; ii++) {
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
                $a.attr('rel', 'video');
                $img = $("<img src='/images/disk/video.png'>");
            }
            else if(item.type === 'folder')
                $img = $("<img src='/images/disk/folder.png'>");

            $a.append($img);
            $a.append($p);
            $a.append($hidden);
            $div.append($a);

            $row.append($div);
        }

        $('.button-item:first').addClass('selected');

        $('a.button-item').on('click', function() {
            if($(this).attr('rel') === 'video') {
                var src = $a.children(':hidden').val();
                document.vlc.setAttribute('target', 'file:///' + src);
                $.fancybox({ href: '#div-vlc', title: src, autosize: true });
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
        if(!$.fancybox.isOpen)
            $selected.click();
    };

    remote.onReturn = function() {
        if($.fancybox.isOpen) {
            vlc.stop();
            $.fancybox.close();
            remote.closeTime();
            remote.enableCross = true;
        } else {
            var path = $('.breadcrumb input:last').val();
            if(path) {
                $.loadingStart();
                $('#disk').fadeOut('normal', function() {
                    socket.emit('disk-list-folders', path);
                });
            }
            else {
                var $a = $('.breadcrumb a:last');
                window.location = $a.attr('href');
            }
        }
    };

    remote.onPause = function() {
        vlc.pause();
    };

    remote.onPlay = function() {
        vlc.play();
    };

    remote.onMute = function() {
        vlc.mute();
    };

    remote.onUnMute = function() {
        vlc.unMute();
    };

    remote.onFastBackward = function() {
        vlc.fastBackward();
    };

    remote.onFastForward = function() {
        vlc.fastForward();
    };

    remote.onFullscreen = function() {
        vlc.toggleFullscreen();
    };

    remote.onSearch = function() {
        $('#search').toggle('blind');
    };

    remote.onSearchItem = function(item) {
        $('#searchInput').val(item);
        $('.button-item').removeClass('selected');
        if(item.trim() === '') {
            $('.button-item').show().first().addClass('selected');
        }
        else {
            $('.button-item').not(':contains(' + item + ')').hide();
            $('.button-item:contains(' + item + ')').show().first().addClass('selected');
        }
    };

    return {
        listDrives: function() {
            socket.emit('disk-list-drives');
        },
        listFolder: function(folder) {
            $('#disk').fadeOut('normal', function() {
                socket.emit('disk-list-folders', folder);
            });
        }
    };
}
var disk = new Disk();

$(document).ready(function() {
    vlc.onLoadError = function() { $('#div-novlc').show(); };
    vlc.onLoadSuccess = function() { disk.listDrives(); };
    vlc.init();
});