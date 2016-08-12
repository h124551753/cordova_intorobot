define(["tpl!./template/layout.tpl",
    "css!./css/style_30"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var cssUrl_bak=[];
    
    var aircondition;
    var Temperature_up;
    var Temperature_down;
    var info_aircondition=this;
    info_aircondition.temperature=25;
    info_aircondition.switch=0;
//    var widget = function(){
//        $("#showWidget_device").bind("unloadpanel", function(){
//            $.molmc.goShowWidget = false;
//            destroy();    
//            $("#showWidget_device").unbind("unloadpanel");
//            $("#widgetPanel_device").empty();
//        });        
//    };
    var getEl =function(){
        aircondition = $("#aircondition_widget30"); 
        Temperature_up = $("#Temperature_up");
        Temperature_down = $("#Temperature_down");
        initAction();
    };
    
    var initAction = function(){
         $("#widget30").on("change", "input", function(e) {
            if(aircondition.attr("checked") == "null" || aircondition.attr("checked")==undefined){
                aircondition.attr("checked", "checked");
                info_aircondition.switch=1;
            }else{
                aircondition.removeAttr("checked");
                info_aircondition.switch=0;
            }
            pubTopic();
        });
        $("#Temperature_up").bind("tap",function(){
            if(info_aircondition.temperature<30){
                info_aircondition.temperature++;
                $("#thermometer").html(info_aircondition.temperature);
                pubTopic();
            }
        });
        $("#Temperature_down").bind("tap",function(){
            if(info_aircondition.temperature>16){
                info_aircondition.temperature--;
                $("#thermometer").html(info_aircondition.temperature);
                pubTopic();
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
        var url = "v1/" + device_id + topic[1].url;    
        mMqtt.subscribe(url, 2, function(message){    
            if(message.payloadString != '0'){
                curtaincontrol.addClass("open");
                curtainstatus.prop("checked",true);
            }else{
                curtaincontrol.removeClass("open");
                curtainstatus.prop("checked",false);
            }
        });     
    };    
    
    var pubTopic = function(status){        
        var topic = mWidget.topics;
        var url = "v1/" + device_id +topic[0].url;
        var payload = JSON.stringify({mode:0, temp:info_aircondition.temperature, switch: info_aircondition.switch})
        if(info_aircondition.switch==1){
            $(".show span").show();
        }
        else{
            $(".show span").hide();
        }
        mMqtt.publish(url, payload, 0, true);
    };    
    
    var destroy = function(){
        var topic = mWidget.topics;
        var url = "v1/" + device_id + topic[1].url;
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
