define(["tpl!./template/layout.tpl",
    "css!./css/style9"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var cssUrl_bak=[];
    
    var button;

//    var widget = function(){
//        $("#showWidget_device").bind("unloadpanel", function(){
//            $.molmc.goShowWidget = false;
//            destroy();    
//            $("#showWidget_device").unbind("unloadpanel");
//            $("#widgetPanel_device").empty();
//        });        
//    };
    var getEl =function(){
        button = $('#widget9 input');
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
    };

    var initAction = function(){
        button.on("change", function(e) {
            if($(this).prop('checked')){
                pubTopic(0);
            }else{
                pubTopic(1);
            }
            var $this = $(this);
            $this.attr("disabled", 'disabled');
            setTimeout(function(){
                $this.removeAttr("disabled");
            }, 1000);
        });
    };
    
    var pubTopic = function(value){
        var topic = mWidget.topics;
        var url = "v1/" + device_id +topic[0].url;
        var payload = (1 - value).toString();
        mMqtt.publish(url, payload, 0, true);
    };    
    
    var destroy = function(){
        button.off('change');
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
            initAction();
        },
    };
    return widget;
});
