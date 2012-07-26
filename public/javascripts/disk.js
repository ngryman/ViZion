function BreadCrumb() {

    function join() {
        
    }

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
                    $bc.append('<li><a href="#">' + part + '<input type="hidden" value="' + pathPart.slice(0,i+1).join('\\') + '"/></a> <span class="divider">/</span></li>')
            }
        },
        //addItem: function(name) {
        //    if(name.trim() === '')
        //        return;

        //    var $bc = $('.breadcrumb');
        //    var $lastLi = $bc.children('li:last');
        //    if($lastLi[0].id === 'bc-root') {
        //        $bc.append('<li id="bc-root"></li>');
        //        $lastLi.remove();
        //    }

        //    $('.breadcrumb').append('<li class="active">' + name + '</li></li>');
        //},
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
    this.$disk = {};

    socket.on('disk-list', function(data) {
        var d = JSON.parse(data);

        disk.$disk.children('div').remove();

        $.breadcrumb.parsePath(d.path);

        for(var ii in d.items) {
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

            disk.$disk.append($div);
        }

        $('.button-item:first').addClass('selected');

        $('a[rel^=nyro]').nyroModal({
            modal: true,
            showCloseButton: false,
            galleryCounts: false
        });

        $('a.button-item').on('click', function() {
            $.loadingStart();
            disk.$selected = $(this);
            disk.$disk.fadeOut('normal', function() {
                disk.listFolder(disk.$selected.children('input').val());
            });
            return false;
        });

        disk.$disk.fadeIn();

        $.loadingStop();

        $('html, body').animate({
            scrollTop: 0
        }, 'fast');
    });

    remote.onEnter = function($selected) {
        $selected.click();
    };

    remote.onReturn = function() {
        $.loadingStart();
        disk.$disk.fadeOut('normal', function() {
            var p = $('p.path').text();
            var sIndex = p.indexOf('\\');
            p = p.substr(0, sIndex);
            socket.emit('disk-list-folders', p);
        });
    }

    return {
        init: function() {
            this.$disk = $('#disk');
        },
        listDrives: function() {
            socket.emit('disk-list-drives');
        },
        listFolder: function(folder) {
            socket.emit('disk-list-folders', folder);
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
    socket.emit('remote-change-remote', 'remote-nav');
});