define(["tpl!./template/layout.tpl","css!./css/style48","./js/timer.js"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    var someTimer;
    var hour;
    var min;
    var sec;
    var customTimer={};
    
    var getEl =function(){
        someTimer=$('.someTimer');
        hour=$('input#timerH');
        min=$('input#timerM');
        sec=$('input#timerS');
    };
    var initView = function(el, wid, devId, mqtt){
        el.empty();
        mMqtt = mqtt;
        mWidget = wid;
        device_id = devId;
        var div = layoutTpl();
        el.append(div);
        getEl();
        initTimer();
        $('#widget48').on("tap", "button", function(){
            publish();
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
            console.log(currentAmount);
            updateTime(parseInt(currentAmount));
        }
        mMqtt.on(url, function(message){
            var str=message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                .replace(/ /gi,"&nbsp;")
                                .replace(/\'/g, "&#39;")
                                .replace(/\"/g, "&quot;")
                                .replace(/&/g, "&gt;")
                                .replace(/\n/gi,"<br>");
            console.log(str);
            updateTime(parseInt(str));
        });        
    }; 

    var initTimer = function(){
        console.log(someTimer);
        customTimer = someTimer.TimeCircles({
            count_past_zero:false,
            time : {
                Days: {
                    show: false,
                    text: "天",
                    color: "#FC6"
                },
                Hours: {
                    show: true,
                    text: _lang('graphic_hour'),
                    color: "#9CF"
                },
                Minutes: {
                    show: true,
                    text: _lang('graphic_min'),
                    color: "#BFB"
                },
                Seconds: {
                    show: true,
                    text: _lang('graphic_sec'),
                    color: "#F99"
                }
            }
        });
    };

    var updateTime = function(time){
        customTimer.updata(time);
    };

    var publish = function(){
        var time = parseInt(hour.val())*3600 + parseInt(min.val())*60 + parseInt(sec.val());
        if(time<0) time = 0;
        var topic = mWidget.topics;
        var url = "v1/" + device_id +topic[1].url;
        console.log(time);
        console.log(url);
        mMqtt.publish(url, time.toString(), 0, false);
    };

    var destroy = function(){
        var topic = mWidget.topics;
        var url = "mqtt:" + "v1/" + device_id + topic[0].url;
        mMqtt.off(url);
        $('#widget48').off("tap", "button");
        customTimer.destroy();
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
