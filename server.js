
/**
* Module dependencies.
*/

var express = require('express')
  , routes = require('./routes')
  , disk = require('./modules/disk/disk.js')
  , remote = require('./modules/remote.js')
  , io = require('socket.io').listen(4242);

var app = module.exports = express.createServer();

// Configuration

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));

    app.helpers({
        renderStyleSheetTags: function(all) {
            if(all != undefined) {
                return all.map(function(stylesheet) {
                    return '<link href="/stylesheets' + stylesheet + '" rel="stylesheet" type="text/css">';
                }).join('\n ');
            }
            else {
                return '';
            }
        },
        renderScriptsTags: function(all) {
            if(all != undefined) {
                return all.map(function(script) {
                    return '<script src="/javascripts' + script + '"></script>';
                }).join('\n ');
            }
            else {
                return '';
            }
        }
    });

    app.dynamicHelpers({
        scripts: function(req, res) {
            return [];
        },
        stylesheets: function(req, res) {
            return [];
        }
    });

});

// Routes

app.get('/', routes.index);
app.get('/disk', routes.disk);

app.get('/remote', routes.remote);

io.set("log level", 1);

remote.init(io);
disk.init(io, remote);

app.listen(3000);
console.log("info: ViZion server listening on port %d", app.address().port);
