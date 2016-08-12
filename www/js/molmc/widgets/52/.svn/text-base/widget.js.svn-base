define(["tpl!./template/layout.tpl",
    "css!./css/style52"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];

    var tinyCloud;

    var getEl =function(){
        tinyCloud = $("#tinyCloud");
        countNum = $("#countNum");
        $("#widget52").on("tap", "button", function(){
            pubTopic("1");
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
                tinyCloud.addClass("tinyOpen");
                $('#widget52 button').addClass("open");
            }else{
                tinyCloud.removeClass("tinyOpen");
                $('#widget52 button').removeClass("open");
            }
            $('#widget52 button').html("打开");
        }
        mMqtt.on(url, function(message){
            var sw_status = parseInt(message.payloadString)
            if(sw_status == '1'){
                tinyCloud.addClass("tinyOpen");
                $('#widget52 button').addClass("open");
            }else{
                tinyCloud.removeClass("tinyOpen");
                $('#widget52 button').removeClass("open");
            }
        });
    };

    var pubTopic = function(value){
        var topic = mWidget.topics;
        var url = "v1/" + device_id + topic[1].url;
        mMqtt.publish(url, value, 0, false);
    };

    var destroy = function(){
        $("#widget52").off("tap", "button");
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
