/**
 * Created by Administrator on 2017/3/24.
 */


$(function(){

	sessionStorage.setItem('dataObj','{"key1":"value1"}');
	var data=sessionStorage.getItem("dataObj");
	console.log(data);
	var socket = io.connect('http://127.0.0.1:4000');

	socket.on("cms_device_info",function(msg){
		//console.log(msg);
		//sessionStorage.setItem('dataObj',msg)
	});


	//向服务器发消息
	socket.emit("redisC", {
		"content" :$("#redisC").html(),
	});

	//从服务器获得消息
	//socket.on("message", function(msg){
	//    if(msg==null){
	//        return;
	//    }else{
	//        //console.log(msg);
	//        $(".fan-panel-group").empty();
	//        var html = "";
	//        for(var i=0;i<msg.length;i++){
	//            var index=i+1;
	//            if(msg[i].state==1){
	//                html+="<div class='fan-panel pull-left'>" +
	//                        "<div class='fan-panel-bd clearfix'>" +
	//                          "<div class='pull-left fan-panel-icon fan-panel-icon-default'>" +
	//                            "<img src='images/icons-fan-green.gif' class='img-circle mCS_img_loaded' />" +
	//                          "</div>" +
	//                         "<div class='fan-panel-bd-tt'><a href='/windetail?id="+msg[i]._id+"'>风机"+index+"号</a></div>" +
	//                      "</div></div>";
	//            }else if(msg[i].state==2){
	//                html+= "<div class='fan-panel pull-left'><div class='fan-panel-bd clearfix'>" +
	//                           "<div class='pull-left fan-panel-icon fan-panel-icon-warning'>" +
	//                                "<img src='images/icons-fan-green2.gif' class='img-circle' />" +
	//                           "</div>" +
	//                           "<div class='fan-panel-bd-tt'><a href='/windetail?id="+msg[i]._id+"'>风机"+index+"号</a></div>" +
	//                       "</div></div>";
	//            }else if(msg[i].state==3){
	//                html+="<div class='fan-panel pull-left'><div class='fan-panel-bd clearfix'>" +
	//                    "<div class='pull-left fan-panel-icon fan-panel-icon-danger2'>" +
	//                    "<img src='images/icons-fan-red.gif' class='img-circle mCS_img_loaded' />" +
	//                    "</div>" +
	//                    "<div class='fan-panel-bd-tt'><a href='/windetail?id="+msg[i]._id+"'>风机"+index+"号</a></div>" +
	//                    "</div></div>";
	//
	//            }else if(msg[i].state==4){
	//                html+="<div class='fan-panel pull-left'><div class='fan-panel-bd clearfix'>" +
	//                    "<div class='pull-left fan-panel-icon fan-panel-icon-warning'>" +
	//                    "<img src='images/icons-fan-red.gif' class='img-circle' />" +
	//                    "</div>" +
	//                    "<div class='fan-panel-bd-tt'><a href='/windetail?id="+msg[i]._id+"'>风机"+index+"号</a></div>" +
	//                    "</div></div>";
	//            }else if(msg[i].state==5){
	//                html+="<div class='fan-panel pull-left'><div class='fan-panel-bd clearfix'>" +
	//                    "<div class='pull-left fan-panel-icon fan-panel-icon-danger2'>" +
	//                    "<img src='images/icons-fan-gray.png' class='img-circle mCS_img_loaded' />" +
	//                    "</div>" +
	//                    "<div class='fan-panel-bd-tt'><a href='/windetail?id="+msg[i]._id+"'>风机"+index+"号</a></div>" +
	//                    "</div></div>";
	//
	//            }
	//
	//        }
	//        $(".fan-panel-group").append(html);
	//    }
	//});



});