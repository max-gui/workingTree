var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var Q = require('q');
var redis = require("redis");

var get_tend_q = function (sensor_code, callback) {
    var deffered = Q.defer();
    mongoHelp.mongoInit("cms_tend", function (err, collection) {
        collection.find({"sensor_code": sensor_code}).toArray(function (err, doc) {
            var result = new Object();
            //assert.equal(err, null);
            //assert.equal(doc.length, 1);
            if (doc != null) {
                console.log("in true");
                console.dir(doc[0]);
                result.data = doc[0];
                result.message = "founded"
            } else {
                console.log("in else");
                result.message = "nothing was found";
            }

            deffered.resolve(result);
            //res.send(result);
        })
    });
    return deffered.promise.nodeify(callback);
};

var get_tend_xy_q = function (sensor_code, callback) {
    return get_tend_q(sensor_code).then(function (sensor_data) {
        var rd = sensor_data.data.tend.reduce(function (acc, t) {
            acc.x.push(t.sample_time);
            acc.y.push(t.RMS);

            return acc;
        }, {
            x: [],
            y: []
        });

        return rd;
    });
};

router.get('/:sensor_code', function (req, res) {
    // console.log(sensor_code);
    // var promise = get_tend_q(req.params.sensor_code);
    // promise.then(function (data) {
    //     res.send(data);

    // });

    var promise = get_tend_xy_q(req.params.sensor_code);
    promise.then(function (data) {
        res.send(data);

    });
});

module.exports = router;