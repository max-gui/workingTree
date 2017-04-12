var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var Q = require('q');
var redis = require("redis");

/*
 router.get('/', function (req, res, next) {
 res.render('cms_fan');
 });
 */

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

var getcms_circuit_device_q = function (deviceUniKey, callback) {
    var client = redis.createClient(19000, "hao.oudot.cn");
    client.on("error", function (err) {
        console.log("Error " + err);
    });
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
    getcms_device_info_q: function (devicetag, callback) {
        var client = redis.createClient(19000, "hao.oudot.cn");
        client.on("error", function (err) {
            console.log("Error " + err);
        });
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


/*router.get('/:entity_id', function (req, res) {
 // console.log(entity_id);
 mongoHelp.mongoInit("event_history", function (err, collection) {
 collection.find({"entity_id": req.params.entity_id}).toArray(function (err, doc) {
 var result = new Object();
 //assert.equal(err, null);
 //assert.equal(doc.length, 1);
 if (doc != null) {
 console.log("in true");
 console.dir(doc);
 result.data = doc;
 result.message = "founded"
 } else {
 console.log("in else");
 result.message = "nothing was found";
 }

 //res.send(result);

 res.render('cms_fan', {fanData: result});
 })
 });

 });*/

router.get('/:entity_id/info/:tag', function (req, res) {
    console.log(req.path);
    var promise = deviceHelp.getcms_device_info_q(req.params.tag);
    var pp = promise.then(function (data) {

        mongoHelp.mongoInit("event_history", function (err, collection) {
            collection.find({"entity_id": req.params.entity_id}).toArray(function (err, doc) {
                var result = new Object();
                //assert.equal(err, null);
                //assert.equal(doc.length, 1);
                if (doc != null) {
                    console.log("in true");
                    console.dir(doc);
                    result.data = doc;
                    result.message = "founded"
                } else {
                    console.log("in else");
                    result.message = "nothing was found";
                }

                //res.send(result);

                res.render('cms_fan', {fanData: result, infoData: data});
            })
        });

    });
});


module.exports = router;