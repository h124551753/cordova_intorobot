(function($) {
    "use strict";
    var Entity = {};
    var curDevId;
    var mapZoom;
    var initFlag=true;
    var localPoint;

    var ExploreMap = function(){
        var self = this;
        Entity.ArrayDevice = [];
        Entity.Devicespart = [];
        Entity.ismore=false;
        $(document).on("applogout", function(){
            Entity={};
        });

        $("#mapExplore").bind( "loadpanel", function(){
            mapZoom = 12;
            mInitMap();
            if(initFlag){
                var myScroller=$("#myExploreMapDevices").scroller({
                   verticalScroll:true,
                   horizontalScroll:false,
                   autoEnable:true
                });
                initFlag=false;
            }
        });
        $("#mapExplore").bind( "unloadpanel", function(){
            $(".headerleft").show();
        });
        
//        点击查看设备
        $("#myExploreMapDevices ul").on("tap","li",function(event){
            if(event.currentTarget.id===""){
                return;
            }
            $.molmc.device.getCollectDevs();
            var device_id = Entity.Devicespart[event.currentTarget.id]._id;
            var respdev = function(result){ 
                Entity.CurDevice = result;
                $.molmc.explore.setcurdevices(result);
                $.ui.loadContent("#widgets_explore", false, false, "slide");
            };
            var resptoken = function(result){
                Entity.CurToken = result;
                $.molmc.explore.setcurdevtoken(result);
                var token = Entity.CurToken.access_token;
                var options = {
                    userName: token,
                    password: "password"
                };
                if(_.isEmpty($.molmc.pubMqtt)){
                    $.molmc.pubMqtt = new $.molmc.mqtt(options);
                }else{
                    $.molmc.pubMqtt.openConnect(options);
                }
            };
            if($.molmc.utils.checkNetwork()){
                self.getPubDevToken(resptoken, device_id);
                self.getPubdevInfo(respdev, device_id);
            }
        });
    };

    var showDeviceMap = function(Map, cent, dist){
        if(dist == undefined){
            var distance = Map.GetDistance();
        }else{
            var distance = dist;
        }
        if(cent == undefined){
            var center = Map.GetCenter();
        }else{
            var center = cent;
        }
        
        localPoint = {lng:center.lng, lat:center.lat, layer:Map.getZoom()};
        var callback = function(data){
            if(!_.isEmpty(data)){
                Entity.Devicesshow = data;
                // $.molmc.utils.showDevices($("#myExploreMapDevices ul"),data,{img:false});
                addMarker(data, Map);
                showDragMap(Map);
            }else{
                $("#myExploreMapDevices ul").empty();
                $("#myExploreMapDevices ul").html("<div style='text-align:center;padding:10px 0px;font-size:18px;'>"+_lang("explore_map_nofounddev")+"</div>");
            }
        };
        var positionInfo = "lng="+center.lng+"&lat="+center.lat+"&dist=300";
        $.molmc.api.searchPubDevices(callback, positionInfo, 1, 400);
    };

    var mInitMap = function(){
        $.molmc.utils.getLocation(function(point){
            require(["vendor/map.quick"], function(MapEntity){
                if(_.isEmpty(localPoint)){
                    MapEntity.initMap("myExploreMap", {lng:point.lng,lat:point.lat,layer:5}, {minZoom:4,maxZoom:16});
                }else{
                    MapEntity.initMap("myExploreMap", localPoint, {minZoom:4,maxZoom:16});
                }
                if($.molmc.position.localCountry.toLowerCase() == 'china'){
                    MapEntity.listenTo("dragend", function(e){
                        showDragMap(MapEntity);
                    });
                    MapEntity.listenTo("zoomchange", function(e){
                        showDragMap(MapEntity);
                    });
                    showDeviceMap(MapEntity, localPoint, 0.1);
                    showDragMap(MapEntity);
                }else{
                    MapEntity.listenToOnce("tilesloaded", function(e) {
                        MapEntity.listenTo("dragend", function(e) {
                            showDragMap(MapEntity);
                        });
                        MapEntity.listenTo("zoom_changed", function(e) {
                            showDragMap(MapEntity);
                        });
                        showDeviceMap(MapEntity, localPoint, 0.1);
                        showDragMap(MapEntity);
                    });
                }
                
            });
        }, true);      
    };    
    
    var showDragMap = function(Map){
        var center = Map.GetCenter();
        var region = Map.GetRegion();
        localPoint = {lng:center.lng, lat:center.lat, layer:Map.getZoom()};
        var devicesArray = [];
        if(Entity.Devicesshow !== undefined){
            Entity.Devicesshow.forEach(function(elem){
                var hor = Math.abs(parseFloat(elem.coordinate[0])-center.lng);
                var ver = Math.abs(parseFloat(elem.coordinate[1])-center.lat);
                if(hor<=region.horizontal && ver<=region.vertical){
                    devicesArray.push(elem);
                }
            });
        }
        if(devicesArray.length==0){
            $("#myExploreMapDevices ul").empty();
            $("#myExploreMapDevices ul").html("<div style='text-align:center;padding:10px 0px;font-size:18px;'>"+_lang("explore_map_nofounddev")+"</div>");
        }else{
            $.molmc.utils.showDevices($("#myExploreMapDevices ul"),devicesArray,{img:false});
            Entity.Devicespart=devicesArray;
        }
    };

    var addMarker = function(obj, Map){
        Map.clearOverlays();
        Map.markerClusterer(obj);
    };
    
    var subWidgetStatus = function(widList, mqtt){
        var el = $("#widgetList_explore")[0].children;        
        $.each(el, function(index){
            var wid = widList[el[index].id];
            var topic = _.filter(wid.topics, function(m){
                return m.isData === true;
            });
            if(wid.isShow === false){
                return;
            }else{
                var url = "v1/" + Entity.CurDevice._id + topic[0].url;
                var callbk_sub = function(){
                    mqtt.subscribe(url, 2, function(msg){
                        $("#badge", $(el[index])).html(msg.payloadString);
                        widList[el[index].id].retain = msg.payloadString;
                    });
                };
                if(topic.length>0){
                    mqtt.unsubscribe(url, callbk_sub);
                }
            }            
        });
    };
    
    var getlistlabel = function(tag,type_li){
        var labels={};
        labels.typeofli=type_li;
        labels.tag=tag;
        return labels;
    };
    
    ExploreMap.prototype = {
        getPubdevInfo:function(response, devId){
            $.molmc.explore.setIsDemo(false);
            if(curDevId !== devId){
                curDevId = devId;
                $.molmc.api.getPubDevice(response, devId);
            }else{
                $.ui.loadContent("#widgets_explore", false, false, "slide");
            }
        },
        getPubDevToken:function(response, devId){            
            $.molmc.api.getPubDevToken(response, devId);
        }
    };

    $.molmc.exploreMap = new ExploreMap();
})(af);