define(["tpl!./template/layout.tpl",
    "css!./css/style_29"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var cssUrl_bak=[];
    
    var curtaincontrol;
    var curtainstatus;
    
//    var widget = function(){
//        $("#showWidget_device").bind("unloadpanel", function(){
//            $.molmc.goShowWidget = false;
//            destroy();    
//            $("#showWidget_device").unbind("unloadpanel");
//            $("#widgetPanel_device").empty();
//        });        
//    };
    var getEl =function(){
        curtaincontrol = $("#curtaincontrol"); 
        curtainstatus = $("#toggle_status");
        initAction();
    };
    
    var initAction = function(){

    };
    var initView = function(el, wid, devId, mqtt){
        el.empty();
        mMqtt = mqtt;
        mWidget = wid;
        device_id = devId;
        var div = layoutTpl();
        el.append(div);
        getEl();
         $("#widget29").on("change", "#toggle_status", function() {
            pubTopic();
        });
    };
    
    var initMqtt = function(){   
        var topic = mWidget.topics;
        var url = "v1/" + device_id + topic[1].url;    
        if(!_.isEmpty(mWidget.retain)){
            var currentAmount = mWidget.retain;
            if(currentAmount == 1){
                curtaincontrol.addClass("open");
                curtainstatus.prop("checked",true);
            }else{
                curtaincontrol.removeClass("open");
                curtainstatus.prop("checked",false);
            }
        }
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
        if(curtainstatus.prop()){
            mMqtt.publish(url,"1",0,true);
        }
        else{
            mMqtt.publish(url,"0",0,true);
        }
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
