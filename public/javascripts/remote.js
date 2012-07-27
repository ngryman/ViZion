Remote = function() {
    //constructor
    this.onFastBackward = function() { };
    this.onPlay = function() { };
    this.onPause = function() { };
    this.onFastForward = function() { };
    this.onCrossRight = function() { };
    this.onCrossLeft = function() { };
    this.onCrossDown = function() { };
    this.onCrossUp = function() { };
    this.onEnter = function($selected) {
        var href = $selected.attr('href').trim();
        if(href != '' && href != '#')
            window.location = href;
        else
            $selected.click();
    };
    this.onReturn = function() { };
    this.onFullscreen = function() { };
    this.onMute = function() { };
    this.onUnMute = function() { };
    this.enableCross = true;

    function selectItemLR(position) {
        var indexSelected = $('a.selected').index('a');

        if(position === 'right') {
            if(indexSelected < $('a').length)
                indexSelected++;
        }
        else {
            indexSelected--;
            if(indexSelected < 0)
                indexSelected = 0;
        }

        $('a.selected').removeClass('selected');
        $('a:eq(' + indexSelected + ')').addClass('selected');
    }

    socket.on('remote-fastbackward', function() {
        remote.onFastBackward();
    });

    socket.on('remote-play', function() {
        remote.onPlay();
    });

    socket.on('remote-pause', function() {
        remote.onPause();
    });

    socket.on('remote-fastforward', function() {
        remote.onFastForward();
    });

    socket.on('remote-cross-right', function() {
        if(!remote.enableCross)
            return;
        selectItemLR('right');
        remote.onCrossRight();
    });

    socket.on('remote-cross-left', function() {
        if(!remote.enableCross)
            return;
        selectItemLR('left');
        remote.onCrossLeft();
    });

    socket.on('remote-cross-down', function() {
        if(!remote.enableCross)
            return;
        var $liSelected = $('.table li.selected');

        var $li = findLiAt('down');

        if($li.length) {
            $liSelected.removeClass('selected');
            $li.addClass('selected');
            scrollTo($li);
        }

        remote.onCrossDown();
    });

    socket.on('remote-cross-up', function() {
        if(!remote.enableCross)
            return;
        var $liSelected = $('.table li.selected');

        var $li = findLiAt('up');

        if($li.length) {
            $liSelected.removeClass('selected');
            $li.addClass('selected');
            scrollTo($li);
        }

        remote.onCrossUp();
    });

    socket.on('remote-enter', function() {
        remote.onEnter($('a.selected'));
    });

    socket.on('remote-return', function() {
        remote.onReturn();
    });

    socket.on('remote-fullscreen', function() {
        remote.onFullscreen();
    });

    socket.on('remote-mute', function() {
        remote.onMute();
    });

    socket.on('remote-unmute', function() {
        remote.onUnMute();
    });

    return this;
}

remote = window.remote || new Remote();
