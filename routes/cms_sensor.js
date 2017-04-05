var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var Q = require('q');

router.get('/', function (req, res) {
    res.render("cms_sensor");
});

module.exports = router;