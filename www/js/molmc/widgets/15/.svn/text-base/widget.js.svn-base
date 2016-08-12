define(["tpl!./template/layout.tpl",
    "css!./css/style15"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var cssUrl_bak=[];
    
    var optStatus;
    var slider;
    var armbase;
    var armshoulder;
    var armelbow;
    var armwrist;
    var armwrist_rotate;
    var armgripper;
    var resetButton;
    var curjsonobj;

//    var widget = function(){
//        $("#showWidget_device").bind("unloadpanel", function(){
//            $.molmc.goShowWidget = false;
//            destroy();    
//            $("#showWidget_device").unbind("unloadpanel");
//            $("#widgetPanel_device").empty();
//        });        
//    };
    var getEl =function(){
        optStatus = $('#widget15 arm_status')
        slider = $('#widget15 .slider');
        armbase = $('#widget15 #arm-base');
        armshoulder = $('#widget15 #arm-shoulder');
        armelbow = $('#widget15 #arm-elbow');
        armwrist = $('#widget15 #arm-wrist');
        armwrist_rotate = $('#widget15 #arm-wrist_rotate');
        armgripper = $('#widget15 #arm-gripper');
        resetButton = $('#widget15 button');
    };
    
    var initView = function(el, wid, devId, mqtt){
        el.empty();
        mMqtt = mqtt;
        mWidget = wid;
        device_id = devId;
        var div = layoutTpl();
        el.append(div);
        getEl();
        slider.molmcSlider({
            min:'-90',
            max:'90',
            autoTemplate:false,
//            stop:function(){
//                pubTopic();
//            }
        });
        resetButton.on('click', function(){
            armbase.molmcSlider('value', 0);
            armshoulder.molmcSlider('value', 0);
            armelbow.molmcSlider('value', 0);
            armwrist.molmcSlider('value', 0);
            armwrist_rotate.molmcSlider('value', 0);
            armgripper.molmcSlider('value', 0);
            pubTopic();
        });
        slider.on('change', function(){
            pubTopic();
        });
    };
    
    var initMqtt = function(){        
        var topic = mWidget.topics;
        var url = "v1/" + device_id + topic[0].url;
        mMqtt.subscribe(url, 2, function(message){
            mMqtt.unsubscribe(message.destinationName);
            var mode=JSON.parse(message.payloadString);
            armbase.molmcSlider('value', parseInt(mode.b)),
            armshoulder.molmcSlider('value', parseInt(mode.s)),
            armelbow.molmcSlider('value', parseInt(mode.e)),
            armwrist.molmcSlider('value', parseInt(mode.w)),
            armwrist_rotate.molmcSlider('value', parseInt(mode.wr)),
            armgripper.molmcSlider('value', parseInt(mode.g))
        });

        var url = "v1/" + device_id + topic[1].url;
        mMqtt.subscribe(url, 2, function(message){
            if(message.payloadString == '0'){
                optStatus.html(_lang('widgetlist_topicname_optFail'));
            }
        });      
    };

    var initAction = function(){
    };
    
    var pubTopic = function(){
        var obj = {
            "b":parseInt(armbase.val()), 
            "s":parseInt(armshoulder.val()), 
            "e":parseInt(armelbow.val()), 
            "w":parseInt(armwrist.val()), 
            "wr":parseInt(armwrist_rotate.val()), 
            "g":parseInt(armgripper.val())
        };
        var topic = mWidget.topics;
        var url = "v1/" + device_id +topic[0].url;
        var payload = JSON.stringify(obj);
        if(curjsonobj===payload){
            return;
        };    
        curjsonobj = payload;
        mMqtt.publish(url, payload, 0, true);
    };    
    
    var destroy = function(){
        resetButton.off('click');
        $("#widget15").off('touchend');
        slider.molmcSlider('destroy');
        var topic = mWidget.topics;
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
            initAction();
        },
    };
    return widget;
});
