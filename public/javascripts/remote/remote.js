$(document).ready(function() {

    var socketUri = 'http://' + location.hostname + ':' + '4242';
    var socket = io.connect(socketUri);
    var $panels = $('.panel');
    $panels.css('top', $('table').offset().top);
    $panels.height($('table').outerHeight(true));

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

    $('#cross-up').tappable(function() {
        socket.emit('trueremote-cross-up');
        return false;
    });

    $('#cross-left').tappable(function() {
        socket.emit('trueremote-cross-left');
        return false;
    });

    $('#cross-down').tappable(function() {
        socket.emit('trueremote-cross-down');
        return false;
    });

    $('#cross-right').tappable(function() {
        socket.emit('trueremote-cross-right');
        return false;
    });

    $('#enter').tappable(function() {
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
        $(this).hide();
        $('#unmute').show();
        socket.emit('trueremote-mute');
        return false;
    });

    $('#unmute').tappable(function() {
        $(this).hide();
        $('#mute').show();
        socket.emit('trueremote-unmute');
        return false;
    });

});
