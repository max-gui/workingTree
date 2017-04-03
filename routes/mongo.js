
var MongoClient = require('mongodb').MongoClient;

// var url = 'mongodb://oudot.vicp.io:12307/fengdian_cms';
// var this.mongoInit = function (collectName, collectAction) {
//         MongoClient.connect(url, function (err, db) {
//             //assert.equal(null, err);

//             console.log("Connected correctly to server.");
//             db.collection(collectName, collectAction);
//             db.close();
//         });
//     }

var mongoHelp = {
    url : 'mongodb://oudot.vicp.io:12307/fengdian_cms',

    getcms_circuit : function (wfId, actData) {
        console.log(wfId);
        this.mongoInit("cms_circuit", function (err, collection) {
            collection.find({ "wfId": wfId }).toArray(function (err, doc) {
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

                actData(result);
            })
        });
    },

    getcms_circuit_q : function (wfId, callback) {
        console.log(wfId);
        var deffered = Q.defer();
        this.mongoInit("cms_circuit", function (err, collection) {
            collection.find({ "wfId": wfId }).toArray(function (err, doc) {
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
    },

    mongoInit : function (collectName, collectAction) {
        MongoClient.connect(this.url, function (err, db) {
            //assert.equal(null, err);

            console.log("Connected correctly to server.");
            db.collection(collectName, collectAction);
            db.close();
        });
    },

    mongoFindAll : function (collectName, act) {
        var result = new Object();

        this.mongoInit(collectName, function (err, collection) {
            console.log("in");
            // Attempt to read (should fail due to the server not being a primary);
            collection.find().toArray(function (err, doc) {
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

                act(result);
            })
        });
    },

    mongoAddOne : function (collectName, value, act) {
        var result = new Object();

        this.mongoInit(collectName, function (err, collection) {
            console.log("in");
            collection.insertOne(value, function (err, doc) {
                //assert.equal(err, null);
                //assert.equal(doc.insertedCount, 1);
                doc.insert

                result.message = "inserted";
                result.insertedId = doc.insertedId;

                act(result);
            })
        });
        //db.close();
    },

    mongoPutOne : function (collectName, value, act) {
        var result = new Object();

        this.mongoInit(collectName, function (err, collection) {
            console.log("in");
            collection.findOneAndUpdate({ _id: value._id }
                , { $set: value.body }
                , function (err, r) {
                    //assert.equal(null, err);
                    //assert.equal(1, r.lastErrorObject.n);


                    result.message = "updated";
                    act(result);
                });

        });
    },

    mongoDeleteOne : function (collectName, value, act) {
        var result = new Object();

        this.mongoInit(collectName, function (err, collection) {
            console.log("in");
            collection.findOneAndDelete({ _id: value._id }
                , function (err, r) {
                    //assert.equal(null, err);
                    //assert.equal(1, r.lastErrorObject.n);

                    result.message = "deleted";
                    act(result);
                });

        });
    }
}




module.exports = mongoHelp;