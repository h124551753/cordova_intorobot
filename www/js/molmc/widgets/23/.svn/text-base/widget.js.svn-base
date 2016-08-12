define(["tpl!./template/layout.tpl",
    "css!./css/style_23"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var sw_status = 0;
    var url;
    var cssUrl_bak=[];
    var illu;

//    var widget = function(){
//        $("#showWidget_device").bind("unloadpanel", function(){
//            $.molmc.goShowWidget = false;
//            destroy();
//            $("#showWidget_device").unbind("unloadpanel");
//            $("#widgetPanel_device").empty();
//        });
//    };

    var getEl = function(){
        illu = $("#widget23_illumination");
    };

    var initView = function(el, wid, devId, mqtt){
        el.empty();
        mMqtt = mqtt;
        mWidget = wid;
        device_id = devId;
        var div = layoutTpl();
        el.append(div);
        getEl();
        $('#widget23').on("change", "input", function(e) {
            pubTopic();
        });
    };

    var initMqtt = function(){
        var topic = mWidget.topics;
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
        var currentAmount = mWidget.retain;
        if(!_.isEmpty(currentAmount)){
            currentAmount = currentAmount.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                    .replace(/ /gi,"&nbsp;")
                                    .replace(/\'/g, "&#39;")
                                    .replace(/\"/g, "&quot;")
                                    .replace(/&/g, "&gt;")
                                    .replace(/\n/gi,"<br>");
            if(illu){
                illu.html(parseFloat(currentAmount).toFixed(2)+" "+topic[0].attribute.unit);
            }
        }

        mMqtt.on(url, function(message){
            var str = message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                    .replace(/ /gi,"&nbsp;")
                                    .replace(/\'/g, "&#39;")
                                    .replace(/\"/g, "&quot;")
                                    .replace(/&/g, "&gt;")
                                    .replace(/\n/gi,"<br>");
            if(illu){
                illu.html(parseFloat(str).toFixed(2)+" "+topic[0].attribute.unit);
            }
        });

        $("#widget23 input").removeAttr("checked");
        var url2 = "v1/" + device_id + topic[1].url;
        mMqtt.subscribe(url2, 2, function(message){
            sw_status = parseInt(message.payloadString);
            $("#widget23 #light-bulb2").css("opacity", sw_status);
            if(sw_status === 1){
                $("#widget23 input").attr("checked","checked");
                $("#widget23 input").prop("checked",true);
                $("#widget23 input").val(1);
            }else{
                $("#widget23 input").removeAttr("checked");
                $("#widget23 input").prop("checked",false);
                $("#widget23 input").val(0);
            }
        });
    };

    var pubTopic = function(){
        var topic = mWidget.topics;
        var url = "v1/" + device_id +topic[2].url;
        var payload = (1 - sw_status).toString();
        mMqtt.publish(url, payload, 0, true);
    };

    var destroy = function(){
        $('#widget23').off("change", "input");
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
