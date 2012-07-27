$(document).ready(function() {

    var socketUri = 'http://' + location.hostname + ':' + '4242';
    var socket = io.connect(socketUri);

    $('#fb').click(function() {
        socket.emit('trueremote-fastforward');
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
        socket.emit('trueremote-keyboard');
        return false;
    });

    $('#mute').click(function() {
        socket.emit('trueremote-mute');
        return false;
    });

});