Remote = function() {
    //constructor
    this.currentRemote = '';
    this.changeRemote = function(newRemote) {
        remote.currentRemote = newRemote;
    };
    this.init = function(io) {
        this.io = io;
        this.io.sockets.on('connection', function(socket) {
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
            socket.on('trueremote-cross-enter', function() {
                socket.broadcast.emit('remote-cross-enter');
            });
            socket.on('trueremote-cross-return', function() {
                socket.broadcast.emit('remote-cross-return');
            });
            socket.on('trueremote-cross-refresh', function() {
                socket.broadcast.emit('remote-cross-refresh');
            });
            socket.on('trueremote-which', function() {
                socket.emit('remote-change', remote.currentRemote);
            });
            socket.on('remote-change-remote', function(changeRemote) {
                remote.currentRemote = changeRemote;
                socket.broadcast.emit('remote-change', remote.currentRemote);
            });
        });
    };
    return this;
};

var remote = new Remote();

module.exports = remote;