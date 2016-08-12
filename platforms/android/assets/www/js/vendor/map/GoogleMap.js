define(["vendor/map/markerclusterer"], function() {

    if(typeof google == 'undefined'){
        return;
    }
    var molmc = {
        markers:[]
    };
    var localInfo = {
        bounds:{
            info:'OK',
            city: $.molmc.position.city,
            getCenter:function(){
                return {
                    lat: $.molmc.position.lat,
                    lng: $.molmc.position.lng
                }
            }
        }
    }
    var createMap = function($el, point, options) {
        if(_.isObject(options)){
            var minZoom = options.minZoom?options.minZoom:3;
            var maxZoom = options.maxZoom?options.maxZoom:18;
        }else{
            var minZoom = 3;
            var maxZoom = 18;
        }
        var zoomRange = [minZoom, maxZoom];
        var map = new google.maps.Map(document.getElementById($el), {
            center: {lat: -34.397, lng: 150.644},
            zoom: 12,
            minZoom: minZoom,
            maxZoom: maxZoom,
        });
        if (point) {
            var pointMap = new google.maps.LatLng(point.lat, point.lng);
            var layer = point.layer?point.layer:14;
            map.setCenter(pointMap);
            map.setZoom(layer);
        } else {
            var pointMap = new google.maps.LatLng($.molmc.position.lat, $.molmc.position.lng);
            map.setCenter(pointMap);
            map.setZoom(12);
        }
        // map.setLang('zh_en');
        molmc.map = map;
        return map;
    };

    //地图事件设置函数：
    var setMapEvent = function(map) {
        // var obj = map ? map : molmc.map;
        // obj.enableDragging();   //启用地图拖拽事件，默认启用(可不写)
        // obj.enableDoubleClickZoom();    //启用鼠标双击放大，默认启用(可不写)
    };

    //地图控件添加函数：
    var addMapControl = function(map){
        // var obj = map ? map : molmc.map;
        // obj.plugin(["AMap.ToolBar"],function(){     
        //     toolBar = new AMap.ToolBar();
        //     obj.addControl(toolBar);        
        // });
    };

    var addMarker = function(point, map){
        var obj = map ? map : molmc.map;
        var marker = new google.maps.Marker({
            position:point,
            map: obj, //点标记可拖拽
            // raiseOnDrag: true//鼠标拖拽点标记时开启点标记离开地图的效果
        });
        if (clean) {
            clearMarkers();
        }
        molmc.markers.push(marker);
        // var marker = new AMap.Marker(point);
        // obj.addOverlay(marker);
        marker.setMap(obj);  //在地图上添加点
        return marker;
    };

    var clearMarkers = function(){
        if(!molmc.markers){
            return
        }
        for (var i = 0; i < molmc.markers.length; i++) {
            molmc.markers[i].setMap(null);
        }
        molmc.markers = [];
    };

    var moveToPoint = function(point, map) {
        var obj = map ? map : molmc.map;
        // obj.panTo(point);
        obj.setCenter(point);
    };

    //创建InfoWindow
    var createWindow = function(json){
        // var fun = 'showExp("' + json._id + '")';
        // var html = '<div class="clearfix"> \
        //     <div style="padding: 5px 0;"> \
        //         <span class="h4"><a onclick="' + fun + '\">' + json.name +'</a></span> \
        //         <div><small>'+ json.description +'</small></div> \
        //         <div><small>'+ json.city +'</small></div> \
        //     </div> \
        //     </div>';
        var html = '<div class="clearfix"> \
            <div style="padding: 5px 0;"> \
                <span class="h4"><a>' + json.name +'</a></span> \
                <div><small>'+ json.description +'</small></div> \
                <div><small>'+ json.city +'</small></div> \
            </div> \
            </div>';
        // var iw = new BMap.InfoWindow(html);
        var iw = new google.maps.InfoWindow({
            content:html,
            // closeWhenClickMap:true,
            // offset:new AMap.Pixel(0, -25)
        });
        return iw;
    };

    var getLocal = function(callback) {
        $.molmc.utils.getLocation(callback);
    };

    var getCityName = function(address_components, type){
        for(var i=0;i<address_components.length;i++){
            if(_.isArray(address_components[i].types) && address_components[i].types[0] == 'locality'){
                return address_components[i].long_name;
            }
        }
        return;
    };
    
    return {
        initMap: function($el, point, options) {
            var map = createMap($el, point, options);
            setMapEvent();
            addMapControl();
        },
        addMarker: function(json) {
            var point = new google.maps.LatLng(json.coordinate[1], json.coordinate[0]);
            var marker = addMarker(point, false);
            var infoWindow = createWindow(json);
            // marker.addEventListener("click", function(){          
            //    this.openInfoWindow(infoWindow);
            // });
            marker.addListener('click',function(){ 
                infoWindow.open(molmc.map,marker);
            });
            return marker;
        },
        markerClusterer: function(collection){
            var markers=[];
            collection.forEach(function(elem){
                var point = new google.maps.LatLng(elem.coordinate[1], elem.coordinate[0]);
                var marker = new google.maps.Marker({position:point});
                var infoWindow = createWindow(elem);
                marker.addListener('click',function(){ 
                    infoWindow.open(molmc.map,marker);
                });
                markers.push(marker);
            });
            var markerCluster = new MarkerClusterer(molmc.map, markers);
        },
        clearOverlays: function(){
            // molmc.map.clearOverlays();
            return clearMarkers();
        },

        moveTo: function(lng, lat) {
            var point = new google.maps.LatLng(lat, lng);
            moveTo(point);
        },
        getLocal: function(callback) {
            getLocal(callback);
        },
        LocalByPoint: function(point, callback) {
            var geocoder = new google.maps.Geocoder;
            var latlng = {lat: parseFloat(point.lat), lng: parseFloat(point.lng)};
            geocoder.geocode({'location': latlng}, function(results, status) {
                var city = getCityName(results[0].address_components, 'locality');
                if(!city){
                    city = getCityName(results[0].address_components, 'administrative_area_level_2');
                }
                if(!city){
                    // city = results[0].address_components[0].long_name;
                    city = "北京市";
                }
                callback(city);
            });
        },
        listenToOnce: function(type, callback) {
            var obj = molmc.map;
            google.maps.event.addListenerOnce(obj, type,function(e){
                if(type=='click'){
                    var info = {
                        lnglat:{
                            getLng:function(){
                                return e.latLng.lng();
                            },
                            getLat:function(){
                                return e.latLng.lat();
                            }
                        }
                    }
                    callback(info);
                }else{
                    callback(e);
                }
            });
        },
        listenTo: function(type, callback) {
            var obj = molmc.map;
            google.maps.event.addListener(obj, type,function(e){
                if(type=='click'){
                    var info = {
                        lnglat:{
                            getLng:function(){
                                return e.latLng.lng();
                            },
                            getLat:function(){
                                return e.latLng.lat();
                            }
                        }
                    }
                    callback(info);
                }else{
                    callback(e);
                }
            });
        },
        getZoom: function(){
            return molmc.map.getZoom();
        },
        GetDistance: function(){
            var bs = molmc.map.getBounds();   //获取可视区域
            var bsct = bs.getCenter();   //可视区域中心
            var bssw = bs.getSouthWest();
            var a = bssw.lng() - bsct.lng();
            return Math.abs(a.toFixed(6));
        },
        GetCenter: function(){
            var bsct = molmc.map.getCenter();   //可视区域中心
            return {lng:bsct.lng(), lat:bsct.lat()};
        },
        GetRegion: function(){
            var bs = molmc.map.getBounds();   //获取可视区域
            var bsct = bs.getCenter();   //可视区域中心
            var bssw = bs.getSouthWest();   //可视区域中心
            var region = {horizontal:Math.abs(bssw.lng()-bsct.lng()), vertical:Math.abs(bssw.lat()-bsct.lat())}
            return region;
        }
    }
});
