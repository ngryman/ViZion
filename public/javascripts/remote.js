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
    this.openTime = function(lengthTime) { socket.emit('remote-opentime', lengthTime); };
    this.closeTime = function() { socket.emit('remote-closetime'); };

    function selectItemLR(position) {
        var indexSelected = $('a.selected').index('a:visible');

        if(position === 'right') {
            if(indexSelected < $('a:visible').length)
                indexSelected++;
        }
        else {
            indexSelected--;
            if(indexSelected < 0)
                indexSelected = 0;
        }

        $('a.selected').removeClass('selected');
        $('a:visible:eq(' + indexSelected + ')').addClass('selected');
    };

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

        var $selected = $('.selected');
        var offsetSelected = $selected.offset();
        offsetSelected.middle = offsetSelected.left + ($selected.outerWidth(true) / 2);

        var indexSelected = $('a.selected').index('a:visible');
        var $selectable = $('a:visible:gt(' + indexSelected + ')');

        //find closest down item
        var $toSelect, closestTop = 99999, closestLeft = 99999;
        for(var i = 0; i < $selectable.length; i++) {
            console.log(i);
            var $select = $($selectable[i]);
            var offset = $select.offset();

            if(offset.top <= offsetSelected.top)
                continue;

            var topDiff = offset.top - offsetSelected.top;
            offset.middle = offset.left + ($select.outerWidth(true) / 2);
            var leftDiff = Math.abs(offset.middle - offsetSelected.middle);

            if(topDiff < closestTop) {
                closestTop = topDiff;
                closestLeft = leftDiff;
                $toSelect = $select;
            }
            else if(topDiff == closestTop) {
                if(leftDiff < closestLeft) {
                    closestLeft = leftDiff;
                    $toSelect = $select;
                }
            }
        }

        if($toSelect) {
            $selected.removeClass('selected');
            $toSelect.addClass('selected');

            scrollTo($toSelect);
        }

        remote.onCrossDown();
    });

    function scrollTo($item) {
        $('html, body').animate({
            scrollTop: $item.offset().top - $item.outerHeight(true)
        }, 2000);
    }

    socket.on('remote-cross-up', function() {
        if(!remote.enableCross)
            return;

        var $selected = $('.selected');
        var offsetSelected = $selected.offset();
        offsetSelected.middle = offsetSelected.left + ($selected.outerWidth(true) / 2);
        offsetSelected.bottom = offsetSelected.top + $selected.outerHeight(true);

        var indexSelected = $('a.selected').index('a:visible');
        var $selectable = $('a:visible:lt(' + indexSelected + ')');

        //find closest up item
        var $toSelect, closestBottom = 99999, closestLeft = 99999;
        for(var i = $selectable.length - 1; i >= 0; i--) {
            var $select = $($selectable[i]);
            var offset = $select.offset();
            offset.bottom = offset.top + $select.outerHeight(true);

            if(offset.bottom >= offsetSelected.bottom)
                continue;

            var bottomDiff = offsetSelected.bottom - offset.bottom;

            if(bottomDiff < closestBottom) {
                closestBottom = bottomDiff;
                $toSelect = $select;
            }
            else if(bottomDiff == closestBottom) {
                offset.middle = offset.left + ($select.outerWidth(true) / 2);
                var leftDiff = Math.abs(offsetSelected.middle - offset.middle);
                if(leftDiff < closestLeft) {
                    closestLeft = leftDiff;
                    $toSelect = $select;
                }
            }
        }

        if($toSelect) {
            $selected.removeClass('selected');
            $toSelect.addClass('selected');

            scrollTo($toSelect);
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
