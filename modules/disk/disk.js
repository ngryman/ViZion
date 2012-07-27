function Disk() {

    //constructor
    this.init = function(io, remote) {
        this.io = io;
        this.util = require('util');
        this.fs = require('fs');
        this.path = require('path');
        this.DirectoryNS = require('./directory.js');

        this.io.sockets.on('connection', function(socket) {

            socket.on('disk-list-drives', listDrives);
            socket.on('disk-list-folders', listFolders);

            function listDrives() {

                require('child_process').exec("wmic logicaldisk get name, volumename", function(error, stdout, stderr) {
                    var entries = stdout.split('\r\n');
                    var dirItems = new Array();
                    for(var ei in entries) {
                        var entry = entries[ei];

                        if(entry.indexOf(':') == -1)
                            continue;

                        try {
                            var entryInfo = entry.split(':');
                            var letter = entryInfo[0].trim() + ':';

                            if(disk.fs.readdirSync(letter).length) {
                                var name = entryInfo[1].trim();
                                dirItems.push(new disk.DirectoryNS.DirectoryItem(disk.util.format('%s (%s)', name, letter), letter, "drive"));
                            }
                        }
                        catch(err) {
                            continue;
                        }
                    }
                    var directory = new disk.DirectoryNS.DirectoryInfo('', dirItems);
                    socket.emit('disk-list', JSON.stringify(directory));
                });
            }

            function isMusic(file) {
                return /.mp3/i.test(file);
            }

            function isVideo(file) {
                return /.avi|.mp4|.mkv/i.test(file);
            }

            function listFolders(folder) {

                if(folder.trim() === '')
                    return listDrives();
                disk.fs.readdir(folder, function(err, items) {

                    var dirItems = new Array();

                    for(var ii in items) {
                        var item = items[ii];
                        var path = disk.path.join(folder, item);

                        try {
                            fstat = disk.fs.statSync(path);
                        }
                        catch(err) {
                            continue;
                        }

                        if(fstat.isDirectory())
                            dirItems.push(new disk.DirectoryNS.DirectoryItem(item, path, "folder"));
                        else if(isMusic(item))
                            dirItems.push(new disk.DirectoryNS.DirectoryItem(item, path, "music"));
                        else if(isVideo(item))
                            dirItems.push(new disk.DirectoryNS.DirectoryItem(item, path, "video"));
                    }

                    var directory = new disk.DirectoryNS.DirectoryInfo(folder, dirItems);
                    socket.emit('disk-list', JSON.stringify(directory));
                });
            }
        });
    }

    return this;
};

var disk = new Disk();
module.exports = disk;