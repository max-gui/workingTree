/*��··���ļ�*/

var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var Q = require('q');
var cms_interface = require("./cms_circuit_device");

exports.cmsChannel = function (req, res) {
    cms_interface.turbine_getAll_q(req.params.term).
        then(function (data) {
            //res.send(data)
            res.render("cms_channel", {channelData: data});
        });
}
/*router.get('/Turbine/:term', function (req, res) {
    cms_interface.turbine_getAll_q(req.params.term).
        then(function (data) {
            //res.send(data)
            res.render("cms_channel", {channelData: data});
        });
});*/

//module.exports = router;