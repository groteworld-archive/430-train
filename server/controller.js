(function() {
    var exports = {};

    exports.get = function(req, res) {
        res.render("index", {});
    };

    module.exports = exports;
}).call(this);
