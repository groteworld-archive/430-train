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

    exports.getTimes = function(req, res) {
        var data = JSON.parse(fs.readFileSync('./server/data.json', 'utf8'));

        res.json(data);
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
            if (!(data.times[req.params.fromTime]) || !(data.times[req.params.toTime]))
                throw Error;

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
            // if after 3:00PM and before 6:00PM
            if (timeInt > 1500 && timeInt < 1800) {
                rtn.times[dateFormat(now, 'yyyymmdd')] = dateFormat(now, 'h:MM:ss TT');

                fs.writeFileSync('./server/data.json', JSON.stringify(rtn));

                // exec('git add ./server/data.json', function(error) {
                //     if (!error) {
                //         exec('git commit -m ":train: There was a train today. :train:"', function(err) {
                //             if (!err) {
                //                 exec('git push https://groteworld:'+process.env.GITHUB_PAT+'@github.com/groteworld/430-train.git master',function(er){
                //                     if (!er) {
                //                         console.log('success');
                //                     }
                //                 });
                //             }
                //         });
                //     }
                // });

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
