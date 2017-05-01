var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var index = require('./routes/index');
var users = require('./routes/users');
var spectrum = require('./routes/cms_spectrum');
var event_history = require('./routes/event_history');
var mg_alarm = require('./routes/mg_alarm');
var circuit_device = require('./routes/cms_circuit_device');
var sensor_tend = require('./routes/cms_tend');
var time_base = require('./routes/cms_timebase');
var spectrum_data = require('./routes/cms_spectrum_data')

/*路由*/
var cms_channel = require('./routes/cms_channel');
var cms_fan = require('./routes/cms_fan');
var cms_sensor = require('./routes/cms_sensor');
var cms_mg = require('./routes/cms_mg');
/*/路由*/

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/spectrum', spectrum);
app.use('/event_history', event_history);
app.use('/mg_alarm', mg_alarm);
app.use('/circuit_device', circuit_device.router);
app.use('/tend', sensor_tend);
app.use('/time_base', time_base);
app.use('/spectrum_data', spectrum_data);

/*路由*/

app.use('/cms_channel', cms_channel);//主页-环路
app.use('/cms_fan', cms_fan);//风机-机舱
app.use('/cms_sensor', cms_sensor);//传感器
app.use('/cms_mg', cms_mg);//管理

/*/路由*/

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


var redis = require("./routes/redis_help");
var Q = require('q');

var server = require('http').createServer(app);
var io = require('socket.io')(server);

// var cms_device_info_sub = redis.createClient(19000, "hao.oudot.cn");

// var cms_device_status_sub = redis.createClient(19000, "hao.oudot.cn");

// cms_device_info_sub.on("subscribe", function (channel, message) {
//     console.log("cms_device_info_sub" +channel + message);
// });

// cms_device_status_sub.on("subscribe", function (channel, message) {
//     console.log("cms_device_status_sub"+channel + message);
// });

// cms_device_info_sub.on("message", function (channel, message) {
//     console.log("sub channel " + channel + ": " + message);
//     var promise = circuit_device.deviceHelp.getcms_device_info_q(message);//deviceTag
//     promise.then(function (data) {
//         console.log(data);
//         io.emit('cms_device_info', data);
//     });
// });

// cms_device_status_sub.on("message", function (channel, message) {
//     console.log("sub channel " + channel + ": " + message);
//     var promise = circuit_device.deviceHelp.getStatus_q(message);//wfid
//     promise.then(function (data) {
//         console.log(data);
//         io.emit('cms_device_info', data);
//     });
// });

setInterval(function () {
    //var tt =io.sockets.clients().connected.keys;
    if (Object.keys(io.sockets.clients().connected).length != 0)///.connected == {});
    {
        console.dir(io.sockets.clients().connected.length);
        var promise = get_teststatus();//deviceTag
        promise.then(function (data) {
            console.log(data);
            io.emit('cms_status_info', data);
        });

        var promise2 = get_testsinfo();//wfid
        promise2.then(function (data) {
            console.log(data);
            io.emit('cms_sensor_info', data);
        });

        var promise3 = get_testtinfo();//wfid
        promise3.then(function (data) {
            console.log(data);
            io.emit('cms_turbine_info', data);
        });
    }
}, 5000);

// cms_device_info_sub.subscribe("cms_device_info");
// cms_device_status_sub.subscribe("cms_device_status");
// var test = function (testtag, callback) {
//     var client = redis.createClient(19000, "hao.oudot.cn");
//     client.on("error", function (err) {
//         console.log("Error " + err);
//     });
//     var deffered = Q.defer();
//     client.keys(testtag, function (err, replies) {

//         console.log("last");
//         console.dir(replies);
//         deffered.resolve(replies);
//     });
//     return deffered.promise.nodeify(callback);
// };

var get_teststatus = function (req, res) {

    var promise = redis.test("cms:turbineStatus:*");
    return promise.then(function (data) {
        var m = data.map(function (d) {
            return d.split("Status:")[1];
        })
        var am = m.map(function (tag) {
            return circuit_device.deviceHelp.get_turbine_status_all_q(tag).then(function (da) {
                return da;

            });
        });

        return Q.all(am).then(function (ov) {

            var result = {};
            ov.map(function (md) {

                for (var key in md) {
                    result[key] = Math.floor((Math.random() * 5) + 0);//md[key];
                }
            });
            var temp = {
                data: data,
                m: m,
                da: result
            };
            return result;
        });
    });
};

var get_testtinfo = function (req, res) {

    var promise = redis.test("cms:turbineData:*");
    return promise.then(function (data) {
        var m = data.map(function (d) {
            return d.split("turbineData:")[1];
        })
        var am = m.map(function (tag) {
            return circuit_device.deviceHelp.get_turbine_data_q(tag).then(function (da) {
                da.tag = tag
                da.power_factor = Math.floor((Math.random() * 20) + -10)
                return da;

            });
        });

        return Q.all(am).then(function (ov) {

            var result = {};
            ov.map(function (md) {
                result[md.tag] = md;
            });
            var temp = {
                data: data,
                m: m,
                da: result
            };
            return result;
        });
    });
}

var get_testsinfo = function (req, res) {

    var promise = redis.test("cms:senorData:*");
    return promise.then(function (data) {
        var m = data.map(function (d) {
            return d.split("senorData:")[1];
        })
        var am = m.map(function (tag) {
            return circuit_device.deviceHelp.get_sensor_data_q(tag).then(function (da) {
                da.tag = tag
                da.J_BPFI = Math.floor((Math.random() * 101) + 0)
                return da;

            });
        });

        return Q.all(am).then(function (ov) {

            var result = {};
            ov.map(function (md) {
                result[md.tag] = md;
            });
            var temp = {
                data: data,
                m: m,
                da: result
            };
            return result;
        });
    });
}

io.on('connection', function () { /* … */
});

server.listen(4000, function () {
    console.log('ws app listening on port 4000!');
});

io.sockets.on('connection', function (socket) {
    socket.emit('news', {hello: 'world'});//前端通过socket.on("news")获取
    socket.on('paper', function (data) {//前端通过socket.emit('paper')发送
        socket.emit('news', {hello: 'world'});

        console.log(data);
    });
});


module.exports = app;
