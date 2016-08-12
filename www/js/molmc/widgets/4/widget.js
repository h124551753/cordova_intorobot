define(["tpl!./template/datapush.tpl"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    
    var disp;
    var input;
    var btn;
    var span;
    
//    var widget = function(){
//        $("#showWidget_device").bind("unloadpanel", function(){
//            $.molmc.goShowWidget = false;
//            destroy();    
//            $("#showWidget_device").unbind("unloadpanel");
//            $("#widgetPanel_device").empty();
//        });        
//    };
    var getEl =function(){
        disp = $("#datapush_display");
        input = $("#datapush > input");
        btn = $("#datapush > button");
        span = $("span#textsend_widget4");
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
        url = "v1/" + device_id + topic[0].url;
        
//        $.molmc.thermometer.thermometerCreate();
        mMqtt.subscribe(url, 2, function(message){
//            var amount = parseFloat(message.payloadString).toFixed(2);
            var str = message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                        .replace(/\'/g, "&#39;")
                                        .replace(/\"/g, "&quot;")
                                        .replace(/&/g, "&gt;")
                                        .replace(/\n/gi,"<br>");
            if(disp){
                disp.html(str);
            }
        });
        var url2 = "v1/" + device_id + topic[1].url;
        mMqtt.subscribe(url2, 2, function(message){
            if(span){
                if(message.payloadString==="1"){
                    span.html(_lang('widget_sendsucc'));
                }else{
                    span.html(_lang('widget_sendfail'));
                }
            }
        });
        
        btn.on("tap", function(e){
            var payload = input.val();
            mMqtt.publish(url, payload, 0, true);
        });
        
    };      
   
    var destroy = function(){   
        btn.unbind("tap");
        var topic = mWidget.topics;
        url = "v1/" + device_id + topic[0].url;
        mMqtt.unsubscribe(url);
        url = "v1/" + device_id + topic[1].url;
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
