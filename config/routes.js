var cms_channel = require('../contorller/cms_channel');
var cms_fan = require('../contorller/cms_fan');
var cms_sensor = require('../contorller/cms_sensor');
var cms_tend = require('../contorller/cms_tend');
var time_base = require('../contorller/cms_timebase');
var spectrum_data = require('../contorller/cms_spectrum_data');
var cms_mg = require('../contorller/cms_mg');



module.exports = function (app) {
    /*环路页面*/
    app.get('/cms_channel/Turbine/:term', cms_channel.cmsChannel);
    /*风机页面*/
    app.get('/cms_fan/circuit_device/info/:id', cms_fan.cmsFan);
    /*传感器页面*/
    app.get('/cms_sensor/info/:tag', cms_sensor.cmsSensor);
    /*传感器页面-趋势图*/
    app.get('/tend/:sensor_code', cms_tend.csmTend);
    /*传感器页面-时域图*/
    app.get('/time_base/:sensor_code', time_base.timeBase);
    /*传感器页面-频域图*/
    app.get('/spectrum_data/:sensor_code', spectrum_data.spectrumData);
    /*管理-报警门限*/
    app.get('/cms_mg/alarm', cms_mg.mgAlarmQuery);
    app.post('/cms_mg/alarm/:id', cms_mg.mgAlarmInc);
    app.put('/cms_mg/alarm/:id', cms_mg.mgAlarmModify);
    /*管理-轴承管理*/
    app.get('/cms_mg/bearing', cms_mg.mgBearing);
    /*管理-传感器管理*/
    app.get('/cms_mg/sensor', cms_mg.mgSensor);

}