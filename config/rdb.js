//redis数据库连接配置相关内容
var redis = require("redis");
var blueBird = require("bluebird"); //blueBird使redis查询同步
blueBird.promisifyAll(redis.RedisClient.prototype);
blueBird.promisifyAll(redis.Multi.prototype);
var fs = require("fs");
var basePath = process.cwd();
basePath = basePath.indexOf("bin") != -1?basePath.substr(0,basePath.indexOf("bin")-1):basePath;
var objConfig = JSON.parse(fs.readFileSync( basePath + "/config/config.json", "utf8"));
var client ;


if(objConfig.redis != null){
	client = redis.createClient(objConfig.redis.PORT,objConfig.redis.IP);
	client.auth(objConfig.redis.REQUIREPASS,function(){
		console.log("redis connect success");
	});
}else{
	client = redis.createClient();
}

client.on("error", function(err){
	console.log("Error: " + err);
});
module.exports = client;


