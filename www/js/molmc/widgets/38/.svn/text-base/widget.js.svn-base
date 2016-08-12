define(["tpl!./template/layout.tpl"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    var touchFlag;
    
    var getEl =function(){
        touchFlag = $("#widget38 #touchFlag");
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
            if(parseInt(currentAmount) == 1){
                touchFlag.show();
            }else{
                touchFlag.hide();
            }
        }
        mMqtt.on(url, function(message){
            var str=message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                .replace(/ /gi,"&nbsp;")
                                .replace(/\'/g, "&#39;")
                                .replace(/\"/g, "&quot;")
                                .replace(/&/g, "&gt;")
                                .replace(/\n/gi,"<br>");
            if(touchFlag){
                if(parseInt(str) == 1){
                    touchFlag.show();
                }else{
                    touchFlag.hide();
                }
            }           
        });        
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
