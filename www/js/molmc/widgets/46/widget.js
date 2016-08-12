define(["js/vendor/map.quick.js", "tpl!./template/layout.tpl", "./gamecontroller"], function(Map, layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    
    var arc;
    var slider;
    var speed;
    var direction;
    var temperature;
    var localPoint;
    var destPoint;
    var options={};
    
    var getEl =function(){
        arc = $('#arcControl');
        slider = $('.slider');
        speed = $('#speed_boat');
        direction = $('#direction_boat');
        temperature = $('#temperature_boat');
        options.control = {
            speed:0,
            direction:0
        };
        // arcInit();
        initControl();
    };
    var initControl = function(){
        GameController.init({
            left: {
              type: 'joystick',
              position: {left: '50%', bottom: '50%'},
              touchRadius:50,
              forcePerformanceFriendly:true,
              joystick: {
                radius:40,
                touchStart: function(){
                  console.log('touch starts');
                },
                touchEnd: function(){
                  console.log('touch ends');
                },
                touchMove: function(data){
                  // console.log(data);
                  options.control.speed = Math.sqrt(data.dx*data.dx + data.dy*data.dy);
                  options.control.direction =data.dx/data.dy;
                  sendControl(options.control);
                }
              }
            },
            right: {
              position: {right: '0', bottom: '0'},
              type: 'buttons',
              buttons: [false, false,
                false,
                false
              ]
            }
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
        mInitMap();
    };
    var mInitMap = function(){
        console.log(Map);     
        var mMap = Map.initMap("widget46Map",{
            lng: $.molmc.position.lng,
            lat: $.molmc.position.lat,
            layer: 12
        }, {
            minZoom: 4,
            maxZoom: 16
        });
        Map.listenTo(mMap, "tap", function(e){
            Map.clearMaker(mMap);
            if(localPoint){
                Map.addOverlay(mMap, {lng:localPoint.lng,lat:localPoint.lat, imgSrc:'js/molmc/widgets/46/img/boat.png'});
            }
            destPoint = {lng:e.lnglat.getLng(),lat:e.lnglat.getLat()};
            Map.addOverlay(mMap, destPoint);
            // Map.addOverlay(thisView.options.map, {lng:e.lnglat.getLng(),lat:e.lnglat.getLat()});
        });
    };    
    var initMqtt = function(){        
        var topic = mWidget.topics;
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
        if(!_.isEmpty(mWidget.retain)){
            var currentAmount = mWidget.retain;
            speed.html(parseFloat(currentAmount).toFixed(2)+" "+topic[0].attribute.unit);
        }
        mMqtt.on(url, function(message){
            var value = parseFloat(message.payloadString).toFixed(2);
            if(speed){
                speed.html(value+" "+topic[0].attribute.unit);
            }           
        });
        url = "v1/" + device_id + topic[1].url;
        mMqtt.subscribe(url, 2, function(message){
            var value = parseFloat(message.payloadString).toFixed(2);
            if(direction){
                direction.html(value +" "+topic[1].attribute.unit);
            }
        });
        url = "v1/" + device_id + topic[2].url;
        mMqtt.subscribe(url, 2, function(message){
            var value = parseFloat(message.payloadString).toFixed(2);
            if(temperature){
                temperature.html(value +" "+ topic[2].attribute.unit);
            }
        });
        url = "v1/" + device_id + topic[3].url;
        mMqtt.subscribe(url, 2, function(message){
            var mode=JSON.parse(message.payloadString);
            Map.clearMaker(mMap);
            localPoint = {lng:mode.lng, lat:mode.lat};
            Map.addOverlay(mMap, {lng:localPoint.lng,lat:localPoint.lat, imgSrc:'js/molmc/widgets/46/img/boat.png'});
            Map.moveTo(mMap, localPoint.lng, localPoint.lat);
            if(destPoint){
                Map.addOverlay(mMap, destPoint);
            }
        });
    };    
    
    var sendControl = function(control){
        var topic = mWidget.topics;
        var url = "v1/" + device_id +topic[5].url;
        var payload = JSON.stringify(control);
        mMqtt.publish(url, payload, 0, false);
    };
    
    var getEventPosition = function(ev){
        var x, y;
        if (ev.layerX || ev.layerX == 0) {
            x = ev.layerX;
            y = ev.layerY;
        } else if (ev.offsetX || ev.offsetX == 0) { // Opera
            x = ev.offsetX;
            y = ev.offsetY;
        }
        return {x: x, y: y};
    };
    var arcBegin = function(evt){
        function PI(deg){
            return deg/180*Math.PI;
        }

        var canvas = arc[0];
        var context = canvas.getContext('2d');
        var width = canvas.width/2;
        var height = width+30;
        var radius = Math.min(width-20, 150);
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
            var direction;
            if(point.y >= height){
                direction = (point.x>=width)?(-Math.PI/2):(Math.PI/2);
            }else{
                direction = Math.atan((point.x-width)/(point.y-height))
            }
            options.arcBegin = true;
            setArcVal(direction, true);
            var that = this;
            $(document).one("mouseup",function(evt){
                options.arcBegin=false;
                var point = that.getEventPosition(evt);
                if(point.y>=height) point.y=height-1;
                // that.setArcVal(direction, false);
                setArcVal(0);
            });
        }
    };
    var setArcVal = function(val, focus){
        function PI(deg){
            return deg/180*Math.PI;
        }
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
        
        var canvas = arc[0];
        var context = canvas.getContext('2d');

        var pi=Math.PI;
        var width = canvas.width/2;
        var height = width+30;
        var radius = Math.min(width-20, 150);

        context.clearRect(0,0, canvas.width, canvas.height);
        context.putImageData(options.arcBG,0,0);

        context.save();//保存当前状态
        //设置原点
        context.translate(width, height);
        var sp={x:0,y:0}; 
        var ep={x:0,y:-radius+20};
        context.lineWidth = 2;
        context.strokeStyle = "#ddd";
        //设置旋转角度
        context.rotate(-val);//弧度   角度*Math.PI/180
        //画箭头主线 
        context.beginPath(); 
        context.moveTo(sp.x, sp.y);
        context.lineTo(ep.x, ep.y);
        //画箭头头部 
        var h=_calcH(sp,ep,context); 
        context.moveTo(ep.x,ep.y); 
        context.lineTo(h.h1.x,h.h1.y); 
        context.moveTo(ep.x,ep.y); 
        context.lineTo(h.h2.x,h.h2.y); 
        context.stroke();

        context.beginPath();
        context.lineWidth = 5;
        var point_circle;
        if(focus){
            point_circle = 15;
        }else{
            point_circle = 10;
        }
        context.arc(0, radius*(-1), point_circle, PI(0), PI(360));
        context.stroke();

        context.restore();//把原来状态恢复回来
        options.control.direction = Math.ceil(-val/Math.PI*180);
        sendControl(options.control);
    };
    var arcInit = function(){
        function PI(deg){
            return deg/180*Math.PI;
        }
        options.arcBegin = false;
        var canvas = arc[0];
        var context = canvas.getContext('2d');

        var pi=Math.PI;
        var width = canvas.width/2;
        var height = width+30;
        var radius = Math.min(width-20, 150);
        
        context.strokeStyle = "#00FFFF";
        context.lineWidth = 5;
        context.beginPath();
        context.arc(width, height, radius, PI(180), PI(360));
        context.stroke();
        context.closePath();
        
        context.beginPath();
        context.moveTo(width-radius-2, height);
        context.lineTo(width+radius+2, height);
        context.stroke();
        context.closePath();
                
        for (var i = 1; i < 6; i++) {
            context.save();//保存当前状态
            context.lineWidth = 3;
            context.strokeStyle = "red";
            //设置原点
            context.translate(width, height);
            //设置旋转角度
            context.rotate(30 * i * Math.PI / 180);//弧度   角度*Math.PI/180
            context.beginPath();
            context.moveTo(-radius+15, 0);
            context.lineTo(-radius+2, 0);
            context.stroke();
            context.closePath();
            context.restore();//把原来状态恢复回来
        }

        options.arcBG = context.getImageData(0,0,canvas.width,canvas.height);
        setArcVal(Math.atan(0), false);
    };
    
    var destroy = function(){       
        var topic = mWidget.topics;
        url = "v1/" + device_id + topic[1].url;
        mMqtt.off(url);
        mMqtt.unsubscribe(url);

        url = "v1/" + device_id + topic[2].url;
        mMqtt.unsubscribe(url);

        url = "v1/" + device_id + topic[3].url;
        mMqtt.unsubscribe(url);
        GameController.destroy();
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
