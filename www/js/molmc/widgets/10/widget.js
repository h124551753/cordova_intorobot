define(["tpl!./template/layout.tpl",
    "css!./css/style10"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var cssUrl_bak=[];
    
    var emergencyTimer;

//    var widget = function(){
//        $("#showWidget_device").bind("unloadpanel", function(){
//            $.molmc.goShowWidget = false;
//            destroy();    
//            $("#showWidget_device").unbind("unloadpanel");
//            $("#widgetPanel_device").empty();
//        });        
//    };
    var getEl =function(){
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
        var url = "v1/" + device_id + topic[0].url;
        mMqtt.subscribe(url, 2, function(message){
            if(message.payloadString == '0'){
                $("#emergency-disp1").css("opacity","1");
                $("#emergency-disp2").css("opacity","1");
                $("#emergency-disp0").css("opacity","1");
                if(emergencyTimer){
                    clearInterval(emergencyTimer);
                }
            }else{
                if(emergencyTimer){
                    clearInterval(emergencyTimer);
                }
                emergencyTimer = setInterval(function(){
                    if(disp === 1){
                        $("#emergency-disp1").css("opacity","1");
                        $("#emergency-disp2").css("opacity","0");
                        $("#emergency-disp0").css("opacity","0");
                        disp = 2;
                    }else{
                        $("#emergency-disp2").css("opacity","1");
                        disp = 1;
                    }
                },400);
            }
        });
    };

    var initAction = function(){
    };
    
    var pubTopic = function(){
    };    
    
    var destroy = function(){
        var topic = mWidget.topics;
        var url = "v1/" + device_id + topic[0].url;
        mMqtt.unsubscribe(url);
        if(emergencyTimer){
            clearInterval(emergencyTimer);
        }
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
            initAction();
        },
    };
    return widget;
});
