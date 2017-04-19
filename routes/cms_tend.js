var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var Q = require('q');
var redis = require("redis");

var cd = require('./cms_circuit_device');

var get_tend_q = function (sensor_code, callback) {
    var deffered = Q.defer();
    mongoHelp.mongoInit("cms_tend", function (err, collection) {
        collection.find({ "sensor_code": sensor_code }).toArray(function (err, doc) {
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

var test = function (testtag, callback) {
    var client = redis.createClient(19000, "hao.oudot.cn");
    client.on("error", function (err) {
        console.log("Error " + err);
    });
    var deffered = Q.defer();
    client.keys(testtag, function (err, replies) {

        console.log("last");
        console.dir(replies);
        deffered.resolve(replies);
    });
    return deffered.promise.nodeify(callback);
}

router.get('/teststatus/:d', function (req, res) {
    
    var promise = test("cms:turbineStatus:*");
    promise.then(function (data) {
        var m = data.map(function (d) {
            return d.split("Status:")[1];
        })
        var am = m.map(function (tag) {
            return cd.deviceHelp.get_turbine_status_all_q(tag).then(function (da) {
                return da;

            });
        });

        Q.all(am).then(function (ov) {

            var result = {};
            ov.map(function (md) {

                for (var key in md) {
                    result[key] = md[key];
                }
            });
            var temp ={
                data: data,
                m: m,
                da: result
            };
            res.send(result
            );
        });
    });
});

router.get('/testtinfo/:d', function (req, res) {
    
    var promise = test("cms:turbineData:*");
    promise.then(function (data) {
        var m = data.map(function (d) {
            return d.split("turbineData:")[1];
        })
        var am = m.map(function (tag) {
            return cd.deviceHelp.get_turbine_data_q(tag).then(function (da) {
                da.tag = tag
                return da;

            });
        });

        Q.all(am).then(function (ov) {

            var result = {};
            ov.map(function (md) {
                result[md.tag] = md;
            });
            var temp ={
                data: data,
                m: m,
                da: result
            };
            res.send(result
            );
        });
    });
});

router.get('/testsinfo/:d', function (req, res) {
    
    var promise = test("cms:senorData:*");
    promise.then(function (data) {
        var m = data.map(function (d) {
            return d.split("senorData:")[1];
        })
        var am = m.map(function (tag) {
            return cd.deviceHelp.get_sensor_data_q(tag).then(function (da) {
                da.tag = tag
                return da;

            });
        });

        Q.all(am).then(function (ov) {

            var result = {};
            ov.map(function (md) {
                result[md.tag] = md;
            });
            var temp ={
                data: data,
                m: m,
                da: result
            };
            res.send(result
            );
        });
    });
});

module.exports = router;
