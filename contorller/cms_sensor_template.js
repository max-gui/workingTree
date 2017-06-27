var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var ObjectId = require('mongodb').ObjectId;
var Q = require('q');
var cms_interface = require("./cms_circuit_device");

exports.get_turbines = function (req, res) {
    mongoHelp.mongoInitWithDb().then(function (err_db) {
        var db = err_db.db;
        db.collection("cms_sensor_template", function (err, collection) {
            collection.find(
                {}, { turbines: 1, _id: 0 }
            ).toArray(function (err, docs) {
                var result = [];
                if (err == null && docs.length > 0) {
                    docs.forEach(function (element) {
                        element.turbines.forEach(function (e) {
                            result.push(e);
                        })
                    });
                }
                db.close();
                res.send(result);
                //deffered.resolve(result);
            });
        })
    });
}

exports.add = function (req, res) {
    console.log(req.path);

    var data = req.body;

    mongoHelp.mongoInitWithDb().then(function (err_db) {
        var db = err_db.db;
        db.collection("cms_sensor_template", function (err, collection) {
            collection.find(
                {"turbines": {$in:data.turbines }}, { turbines: 1, _id: 0 }
            ).toArray(function (err, docs) {
                if (docs.length > 0) {
                    res.send("duplicated data");
                } else {
                    db.collection("cms_sensor_template", function (err, collection) {
                        collection.insertOne(data, function (err, doc) {
                            doc.insert
                            var result = {
                                message: "inserted",
                                insertedId: doc.insertedId
                            };

                            db.close();
                            res.send(result);
                        })
                    })
                }
            })
        })
    })
}

var insert_template_to_turbine = function (tempId, code, callback) {
    var deffered = Q.defer();
    mongoHelp.mongoInitWithDb().then(function (err_db) {
        var db = err_db.db;
        db.collection("Turbine", function (err, collection) {
            collection.updateOne(
                { "code": code },
                { $set: { "template_id": tempId } }
            );
            db.close();
            deffered.resolve(tempId);
        })
    });

    return deffered.promise.nodeify(callback);
}

var del_template = function (tempId, callback) {
    var deffered = Q.defer();
    mongoHelp.mongoInitWithDb().then(function (err_db) {
        var db = err_db.db;
        db.collection("Turbine", function (err, collection) {
            collection.updateMany(
                { "template_id": tempId },
                { $set: { "template_id": null } }
            );
            collection.deleteOne({ "_id": tempId });
            deffered.resolve(tempId);
            db.close();
        })
    });

    return deffered.promise.nodeify(callback);
}

var find_one = function (tempId, callback) {
    var deffered = Q.defer();
    mongoHelp.mongoInitWithDb().then(function (err_db) {
        var db = err_db.db;
        db.collection("cms_sensor_template", function (err, collection) {
            collection.findone(
                { "_id": tempId },
                function (err, doc) {
                    db.collection("cms_bearing", function (err, cms_coll) {
                        cms_coll.find({ "_id": { "$in": doc.locations } }, function (err, doc) {
                            var value = doc.locations;
                            value.locations = doc;
                            deffered.resolve(value);
                            db.close();
                        });
                    });
                })
        });

        return deffered.promise.nodeify(callback);
    });
}

var find_all = function (tempId, callback) {
    var deffered = Q.defer();
    mongoHelp.mongoInitWithDb().then(function (err_db) {
        var db = err_db.db;
        db.collection("cms_sensor_template", function (err, collection) {
            collection.find.find().toArray(
                function (err, doc) {
                    db.collection("cms_bearing", function (err, cms_coll) {
                        cms_coll.find({ "_id": { "$in": doc.locations } }, function (err, doc) {
                            var value = doc.locations;
                            value.locations = doc;
                            deffered.resolve(value);
                            db.close();
                        });
                    });
                })
        });

        return deffered.promise.nodeify(callback);
    });
}

exports.alt = function (req, res) {
    console.log(req.path);

    var data = req.body;
    data._id = new ObjectId(req.paras._id);
    mongoHelp.mongoPutOne("cms_sensor_template", data, function (result) {
        res.send(result);
    });
}

exports.del = function (req, res) {
    console.log(req.path);

    var data = { _id: new ObjectId(req.paras._id) };
    mongoHelp.mongoDeleteOne("cms_sensor_template", data, function (result) {
        res.send(result);
    });
}

exports.getall = function (req, res) {
    console.log(req.path);

    mongoHelp.mongoFindAll("cms_sensor_template", function (result) {
        res.send(result);
    });
}
