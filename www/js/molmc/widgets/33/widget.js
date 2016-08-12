define(["tpl!./template/layout.tpl",
    "css!./css/style33"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    var pointValue;
    var pulseLine;
    var maxVal;
    var minVal;
    var unit;
    
    var getEl =function(){
        var pos0 = $(".pos0");
        var pos1 = $(".pos1");
        var pos2 = $(".pos2'");
        var pos3 = $(".pos3");
        var topic = mWidget.topics;
        maxVal = parseInt(topic[0].attribute.max);
        minVal = parseInt(topic[0].attribute.min);
        var offset = (maxVal - minVal)/4;
        unit = topic[0].attribute.unit;
        pos0.html(maxVal+unit);
        pos1.html(parseInt(maxVal-offset)+unit);
        pos2.html(parseInt(maxVal-offset*2)+unit);
        pos3.html(parseInt(maxVal-offset*3)+unit);
        setValue(minVal);
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
            setValue(parseFloat(currentAmount));
        }
        mMqtt.on(url, function(message){
            var str=message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                .replace(/ /gi,"&nbsp;")
                                .replace(/\'/g, "&#39;")
                                .replace(/\"/g, "&quot;")
                                .replace(/&/g, "&gt;")
                                .replace(/\n/gi,"<br>");
            setValue(parseFloat(str));     
        });        
    };

    var setValue = function(value){        
        var showValue = $("#level-tooltip p");
        var graphics = $("#level-graphics");
        var tooltip = $("#level-tooltip");
        var offset = (value-minVal)/(maxVal-minVal)*160;
        var speed = offset/300.00;
        showValue.html(value.toFixed(2)+unit);
        tooltip.css3Animate({y:-offset, origin:"0", time:300});
        graphics.css3Animate({height:-offset, origin:"0", time:300});
        var position = '0px ' + (177 - offset) + 'px';
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
