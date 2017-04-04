var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var Q = require('q');

router.get('/', function (req, res) {
    mongoHelp.mongoFindAll("mg_alarm", function (result) {
        console.log("==========>"+JSON.stringify(result))
        res.render("cms_mg_alarm", {data: result});
    });
});
router.post('/', function (req, res) {
    mongoHelp.mongoAddOne("mg_alarm", req.body, function (result) {
        res.send(result);
    });
});
module.exports = router;