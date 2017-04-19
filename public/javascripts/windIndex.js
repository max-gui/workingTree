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
    socket.on("cms_device_info", function (msg) {
        console.log(msg);
        sessionStorage.setItem('sessionData', JSON.stringify(msg));
    });
    /*每取一次session*/
    setInterval(sessionRefresh, 1000);

    /*循环遍历session的key value*/
    function sessionRefresh() {
        var sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
        for (var i in sessionData) {
            var fanCode = $(".fan-panel-bd-tt>a").val();
            $(".fan-panel-bd-tt").each(function () {
                //判断当前风机
                if (i == fanCode) {
                    changeStatus(sessionData[i]);
                }
            })
        }
    }
    //改变当前风机的状态图片和颜色
    function changeStatus(value) {
        if (value == 0) {
            $(this).prev().children().attr("src", "/images/icons-fan-green.gif");
            $(this).prev().attr("class", "pull-left fan-sample-icon fan-sample-icon-default");
        } else if (value == 1) {
            $(this).prev().children().attr("src", "/images/icons-fan-green2.gif");
            $(this).prev().attr("class", "pull-left fan-sample-icon fan-sample-icon-warning");
        } else if (value == 2) {
            $(this).prev().children().attr("src", "/images/icons-fan-red.gif");
            $(this).prev().attr("class", "pull-left fan-sample-icon fan-sample-icon-danger");
        } else if (value == 3) {
            $(this).prev().children().attr("src", "/images/icons-fan-red.gif");
            $(this).prev().attr("class", "pull-left fan-sample-icon fan-sample-icon-warning");
        } else {
            $(this).prev().children().attr("src", "/images/icons-fan-gray.gif");
            $(this).prev().attr("class", "pull-left fan-sample-icon fan-sample-icon-danger2");
        }
    }


});