$(document).ready(function() {

    var socketUri = 'http://' + location.hostname + ':' + '4242';
    var socket = io.connect(socketUri);
    var $time = $('#time-panel');
    $time.css('top', $('.row:first').outerHeight(true));

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

    $('#fb').click(function() {
        socket.emit('trueremote-fastbackward');
        return false;
    });

    $('#play').click(function() {
        socket.emit('trueremote-play');
        return false;
    });

    $('#pause').click(function() {
        socket.emit('trueremote-pause');
        return false;
    });

    $('#ff').click(function() {
        socket.emit('trueremote-fastforward');
        return false;
    });

    $('#cross-up').click(function() {
        socket.emit('trueremote-cross-up');
        return false;
    });

    $('#cross-left').click(function() {
        socket.emit('trueremote-cross-left');
        return false;
    });

    $('#cross-down').click(function() {
        socket.emit('trueremote-cross-down');
        return false;
    });

    $('#cross-right').click(function() {
        socket.emit('trueremote-cross-right');
        return false;
    });

    $('#enter').click(function() {
        socket.emit('trueremote-enter');
        return false;
    });

    $('#return').click(function() {
        socket.emit('trueremote-return');
        return false;
    });

    $('#kb').click(function() {
        alert('not yet implemented');
        return false;
    });

    $('#fs').click(function() {
        socket.emit('trueremote-fullscreen');
        return false;
    });

    $('#mute').click(function() {
        $(this).hide();
        $('#unmute').show();
        socket.emit('trueremote-mute');
        return false;
    });

    $('#unmute').click(function() {
        $(this).hide();
        $('#mute').show();
        socket.emit('trueremote-unmute');
        return false;
    });

});