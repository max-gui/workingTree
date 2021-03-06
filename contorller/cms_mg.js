var express = require('express');
var router = express.Router();
var mongoHelp = require('./mongo');
var Q = require('q');


/*报警门限管理*/
/*router.get('/alarm', function (req, res) {
    mongoHelp.mongoFindAll("mg_alarm", function (result) {
        console.log("=========>" + JSON.stringify(result.data));
        res.render("cms_mg_alarm", {alarmData: result});
    });
});

router.post('/:_id', function (req, res) {
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

});*/
exports.mgAlarmQuery = function (req, res) {
    mongoHelp.mongoFindAll("mg_alarm", function (result) {
        console.log("=========>" + JSON.stringify(result.data));
        res.render("cms_mg_alarm", {alarmData: result});
    });
}

exports.mgAlarmInc = function (req, res) {
    mongoHelp.mongoAddOne("mg_alarm", req.body, function (result) {
        res.send(result);
    });
}

exports.mgAlarmModify = function (req, res) {
    var valueInfo = new Object();
    valueInfo._id = new ObjectId(req.params._id);
    valueInfo.body = req.body;
    mongoHelp.mongoPutOne("mg_alarm", valueInfo, function (result) {
        res.send(result);
    });

}

/*轴承管理*/
/*router.get('/bearing', function (req, res) {
    res.render("cms_mg_bearing");
});*/
exports.mgBearing = function (req, res) {
    res.render("cms_mg_bearing");
}

/*传感器管理*/
/*router.get('/sensor', function (req, res) {
 res.render("cms_mg_sensor");
 });*/
exports.mgSensor = function (req, res) {
    res.render("cms_mg_sensor");
}

//module.exports = router;