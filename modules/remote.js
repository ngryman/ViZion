Remote = function() {
    this.init = function(io) {
        this.io = io;
        this.io.sockets.on('connection', function(socket) {
            socket.on('trueremote-fastbackward', function() {
                socket.broadcast.emit('remote-fastbackward');
            });
            socket.on('trueremote-play', function() {
                socket.broadcast.emit('remote-play');
            });
            socket.on('trueremote-pause', function() {
                socket.broadcast.emit('remote-pause');
            });
            socket.on('trueremote-fastforward', function() {
                socket.broadcast.emit('remote-fastforward');
            });
            socket.on('trueremote-cross-up', function() {
                socket.broadcast.emit('remote-cross-up');
            });
            socket.on('trueremote-cross-left', function() {
                socket.broadcast.emit('remote-cross-left');
            });
            socket.on('trueremote-cross-down', function() {
                socket.broadcast.emit('remote-cross-down');
            });
            socket.on('trueremote-cross-right', function() {
                socket.broadcast.emit('remote-cross-right');
            });
            socket.on('trueremote-enter', function() {
                socket.broadcast.emit('remote-enter');
            });
            socket.on('trueremote-return', function() {
                socket.broadcast.emit('remote-return');
            });
            socket.on('trueremote-fullscreen', function() {
                socket.broadcast.emit('remote-fullscreen');
            });
            socket.on('trueremote-mute', function() {
                socket.broadcast.emit('remote-mute');
            });
            socket.on('trueremote-unmute', function() {
                socket.broadcast.emit('remote-unmute');
            });
            socket.on('remote-closetime', function() {
                socket.broadcast.emit('trueremote-closetime');
            });
            socket.on('remote-opentime', function(time) {
                console.log('opentime');
                socket.broadcast.emit('trueremote-opentime', time);
            });
        });
    };
    return this;
};

var remote = new Remote();

module.exports = remote;