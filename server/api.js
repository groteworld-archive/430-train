(function() {
    var fs = require('fs');
    var exec = require('child_process').exec;
    var dateFormat = require('dateformat');
    var bcrypt = require('bcrypt-nodejs');
    var pkg = require('../package.json');

    var exports = {};

    exports.getVersion = function(req, res) {
        res.json({version: pkg.version});
    };

    exports.getDistances = function(req, res) {
        var data = JSON.parse(fs.readFileSync('./server/data.json', 'utf8'));

        res.json(data.distances);
    };

    exports.getTimes = function(req, res) {
        var data = JSON.parse(fs.readFileSync('./server/data.json', 'utf8'));

        res.json(data.times);
    };

    exports.getTime = function(req, res) {
        var data = JSON.parse(fs.readFileSync('./server/data.json', 'utf8'));
        var val = data.times[req.params.time];

        if (val) {
            var rtn = {};
            rtn[req.params.time] = val;

            res.json(rtn);
        } else {
            res.status(404).json({ error: 'Not Found' });
        }
    };

    exports.getTimeRange = function(req, res) {
        var data = JSON.parse(fs.readFileSync('./server/data.json', 'utf8'));

        try {

            var rtn = {};

            for (var rec in data.times) {
                if (parseInt(rec) >= parseInt(req.params.fromTime) &&
                    parseInt(rec) <= parseInt(req.params.toTime))
                    rtn[rec] = data.times[rec];
            }

            res.json(rtn);
        } catch (e) {
            res.status(404).json({ error: 'Not Found' });
        }
    };

    exports.postTimes = function(req, res) {
        var rtn = JSON.parse(fs.readFileSync('./server/data.json', 'utf8'));
        if (bcrypt.compareSync(req.body.password, process.env.TRAIN_PASSWORD_HASH)) {
            var now = new Date();
            var timeInt = parseInt(dateFormat(now, 'HMM'));
            // TODO: remove `true`, which is there for demo purposes.
            // if after 3:45PM and before 5:15PM
            if (true || timeInt > 1545 && timeInt < 1715) {
                rtn.times[dateFormat(now, 'yyyymmdd')] = dateFormat(now, 'h:MM:ss TT');

                fs.writeFileSync('./server/data.json', JSON.stringify(rtn));

                exec('git add ./server/data.json', function(error) {
                    if (!error) {
                        exec('git commit -m ":train: Train Time! :train:"', function(err) {
                            if (!err) {
                                exec('git push https://groteworld:'+process.env.GITHUB_PAT+'@github.com/groteworld/430-train.git master',function(er){
                                    if (!er) {
                                        console.log('success');
                                    }
                                });
                            }
                        });
                    }
                });

                res.json(rtn);
            } else {
                res.status(418).json({ error: 'I\'m a teapot' });
            }
        } else {
            res.status(401).json({ error: 'Incorrect Password' });
        }
    };

    module.exports = exports;
}).call(this);
