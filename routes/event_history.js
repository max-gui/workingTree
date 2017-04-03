var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');

router.get('/:entity_id', function (req, res) {
    // console.log(entity_id);
    mongoHelp.mongoInit("event_history", function (err, collection) {
        collection.find({ "entity_id": req.params.entity_id }).toArray(function (err, doc) {
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

            res.send(result);
        })
    });

});

module.exports = router;