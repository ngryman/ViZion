$(document).ready(function() {

    var socketUri = 'http://' + location.hostname + ':' + '4242';
    var socket = io.connect(socketUri);

    var $panels = $('.panel');
    $panels.css('top', $('.cross').offset().top);
    $panels.height($('.cross').outerHeight(true));

    socket.on('trueremote-opentime', function(totalTime) {
        $('#total-time').text(totalTime);
        $time.show('clip');
    });

    socket.on('trueremote-settime', function(time) {
        $('#time').text(time);
        $time.show('clip');
    });

    socket.on('trueremote-closetime', function() {
        $time.hide('clip');
    });

    $('#fb').tappable(function() {
        socket.emit('trueremote-fastbackward');
        return false;
    });

    $('#play').tappable(function() {
        socket.emit('trueremote-play');
        return false;
    });

    $('#pause').tappable(function() {
        socket.emit('trueremote-pause');
        return false;
    });

    $('#ff').tappable(function() {
        socket.emit('trueremote-fastforward');
        return false;
    });

    $('#up').tappable(function() {
        socket.emit('trueremote-cross-up');
        return false;
    });

    $('#left').tappable(function() {
        socket.emit('trueremote-cross-left');
        return false;
    });

    $('#down').tappable(function() {
        socket.emit('trueremote-cross-down');
        return false;
    });

    $('#right').tappable(function() {
        socket.emit('trueremote-cross-right');
        return false;
    });

    $('#ok').tappable(function() {
        socket.emit('trueremote-enter');
        return false;
    });

    $('#return').tappable(function() {
        socket.emit('trueremote-return');
        return false;
    });

    $('#search').tappable(function() {
        $('#search-panel').toggle('clip');
        socket.emit('trueremote-search');

        var $input = $('#searchInput:visible');
        //$input.focus(); //TODO: Fix that, focus on input after open
        $input.val('');
        $input.keyup(function() {
            socket.emit('trueremote-searchitem', $input.val());
        });
        return false;
    });

    $('#fs').tappable(function() {
        socket.emit('trueremote-fullscreen');
        return false;
    });

    $('#mute').tappable(function() {
        var $this = $(this);
        $this.toggleClass('on').toggleClass('off');
        console.log($this.hasClass('on'), $this.hasClass('off'));
        socket.emit($this.hasClass('on') ? 'trueremote-mute' : 'trueremote-unmute');
        return false;
    });
});

$(window).load(function() {
    setTimeout(scrollTo, 100, 0, 1);
});
