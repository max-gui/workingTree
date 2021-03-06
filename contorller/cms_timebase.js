var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var Q = require('q');

var get_timebae_q = function (sensor_code, callback) {
    var deffered = Q.defer();
    mongoHelp.mongoInit("cms_timebase", function (err, collection) {
        collection.find({"sensor_code": sensor_code}).sort({sample_time:-1}).limit(1).toArray(function (err, doc) {
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

exports.timeBase=function(req, res){
    var promise = get_timebae_q(req.params.sensor_code);
    promise.then(function (data) {
        var ret = {
            x : Array.apply(null, {length: data.data.sample_data.length}).map(Number.call, Number),
            y : data.data.sample_data
        };
        res.send(ret);

    });
}

/*
router.get('/:sensor_code', function (req, res) {
    // console.log(sensor_code);
    // var promise = get_tend_q(req.params.sensor_code);
    // promise.then(function (data) {
    //     res.send(data);

    // });

    var promise = get_timebae_q(req.params.sensor_code);
    promise.then(function (data) {
         var ret = {
             x : Array.apply(null, {length: data.data.sample_data.length}).map(Number.call, Number),
             y : data.data.sample_data
         };

        //var ret = {
        //    x : Array.apply(null, {length: data.data.sample_count}).map(Number.call, Number),
        //    y : Array.apply(null, {length: data.data.sample_count}).map(Function.call, Math.random)
        //};
        res.send(ret);

    });
});

module.exports = router;
*/
