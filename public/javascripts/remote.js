Remote = function() {
    //constructor
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
    this.onRefresh = function() { };

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

    socket.on('remote-cross-right', function() {
        selectItemLR('right');
        remote.onCrossRight();
    });

    socket.on('remote-cross-left', function() {
        selectItemLR('left');
        remote.onCrossLeft();
    });

    socket.on('remote-cross-down', function() {
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
        var $liSelected = $('.table li.selected');

        var $li = findLiAt('up');

        if($li.length) {
            $liSelected.removeClass('selected');
            $li.addClass('selected');
            scrollTo($li);
        }

        remote.onCrossUp();
    });

    socket.on('remote-cross-enter', function() {
        remote.onEnter($('a.selected'));
    });

    socket.on('remote-cross-refresh', function() {
        remote.onRefresh();
    });

    return this;
}

remote = window.remote || new Remote();
