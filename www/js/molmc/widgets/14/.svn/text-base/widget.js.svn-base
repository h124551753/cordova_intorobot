define(["tpl!./template/layout.tpl"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    
    var topic;
    var time = "";
    var initVal = 0;
    var min_val;
    var max_val;
    var unit;
    var bgData;
    
    var gasCanvas;
   
//    var widget = function(){
//        $("#showWidget_device").bind("unloadpanel", function(){
//            $.molmc.goShowWidget = false;
//            destroy();
//            $("#showWidget_device").unbind("unloadpanel");
//            $("#widgetPanel_device").empty();
//        });        
//    };
    var getEl = function(){
        gasCanvas = $("#widget14_gasCanvas")[0];
        canvasView();
    };
    var canvasView = function(){
        topic = mWidget.topics;
        min_val = topic[0].attribute.min;
        max_val = topic[0].attribute.max;
        unit = topic[0].attribute.unit;
        drawBG();
        setVal(0);
    };
    var setVal = function(val){
        clearInterval(time);
        var targetVal = val;
//        var intervalTime = 300/Math.abs(val-initVal);
        var intervalTime = (val-initVal)?300/Math.abs(val-initVal):300;
        time = setInterval(function(){
            drawVal(initVal, 0, 100);
            if(initVal == targetVal){
                clearInterval(time);
                return;
            }else if(initVal > targetVal){
                initVal--;
                if(initVal<targetVal){
                    clearInterval(time);
                }
            }else{
                initVal++;
                if(initVal>targetVal){
                    clearInterval(time);
                }
            }
        }, intervalTime);
    };
    
    var drawBG = function(){
        function PI(deg){
            return deg/180*Math.PI;
        }
        var context = gasCanvas.getContext('2d');
        var gradient;
        var pi=Math.PI;
        var width = gasCanvas.width/2;
        var height = width;
        var radius = Math.min(width-40, 150);

        context.beginPath();
        context.arc(width, width, radius, PI(150), PI(180), false);
        context.lineWidth = 20;
        context.lineCap="round";
        var gradient=context.createLinearGradient(width,width+radius+10,width-radius-10,width);
        gradient.addColorStop("0.6",'rgb(50, 255, 0)');
        gradient.addColorStop("0.9",'rgb(150, 255, 0)');
        context.strokeStyle = gradient;
        context.stroke();

        context.beginPath();
        context.arc(width, width, radius, PI(180), PI(270), false);
        context.lineWidth = 20;
        context.lineCap="butt";
        gradient=context.createLinearGradient(width-radius-10,width,width,width-radius-10);
        gradient.addColorStop("0",'rgb(150, 255, 0)');
        gradient.addColorStop("0.6",'rgb(255, 255, 0)');
        gradient.addColorStop("0.9",'rgb(255, 100, 0)');
        context.strokeStyle = gradient;
        context.stroke();

        context.beginPath();
        context.arc(width, width, radius, PI(270), PI(0), false);
        context.lineWidth = 20;
        context.lineCap="butt";
        gradient=context.createLinearGradient(width,width-radius-10,width+radius+10,width);
        gradient.addColorStop("0.1",'rgb(255, 100, 0)');
        gradient.addColorStop("0.9",'rgb(100, 0, 100)');
        context.strokeStyle = gradient;
        context.stroke();

        context.beginPath();
        context.arc(width, width, radius, PI(0), PI(30), false);
        context.lineWidth = 20;
        context.lineCap="round";
        gradient=context.createLinearGradient(width+radius+10,width,width,width+radius+10);
        gradient.addColorStop("0",'rgb(100, 0, 100)');
        gradient.addColorStop("0.4",'rgb(0, 0, 0)');
        context.strokeStyle = gradient;
        context.stroke();
        context.closePath();

        context.font="15px Arial";
        text = max_val/2;
        length = context.measureText(text).width/2;
        context.fillText(text,width-length,20);

        context.font="15px Arial";
        text = max_val/4;
        length = context.measureText(text).width/2;
        context.fillText(text,width-radius*Math.cos(pi/6)-length-25,width-radius*Math.sin(pi/6)-5);

        context.font="15px Arial";
        text = max_val/4*3;
        length = context.measureText(text).width/2;
        context.fillText(text,width+radius*Math.cos(pi/6)-length+25,width-radius*Math.sin(pi/6)-5);

        context.font="15px Arial";
        text = min_val;
        length = context.measureText(text).width/2;
        context.fillText(text,width-radius*Math.cos(pi/6)-length,radius*Math.sin(pi/6)+width+30);

        context.font="15px Arial";
        text = max_val;
        length = context.measureText(text).width/2;
        context.fillText(text,width+radius*Math.cos(pi/6)-length,radius*Math.sin(pi/6)+width+30);

        bgData = context.getImageData(0,0,gasCanvas.width,gasCanvas.height);
    };
    
    var drawVal = function(val){
        if(!gasCanvas){
            return;
        }
        function PI(deg){
            return deg/180*Math.PI;
        }
        var context = gasCanvas.getContext('2d');
        var width = gasCanvas.width/2;
        var height = width;
        var radius = Math.min(width-40, 150);
        var pi=Math.PI;
        context.clearRect(0,0, width*2, height*2);
        context.putImageData(bgData,0,0);
        var sqe = 240*val/max_val+150;
        var arc_cos = Math.cos(pi*2*sqe/360);
        var arc_sin = Math.sin(pi*2*sqe/360);

        context.beginPath();
        context.arc(width+radius*arc_cos, width+radius*arc_sin, 9, PI(0), PI(360), false);
        context.lineWidth = 2;
        context.strokeStyle = "white";
        context.stroke();

        context.beginPath();
        context.arc(width+radius*arc_cos, width+radius*arc_sin, 7, PI(0), PI(360), false);
        context.lineWidth = 2;
        context.strokeStyle = "black";
        context.stroke();

        context.beginPath();
        context.arc(width+radius*arc_cos, width+radius*arc_sin, 3, PI(0), PI(360), false);
        context.strokeStyle = "black";
        context.fill();

        context.font="15px Arial";
        var text = "PM2.5";
        var length = context.measureText(text).width/2;
        context.fillText(text,width-length,width-40);

        context.font="25px Arial";
        text = val+" "+unit;
        length = context.measureText(text).width/2;
        context.fillText(text,width-length,width);

        context.font="25px Arial";
        if(val<=35){
            text = _lang('widget_excellent');           //Excellent
        }else if(val<=75 && val>35){
            text = _lang('widget_good');           //Good
        }else if(val<=115 && val>75){
            text = _lang('widget_mildpollu');      //Mild pollution
        }else if(val<=250 && val>115){
            text = _lang('widget_moderatepollu');      //Moderate pollution
        }else if(val>250){
            text = _lang('widget_seriouspollu');      //Serious pollution
        }
        length = context.measureText(text).width/2;
        context.fillText(text,width-length,width+40);
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
        url ="mqtt:" + "v1/" + device_id + topic[0].url;
        if(!_.isEmpty(mWidget.retain)){
            var currentAmount = mWidget.retain;
            currentAmount=currentAmount.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                    .replace(/ /gi,"&nbsp;")
                                    .replace(/\'/g, "&#39;")
                                    .replace(/\"/g, "&quot;")
                                    .replace(/&/g, "&gt;")
                                    .replace(/\n/gi,"<br>");
            setVal(parseFloat(currentAmount).toFixed(2));
        }
        mMqtt.on(url, function(message){
            var str=message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                .replace(/ /gi,"&nbsp;")
                                .replace(/\'/g, "&#39;")
                                .replace(/\"/g, "&quot;")
                                .replace(/&/g, "&gt;")
                                .replace(/\n/gi,"<br>");
            setVal(parseFloat(str).toFixed(2));
        });
    };    
    
//    var pubTopic = function(mod){
//        var topic = mWidget.topics;       
//        var payload = JSON.stringify(obj);
//        mMqtt.publish(url, payload, 0, true);
//    };   
    
    
    var destroy = function(){        
        var topic = mWidget.topics;
        clearInterval(time);
        gasCanvas = undefined;
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
