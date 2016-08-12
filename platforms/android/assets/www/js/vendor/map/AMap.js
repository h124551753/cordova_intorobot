define(function() {

    if(typeof AMap == 'undefined'){
        return;
    }

    var molmc = {};
    var createMap = function($el, point, options) {
        if(_.isObject(options)){
            var minZoom = options.minZoom?options.minZoom:3;
            var maxZoom = options.maxZoom?options.maxZoom:18;
        }else{
            var minZoom = 3;
            var maxZoom = 18;
        }
        var zoomRange = [minZoom, maxZoom];
        var map = new AMap.Map($el, {zooms:zoomRange});    //在百度地图容器中创建一个地图
        if(_.isObject(point)){
            var pointer = new AMap.LngLat(point.lng,point.lat);
            var layer = point.layer?point.layer:12;
        }else{
            var pointer = new AMap.LngLat(116.331398,39.897445);
            var layer = 12;
        }
        
        map.setZoomAndCenter(layer, pointer);
        
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
        var obj = map ? map : molmc.map;
        obj.plugin(["AMap.ToolBar"],function(){     
            toolBar = new AMap.ToolBar();
            obj.addControl(toolBar);        
        });
    };

    var addMarker = function(point, map){
        var obj = map ? map : molmc.map;
        // var marker = new BMap.Marker(point);
        // obj.addOverlay(marker);
        var marker = new AMap.Marker({
            position:new AMap.LngLat(point.lng,point.lat),
            draggable: false, //点标记可拖拽
            raiseOnDrag: true//鼠标拖拽点标记时开启点标记离开地图的效果
        });
        marker.setMap(obj);  //在地图上添加点
        return marker;
    };

    var moveToPoint = function(point, map) {
        var obj = map ? map : molmc.map;
        obj.panTo(point);
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
        var iw = new AMap.InfoWindow({
            content:html,
            closeWhenClickMap:true,
            offset:new AMap.Pixel(0, -25)
        });
        return iw;
    };

    var getCenter = function(){
        var obj = map ? map : molmc.map;
        return obj.getCenter();
    };
    var getBounds = function(){
        var obj = map ? map : molmc.map;
        return obj.getBounds();
    };

    var getLocal = function(callback) {
        $.molmc.utils.getLocation(callback);
    };
    
    return {
        initMap: function($el, point, options) {
            var map = createMap($el, point, options);
            setMapEvent();
            addMapControl();
        },
        addMarker: function(json) {
            var point = new AMap.LngLat(json.coordinate[0], json.coordinate[1]);
            var marker = addMarker(point, false);
            var infoWindow = createWindow(json);
            // marker.addEventListener("click", function(){          
            //    this.openInfoWindow(infoWindow);
            // });
            AMap.event.addListener(marker,'click',function(){ 
                infoWindow.open(molmc.map,marker.getPosition());
            });
            return marker;
        },
        markerClusterer: function(collection){
            var markers=[];
            collection.forEach(function(elem){
                var point = new AMap.LngLat(elem.coordinate[0], elem.coordinate[1]);
                var marker = new AMap.Marker({position:point});
                var infoWindow = createWindow(elem);
                // marker.addEventListener("click", function(evt){
                //     evt.preventDefault();
                //     this.openInfoWindow(infoWindow);
                // });
                AMap.event.addListener(marker,'click',function(){ 
                    infoWindow.open(molmc.map,marker.getPosition()); 
                });
                markers.push(marker);
            });
            // var markerClusterer = new BMapLib.MarkerClusterer(molmc.map, {markers:markers});
            molmc.map.plugin(["AMap.MarkerClusterer"],function(){
                cluster = new AMap.MarkerClusterer(molmc.map,markers);
                cluster.setGridSize(20);
            });
        },
        clearOverlays: function(){
            // molmc.map.clearOverlays();
            return molmc.map.clearMap();
        },

        moveTo: function(lng, lat) {
            // 
            // var point = new BMap.Point(lng, lat);
            // moveToPoint(point);
            var point = new AMap.LngLat(lng, lat);
            moveTo(point);
        },
        getLocal: function(callback) {
            getLocal(callback);
        },
        LocalByPoint: function(point, callback) {
            // document.getElementById('pane').innerHTML = this.getZoom(); 
            molmc.map.getCity(function(data){
                var city;
                if(data['province'] && typeof data['province'] === 'string'){
                    // document.getElementById('zoom').innerHTML = '城市：' + (data['city'] || data['province']);
                    city = data['city'] || data['province'];
                }else{
                    city = "北京市";
                }
                callback(city)
            });
        },
        listenTo: function(type, callback) {
            var obj = molmc.map;
            // obj.addEventListener(type, function(e){
            //     callback(e);
            // });
            AMap.event.addListener(molmc.map,type,function(e){
                // document.getElementById('pane').innerHTML = this.getZoom(); 
                callback(e); 
            });
        },
        getZoom: function(){
            return molmc.map.getZoom();
        },
        GetDistance: function(){
            var bs = molmc.map.getBounds();   //获取可视区域
            // 
            var bsct = bs.getCenter();   //可视区域中心
            var bssw = bs.getSouthWest();
            var a = bssw.lng - bsct.lng;
            return Math.abs(a.toFixed(6));
        },
        GetCenter: function(){
            var bsct = molmc.map.getCenter();   //可视区域中心
            return bsct;
        },
        GetRegion: function(){
            var bs = molmc.map.getBounds();   //获取可视区域
            var bsct = bs.getCenter();   //可视区域中心
            var bssw = bs.getSouthWest();   //可视区域中心
            var region = {horizontal:Math.abs(bssw.lng-bsct.lng), vertical:Math.abs(bssw.lat-bsct.lat)}
            return region;
        }
    }
});
