define(["tpl!./template/layout.tpl","css!./css/style41"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    var turnOff;
    var turnOn;
    
    var getEl =function(){
        turnOff = $('.fa-volume-off');
        turnOn = $('.fa-volume-up');
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
            currentAmount = currentAmount.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                    .replace(/ /gi,"&nbsp;")
                                    .replace(/\'/g, "&#39;")
                                    .replace(/\"/g, "&quot;")
                                    .replace(/&/g, "&gt;")
                                    .replace(/\n/gi,"<br>");
            if(parseInt(currentAmount) == 0){
                turnOffFunc();
            }else{
                turnOnFunc();
            }
        }
        mMqtt.on(url, function(message){
            var str=message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                .replace(/ /gi,"&nbsp;")
                                .replace(/\'/g, "&#39;")
                                .replace(/\"/g, "&quot;")
                                .replace(/&/g, "&gt;")
                                .replace(/\n/gi,"<br>");
            if(parseInt(str) == 0){
                turnOffFunc();
            }else{
                turnOnFunc();
            }
        });        
    };    

    var turnOffFunc = function(){
        turnOn.hide();
        turnOff.show();
    };
    var turnOnFunc = function(){
        navigator.notification.beep(5);
        turnOn.show();
        turnOff.hide();
    };
    var destroy = function(){
        var topic = mWidget.topics;
        var url = "mqtt:" + "v1/" + device_id + topic[0].url;
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
