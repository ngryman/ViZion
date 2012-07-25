
/*
* GET home page.
*/

exports.index = function(req, res) {

    var ua = req.headers['user-agent'];

    if(/mobile/i.test(ua))
        return exports.remote(req, res);

    var model = {
        title: '',
        description: 'Enjoy your multimedia.'
    };

    res.render('index', { modelview: model })
};

exports.disk = function(req, res) {

    var model = {
        title: 'Disk',
        navSelect: 'disk',
        description: 'Explore your drives and read movies, musics and photos.'
    };

    res.render('disk', { modelview: model });
}

exports.remote = function(req, res) {
    res.render('remote', { layout: 'remote-layout' });
}

exports.remotenav = function(req, res) {
    res.render('remote-nav', { layout: 'remote-layout' });
}

exports.remoteplayer = function(req, res) {
    res.render('remote-player', { layout: 'remote-layout' });
}