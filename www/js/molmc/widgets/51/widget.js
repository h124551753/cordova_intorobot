define(["tpl!./template/layout.tpl",
    "css!./css/style51"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    
    var pet;
    var feedImg;
    var photo;
    var feed;
    
    var getEl =function(){
        pet = $("#widget51 #pet");
        feedImg = $("#widget51 #feed");
        photo = $("#widget51 .camera");
        feed = $("#widget51 .paw");
        
        photo.bind("tap", function(){
            pubTopic("photo")
        });
        feed.bind("tap", function(){
            pubTopic("feed");
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
                pet.addClass("petShow");
            }else{
                pet.removeClass("petShow");
            }
        }
        mMqtt.on(url, function(message){
            var sw_status = parseInt(message.payloadString)
            if(sw_status == '1'){
                pet.addClass("petShow");
            }else{
                pet.removeClass("petShow");
            }
        });
        url = "v1/" + device_id + topic[2].url;
        mMqtt.subscribe(url, 2, function(message){
            var str=message.payloadString;
            if(str == '1'){
                feedImg.addClass("openfeed");
            }else{
                feedImg.removeClass("openfeed");
            }
        });
    };    
    
    var pubTopic = function(type){
        var topic = mWidget.topics;
        var url = "v1/" + device_id + topic[1].url;
        var payload = "";
        if(type == "feed"){
            payload = JSON.stringify({feed:1, photo: 0});
            
        }else if(type == "photo"){
            payload = JSON.stringify({feed:0, photo: 1});
        }
        mMqtt.publish(url, payload, 0, false);
    };  
    
    var destroy = function(){
        feed.unbind("tap");
        photo.unbind("tap");
        var topic = mWidget.topics;
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
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
