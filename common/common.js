var basePath = process.cwd();
basePath = basePath.indexOf("bin") == -1 ? basePath : basePath.substr(0, basePath.indexOf("bin") - 1);
var configJSON = JSON.parse(fs.readFileSync(basePath + "/config/config.json"));


// 获取socket路径(子工程需要在config.json里配置PATH属性)
exports.getSocketURL = function(req){
    var socketUrl;
    if(COMMON.isEmpty(configJSON.socket)){
        log.writeWarn("请检查配置文件中是否配置socket的ip和端口！");
        socketUrl = null;
    }else{
        var socketIp = configJSON.socket.IP;
        if(!COMMON.isNull(req) && !COMMON.isEmpty(req.session.socketIP)){
            socketIp = req.session.socketIP;
        }
        socketUrl = "http://" + socketIp + ":" + configJSON.socket.PORT;
        if(!COMMON.isEmpty(configJSON.socket.PATH)){
            socketUrl += configJSON.socket.PATH;
        }
    }
    return socketUrl;
}