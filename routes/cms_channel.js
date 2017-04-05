var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var Q = require('q');

router.get('/:wfId', function (req, res) {
	var id = req.params.wfId;
	mongoHelp.getcms_circuit(id, function (data) {
		res.render("cms_channel", {data: data})
	});
});


module.exports = router;