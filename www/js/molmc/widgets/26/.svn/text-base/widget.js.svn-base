define(["tpl!./template/humidity.tpl",
    "css!./css/style_26", "./humidity.js"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    
    var humidity;
    
//    var widget = function(){
//        $("#showWidget_device").bind("unloadpanel", function(){
//            $.molmc.goShowWidget = false;
//            destroy();    
//            $("#showWidget_device").unbind("unloadpanel");
//            $("#widgetPanel_device").empty();
//        });        
//    };
    var getEl =function(){
        humidity = $("#widget-humidity");
    };
    var initView = function(el, wid, devId, mqtt){
        el.empty();
        mMqtt = mqtt;
        mWidget = wid;
        device_id = devId;
        var div = layoutTpl();
        el.append(div);
        getEl();
    };
    
    var initMqtt = function(){        
        var topic = mWidget.topics;
        var maxVal = parseInt(topic[0].attribute.max);
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
        var currentAmount = mWidget.retain;
        if(!_.isEmpty(currentAmount)){
            currentAmount = parseFloat(currentAmount).toFixed(2)
        }else{
            currentAmount = 0;
        }
        $.molmc.humidity.humidityCreate({
            currentAmount:parseFloat(currentAmount),
            goalAmount:maxVal,
            widthOfNums:maxVal/4,
            unit:topic[0].attribute.unit
        }, humidity);
        mMqtt.on(url, function(message){
            var amount = parseFloat(message.payloadString).toFixed(2);
            if(humidity){
                $.molmc.humidity.humidityUpdate({currentAmount:parseFloat(amount)},humidity);
            }           
        });        
    };      
   
    var destroy = function(){        
        var topic = mWidget.topics;
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
