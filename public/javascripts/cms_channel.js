/**
 * ws设置
 */

$(function () {
    var socket = io.connect('http://127.0.0.1:4000');

    /*  socket.on("news", function (msg) {
     console.log("news===============" + msg.hello);
     //sessionStorage.setItem('dataObj',msg)
     });
     */
    socket.on("cms_status_info", function (msg) {
        //console.log(msg);
        sessionStorage.setItem('sessionData', JSON.stringify(msg));
    });
    /*每取一次session*/
    setInterval(sessionRefresh, 1000);

    /*循环遍历session的key value*/
    function sessionRefresh() {
        var data = sessionStorage.getItem('sessionData');
        if (data != null) {
            var sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
            console.log("sessionData====>" + JSON.stringify(sessionData));
            /*for (var i in sessionData) {
             var fanCode = $(".fan-panel-bd-tt>a").attr("value");
             $(".fan-panel-bd-tt").each(function () {
             //判断当前风机
             if (i == fanCode) {
             changeStatus(sessionData[i]);
             }
             })
             }*/
            /*var fanCode = $(".fan-panel-bd-tt>a").attr("value");
             $(".fan-panel-bd-tt").each(function (index) {
             //changeStatus(sessionData[fanCode]);
             //console.log($(".fan-panel-bd-tt")[index])
             })*/
            $(".fan-panel-bd-tt").each(function (index, dv) {
                changeStatus(dv, sessionData[dv.attributes.value.value]);
            })
        }
    }

    //改变当前风机的状态图片和颜色
    /* function changeStatus(value) {
     if (value == 0) {
     $(".fan-panel-bd-tt").prev().children().attr("src", "/images/icons-fan-green.gif");
     $(".fan-panel-bd-tt").prev().attr("class", "pull-left fan-sample-icon fan-sample-icon-default");
     } else if (value == 1) {
     $(".fan-panel-bd-tt").prev().children().attr("src", "/images/icons-fan-green2.gif");
     $(".fan-panel-bd-tt").prev().attr("class", "pull-left fan-sample-icon fan-sample-icon-warning");
     } else if (value == 2) {
     $(".fan-panel-bd-tt").prev().children().attr("src", "/images/icons-fan-red.gif");
     $(".fan-panel-bd-tt").prev().attr("class", "pull-left fan-sample-icon fan-sample-icon-danger");
     } else if (value == 3) {
     $(".fan-panel-bd-tt").prev().children().attr("src", "/images/icons-fan-red.gif");
     $(".fan-panel-bd-tt").prev().attr("class", "pull-left fan-sample-icon fan-sample-icon-warning");
     } else {
     $(".fan-panel-bd-tt").prev().children().attr("src", "/images/icons-fan-gray.png");
     $(".fan-panel-bd-tt").prev().attr("class", "pull-left fan-sample-icon fan-sample-icon-danger2");
     }
     }*/
    //改变当前风机的状态图片和颜色
    function changeStatus(dv, value) {
        if (value == 0) {
            $(dv).prev().children().attr("src", "/images/icons-fan-green.gif");
            $(dv).prev().attr("class", "pull-left fan-panel-icon fan-panel-icon-default");
        } else if (value == 1) {
            $(dv).prev().children().attr("src", "/images/icons-fan-green2.gif");
            $(dv).prev().attr("class", "pull-left fan-panel-icon fan-panel-icon-warning");
        } else if (value == 2) {
            $(dv).prev().children().attr("src", "/images/icons-fan-red.gif");
            $(dv).prev().attr("class", "pull-left fan-panel-icon fan-panel-icon-danger");
        } else if (value == 3) {
            $(dv).prev().children().attr("src", "/images/icons-fan-red.gif");
            $(dv).prev().attr("class", "pull-left fan-panel-icon fan-panel-icon-warning");
        } else {
            $(dv).prev().children().attr("src", "/images/icons-fan-gray.png");
            $(dv).prev().attr("class", "pull-left fan-panel-icon fan-panel-icon-danger2");
        }
    }

});