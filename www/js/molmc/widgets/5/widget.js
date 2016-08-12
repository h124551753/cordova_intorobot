define(["tpl!./template/button.tpl",
    "css!./css/button_5"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var sw_status = 0; 
    var url;
    var cssUrl_bak=[];
//    var widget = function(){
//        $("#showWidget_device").bind("unloadpanel", function(){
//            $.molmc.goShowWidget = false; 
//            destroy();
//            $("#showWidget_device").unbind("unloadpanel");
//            $("#widgetPanel_device").empty();
//        });        
//    };
    
    var initView = function(el, wid, devId, mqtt){
        el.empty();
        mMqtt = mqtt;
        mWidget = wid;
        device_id = devId;
        var div = layoutTpl();
        el.append(div);
        $('#widget5').on("change", "input", function(e) {
            pubTopic();
        });
    };
    
    var initMqtt = function(){        
        var topic = mWidget.topics;
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
        if(!_.isEmpty(mWidget.retain)){
            var currentAmount = mWidget.retain;
            $("#widget5 #light-bulb2").css("opacity", currentAmount);
            sw_status = currentAmount;            
            if(currentAmount == true){
                $("#widget5 input").attr("checked", "checked");
            }else{
                $("#widget5 input").removeAttr("checked");
            }
        }
        mMqtt.on(url, function(message){
            sw_status = parseInt(message.payloadString);
            $("#widget5 #light-bulb2").css("opacity", sw_status);
            if(sw_status === 1){
                $("#widget5 input").attr("checked","checked");
                $("#widget5 input").prop("checked",true);
                $("#widget5 input").val(1);
            }else{
                $("#widget5 input").removeAttr("checked");
                $("#widget5 input").prop("checked",false);
                $("#widget5 input").val(0);
            }
        });
    };
    
    var pubTopic = function(){
        var topic = mWidget.topics;
        var url = "v1/" + device_id +topic[1].url;
        var payload = (1 - sw_status).toString();
        mMqtt.publish(url, payload, 0, true);
    };
    
    var destroy = function(){
        var topic = mWidget.topics;
        $('#widget5').off("change", "input");
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
        mMqtt.off(url);
        url = "v1/" + device_id + topic[0].url;
        mMqtt.unsubscribe(url);
    };
    
    var widget={
        Show:function(panel, el, wid, devId, mqtt){
            panel.one("unloadpanel", function(){
                $.molmc.goShowWidget = false; 
                destroy();
                el.empty();
            }); 
            initView(el, wid, devId, mqtt);
            initMqtt();
        },
    };
    return widget;
});
