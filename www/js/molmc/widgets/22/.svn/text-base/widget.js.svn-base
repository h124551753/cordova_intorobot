define(["tpl!./template/layout.tpl",
    "css!./css/style_22"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    
    var fan;
    var button;
    var isremove=true;
    
//    var widget = function(){
//               
//    };
    var getEl =function(){
        fan = $("#widget22 #fan");
        button = $("#widget22 input");   
        initAction();
    };
    
    var initAction = function(){
        if(sessionStorage.getItem("isfresh")!=="false"){
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
        
        $('#widget22').on("change", "input", function() {
            if(fan.hasClass("start")){
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
        var time = 0;
        var topic = mWidget.topics;
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
        if(!_.isEmpty(mWidget.retain)){
            var currentAmount = mWidget.retain;
            if(currentAmount == '0'){
                fan.removeClass("start");
                button.removeAttr("checked");
                button.prop('checked',false);
            }else{
                fan.addClass("start");
                isremove=false;
                button.attr("checked","checked");
                button.prop('checked',true);
            }
        }
        mMqtt.on(url, function(message){
            if(button){
                if(message.payloadString == '0'){
                    fan.removeClass("start");
                    button.removeAttr("checked");
                    button.prop('checked',false);
                }else{
                    fan.addClass("start");
                    button.attr("checked","checked");
                    button.prop('checked',true);
                }
            }    
        });
        
    };   
    var pubTopic = function(status){
        var topic = mWidget.topics;
        var url = "v1/" + device_id +topic[1].url;
        var payload = status;
        mMqtt.publish(url, payload, 0, true);
    };    
    
    var destroy = function(){
        button.unbind("tap");
        var topic = mWidget.topics;
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
        mMqtt.off(url);
        url = "v1/" + device_id + topic[0].url;
        mMqtt.unsubscribe(url);
    };
    var widget={
        Show:function(panel, el, wid, devId, mqtt){
            panel.one("unloadpanel", function(){
                sessionStorage.setItem("isfresh","false");
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
