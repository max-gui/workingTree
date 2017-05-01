var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var Q = require('q');
var cms_interface = require("./cms_circuit_device");

/*router.get('/', function (req, res) {
 res.render("cms_sensor");
 });*/

router.get('/info/:tag', function (req, res) {
    console.log(req.path);
    var promise = cms_interface.deviceHelp.get_sensor_data_q(req.params.tag);
    var pp = promise.then(function (data) {
        res.render("cms_sensor", {sensorInfo: data,urlTag:req.params.tag});
    });
});

module.exports = router;