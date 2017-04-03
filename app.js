var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var spectrum = require('./routes/cms_spectrum');
var event_history = require('./routes/event_history');
var mg_alarm = require('./routes/mg_alarm');
var circuit_device = require('./routes/cms_circuit_device');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/spectrum', spectrum);
app.use('/event_history', event_history);
app.use('/mg_alarm', mg_alarm);
app.use('/circuit_device', circuit_device);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectId;
var redis = require("redis");
var Q = require('q');

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var cms_device_info_sub = redis.createClient(19000, "hao.oudot.cn");

var cms_device_status_sub = redis.createClient(19000, "hao.oudot.cn");

cms_device_info_sub.on("subscribe", function (channel, message) {
    console.log(channel + message);
});

cms_device_status_sub.on("subscribe", function (channel, message) {
    console.log(channel + message);
});

cms_device_info_sub.on("message", function (channel, message) {
    console.log("sub channel " + channel + ": " + message);
    var promise = getcms_device_info_q(req.params.tag);
  var pp = promise.then(function (data) {
  console.log(data);
    io.emit('cms_device_info', data);
  });
});

cms_device_status_sub.on("message", function (channel, message) {
    console.log("sub channel " + channel + ": " + message);
    var promise = getcms_device_info_q(req.params.tag);
  var pp = promise.then(function (data) {
  console.log(data);
    io.emit('cms_device_info', data);
  });
});

cms_device_info_sub.subscribe("cms_device_info");
cms_device_status_sub.subscribe("cms_device_status");

io.on('connection', function(){ /* … */ });

server.listen(4000, function () {
  console.log('ws app listening on port 4000!');
});

io.sockets.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('paper', function (data) {
    socket.emit('news', { hello: 'world' });
    
    console.log(data);
  });
});

// setInterval((arg) => {
//   var promise = getcms_device_info_q(req.params.tag);
//   var pp = promise.then(function (data) {
//   console.log(data);
//     io.emit('cms_device_info', data);
//   });
// }, 1000);

// setInterval((arg) => {
//   var promise = getcms_device_info_q(req.params.tag);
//   var pp = promise.then(function (data) {
//   console.log(data);
//     io.emit('cms_device_info', data);
//   });
// }, 1000);
//********************************************************************** */
var url = 'mongodb://oudot.vicp.io:12307/fengdian_cms';

var getcms_circuit = function (wfId, actData) {
  console.log(wfId);
  mongoInit("cms_circuit", function (err, collection) {
    collection.find({ "wfId": wfId }).toArray(function (err, doc) {
      assert.equal(err, null);
      var result = new Object();
      if (doc != null) {
        console.log("in true");
        console.dir(doc[0]);

        result.data = doc[0];
        result.message = "founded"

      } else {
        console.log("in else");
        result.data = null;
        result.message = "nothing was found";
      }

      actData(result);
    })
  });
}

var getcms_circuit_q = function (wfId, callback) {
  console.log(wfId);
  var deffered = Q.defer();
  mongoInit("cms_circuit", function (err, collection) {
    collection.find({ "wfId": wfId }).toArray(function (err, doc) {
      assert.equal(err, null);
      var result = new Object();
      if (doc != null) {
        console.log("in true");
        console.dir(doc[0]);

        result.data = doc[0];
        result.message = "founded"

      } else {
        console.log("in else");
        result.data = null;
        result.message = "nothing was found";
      }

      deffered.resolve(result);
      // actData(result);
    })
  });
  return deffered.promise.nodeify(callback);
}

var mongoInit = function (collectName, collectAction) {
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);

    console.log("Connected correctly to server.");
    db.collection(collectName, collectAction);
    db.close();
  });
}

var mongoFindAll = function (collectName, act) {
  var result = new Object();

  mongoInit(collectName, function (err, collection) {
    console.log("in");
    // Attempt to read (should fail due to the server not being a primary);
    collection.find().toArray(function (err, doc) {
      assert.equal(err, null);
      //assert.equal(doc.length, 1);
      if (doc != null) {
        console.log("in true");
        console.dir(doc);
        result.data = doc;
        result.message = "founded"
      } else {
        console.log("in else");
        result.message = "nothing was found";
      }

      act(result);
    })
  });
}

var mongoAddOne = function (collectName, value, act) {
  var result = new Object();

  mongoInit(collectName, function (err, collection) {
    console.log("in");
    collection.insertOne(value, function (err, doc) {
      assert.equal(err, null);
      assert.equal(doc.insertedCount, 1);
      doc.insert

      result.message = "inserted";
      result.insertedId = doc.insertedId;

      act(result);
    })
  });
  //db.close();
}

var mongoPutOne = function (collectName, value, act) {
  var result = new Object();

  mongoInit(collectName, function (err, collection) {
    console.log("in");
    collection.findOneAndUpdate({ _id: value._id }
      , { $set: value.body }
      , function (err, r) {
        assert.equal(null, err);
        assert.equal(1, r.lastErrorObject.n);


        result.message = "updated";
        act(result);
      });

  });
}

var mongoDeleteOne = function (collectName, value, act) {
  var result = new Object();

  mongoInit(collectName, function (err, collection) {
    console.log("in");
    collection.findOneAndDelete({ _id: value._id }
      , function (err, r) {
        assert.equal(null, err);
        assert.equal(1, r.lastErrorObject.n);

        result.message = "deleted";
        act(result);
      });

  });
}

// app.get('/hello', function (req, res) {
//   res.send("world");
// });

// app.get('/cms_spectrum/:entity_id', function (req, res) {
//   // console.log(entity_id);
//   MongoClient.connect(url, function (err, db) {
//     assert.equal(null, err);

//     console.log("Connected correctly to server.");
//     var result = new Object();
//     db.collection("cms_spectrum", function (err, collection) {
//       console.log("in");
//       // Attempt to read (should fail due to the server not being a primary);
//       collection.find({ "entity_id": req.params.entity_id }).toArray(function (err, doc) {
//         assert.equal(err, null);
//         //assert.equal(doc.length, 1);
//         if (doc != null) {
//           console.log("in true");
//           console.dir(doc);
//           result.data = doc;
//           result.message = "founded"
//         } else {
//           console.log("in else");
//           console.dir(doc);
//           result.message = "nothing was found";


//         }

//         res.send(result);
//       })
//     });
//     db.close();

//   });
// });
//********************************************************************** */
app.get('/event_history/:entity_id', function (req, res) {
  // console.log(entity_id);
  MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);

    console.log("Connected correctly to server.");
    var result = new Object();
    db.collection("event_history", function (err, collection) {
      console.log("in");
      // Attempt to read (should fail due to the server not being a primary);
      collection.find({ "entity_id": req.params.entity_id }).toArray(function (err, doc) {
        assert.equal(err, null);
        //assert.equal(doc.length, 1);
        if (doc != null) {
          console.log("in true");
          console.dir(doc);
          result.data = doc;
          result.message = "founded"
        } else {
          console.log("in else");
          result.message = "nothing was found";
        }

        res.send(result);
      })
    });
    db.close();

  });
});

app.get('/mg_alarm', function (req, res) {
  mongoFindAll("mg_alarm", function (result) {
    res.send(result);
  });
});

app.post('/mg_alarm', function (req, res) {
  mongoAddOne("mg_alarm", req.body, function (result) {
    res.send(result);
  });
});

app.put('/mg_alarm/:_id', function (req, res) {
  var valueInfo = new Object();
  valueInfo._id = new ObjectId(req.params._id);
  valueInfo.body = req.body;
  mongoPutOne("mg_alarm", valueInfo, function (result) {
    res.send(result);
  });
});

app.delete('/mg_alarm/:_id', function (req, res) {
  var valueInfo = new Object();
  valueInfo._id = new ObjectId(req.params._id);
  valueInfo.body = req.body;
  mongoDeleteOne("mg_alarm", valueInfo, function (result) {
    res.send(result);
  });
});
//******************************************************* */
// app.get('/cms-circuit/:deviceUniKey', function (req, res) {
//   var client = redis.createClient(19000, "hao.oudot.cn");
//   client.on("error", function (err) {
//     console.log("Error " + err);
//   });

//   client.hgetall("cms:circuit:" + req.params.deviceUniKey, function (err, replies) {
//     console.dir(replies);
//     for (var key in replies)
//     {
//        console.log(key+': '+replies[key]);
//     };

//     res.send(replies);
//     client.quit();
//   });
// });

app.get('/cms-circuit-device/:deviceUniKey', function (req, res) {
  console.log(req.path);
  getcms_circuit_device(req.params.deviceUniKey, function (data) {

    res.send(data);
  });
});

var getcms_circuit_device = function (deviceUniKey, act) {
  var client = redis.createClient(19000, "hao.oudot.cn");
  client.on("error", function (err) {
    console.log("Error " + err);
  });

  client.hgetall("cms:circuit:" + deviceUniKey, function (err, replies) {
    console.dir(replies);
    for (var key in replies) {
      console.log(key + ': ' + replies[key]);
    };

    act(replies)
    client.quit();
  });
}

var getcms_circuit_device_q = function (deviceUniKey, callback) {
  var client = redis.createClient(19000, "hao.oudot.cn");
  client.on("error", function (err) {
    console.log("Error " + err);
  });
  console.log(deviceUniKey);
  var deffered = Q.defer();
  client.hgetall("cms:circuit:" + deviceUniKey, function (err, replies) {
    for (var key in replies) {
      console.log(key + ': ' + replies[key]);
    };
    console.log("last");
    console.dir(replies);
    deffered.resolve(replies);
  });
  return deffered.promise.nodeify(callback);
}

var getcms_device_info_q = function (devicetag, callback)
{
  var client = redis.createClient(19000, "hao.oudot.cn");
  client.on("error", function (err) {
    console.log("Error " + err);
  });
  console.log(devicetag);
  var deffered = Q.defer();
  client.hgetall("cms:" + devicetag, function (err, replies) {
    for (var key in replies) {
      console.log(key + ': ' + replies[key]);
    };
    console.log("last");
    console.dir(replies);
    deffered.resolve(replies);
  });
  return deffered.promise.nodeify(callback);
}

app.get('/cms-circuit/:wfId', function (req, res) {
  getcms_circuit(req.params.wfId, function (data) {
    console.dir(data);
    res.send(data);
  })
});

var getcms_circuit_device_key = function (wfId, act) {
  getcms_circuit(wfId, function (data) {
    console.dir(data);
    var dd = data == null ? null : data.data.channels.channel.map(function (curChannel, index, arr) {
      var ed = curChannel.endPoints.endPoint.map(function (curEndPoint, index, arr) {
        return curChannel.deviceUniKey + '.' + curEndPoint.key;
      });
      return ed;
    });

    data.data = [].concat.apply([], dd);

    act(data);
  })
};

var getcms_circuit_device_key_q = function (wfId, callback) {
  var deffered = Q.defer();
  var promise = getcms_circuit_q(wfId);
  promise.then(function (data) {
    console.dir(data);
    var dd = data == null ? null : data.data.channels.channel.map(function (curChannel, index, arr) {
      var ed = curChannel.endPoints.endPoint.map(function (curEndPoint, index, arr) {
        return curChannel.deviceUniKey + '.' + curEndPoint.key;
      });
      return ed;
    });

    data.data = [].concat.apply([], dd);

    deffered.resolve(data);
  })
  return deffered.promise.nodeify(callback);
};

app.get('/cms-circuit-device-key/:wfId', function (req, res) {
  getcms_circuit_device_key(req.params.wfId, function (data) {
    res.send(data);
  })
});

var getcms_circuit_key = function (wfId, act) {
  getcms_circuit(wfId, function (data) {
    console.dir(data);
    var dd = data == null ? null : data.data.channels.channel.map(function (curChannel, index, arr) {

      return curChannel.deviceUniKey;
    });

    data.data = [].concat.apply([], dd);

    act(data);
  })
};

var getcms_circuit_key_q = function (wfId, recall) {
  var deffered = Q.defer();
  getcms_circuit(wfId, function (data) {
    console.dir(data);
    var dd = data == null ? null : data.data.channels.channel.map(function (curChannel, index, arr) {

      return curChannel.deviceUniKey;
    });

    data.data = dd;//[].concat.apply([], dd);
    // console.dir(data);
    deffered.resolve(data);
    //act(data);
  });
  return deffered.promise.nodeify(recall);
};

app.get('/cms-circuit-key/:wfId', function (req, res) {
  getcms_circuit_key(req.params.wfId, function (data) {
    res.send(data);
  })
});

app.get('/cms-circuit-device-status/:wfId', function (req, res) {
  console.log(req.path);
  var promise = getcms_circuit_key_q(req.params.wfId);
  var pp = promise.then(function (data) {

    return data.data.map(function (item) {
      return getcms_circuit_device_q(item);
    });
  });
  Q.all(pp).then(function (dataArray) {


    var result = {};
    dataArray.map(function (md) {


      for (var key in md) {
        result[key] = md[key];
      };
    })

    res.send(result);
    //console.dir(result);
  });

});

app.get('/cms-circuit-device-info/:tag', function (req, res) {
  console.log(req.path);
  var promise = getcms_device_info_q(req.params.tag);
  var pp = promise.then(function (data) {
    res.send(data);
  });
});

// app.listen(2000, function () {
//   console.log('Example app listening on port 2000!');
// });

module.exports = app;
