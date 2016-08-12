define(["tpl!./template/layout.tpl",
    "css!./css/style50"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    
    var wastebin;
    var button;
    var countNum;
    
    var getEl =function(){
        wastebin = $("#wastebin");
        countNum = $("#countNum");
        $("#widget50").on("tap", "button", function(){
            if(wastebin.hasClass("openWastebin")){
                pubTopic("0");
            }else{
                pubTopic("1");
            }
        });
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
                wastebin.addClass("openWastebin");
                $('#widget50 button').html("关闭");
            }else{
                wastebin.removeClass("openWastebin");
                $('#widget50 button').html("打开");
            }
        }
        mMqtt.on(url, function(message){
            var sw_status = parseInt(message.payloadString)
            if(sw_status == '1'){
                wastebin.addClass("openWastebin");
                $('#widget50 button').html("关闭");
            }else{
                wastebin.removeClass("openWastebin");
                $('#widget50 button').html("打开");
            }
        });
        url = "v1/" + device_id + topic[2].url;
        mMqtt.subscribe(url, 2, function(message){
            var str=message.payloadString;
            if(countNum){
                countNum.html(parseInt(str));
            }
        });
    };    
    
    var pubTopic = function(value){
        var topic = mWidget.topics;
        var url = "v1/" + device_id + topic[1].url;
        mMqtt.publish(url, value, 0, false);
    };  
    
    var destroy = function(){
        $("#widget50").off("tap", "button");
        var topic = mWidget.topics;
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
        mMqtt.off(url);
        url = "v1/" + device_id + topic[0].url;
        mMqtt.unsubscribe(url);

        url = "v1/" + device_id + topic[2].url;
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
