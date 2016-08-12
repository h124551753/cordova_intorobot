define(["tpl!./template/layout.tpl","./js/rainyday.min.js"], function(layoutTpl, RainyDay){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    var rainImg;
    var canvasCt;
    var canvasEngin;
    
    var getEl =function(){
        rainImg = $('#widget40 #rainImg');
        canvasCt = $('#widget40 #canvasCt');
        rainImg.crossOrigin = 'anonymous';
        rainImg.attr('src', fileSystemWidget+'40/img/img.jpg');
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
            currentAmount = currentAmount.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                    .replace(/ /gi,"&nbsp;")
                                    .replace(/\'/g, "&#39;")
                                    .replace(/\"/g, "&quot;")
                                    .replace(/&/g, "&gt;")
                                    .replace(/\n/gi,"<br>");
            if(parseInt(currentAmount) == 0){
                sunLight();
            }else{
                rain();
            }
        }
        mMqtt.on(url, function(message){
            var str=message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                .replace(/ /gi,"&nbsp;")
                                .replace(/\'/g, "&#39;")
                                .replace(/\"/g, "&quot;")
                                .replace(/&/g, "&gt;")
                                .replace(/\n/gi,"<br>");
            if(parseInt(str) == 0){
                sunLight();
            }else{
                rain();
            }
        });        
    };    
    
    var rain = function(){
        // if(!canvasEngin){
            canvasCt.html('<canvas id="canvas" width="350" height="320"></canvas>');
            rainImg.css3Animate({
                y:-320,
                time:300, 
                success:function(){
                    canvasEngin = new RainyDay({
                        image: rainImg[0],
                        parentElement:canvasCt[0],
                        fps:10,
                        width:350,
                        height:320,
                        crop: [ 0, 0, 350, 320]
                    }, document.getElementById('canvas'));
                    canvasEngin.trail = canvasEngin.TRAIL_SMUDGE;
                    canvasEngin.rain([ [0, 2, 50], [3, 3, 1] ], 100);
                }
            });
        // }
    };
    var sunLight = function(){
        if(canvasEngin){
            canvasEngin.destroy();
        } 
        rainImg.css3Animate({y:0,time:300});
    };
    var destroy = function(){
        canvasEngin.destroy();
        var topic = mWidget.topics;
        var url = "mqtt:" + "v1/" + device_id + topic[0].url;
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
