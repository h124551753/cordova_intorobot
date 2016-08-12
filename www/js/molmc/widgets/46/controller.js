define(["app", "./view"], function(MyApp, View) {
    MyApp.module("Widget46.C", function(Obj, MyApp, Backbone, Marionette, $, _) {
        var cssUrl_bak=[];
        Obj.Controller = {
            showUI : function(el, options, mqtt) {
                Obj.mqtt = mqtt;
                var op = $.extend({}, options);
                var view = new View.Layout({model: op});

                view.on('retain:vent:widget46', function(view){
                    if(view.ui.speed){
                        var topic = this.model.get("topics");
                        var unit = topic[0].attribute.unit;
                        view.ui.speed.html(view.model.get('retain') + unit);
                    }
                });

                view.on("beforeRender:vent:widget46", function(){
                    if(cssUrl_bak){
                        cssUrl_bak.forEach(function(model){
                            Jscss.loadIn(model, "css");
                        });
                    }
                });

                view.on("layout:vent:widget46", function(view, Map){
                    var topic = this.model.get("topics");

                    if(!_.isEmpty(view.model.get("retain"))){    
                        var unit = topic[0].attribute.unit;
                        view.ui.speed.html(view.model.get('retain') + unit);
                    }

                    url = options.get("prefix")+topic[1].url;
                    Obj.mqtt.subscribe(url, 2, function(message){
                        var value = parseFloat(message.payloadString).toFixed(2);
                        var unit = topic[1].attribute.unit;
                        if(view.ui.direction){
                            view.ui.direction.html(value + unit);
                        }
                    });

                    url = options.get("prefix")+topic[2].url;
                    Obj.mqtt.subscribe(url, 2, function(message){
                        var value = parseFloat(message.payloadString).toFixed(2);
                        var unit = topic[2].attribute.unit;
                        if(view.ui.temperature){
                            view.ui.temperature.html(value + unit);
                        }
                    });

                    url = options.get("prefix")+topic[3].url;
                    Obj.mqtt.subscribe(url, 2, function(message){
                        var mode=JSON.parse(message.payloadString);
                        Map.clearMaker(view.options.map);
                        view.options.localPoint = {lng:mode.lng, lat:mode.lat};
                        Map.addOverlay(view.options.map, {lng:view.options.localPoint.lng,lat:view.options.localPoint.lat, imgSrc:'assets/js/molmc/widgets/46/img/boat.png'});
                        Map.moveTo(view.options.map, view.options.localPoint.lng, view.options.localPoint.lat);
                        if(view.options.destPoint){
                            Map.addOverlay(view.options.map, view.options.destPoint);
                        }
                    });
                });

                view.on("destroy:vent:widget46", function(options){
                    var topic = options.get("topics");
                    var url = options.get("prefix")+topic[1].url;
                    Obj.mqtt.unsubscribe(url);

                    url = options.get("prefix")+topic[2].url;
                    Obj.mqtt.unsubscribe(url);
                });

                view.on('control:vent:widget46', function(view){
                    var topic = view.model.get("topics");
                    var url = options.get("prefix")+topic[5].url;
                    var payload = JSON.stringify(view.options.control);
                    Obj.mqtt.publish(url, payload, 0, false);
                });

                el.show(view);
            },
        };
    });

    return MyApp.Widget46.C.Controller;
});