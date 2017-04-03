var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var ObjectId = require('mongodb').ObjectId;

router.get('/', function (req, res) {
  mongoHelp.mongoFindAll("mg_alarm", function (result) {
    res.send(result);
  });
});

router.post('/', function (req, res) {
  mongoHelp.mongoAddOne("mg_alarm", req.body, function (result) {
    res.send(result);
  });
});

router.put('/:_id', function (req, res) {
  var valueInfo = new Object();
  valueInfo._id = new ObjectId(req.params._id);
  valueInfo.body = req.body;
  mongoHelp.mongoPutOne("mg_alarm", valueInfo, function (result) {
    res.send(result);
  });
});

router.delete('/:_id', function (req, res) {
  var valueInfo = new Object();
  valueInfo._id = new ObjectId(req.params._id);
  valueInfo.body = req.body;
  mongoHelp.mongoDeleteOne("mg_alarm", valueInfo, function (result) {
    res.send(result);
  });
});

module.exports = router;