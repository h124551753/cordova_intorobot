define(["tpl!./template/layout.tpl",
    "css!./css/style49"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    
    var illumination;
    var airTemp;
    var pm;
    var humidity;
    var cage;
    
    var getEl =function(){
        illumination = $("#widget49_ill");
        airTemp = $("#widget49_temp");
        pm = $("#widget49_pm");
        humidity = $("#widget49_humidity");
        cage = $("#cage");
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
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
        if(!_.isEmpty(mWidget.retain)){
            var currentAmount = mWidget.retain;
            if(currentAmount == '1'){
                cage.addClass('bird');
            }else{
                cage.removeClass('bird');
            }
        }
        mMqtt.on(url, function(message){
            var sw_status = parseInt(message.payloadString)
            if(sw_status == '1'){
                cage.addClass('bird');
            }else{
                cage.removeClass('bird');
            }
        });
        url = "v1/" + device_id + topic[1].url;
        mMqtt.subscribe(url, 2, function(message){
            var str=message.payloadString;
            if(airTemp){
                airTemp.html(parseFloat(str).toFixed(2)+" "+topic[1].attribute.unit);
            }
        });
        url = "v1/" + device_id + topic[2].url;
        mMqtt.subscribe(url, 2, function(message){
            var str=message.payloadString;
            if(humidity){
                humidity.html(parseFloat(str).toFixed(2)+" "+topic[2].attribute.unit);
            }
        });
        url = "v1/" + device_id + topic[3].url;
        mMqtt.subscribe(url, 2, function(message){
            var str=message.payloadString;
            if(illumination){
                illumination.html(parseFloat(str).toFixed(2)+" "+topic[3].attribute.unit);
            }
        });
        url = "v1/" + device_id + topic[4].url;
        mMqtt.subscribe(url, 2, function(message){
            var str=message.payloadString;
            if(pm){
                pm.html(parseFloat(str).toFixed(2)+" "+topic[4].attribute.unit);
            }
        });
    };    
    
    var destroy = function(){
        var topic = mWidget.topics;
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
        mMqtt.off(url);
        url = "v1/" + device_id + topic[0].url;
        mMqtt.unsubscribe(url);

        url = "v1/" + device_id + topic[1].url;
        mMqtt.unsubscribe(url);

        url = "v1/" + device_id + topic[2].url;
        mMqtt.unsubscribe(url);

        url = "v1/" + device_id + topic[3].url;
        mMqtt.unsubscribe(url);

        url = "v1/" + device_id + topic[4].url;
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
