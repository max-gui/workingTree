var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var Q = require('q');
var cms_interface = require("./cms_circuit_device");


router.get('/circuit_device/info/:id', function (req, res) {
    console.log(req.path);
    var promise = cms_interface.deviceHelp.get_turbine_data_q(req.params.id);
    var pp = promise.then(function (data) {

        mongoHelp.mongoInit("event_history", function (err, collection) {

            collection.find({"code": req.params.id}).toArray(function (err, doc) {
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

                //res.send(data);
                res.render('cms_fan', {fanData: result, infoData: data});
            })
        });


        //res.send(data);
    });
});

module.exports = router;