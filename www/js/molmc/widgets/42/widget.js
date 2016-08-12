define(["./shape.js","tpl!./template/layout.tpl"], function(shape, layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    var turnOff;
    var turnOn;
    var timer;
    
    var getEl =function(){
        turnOff = $('.fa-volume-off');
        turnOn = $('.fa-volume-up');
        timer = {};
        shape.init([20,10]);
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
                shakeOff();
            }else{
                shakeOn();
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
                shakeOff();
            }else{
                shakeOn();
            }
        });        
    };    

    var shakeOff = function(){
        if(timer){            
            clearInterval(timer);
        }
        shape.stopShake([20,10]);
    };
    var shakeOn = function(){
        var i = 0;
        if(timer !== undefined){
            timer = setInterval(function(){
                i ++;
                navigator.notification.vibrate(800);
                if(i >= 5){
                    clearInterval(timer);
                }
            }, 1000);    
        }  
        shape.shake([20,10]);
    };
    var destroy = function(){
        if(timer){            
            clearInterval(timer);
        }
        shape.destroy(); 
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
