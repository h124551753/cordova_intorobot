define(["tpl!./template/thermometer.tpl",
    "css!./css/style_2", "./thermometer.js"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    
    var thermometer;
    
//    var widget = function(){
//        $("#showWidget_device").bind("unloadpanel", function(){
//            $.molmc.goShowWidget = false;
//            destroy();
//            $("#showWidget_device").unbind("unloadpanel");
//            $("#widgetPanel_device").empty();
//        });        
//    };
    var getEl =function(){
        thermometer = $("#widget-thermometer");
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
        var minVal = parseInt(topic[0].attribute.min);
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
        var currentAmount = mWidget.retain;
        if(!_.isEmpty(currentAmount)){
            currentAmount = parseFloat(currentAmount).toFixed(2)
        }else{
            currentAmount = minVal;
        }
        $.molmc.thermometer.thermometerCreate({
            currentAmount:parseFloat(currentAmount),
            goalAmount:maxVal,
            minAmount:minVal,
            unit:topic[0].attribute.unit
        }, thermometer);
        mMqtt.on(url, function(message){
            var amount = parseFloat(message.payloadString).toFixed(2);
            if(thermometer){
                $.molmc.thermometer.thermometerUpdate({currentAmount:parseFloat(amount)},thermometer);
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
            $("#showWidget_device").one("unloadpanel", function(){
                $.molmc.goShowWidget = false;
                destroy();
                el.empty();
            });
            initView(el, wid, devId, mqtt);
            initMqtt();
        },
    };
//    var Widget = new widget();
    return widget;
});
