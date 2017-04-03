
var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
// var MongoClient = require('mongodb').MongoClient;

// var url = 'mongodb://oudot.vicp.io:12307/fengdian_cms';

router.get('/:entity_id', function (req, res) {
    mongoHelp.mongoInit("cms_spectrum", function (err, collection) {
        collection.find({ "entity_id": req.params.entity_id }).toArray(function (err, doc) {
            var result = new Object();
            //console.log(req.params.entity_id);
            //assert.equal(err, null);
            //assert.equal(doc.length, 1);
            if (doc != null) {
                console.log("in true");
                console.dir(doc);
                result.data = doc;
                result.message = "founded"
            } else {
                console.log("in else");
                console.dir(doc);
                result.message = "nothing was found";


            }

            res.send(result);
        })
    });

});

module.exports = router;