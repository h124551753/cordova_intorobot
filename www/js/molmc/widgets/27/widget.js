define(["tpl!./template/layout.tpl",
    "css!./css/style_27"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var cssUrl_bak=[];
    
    var checkbody;
    
//    var widget = function(){
//                
//    };
    var getEl =function(){
        checkbody = $("#body_check"); 
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
    };
    
    var initMqtt = function(){        
        var topic = mWidget.topics;
        var url = "v1/" + device_id + topic[0].url;
        if(!_.isEmpty(mWidget.retain)){
            var currentAmount = mWidget.retain;
            if(currentAmount == true){
                checkbody.addClass("find");
            }else{
                checkbody.removeClass("find");
            }
        }
        mMqtt.subscribe(url, 2, function(message){
            if(message.payloadString != '0'){
                checkbody.addClass("find");
            }else{
                checkbody.removeClass("find");
            }
        });   
    };    
    
    var pubTopic = function(status){

    };    
    
    var destroy = function(){
        var topic = mWidget.topics;
        var url = "v1/" + device_id + topic[0].url;
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
