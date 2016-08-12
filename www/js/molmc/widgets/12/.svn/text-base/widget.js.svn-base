define(["tpl!./template/layout.tpl",
    "css!./css/style_12"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    
    var soilHumidity;
    var illumination;
    var airTemp;
    var airHumidity;
    var sprinkler;
    var water;
    var timeSelect;
    
//    var widget = function(){
//        $("#showWidget_device").bind("unloadpanel", function(){
//            $.molmc.goShowWidget = false;
//            destroy();    
//            $("#showWidget_device").unbind("unloadpanel");
//            $("#widgetPanel_device").empty();
//        });        
//    };
    var getEl =function(){
        soilHumidity = $("#widget12_soilHumidity");
        illumination = $("#widget12_illumination");
        airTemp = $("#widget12_airTemp");
        airHumidity = $("#widget12_airHumidity");
        sprinkler = $("#sprinkler");
        water = $("#water");
        timeSelect = $("#widget12 select");
    };
    var initView = function(el, wid, devId, mqtt){
        el.empty();
        mMqtt = mqtt;
        mWidget = wid;
        device_id = devId;
        var div = layoutTpl();
        el.append(div);
        getEl();
        $("#widget12").on("tap", $("#sprinkler"), function(e){
            sprinking();
        });
        $("#widget12").on("change", "select", function(e){
            setTime();
        });
    };
    
    var initMqtt = function(){        
        var topic = mWidget.topics;
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
        if(!_.isEmpty(mWidget.retain)){
            var currentAmount = mWidget.retain;
            currentAmount = currentAmount.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                    .replace(/ /gi,"&nbsp;")
                                    .replace(/\'/g, "&#39;")
                                    .replace(/\"/g, "&quot;")
                                    .replace(/&/g, "&gt;")
                                    .replace(/\n/gi,"<br>");
            soilHumidity.html(parseFloat(currentAmount).toFixed(2)+" "+topic[0].attribute.unit);
        }
        mMqtt.on(url, function(message){
            var str=message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                .replace(/ /gi,"&nbsp;")
                                .replace(/\'/g, "&#39;")
                                .replace(/\"/g, "&quot;")
                                .replace(/&/g, "&gt;")
                                .replace(/\n/gi,"<br>");
            if(soilHumidity){
                soilHumidity.html(parseFloat(str).toFixed(2)+" "+topic[0].attribute.unit);
            }           
        });
        url = "v1/" + device_id + topic[1].url;
        mMqtt.subscribe(url, 2, function(message){
            var str=message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                .replace(/ /gi,"&nbsp;")
                                .replace(/\'/g, "&#39;")
                                .replace(/\"/g, "&quot;")
                                .replace(/&/g, "&gt;")
                                .replace(/\n/gi,"<br>");
            if(illumination){
                illumination.html(parseFloat(str).toFixed(2)+" "+topic[1].attribute.unit);
            }
        });
        url = "v1/" + device_id + topic[2].url;
        mMqtt.subscribe(url, 2, function(message){
            var str=message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                .replace(/ /gi,"&nbsp;")
                                .replace(/\'/g, "&#39;")
                                .replace(/\"/g, "&quot;")
                                .replace(/&/g, "&gt;")
                                .replace(/\n/gi,"<br>");
            if(airTemp){
                airTemp.html(parseFloat(str).toFixed(2)+" "+topic[2].attribute.unit);
            }
        });
        url = "v1/" + device_id + topic[3].url;
        mMqtt.subscribe(url, 2, function(message){
            var str=message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                .replace(/ /gi,"&nbsp;")
                                .replace(/\'/g, "&#39;")
                                .replace(/\"/g, "&quot;")
                                .replace(/&/g, "&gt;")
                                .replace(/\n/gi,"<br>");
            if(airHumidity){
                airHumidity.html(parseFloat(str).toFixed(2)+" "+topic[3].attribute.unit);
            }
        });
        url = "v1/" + device_id + topic[5].url;
        mMqtt.subscribe(url, 2, function(message){
            if(sprinkler){
                if(message.payloadString=="1"){
                    sprinkler.addClass("watering");
                    water.addClass("rain");
                }else{
                    sprinkler.removeClass("watering");
                    water.removeClass("rain");
                }
            }
        });
    };    
    
    var pubTopic = function(status, time){
        var topic = mWidget.topics;
        var url = "v1/" + device_id +topic[4].url;
        var payload = JSON.stringify({status:status, time:time});
        mMqtt.publish(url, payload, 0, false);
    };
    
    var sprinking = function(){
        if(sprinkler.hasClass("watering")){
            sprinkler.removeClass("watering");
            pubTopic(0, 0);
        }else{
            var time = timeSelect.val();
            sprinkler.addClass("watering");
            pubTopic(1, parseInt(time));
        }
    };
    
    var setTime = function(){
        if(sprinkler.hasClass("watering")){
            var time = timeSelect.val();
            pubTopic(1, parseInt(time));
        }
    };
    
    var destroy = function(){
        $("#widget12").off("tap", $("#sprinkler"));
        $("#widget12").off("change", "select");
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

        url = "v1/" + device_id + topic[5].url;
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
