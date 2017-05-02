var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var Q = require('q');
var redis = require("redis");

var client = require('./../config/rdb');

var getcms_circuit_q = function (wfId, callback) {
    console.log(wfId);
    var deffered = Q.defer();
    mongoHelp.mongoInit("cms_circuit", function (err, collection) {
        collection.find({"wfId": wfId}).toArray(function (err, doc) {
            //assert.equal(err, null);
            var result = new Object();
            if (doc != null) {
                console.log("in true");
                console.dir(doc[0]);

                result.data = doc[0];
                result.message = "founded"

            } else {
                console.log("in else");
                result.data = null;
                result.message = "nothing was found";
            }

            deffered.resolve(result);
            // actData(result);
        })
    });
    return deffered.promise.nodeify(callback);
}

var get_turbine_mongo_q = function (term, callback) {
    console.log(term);
    var deffered = Q.defer();
    mongoHelp.mongoInit("Turbine", function (err, collection) {
        collection.find({"term": term}).toArray(function (err, doc) {
            //assert.equal(err, null);
            var result = new Object();
            if (doc != null) {
                console.log("in true");
                console.dir(doc);

                result.data = doc;
                result.message = "founded"

            } else {
                console.log("in else");
                result.data = null;
                result.message = "nothing was found";
            }

            deffered.resolve(result);
            // actData(result);
        })
    });
    return deffered.promise.nodeify(callback);
}

var getcms_circuit_device_q = function (deviceUniKey, callback) {
    //var client = redis.createClient(19000, "hao.oudot.cn");
    //client.on("error", function (err) {
    //    console.log("Error " + err);
    //});
    console.log(deviceUniKey);
    var deffered = Q.defer();
    client.hgetall("cms:circuit:" + deviceUniKey, function (err, replies) {
        for (var key in replies) {
            console.log(key + ': ' + replies[key]);
        }
        ;
        console.log("last");
        console.dir(replies);
        deffered.resolve(replies);
    });
    return deffered.promise.nodeify(callback);
}

var get_turbine_status_q = function (termIpno, turbineId, callback) {
    //var client = redis.createClient(19000, "hao.oudot.cn");
    //client.on("error", function (err) {
    //    console.log("Error " + err);
    //});
    console.log(termIpno);
    var deffered = Q.defer();
    client.hget("cms:turbineStatus:" + termIpno, turbineId, function (err, replies) {
        // for (var key in replies) {
        //     console.log(key + ': ' + replies[key]);
        // }
        // ;
        console.log("last");
        console.dir(replies);
        deffered.resolve(replies);
    });
    return deffered.promise.nodeify(callback);
}

// var getcms_circuit_device_key = function (wfId, act) {
//     getcms_circuit(wfId, function (data) {
//         console.dir(data);
//         var dd = data == null ? null : data.data.channels.channel.map(function (curChannel, index, arr) {
//             var ed = curChannel.endPoints.endPoint.map(function (curEndPoint, index, arr) {
//                 return curChannel.deviceUniKey + '.' + curEndPoint.key;
//             });
//             return ed;
//         });

//         data.data = [].concat.apply([], dd);

//         act(data);
//     })
// };

var getcms_circuit_device_key_q = function (wfId, callback) {
    var deffered = Q.defer();
    var promise = getcms_circuit_q(wfId);
    promise.then(function (data) {
        console.dir(data);
        var dd = data == null ? null : data.data.channels.channel.map(function (curChannel, index, arr) {
            var ed = curChannel.endPoints.endPoint.map(function (curEndPoint, index, arr) {
                return curChannel.deviceUniKey + '.' + curEndPoint.key;
            });
            return ed;
        });

        data.data = [].concat.apply([], dd);

        deffered.resolve(data);
    })
    return deffered.promise.nodeify(callback);
};

router.get('/union_key/:wfId', function (req, res) {
    var promise = getcms_circuit_device_key_q(req.params.wfId);
    promise.then(function (data) {
        res.send(data);
    });
});

var getcms_circuit_key_q = function (wfId, recall) {
    var deffered = Q.defer();

    var promise = getcms_circuit_q(wfId);
    promise.then(function (data) {

        console.dir(data);
        var dd = data == null ? null : data.data.channels.channel.map(function (curChannel, index, arr) {

            return curChannel.deviceUniKey;
        });

        data.data = dd;//[].concat.apply([], dd);
        // console.dir(data);
        deffered.resolve(data);
        //act(data);
    });
    return deffered.promise.nodeify(recall);
};

var get_turbine_q = function (term, recall) {
    var deffered = Q.defer();

    var promise = get_turbine_mongo_q(term);
    promise.then(function (data) {
        console.log("ddddddddd");
        //console.dir(data);
        var dd = data == null ? null : data.data.map(function (curTurbine, index, arr) {
            return curTurbine.Ipno;
            // return {
            //     turbine: curTurbine,
            //     ipno: curTurbine.Ipno
            // };
        }).sort().filter(function (item, pos, ary) {
            return !pos || item != ary[pos - 1];
        }).map(function (curIpno) {
            return {
                ipno: curIpno,
                turbine: data.data.map(function (curTurbine) {
                    curTurbine.statusKey = "T" + curTurbine.term + "_L" + curTurbine.Ipno;
                    return curTurbine;
                }).filter(function (item) {
                    return item.Ipno == curIpno;
                })
            }
        });

        //console.dir(dd);

        data.data = dd;//[].concat.apply([], dd);
        // console.dir(data);
        deffered.resolve(data);
        //act(data);
    });
    return deffered.promise.nodeify(recall);
};

router.get('/:deviceUniKey', function (req, res) {
    console.log(req.path);
    var promise = getcms_circuit_device_q(req.params.deviceUniKey);
    promise.then(function (data) {
        res.send(data);
    })
});

router.get('/cms-circuit/:wfId', function (req, res) {
    var promise = getcms_circuit_q(req.params.wfId);
    promise.then(function (data) {
        res.send(data);
    });
});

var circuit_device_getAll_q = function (wfId) {
    var infos_promise = getcms_circuit_q(wfId);

    var status_promise = deviceHelp.getStatus_q(wfId);

    return Q.all([infos_promise, status_promise]).then(function (pdata) {


        pdata[0].data.channels.channel = pdata[0].data.channels.channel.map(function (varchannel) {

            varchannel.endPoints.endPoint = varchannel.endPoints.endPoint.map(function (varendPoint) {
                varendPoint.realtime_status = pdata[1][varendPoint.key];
                return varendPoint;
            });
            return varchannel;
        });

        return {
            wfInfo: pdata[0]
        };
    });
}

var turbine_getAll_q = function (term) {
    return get_turbine_q(term).
        then(function (data) {

            var ttmm = data.data.map(function (item) {
                var mm = item.turbine.map(function (curTurbine) {
                    var p = get_turbine_status_q(curTurbine.statusKey, curTurbine.code);
                    return p.then(function (sData) {
                        curTurbine.status = sData;
                        return curTurbine;
                    });
                });

                return Q.all(mm).then(function (here) {
                    item.turbine = here
                    console.dir(item);

                    return item;
                });
            });

            return Q.all(ttmm).then(function (jm) {
                return jm;
            })
        });
}

var turbine_only_status_q = function (term) {
    return get_turbine_q(term).
        then(function (data) {

            var ttmm = data.data.map(function (item) {
                var mm = item.turbine.map(function (curTurbine) {
                    var p = get_turbine_status_q(curTurbine.statusKey, curTurbine.code);
                    return p.then(function (sData) {
                        var result = {};
                        result[curTurbine.code] = sData

                        return result;
                    });
                });

                return Q.all(mm).then(function (here) {
                    return here;
                });
            });

            return Q.all(ttmm).then(function (jm) {
                // [].concat.apply([], dd);
                return [].concat.apply([], jm);
            })
        });
}

router.get('/withstatus/:wfId', function (req, res) {
    var promise = circuit_device_getAll_q(req.params.wfId);
    promise.then(function (result) {

        res.send(result);
    });
});


router.get('/Turbine/:term', function (req, res) {

    turbine_getAll_q(req.params.term).
        then(function (data) {
            res.send(data)
        });
});

router.get('/Turbine_status/:term', function (req, res) {

    turbine_only_status_q(req.params.term).
        then(function (data) {
            res.send(data)
        });
});

var deviceHelp = {
    getStatus_q: function (wfId) {
        var promise = getcms_circuit_key_q(wfId);
        var pp = promise.then(function (data) {

            return data.data.map(function (item) {
                return getcms_circuit_device_q(item);
            });
        });
        var res = Q.all(pp).then(function (dataArray) {


            var result = {};
            dataArray.map(function (md) {


                for (var key in md) {
                    result[key] = md[key];
                }
                ;
            });

            return result;
        });

        return res;
    },
    get_turbine_statusWithInfo_q: function (term) {
        return get_turbine_q(term).
            then(function (data) {

                var ttmm = data.data.map(function (item) {
                    var mm = item.turbine.map(function (curTurbine) {
                        var p = get_turbine_status_q(curTurbine.statusKey, curTurbine.code);
                        return p.then(function (sData) {
                            var result = {};
                            result[curTurbine.code] = sData

                            return result;
                        });
                    });

                    return Q.all(mm).then(function (here) {
                        return here;
                    });
                });

                return Q.all(ttmm).then(function (jm) {
                    // [].concat.apply([], dd);
                    return [].concat.apply([], jm);
                })
            });
    },
    get_turbine_status_all_q: function (termIpno, callback) {
        //var client = redis.createClient(19000, "hao.oudot.cn");
        //client.on("error", function (err) {
        //    console.log("Error " + err);
        //});
        console.log(termIpno);
        var deffered = Q.defer();
        client.hgetall("cms:turbineStatus:" + termIpno, function (err, replies) {
            // for (var key in replies) {
            //     console.log(key + ': ' + replies[key]);
            // }
            // ;
            console.log("last");
            console.dir(replies);
            deffered.resolve(replies);
        });
        return deffered.promise.nodeify(callback);
    },
    get_turbine_data_q: function (id, callback) {
        //var client = redis.createClient(19000, "hao.oudot.cn");
        //client.on("error", function (err) {
        //    console.log("Error " + err);
        //});
        console.log(id);
        var deffered = Q.defer();
        client.hgetall("cms:turbineData:" + id, function (err, replies) {
            for (var key in replies) {
                console.log(key + ': ' + replies[key]);
            }
            ;
            console.log("last");
            console.dir(replies);
            deffered.resolve(replies);
        });
        return deffered.promise.nodeify(callback);
    },
    get_sensor_data_q: function (tag, callback) {
        //var client = redis.createClient(19000, "hao.oudot.cn");
        //client.on("error", function (err) {
        //    console.log("Error " + err);
        //});
        console.log(tag);
        var deffered = Q.defer();
        client.hgetall("cms:senorData:" + tag, function (err, replies) {
            for (var key in replies) {
                console.log(key + ': ' + replies[key]);
            }
            ;
            console.log("last");
            console.dir(replies);
            deffered.resolve(replies);
        });
        return deffered.promise.nodeify(callback);
    },
    getcms_device_info_q: function (devicetag, callback) {
        //var client = redis.createClient(19000, "hao.oudot.cn");
        //client.on("error", function (err) {
        //     console.log("Error " + err);
        // });
        console.log(devicetag);
        var deffered = Q.defer();
        client.hgetall("cms:" + devicetag, function (err, replies) {
            for (var key in replies) {
                console.log(key + ': ' + replies[key]);
            }
            ;
            console.log("last");
            console.dir(replies);
            deffered.resolve(replies);
        });
        return deffered.promise.nodeify(callback);
    }

}

router.get('/status/:wfId', function (req, res) {
    console.log(req.path);
    var promise = deviceHelp.getStatus_q(req.params.wfId);

    promise.then(function (data) {
        console.dir(data);
        res.send(data);
    });

});

router.get('/info1/:tag', function (req, res) {
    console.log(req.path);
    var promise = deviceHelp.getcms_device_info_q(req.params.tag);
    var pp = promise.then(function (data) {
        res.send(data);
    });
});

router.get('/info/:id', function (req, res) {
    console.log(req.path);
    var promise = deviceHelp.get_turbine_data_q(req.params.id);
    var pp = promise.then(function (data) {
        res.send(data);
    });
});

router.get('/sensor/info/:tag', function (req, res) {
    console.log(req.path);
    var promise = deviceHelp.get_sensor_data_q(req.params.tag);
    var pp = promise.then(function (data) {
        res.send(data);
    });
});

module.exports = {
    router: router,
    deviceHelp: deviceHelp,
    circuit_device_getAll_q: circuit_device_getAll_q,
    turbine_only_status_q: turbine_only_status_q,
    turbine_getAll_q: turbine_getAll_q
};
