define(["tpl!./template/layout.tpl",
    "css!./css/style31"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    var pointValue;
    var pulseLine;
    
    var getEl =function(){
        pointValue = $("#widget31 .heartBg span");
        pulseLine = $("#widget31 .pulse");
    };
    var initView = function(el, wid, devId, mqtt){
        el.empty();
        mMqtt = mqtt;
        mWidget = wid;
        device_id = devId;
        var div = layoutTpl();
        el.append(div);
        getEl();
        setRateImg(0);
        if(mWidget.retain === undefined){
            mWidget.retain = 0.00;
        }
        pointValue.html(parseFloat(mWidget.retain).toFixed(2)+" "+mWidget.topics[0].attribute.unit);
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
            setRateImg(parseInt(currentAmount));
            pointValue.html(parseFloat(currentAmount).toFixed(2)+" "+topic[0].attribute.unit);
        }
        mMqtt.on(url, function(message){
            var str=message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                .replace(/ /gi,"&nbsp;")
                                .replace(/\'/g, "&#39;")
                                .replace(/\"/g, "&quot;")
                                .replace(/&/g, "&gt;")
                                .replace(/\n/gi,"<br>");
            if(pointValue){
                setRateImg(parseInt(str));
                pointValue.html(parseFloat(str).toFixed(2)+" "+topic[0].attribute.unit);
            }           
        });        
    };    
    
    var setRateImg = function(rate){
        var point = getPoint(rate);
        var color = getColor(rate);
        var Url = 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200px 100px" enable-background="new 0 0 200px 100px" xml:space="preserve"><polyline fill="none" stroke-width="3px" stroke="' + color + '" points="' + point + '"/></svg>\')'
        pulseLine.css('background-image', Url);
    };
    
    var getPoint = function(rate){
        var scale = (rate>100)?1:parseFloat((rate/100).toFixed(2));
        var point = [[2,50],[70,50],[76,30],[81,50],[89,50],[93,65],[102,7],[110,95],[115,50],[126,50],[134,41],[142,50],[197,50]];
        var pointString='';
        point.forEach(function(elem){
            pointString += (elem[0] + ',' + ((elem[1]-50)*scale+50) + ' ');
        })
        return pointString;
    };
    
    var getColor = function(rate){
        var color;
        if(rate == 0){
            color = 'rgb(128, 128, 128)';
        }else if(rate<120){
            color = 'rgb(55, 255, 0)';
        }else if(rate>120 && rate<150){
            color = 'red';
        }else if(rate>150){
            color = 'black';
        }
        return color;
    };
    
    var destroy = function(){
        var topic = mWidget.topics;
        var url = "mqtt:" + "v1/" + device_id + topic[0].url;
        mMqtt.off(url);
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
