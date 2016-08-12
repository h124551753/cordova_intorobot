define(["tpl!./template/layout.tpl",
    "css!./css/style47"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    var warningEl;
    var graphics;
    
    var getEl =function(){
        warningEl = $("#widget47 .flicker");
        console.log(warningEl);
        graphics = $("#widget47 #level-graphics");            
    };
    var initView = function(el, wid, devId, mqtt){
        el.empty();
        mMqtt = mqtt;
        mWidget = wid;
        device_id = devId;
        var div = layoutTpl();
        el.append(div);
        getEl();
        normal(); 
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
            if(currentAmount == 1){
                overflow();
            }else{
                normal();
            }
        }
        mMqtt.on(url, function(message){
            var str=message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                .replace(/ /gi,"&nbsp;")
                                .replace(/\'/g, "&#39;")
                                .replace(/\"/g, "&quot;")
                                .replace(/&/g, "&gt;")
                                .replace(/\n/gi,"<br>");
            if(str == 1){
                overflow();
            }else{
                normal();
            }     
        });        
    };

    var overflow = function(){
        warningEl.show();
        navigator.notification.beep(5);
        graphics.css3Animate({height:-30, origin:"0", time:300});
        var position = '0px 30px';
        graphics.css('background-position', position);
    };
    var normal = function(){
        warningEl.hide();
        graphics.css3Animate({height:-130, origin:"0", time:300});
        var position = '0px 130px';
        graphics.css('background-position', position);
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
