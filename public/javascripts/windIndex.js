/**
 * ws设置
 */


$(function(){

    /*session测试*/
    sessionStorage.setItem('dataObj','{"key1":"value1"}');

    var data=sessionStorage.getItem("dataObj");
    console.log(data);
    /*/session测试*/

    var socket = io.connect('http://127.0.0.1:4000');

    socket.on("news",function(msg){
     console.log("news==============="+msg.hello);
     //sessionStorage.setItem('dataObj',msg)
     });

    socket.on("cms_device_info",function(msg){
        console.log("cms_device_info==============="+msg);
        //sessionStorage.setItem('dataObj',msg)
    });


   /* //向服务器发消息
    socket.emit("redisC", {
        "content" :$("#redisC").html(),
    });*/


});