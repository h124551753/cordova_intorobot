define(["tpl!./template/layout.tpl"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    
    var pointVal;
    var canvasElem;
    var canvas;
    var context;
    var arcBG;

    var arcBeginFlag = false;

//    var widget = function(){
//        $("#showWidget_device").bind("unloadpanel", function(){
//            $.molmc.goShowWidget = false;
//            destroy();    
//            $("#showWidget_device").unbind("unloadpanel");
//            $("#widgetPanel_device").empty();
//        });        
//    };
    var getEl =function(){
        fan = $("#widget21 #fan");
        button = $("#widget21 input");
        canvasElem = $("#SteeringEngine");
        canvas = canvasElem[0];
        context = canvas.getContext('2d');
    };
    
    var initView = function(el, wid, devId, mqtt){
        el.empty();
        mMqtt = mqtt;
        mWidget = wid;
        device_id = devId;
        var div = layoutTpl();
        el.append(div);
        getEl();
        var height = $('#showWidget_device').height()-20;
        $("#widget21").css('height', height+'px');
        // $("#widget21").height(height);
    };
    
    var initMqtt = function(){        
        var topic = mWidget.topics;
        var url = "v1/" + device_id + topic[0].url;
        mMqtt.subscribe(url, 2, function(message){
            mMqtt.unsubscribe(message.destinationName);
            var val = parseInt(message.payloadString);
            setArcVal((val-90)/180*Math.PI);
        });

        url = "v1/" + device_id + topic[1].url;
        mMqtt.subscribe(url, 2, function(message){
            
        });      
    };

    var initAction = function(){
        canvasElem.on('touchstart', arcBegin);
        canvasElem.on('touchmove', arcMove);
    };
    
    var pubTopic = function(val){
        var topic = mWidget.topics;
        var url = "v1/" + device_id +topic[0].url;
        var payload = parseInt(val).toString();
        mMqtt.publish(url, payload, 0, true);
    };

    var arcInit = function(callback){
        arcBeginFlag = false;

        var img=new Image();
        img.src= fileSystemWidget + "21/img/SteeringEngine.png";
        img.onload = function(){
            context.drawImage(img,0,0);
            arcBG = context.getImageData(0,0,canvas.width,canvas.height);
            setArcVal(PI(-90), false);
            if(_.isFunction(callback)){
                callback();
            }
        }
    }

    var PI = function(deg) {
        return deg/180*Math.PI;
    }

    var getEventPosition = function(ev){
        // var x, y;
        // if (ev.layerX || ev.layerX == 0) {
        //     x = ev.layerX;
        //     y = ev.layerY;
        // } else if (ev.offsetX || ev.offsetX == 0) { // Opera
        //     x = ev.offsetX;
        //     y = ev.offsetY;
        // }
        // return {x: x, y: y};

        var x, y;
        if (!_.isEmpty(ev.targetTouches)) {
            x = ev.targetTouches[0].pageX;
            y = ev.targetTouches[0].pageY;
        } else if (!_.isEmpty(ev.offsetX)) { // Opera
            x = ev.offsetX;
            y = ev.offsetY;
        }
        x = x - ev.target.offsetLeft;
        y = y - ev.target.offsetTop - 50;
        
        return {x: x, y: y};
    }

    var arcBegin = function(evt){
        var width = canvas.width/2;
        var height = width;
        var radius = Math.min(width-30, 150);
        var outFlag,inFlag;
        var point = getEventPosition(evt);
        if(point.y>=height) point.y=height-1;
        context.save();//保存当前状态
        context.beginPath();
        context.lineWidth = 1;
        context.arc(width, height, radius+20, PI(180), PI(360));
        outFlag = context.isPointInPath(point.x,point.y);
        context.closePath();
        context.restore();//把原来状态恢复回来

        context.save();//保存当前状态
        context.beginPath();
        context.lineWidth = 1;
        context.arc(width, height, radius-20, PI(180), PI(360));
        inFlag = context.isPointInPath(point.x,point.y);
        context.closePath();
        context.restore();//把原来状态恢复回来

        if(outFlag && !inFlag){
            arcBeginFlag = true;
            if(point.y >= height){
                pointVal = (point.x>=width)?(-Math.PI/2):(Math.PI/2);
            }else{
                pointVal = Math.atan((point.x-width)/(point.y-height));
            }
            setArcVal(pointVal, true);
            $(document).one("touchend",function(evt){
                arcBeginFlag=false;
                setArcVal(pointVal, false);
                pubTopic(pointVal/Math.PI*180+90);//val need pick minus
            });
        }
    }

    var arcMove = function(evt){
        if(arcBeginFlag){
            var width = canvas.width/2;
            var height = width;
            var point = getEventPosition(evt);
            if(point.y >= height){
                pointVal = (point.x>=width)?(-Math.PI/2):(Math.PI/2);
            }else{
                pointVal = Math.atan((point.x-width)/(point.y-height));
            }
            
            setArcVal(pointVal, true);
        }else{
            var width = canvas.width/2;
            var height = width;
            var radius = Math.min(width-30, 150);
            var outFlag,inFlag;
            var point = getEventPosition(evt);
            if(point.y>=height) point.y=height-1;
            context.save();//保存当前状态
            context.beginPath();
            context.lineWidth = 1;
            context.arc(width, height, radius+20, PI(180), PI(360));
            outFlag = context.isPointInPath(point.x,point.y);
            context.closePath();
            context.restore();//把原来状态恢复回来

            context.save();//保存当前状态
            context.beginPath();
            context.lineWidth = 1;
            context.arc(width, height, radius-20, PI(180), PI(360));
            inFlag = context.isPointInPath(point.x,point.y);
            context.closePath();
            context.restore();//把原来状态恢复回来

            if(outFlag && !inFlag){
                setArcVal(pointVal, true);
            }else{
                setArcVal(pointVal, false);
            }
        }
    };

    var setArcVal = function(val, focus){
        pointVal = val;
        var _calcH=function(sp,ep,context){
            var theta=Math.atan((ep.x-sp.x)/(ep.y-sp.y)); 
            var cep=_scrollXOY(ep,-theta); 
            var csp=_scrollXOY(sp,-theta); 
            var ch1={x:0,y:0};
            var ch2={x:0,y:0};
            var l=cep.y-csp.y;
            ch1.x=cep.x+l*(0.025);
            ch1.y=cep.y-l*(0.05);
            ch2.x=cep.x-l*(0.025);
            ch2.y=cep.y-l*(0.05);
            var h1=_scrollXOY(ch1,theta); 
            var h2=_scrollXOY(ch2,theta); 
            return { 
                h1:h1, 
                h2:h2 
            }; 
        }; 
        //旋转坐标 
        var _scrollXOY=function(p,theta){ 
            return { 
                x:p.x*Math.cos(theta)+p.y*Math.sin(theta), 
                y:p.y*Math.cos(theta)-p.x*Math.sin(theta) 
            }; 
        }; 

        var pi=Math.PI;
        var width = canvas.width/2;
        var height = width;
        var radius = Math.min(width-30, 150);

        context.clearRect(0,0, canvas.width, canvas.height);
        context.putImageData(arcBG,0,0);

        context.save();//保存当前状态
        //设置原点
        context.translate(width, height);
        var sp={x:0,y:0};
        var ep={x:0,y:-radius+20};
        context.lineWidth = 2;
        context.strokeStyle = "#ddd";
        //设置旋转角度
        context.rotate(-val);//弧度   角度*Math.PI/180

        context.beginPath();
        context.lineWidth = 5;
        context.fillStyle="#FF0000";
        var point_circle;
        if(focus){
            point_circle = 20;
        }else{
            point_circle = 15;
        }
        context.arc(0, radius*(-1), point_circle, PI(0), PI(360));
        context.fill();

        context.restore();//把原来状态恢复回来

        context.font="25px Arial";
        var showVal = parseInt(val/Math.PI*180+90);
        var text = showVal + "°";
        var length = context.measureText(text).width/2;
        context.fillText(text,width-length,320);
    };
    var destroy = function(){
        canvasElem.off('touchstart');
        canvasElem.off('touchmove');

        var topic = mWidget.topics;
        var url = "v1/" + device_id + topic[0].url;
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
            arcInit(initMqtt);
            initAction();
        },
    };
    return widget;
});
