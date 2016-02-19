(function() {
    'use strict';

    var path = require('path'),
        express = require('express'),
        bodyParser = require('body-parser');

    var routes = require('./server/routes');

    var app = express();

    app.set('views', path.join(__dirname, 'server', 'views'));
    app.set('view engine', 'jade');

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use('/', routes);

    app.use(function(req, res) {
        res.status(404);
        res.render('errors/404', {});
    });

    var server = app.listen(3000, '0.0.0.0', function () {
        var host = server.address().address;
        var port = server.address().port;

        console.log('listening at http://%s:%s', host, port);
    });
}).call(this);
