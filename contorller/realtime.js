var redis = require('./redis_help');
var Q = require('q');
var io = require('../config/websocket');
var circuit_device = require('./cms_circuit_device');

var get_teststatus = function (req, res) {

    var promise = redis.test("cms:turbineStatus:*");
    return promise.then(function (data) {
        var m = data.map(function (d) {
            return d.split("Status:")[1];
        })
        var am = m.map(function (tag) {
            return circuit_device.deviceHelp.get_turbine_status_all_q(tag).then(function (da) {
                return da;

            });
        });

        return Q.all(am).then(function (ov) {

            var result = {};
            ov.map(function (md) {

                for (var key in md) {
                    result[key] = Math.floor((Math.random() * 5) + 0);//md[key];
                }
            });
            var temp = {
                data: data,
                m: m,
                da: result
            };
            return result;
        });
    });
};

var get_testtinfo = function (req, res) {

    var promise = redis.test("cms:turbineData:*");
    return promise.then(function (data) {
        var m = data.map(function (d) {
            return d.split("turbineData:")[1];
        })
        var am = m.map(function (tag) {
            return circuit_device.deviceHelp.get_turbine_data_q(tag).then(function (da) {
                da.tag = tag
                // da.power_factor = Math.floor((Math.random() * 20) + -10)
                return da;

            });
        });

        return Q.all(am).then(function (ov) {

            var result = {};
            ov.map(function (md) {
                var tagTmp = md.tag;
                delete md.tag;
                result[tagTmp] = md;
                for (var key in result[tagTmp]) {
                    result[tagTmp][key] = JSON.parse(result[tagTmp][key])
                }
                // result[md.tag] = JSON.parse()
            });
            var temp = {
                data: data,
                m: m,
                da: result
            };
            return result;
        });
    });
}

var get_testsinfo = function (req, res) {

    var promise = redis.test("cms:senorData:*");
    return promise.then(function (data) {
        var m = data.map(function (d) {
            return d.split("senorData:")[1];
        })
        var am = m.map(function (tag) {
            return circuit_device.deviceHelp.get_sensor_data_q(tag).then(function (da) {
                da.tag = tag
                da.J_BPFI = Math.floor((Math.random() * 101) + 0)
                return da;

            });
        });

        return Q.all(am).then(function (ov) {

            var result = {};
            ov.map(function (md) {
                result[md.tag] = md;
            });
            var temp = {
                data: data,
                m: m,
                da: result
            };
            return result;
        });
    });
}

var realtime = {
    refresh: function () {
        setInterval(function () {
            //var tt =io.sockets.clients().connected.keys;
            //Object.keys(io.sockets.clients().connected).length != 0)///.connected == {});
            if (Object.keys(io.sockets.clients().connected).length != 0)///.connected == {});
            {
                // console.dir(io.sockets.clients().connected.length);
                var promise = get_teststatus();//deviceTag
                promise.then(function (data) {
                    console.log(data);
                    io.emit('cms_status_info', data);
                });

                var promise2 = get_testsinfo();//wfid
                promise2.then(function (data) {
                    console.log(data);
                    io.emit('cms_sensor_info', data);
                });

                var promise3 = get_testtinfo();//wfid
                promise3.then(function (data) {
                    console.log(data);
                    io.emit('cms_turbine_info', data);
                });
            }
        }, 1000);
    }
}

module.exports = realtime;