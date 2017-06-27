var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var Q = require('q');
var ObjectId = require('mongodb').ObjectId;
var cms_interface = require("./cms_circuit_device");

exports.add = function (req, res) {
    console.log(req.path);

    var data = calculator(req.body.D, req.body.z, req.body.d, req.body.elfa);
    data.model = req.body.model;
    data.manu = req.body.manu;
    data.type = req.body.type;
    mongoHelp.mongoAddOne("cms_bearing", data, function (result) {
        res.send(result);
    });
}

exports.del = function (req, res) {
    del(req.params.id).then(function (r) {
        res.send(r);
    })
}

exports.put = function (req, res) {
    var data = calculator(req.body.D, req.body.z, req.body.d, req.body.elfa);
    data.model = req.body.model;
    data.manu = req.body.manu;
    data.type = req.body.type;
    var value = {
        body : data,
        _id : new ObjectId(req.params.id)};
    mongoHelp.mongoPutOne("cms_bearing", value, function (result) {
        data._id = req.params.id
        put(req.params.id, data).then(function(r){
            res.send(r);
        })
    });
}

var put = function (id, data, callback) {
    var oid = new ObjectId(id);

    var deffered = Q.defer();
    mongoHelp.mongoInit("cms_sensor_template", function (err, collection) {
        collection.updateMany(
            { "location._id": id },
            { "$set": { "location": data }}, function (err, r) {
                deffered.resolve(err == null);
            });
    });


    return deffered.promise.nodeify(callback);
}

var del = function (id, callback) {
    var oid = new ObjectId(id);

    var deffered = Q.defer();
    mongoHelp.mongoInit("cms_bearing", function (err, collection) {

        collection.deleteOne({ '_id': oid }, function (err, r) {
            mongoHelp.mongoInit("cms_sensor_template", function (err, in_col) {

                in_col.updateMany(
                    { "location._id": id },
                    { "$pull": { "location": { "_id": id } } }, function (err, r) {
                        deffered.resolve(err == null);
                    });
            });
        });
    });

    return deffered.promise.nodeify(callback);
}

var calculator = function (D, z, d, elfa) {
    var cos_elfa = Math.cos(elfa);
    var d_D = d / D;
    var d_D_cos_elfa = d / D * Math.cos(elfa);
    var bpfi = (1 + d_D_cos_elfa) * z / 2;
    var ftf = (1 - d_D_cos_elfa) / 2;
    var bpfo = ftf * z;
    var bsf = (1 - d_D_cos_elfa * d_D_cos_elfa) * D / d / 2

    return {
        bpfi: bpfi,
        bpfo: bpfo,
        ftf: ftf,
        bsf: bsf
    };
}

/*
router.get('/info/:tag', function (req, res) {
    console.log(req.path);
    var promise = cms_interface.deviceHelp.get_sensor_data_q(req.params.tag);
    var pp = promise.then(function (data) {
        res.render("cms_sensor", {sensorInfo: data, urlTag: req.params.tag});
    });
});

module.exports = router;
*/
