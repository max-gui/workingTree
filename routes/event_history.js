var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var device = require('./cms_circuit_device').deviceHelp;
var Q = require('q');

var get_event_q = function (entity_id, callback) {
    var deffered = Q.defer();
    mongoHelp.mongoInit("event_history", function (err, collection) {
        collection.find({ "entity_id": entity_id }).toArray(function (err, doc) {
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

            deffered.resolve(result);
            //res.send(result);
        })
    });
    return deffered.promise.nodeify(callback);
};

router.get('/:entity_id', function (req, res) {
    // console.log(entity_id);
    var promise = get_event_q(req.params.entity_id);
    promise.then(function (data) {
        res.send(data);

    });
});

router.get('/:entity_id/:tag', function (req, res) {
    // console.log(entity_id);
    var event_promise = get_event_q(req.params.entity_id);

    var info_promise = device.getcms_device_info_q(req.params.tag);

    Q.all([event_promise, info_promise]).then(function (data) {
        res.send({
            event: data[0],
            info: data[1]
        })
    });

});

module.exports = router;