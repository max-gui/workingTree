var redis = require("redis");
var Q = require('q');



var redisHelp = {
    pub_console_q: function (id, value, callback) {
        var deffered = Q.defer();
        this.redis_init(function (console_pub) {
            var flag = console_pub.publish("emerson_console", JSON.stringify({ id: id, value: value }));
            deffered.resolve(flag);
        })
        return deffered.promise.nodeify(callback);
    },
    test: function (testtag, callback) {
        var deffered = Q.defer();
        redis.init(function (client) {
            client.keys(testtag, function (err, replies) {

                console.log("last");
                console.dir(replies);
                deffered.resolve(replies);
            });
        });
        return deffered.promise.nodeify(callback);
    },
    init: function (action) {
        var client = redis.createClient(19000, "hao.oudot.cn");
        client.on("error", function (err) {
                client.log("Error " + err);
            });
            
        var flag = action(client);
        client.quit();
        return flag;
    }
}

module.exports = redisHelp