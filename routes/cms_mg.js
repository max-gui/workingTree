var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var Q = require('q');

router.get('/', function (req, res) {
	mongoHelp.mongoFindAll("mg_alarm", function (result) {
		console.log("=========>" + JSON.stringify(result.data));
		res.render("cms_mg_alarm", {alarmData: result});
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

module.exports = router;