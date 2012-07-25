$(document).ready(function() {

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

    $('#cross-enter').click(function() {
        socket.emit('trueremote-cross-enter');
        return false;
    });

    $('#cross-return').click(function() {
        socket.emit('trueremote-cross-return');
        return false;
    });

    $('#cross-refresh').click(function() {
        socket.emit('trueremote-cross-refresh');
        return false;
    });
});