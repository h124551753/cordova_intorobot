define(["app", 
    "tpl!./template/layout.tpl"
    ], function(MyApp, layoutTpl) {
    MyApp.module("Widget46.V", function(View, MyApp, Backbone, Marionette, $, _) {
        View.Layout = Marionette.ItemView.extend({
            template: layoutTpl,
            id:"widget46",
            className: "text-center",
            ui:{
                arc:'#arcControl',
                slider:'.slider',
                speed:'#speed_boat',
                direction:'#direction_boat',
                temperature:'#temperature_boat'
            },
            modelEvents: {
                "change:retain": "retain" // equivalent to view.listenTo(view.model, "change:name", view.nameChanged, view)
            },
            events:{
                'mousedown @ui.arc':'arcBegin',
                'click @ui.button':'grab'
            },
            onBeforeRender:function(){
                this.trigger("beforeRender:vent:widget46");
            },
            onAttach:function(){
                var thisView = this;
                var topic = this.model.get("topics");
                var max = parseInt(topic[0].attribute.max);
                var min = parseInt(topic[0].attribute.min);
                var unit = topic[0].attribute.unit;
                this.options.control = {
                    speed:0,
                    direction:0
                };
                this.arcInit();
                this.ui.slider.next().html(min+unit);
                this.ui.slider.slider({
                    orientation: "vertical",
                    range: "min",
                    min: min,
                    max: max,
                    value: min,
                    slide: function(event, ui) {
                        $(event.target).next().html(ui.value+unit);
                    },
                    stop:function(event, ui){
                        $(event.target).next().html(ui.value+unit);
                        thisView.options.control.speed = ui.value;
                        thisView.sendControl();
                    }
                });
                require(["common/map"], function(Map) {
                    thisView.options.map = Map.initMap("widget46Map", {
                        lng: MyApp.position.lng,
                        lat: MyApp.position.lat,
                        layer: 12
                    }, {
                        minZoom: 4,
                        maxZoom: 16
                    });
                    Map.listenTo(thisView.options.map, "click", function(e){
                        Map.clearMaker(thisView.options.map);
                        if(thisView.options.localPoint){
                            Map.addOverlay(thisView.options.map, {lng:thisView.options.localPoint.lng,lat:thisView.options.localPoint.lat, imgSrc:'assets/js/molmc/widgets/46/img/boat.png'});
                        }
                        thisView.options.destPoint = {lng:e.lnglat.getLng(),lat:e.lnglat.getLat()};
                        Map.addOverlay(thisView.options.map, thisView.options.destPoint);
                        // Map.addOverlay(thisView.options.map, {lng:e.lnglat.getLng(),lat:e.lnglat.getLat()});
                    });
                    if(MyApp.position.localCountry.toLowerCase() == 'china'){
                        thisView.trigger("layout:vent:widget46", thisView, Map);
                    }else{
                        Map.listenToOnce(searchMap, "tilesloaded", function(e) {
                            thisView.trigger("layout:vent:widget46", thisView, Map);
                        });
                    }
                });
            },
            retain:function(){
                this.trigger('retain:vent:widget46', this);
            },
            getEventPosition:function(ev){
                var x, y;
                if (ev.layerX || ev.layerX == 0) {
                    x = ev.layerX;
                    y = ev.layerY;
                } else if (ev.offsetX || ev.offsetX == 0) { // Opera
                    x = ev.offsetX;
                    y = ev.offsetY;
                }
                return {x: x, y: y};
            },
            arcBegin:function(evt){
                function PI(deg){
                    return deg/180*Math.PI;
                }

                var canvas = this.ui.arc[0];
                var context = canvas.getContext('2d');
                var width = canvas.width/2;
                var height = width+30;
                var radius = Math.min(width-20, 150);
                var outFlag,inFlag;
                var point = this.getEventPosition(evt);
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
                    this.options.arcBegin = true;
                    this.setArcVal(direction, true);
                    var that = this;
                    $(document).one("mouseup",function(evt){
                        that.options.arcBegin=false;
                        var point = that.getEventPosition(evt);
                        if(point.y>=height) point.y=height-1;
                        // that.setArcVal(direction, false);
                        that.setArcVal(0);
                    });
                }
            },
            setArcVal:function(val, focus){
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
                
                var canvas = this.ui.arc[0];
                var context = canvas.getContext('2d');

                var pi=Math.PI;
                var width = canvas.width/2;
                var height = width+30;
                var radius = Math.min(width-20, 150);

                context.clearRect(0,0, canvas.width, canvas.height);
                context.putImageData(this.options.arcBG,0,0);

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
                this.options.control.direction = Math.ceil(-val/Math.PI*180);
                this.sendControl();
            },
            arcInit:function(){
                function PI(deg){
                    return deg/180*Math.PI;
                }
                this.options.arcBegin = false;
                var canvas = this.ui.arc[0];
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

                this.options.arcBG = context.getImageData(0,0,canvas.width,canvas.height);
                this.setArcVal(Math.atan(0), false);
            },
            sendControl:function(){
                this.trigger("control:vent:widget46", this);
            },
            onDestroy: function(){
                console.log("onDestroy");
                this.trigger("destroy:vent:widget46", this.model);
            },
        });
    });

    return MyApp.Widget46.V;
});


