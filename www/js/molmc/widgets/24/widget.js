define(["tpl!./template/layout.tpl", "css!./css/style_24"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    
    var fan;
    var btn;
    var airTemp;
    var timer = false;
    var isremove=true;
    
//    var widget = function(){
//        $("#showWidget_device").bind("unloadpanel", function(){
//            $.molmc.goShowWidget = false;
//            destroy();    
//            $("#showWidget_device").unbind("unloadpanel");
//            $("#widgetPanel_device").empty();
//        });        
//    };
    var getEl =function(){

        fan = $("#widget24 #fan");
        btn = $("#widget24 input");
        airTemp = $("#widget24 #widget24_airTemp");
        initAction();
    };
    var initAction = function(){
        if(sessionStorage.getItem("isfreshanother")!=="false"){
            fan.addClass("start");
//            history.go(0);
            if(isremove){
                setTimeout(function(){
                    if(isremove){
                       fan.removeClass("start");
                    }
                },100);
            }
        }
        $('#widget24').on("change", "input", function(e) {
            if(fan.hasClass("start")){
                pubTopic("0");
            }else{
                pubTopic("1");
            }
        });
    };
    var pubTopic = function(status){
        var topic = mWidget.topics;
        var url = "v1/" + device_id +topic[2].url;
        var payload = status;
        mMqtt.publish(url, payload, 0, true);
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
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
        var currentAmount = mWidget.retain;
        if(!_.isEmpty(currentAmount)){
            currentAmount = currentAmount.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                    .replace(/ /gi,"&nbsp;")
                                    .replace(/\'/g, "&#39;")
                                    .replace(/\"/g, "&quot;")
                                    .replace(/&/g, "&gt;")
                                    .replace(/\n/gi,"<br>");
            if(airTemp){
                airTemp.html(parseFloat(currentAmount).toFixed(2)+" "+topic[0].attribute.unit);
            }
        }
        
        mMqtt.on(url, function(message){
            var str = message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                    .replace(/ /gi,"&nbsp;")
                                    .replace(/\'/g, "&#39;")
                                    .replace(/\"/g, "&quot;")
                                    .replace(/&/g, "&gt;")
                                    .replace(/\n/gi,"<br>");
            if(airTemp){
                airTemp.html(parseFloat(str).toFixed(2)+" "+topic[0].attribute.unit);
            }
        });
        var url2 = "v1/" + device_id + topic[1].url;
        mMqtt.subscribe(url2, 2, function(message){
            if(fan){
                if(message.payloadString == true){
                    fan.addClass("start");
                    btn.attr("checked","checked");
                    btn.prop('checked',true);
                }else{
                    fan.removeClass("start");
                    isremove=false;
                    btn.removeAttr("checked");
                    btn.prop('checked',false);
                }
            }
        });
        
    };      
   
    var destroy = function(){        
        button.unbind("tap");
        $('#widget24').off("change", "input");
        var topic = mWidget.topics;
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
        mMqtt.off(url);
        url = "v1/" + device_id + topic[0].url;
        mMqtt.unsubscribe(url);
        url = "v1/" + device_id + topic[1].url;
        mMqtt.unsubscribe(url);
    };
    
    var widget={
        Show:function(panel, el, wid, devId, mqtt){
            panel.one("unloadpanel", function(){
                sessionStorage.setItem("isfreshanother","false");
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
