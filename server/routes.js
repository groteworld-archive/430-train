(function() {
    'use strict';

    var express = require('express');
    var router = express.Router();

    var view = require('./controller');
    var api = require('./api');

    // View Routes
    router.get('/', view.get);

    // API Routes
    router.get('/api/version', api.getVersion);
    router.get('/api/times/', api.getTimes);
    router.get('/api/times/:time', api.getTime);
    router.get('/api/times/:fromTime/:toTime', api.getTimeRange);
    router.post('/api/times/', api.postTimes);

    module.exports = router;
}).call(this);
