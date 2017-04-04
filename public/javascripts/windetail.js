/**
 * Created by Administrator on 2017/3/28.
 */
$(function(){

 var id=$("input[type='hidden']").val();

    var tdHtml=[];
    var socket = io.connect('http://127.0.0.1/');

    //从服务器获得消息
    socket.on("detailID", function(msg){
        $("table").eq(0).children("tbody").empty();

      var html="<tr style='display: none'><input type='hidden' value='"+msg.data[0]._id+"'/></tr>"+
          "<tr>"+
      "<th>电噪音</th>"+
      "<td>"+msg.data[0].MainBearing_GeneratorElectricalNoise+"</td>"+
      "<th>channel_externalspeed</th>"+
      "<td>"+msg.data[0].CommunicationChannel_ExternalSpeed+"</td>"+
          "</tr>"+
          "<tr>"+
          "<th scope='row'>轴承罩</th>"+
        "<td>"+msg.data[0].MainBearing_MainBearingCage+"</td>"+
        "<th>轴承滚珠</th>"+
        "<td>"+msg.data[0].GeneratorOutboard_GeneratorOutboardBallSpin2X+"</td>"+
            "</tr>"+
            "<tr>"+
            "<th scope='row'>发电机Outboard_High</th>"+
        "<td>"+msg.data[0].GeneratorOutboard_HighPassDirect+"</td>"+
        "<th>轴承ORBP</th>"+
        "<td>"+msg.data[0].MainBearing_MainBearingORBP+"</td>"+
            "</tr>"+
            "<tr>"+
            "<th scope='row'>主要Bearing_Bias</th>"+
        "<td>"+msg.data[0].MainBearing_Bias+"</td>"+
        "<th>发电机Outboard_Direct</th>"+
        "<td>"+msg.data[0].GeneratorOutboard_Directrms+"</td>"+
            "</tr>"+
            "<tr>"+
            "<th scope='row'>齿轮箱油温</th>"+
        "<td>"+msg.data[0].GeneratorOutboard_GeneratorOutboardCage+"</td>"+
        "<th>舷外ORBP</th>"+
        "<td>"+msg.data[0].MainBearing_Directrms+"</td>"+
            "</tr>"+
            "<tr>"+
            "<th scope='row'>轴承滚珠</th>"+
        "<td>"+msg.data[0].GeneratorOutboard_Direct+"</td>"+
        "<th>Bearing_Crest因素</th>"+
        "<td>"+msg.data[0].MainBearing_MainBearingIRBP+"</td>"+
            "</tr>"+
            "<tr>"+
            "<th scope='row'>舷外球旋转</th>"+
        "<td>"+msg.data[0].MainBearing_MainBearingIRBP+"</td>"+
        "<th>沟通Channel_Torque</th>"+
        "<td>"+msg.data[0].GeneratorOutboard_GeneratorOutboardIRBP+"</td>"+
            "</tr>"+
            "<tr>"+
            "<th scope='row'>Outboard_HSS旋转</th>"+
        "<td>"+msg.data[0].MainBearing_MainBearingBallSpin1X+"</td>"+
        "<th>电网B相电压</th>"+
        "<td>"+msg.data[0].MainBearing_CrestFactor+"</td>"+
            "</tr>"+
            "<tr>"+
            "<th scope='row'>有功设定值</th>"+
        "<td>"+msg.data[0].GeneratorOutboard_GeneratorOutboardBallSpin1X+"</td>"+
        "<th>电网C相电压</th>"+
        "<td>"+msg.data[0].CommunicationChannel_Torque+"</td>"+
            "</tr>"+
            "<tr>"+
            "<th scope='row'>功率因数设定值</th>"+
        "<td>"+msg.data[0].GeneratorOutboard_HSSRotational1X+"</td>"+
        "<th>电网A相电流</th>"+
        "<td>"+msg.data[0].MainBearing_CrestFactor+"</td>"+
            "</tr>"+
            "<tr>"+
            "<th scope='row'>有功设定值</th>"+
        "<td>"+msg.data[0].MainBearing_Directrms+"</td>"+
        "<th>电网B相电流</th>"+
        "<td>"+msg.data[0].MainBearing_Directrms+"</td>"+
            "</tr>";

        $("table").eq(0).children("tbody").append(html);
    });

    //向服务器发消息
    socket.emit("detailID", {
        "content" :id,
    });


});
