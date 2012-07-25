var socket;
$(document).ready(function() {
    var socketUri = 'http://' + location.hostname + ':' + '4242';
    socket = io.connect(socketUri);

    socket.on('remote-change', function(remote) {
        document.location = '/' + remote;
    });
});