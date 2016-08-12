(function($) {
    "use strict";
    var Entity = {};
    
    var Device = function(){

        window.getDeviceToken = function(){
            console.log("call from java...");
        };
        
        var self = this;
        var configing = false;
        Entity.hasOnUtopic = false;
        var myScroll;
        Entity.status =[];
        $(document).on("applogout", function(){            
            Entity={};
            Entity.status =[]
            self.offSubUtopic();
            $.molmc.mainMqtt.disconnect();
            $.molmc.mainMqtt = {};
        });
        $("#device").bind("loadpanel", function(){            
            $(".headerleft").hide();
            $.molmc.utils.u_Topic = "mqtt:v1/"+ $.molmc.utils.getItem("u_topic") +"/channel/userDevice/cmd/updata";
            $("#popup_adddevice").html("");
            $("#popup_adddevice").attr("data-status", "device");
            $("#popup_adddevice").addClass("fa fa-ellipsis-v").removeClass("button");
            if($.molmc.utils.getItem("autoLogin" == "true")){
                navigator.splashscreen.hide();
            }
            $("#header_device h1").html(_lang("g_title_device"));
            self.isUtopicInDevPanel(true);
            mShowDeviceList();
        });
        $("#device").bind( "unloadpanel", function(){
            $(".headerleft").show(); 
            self.isUtopicInDevPanel("none");
        });
        $("#widgets_device").bind( "loadpanel", function(){
            $(".headerleft").show();
            $("#popup_adddevice").html("");
            $("#popup_adddevice").attr("data-status", "widgetList");
            $("#popup_adddevice").addClass("fa fa-ellipsis-v").removeClass("button");
            $("#header_device h1").html(Entity.Device.name);
            $.molmc.utils.showWidgets($("#widgetList_device"), Entity.Device.widgets,true);
            setTimeout(function(){
                subWidgetStatus(Entity.Device.widgets, $.molmc.mainMqtt);
            },500);            
            self.isUtopicInDevPanel("notify");
        });
        $("#widgets_device").bind( "unloadpanel", function(){
            if(!$.molmc.goShowWidget){
                $.molmc.mainMqtt.unsubscribeAll();
            }
        }); 
        $("#showWidget_device").bind("loadpanel", function(){
            self.isUtopicInDevPanel("notify");
//            $("#popup_adddevice").html(_lang("device_historyinfo"));
            $("#popup_adddevice").attr("data-status", "widget");
//            $("#popup_adddevice").removeClass("fa fa-ellipsis-v").addClass("button");
            $("#header_device h1").html(Entity.curWidget.name);
            showdevweight();
        });    

        //示例设备
        $("#demo_device").bind("loadpanel",function(){
            $("#defaultHeader .backButton").show();
            var response = function(result){
                Entity.demoDevList = result;
                var categoryList = categoryDemo(result);
                showDemoDevices($("#demoList_device"), categoryList);
            };
            if(_.isEmpty(Entity.demoDevList)){
                $.molmc.api.getDemoDevList(response);
            }
        });
        $("#demo_device").on("tap", "li", function(event){
            var dev_id = event.currentTarget.attributes[0].value;
            if(dev_id === "divider"){
                return;
            }
            $.molmc.explore.getDevices(dev_id, true);
        });
        //收藏设备
        $("#collectdev_device").bind("loadpanel",function(){
            var response = function(result){
                Entity.collectDevice=result;
                if(_.isEmpty(result)){
                    $.molmc.utils.shownullDev($("#collectdevList_device"),"collect");
                }else{
                    showFavDevices($("#collectdevList_device"), Entity.collectDevice);
                }
            };
            $.molmc.api.searchCollectDevices(response);
        });        
        
        $("#collectdev_device").on("tap","li",function(event){
            var dev_id = Entity.collectDevice[event.currentTarget.id].device_id;
            var id = Entity.collectDevice[event.currentTarget.id]._id;
            $.molmc.explore.getDevices(dev_id, undefined, event.currentTarget.id,id);
        });
        
//        长按收藏设备
        $("#collectdev_device").on("longTap","li",function(event){
            var tpl ='<div style="font-size:20px"><span class="fa fa-info-circle padding5" id="check_collect_device">'+ ' ' + _lang("device_view") + '</span><hr><span class="fa fa-trash padding5" id="delete_collectdev_device">' + ' ' + _lang("device_delfavo") + '</span></div>';
            var popup = $.ui.popup({
                id:"popup_delete_collect",
                title:"Alert! Alert!",
                message: tpl,
                cancelText:"Cancel me",
                cancelCallback: function(){console.log("cancelled");},
                doneText:"I'm done!",
                doneCallback: function(){console.log("Done for!");},
                cancelOnly:false,
                hideFooter:true,
                tapHide:true,
                suppressTitle:true,
                posOffset:50
            });
            
            $("#check_collect_device").bind("tap",function(){
                var dev_id = Entity.collectDevice[event.currentTarget.id].device_id;
                popup.hide();
                $.molmc.explore.getDevices(dev_id);
            });
            $("#delete_collectdev_device").bind("tap",function(){
                var dev_id = Entity.collectDevice[event.currentTarget.id]._id;
                popup.hide();
                deletecollectdevlist(dev_id,event.currentTarget.id);
            });
        });
        
        $("#device").on("tap","li",function(event){            
            Entity.Device = Entity.Devices[event.currentTarget.id];
            if(Entity.Device.widgets.length === 1){
                $.molmc.goShowWidget = true;
                Entity.curWidget = Entity.Device.widgets[0];
                subOneWidgetStatus(Entity.Device.widgets, $.molmc.mainMqtt);
                setTimeout(function(){
                    $.ui.loadContent("#showWidget_device", false, false, "slide");
                },50);                 
            }else{
                $.ui.loadContent("#widgets_device", false, false, "slide"); 
            }
        });
        
//        长按设备
        $("#device").on("longTap","li",function(event){
			navigator.notification.vibrate(50);
            var tpl ='<div style="font-size:20px"><span class="fa fa-info-circle padding5 width100" id="check_device">'+ ' ' + _lang("device_info") + '</span><hr><span class="fa fa-trash padding5 width100" id="delete_dev_device">'+ ' ' + _lang("device_deldev") + '</span></div>';
            var popup = $.ui.popup({
                id:"popup_delete_collect",
                title:"Alert! Alert!",
                message: tpl,
                cancelText:"Cancel me",
                cancelCallback: function(){console.log("cancelled");},
                doneText:"I'm do!",
                doneCallback: function(){console.log("Done for!");},
                cancelOnly:false,
                hideFooter:true,
                tapHide:true,
                suppressTitle:true,
                posOffset:50
            });
            $("#check_device").bind("tap",function(){
                Entity.Device = Entity.Devices[event.currentTarget.id];
                popup.hide();
                $.ui.loadContent("#deviceinfo_device", false, false, "slide");
            });
            // 删除设备
            $("#delete_dev_device").bind("tap",function(){
                var response = function(){
                    publishDevInfoNew();
                    Entity.Devices.splice(event.currentTarget.id,1);
                    if(Entity.Devices.length===0){
                        $.molmc.utils.shownullDev($("#deviceList_device"),"mydev");
                    }else{
                        $.molmc.utils.showDevices($("#deviceList_device"), Entity.Devices);
                    }
                };
                $.molmc.api.deleteDevice(Entity.Devices[event.currentTarget.id]._id,response);
                popup.hide();
            });    
        });
        
        $("#widgets_device").on("tap","li",function(event){
            $.molmc.goShowWidget = true;
            Entity.curWidget = Entity.Device.widgets[event.currentTarget.id];
            $.ui.loadContent("#showWidget_device", false, false, "slide");
        });
        
        //        添加按钮
        $("#popup_adddevice").bind("tap",function(){            
            var tplshow;			           
			if($("#popup_adddevice").attr("data-status")=== "device"){
                var tplcollect ='<div style="font-size:17px;bottom-border:1px solid;"><span class="fa fa-cogs padding5 width100" id="pop_config_device">' + ' ' + _lang("device_adddevice") + '</span></div>';
            tplcollect = tplcollect + '<div style="font-size:17px"><span class="fa fa-cube padding5 width100" id="pop_collectdev_device">'+ ' ' + _lang("device_favourite") + '</span></div>';
            tplcollect = tplcollect + '<div style="font-size:17px"><span class="fa fa-cubes padding5 width100" id="pop_demo_device">'+ ' ' + _lang("device_demo") + '</span></div>';
                tplshow = tplcollect;
            }else{
                var tplcollect = "";
                var bindTpl = '<div style="font-size:17px;bottom-border:1px solid;"><span class="fa fa-gears padding5 width100" id="pop_bind_device">' + ' ' + _lang("device_bind") + '</span></div>';
                if($("#popup_adddevice").attr("data-status")==="widgetList"){
                    tplcollect = bindTpl;
                }else if($("#popup_adddevice").attr("data-status")==="widget"){
                    if(mHasHistoryData(Entity.curWidget)){
                        tplcollect = '<div style="font-size:17px;bottom-border:1px solid;"><span class="fa fa-line-chart padding5 width100" id="pop_history_device">' + ' ' + _lang("device_showhistoryinfo") + '</span></div>';
                    }else{
                        tplcollect = "";
                    }
                    if(Entity.Device.widgets.length == 1){
                        tplcollect = tplcollect + bindTpl;
                    }
                }else if($("#popup_adddevice").attr("data-status")=== "history"){
                    tplcollect = '<div style="font-size:17px;bottom-border:1px solid;"><span class="fa fa-tachometer padding5 width100" id="pop_widget_device">' + ' ' + _lang("device_showwidget") + '</span></div>';
                }
                if(Entity.Device.isPublic === true){
                    tplcollect = tplcollect + '<div style="font-size:17px"><span class="fa fa-wechat padding5 width100" id="pop_sendtosession_device">'+ ' ' + _lang("device_sharetoSession") + '</span></div>';
                    tplcollect = tplcollect + '<div style="font-size:17px"><span class="fa fa-share-square-o padding5 width100" id="pop_sharetotimeline_device">'+ ' ' + _lang("device_sharetoTimeline") + '</span></div>';
                    tplcollect = tplcollect + '<div style="font-size:17px"><span class="fa fa-qq padding5 width100" id="pop_sharetoqq_device">'+ ' ' + _lang("device_sharetoqq") + '</span></div>';
                }
                tplshow = tplcollect;
            }

            var popup = $.ui.popup({
                id:"popup_add",
                title:"Alert! Alert!",
                message: tplshow,
                cancelText:"Cancel me",
                cancelCallback: function(){console.log("cancelled");},
                doneText:"I'm done!",
                doneCallback: function(){console.log("Done for!");},
                cancelOnly:false,
                hideFooter:true,
                tapHide:true,
                suppressTitle:true,
                posOffset:50
            });
            $("#popup_add").css({
                "left":"auto",
                "top":"45px",
                "width":"auto",
                "right":"0",
                "padding":"0",
                "border-radius":"0"
            });
            $("#popup_add #pop_collectdev_device").bind("tap",function(){
                popup.hide();
                $.ui.loadContent("#collectdev_device",false,false,"slide");
            });
            $("#popup_add #pop_config_device").bind("tap",function(){
                popup.hide();
                Entity.isCreateDev = true;
                if (!$.molmc.utils.getItem("notFirstConfig")) {                    
                    $.ui.loadContent("#step1_configdev",false,false,"slide");
                }else{
                    $.ui.loadContent("#deviceconfig",false,false,"slide");
                };
            });
            $("#popup_add #pop_demo_device").bind("tap",function(){
                popup.hide();
                $.ui.loadContent("#demo_device",false,false,"slide");
            });
            $("#popup_add #pop_history_device").bind("tap",function(){
                popup.hide();
                showhistory();
            });
            $("#popup_add #pop_widget_device").bind("tap",function(){
                popup.hide();
                showdevweight();
            });
            $("#popup_add #pop_bind_device").bind("tap",function(){
                popup.hide();
                Entity.isCreateDev = false;
                if (!$.molmc.utils.getItem("notFirstConfig")) {                    
                    $.ui.loadContent("#step1_configdev",false,false,"slide");
                }else{
                    $.ui.loadContent("#deviceconfig",false,false,"slide");
                };
            });
            $("#popup_add #pop_sendtosession_device").bind("tap",function(){
                popup.hide();
                var userToken = _.findWhere(Entity.Tokens, {device_id:Entity.Device._id, isPublic:true, clientType:"user"});
                if($("#popup_adddevice").attr("data-status")==="widgetList"){
                    shareToWechat("session", Entity.Device, userToken);
                }else{
                    shareToWechat("session", Entity.Device, userToken, Entity.curWidget);
                }
            });
            $("#popup_add #pop_sharetotimeline_device").bind("tap",function(){
                popup.hide();
                var userToken = _.findWhere(Entity.Tokens, {device_id:Entity.Device._id, isPublic:true, clientType:"user"});
                if($("#popup_adddevice").attr("data-status")==="widgetList"){
                    shareToWechat("timeline", Entity.Device, userToken);
                }else{
                    shareToWechat("timeline", Entity.Device, userToken, Entity.curWidget);
                }
            });
            $("#popup_add #pop_sharetoqq_device").bind("tap",function(){
                popup.hide();
                if($("#popup_adddevice").attr("data-status")==="widgetList"){
                    mShareToQQ(Entity.Device);
                }else{
                    mShareToQQ(Entity.Device, Entity.curWidget);
                }
            });
        });
        
        $("#deviceinfo_device").bind("loadpanel",function(){
            self.isUtopicInDevPanel("notify");
            var imghead = serverURL + '/' + Entity.Device.dev_img;
            $("#deviceinfo_device img").attr("src",imghead);
            if(Entity.Device.activated){
                $("#isactivate").html(_lang("g_btn_yes"));
            }else{
                $("#isactivate").html(_lang("g_btn_no"));
            }
            $("#dev_description_device").html(Entity.Device.description);
            $("#curdev_id_explore").html(Entity.Device._id);
            if(Entity.Device.isPublic){
                $("#curdev_isshared_device").html(_lang("device_sharetype_public"));
                $("#devShareType_device").show();
                $("#divider_share_device").show();
                $("#toggle_share_status").attr("checked","checked");
                $("#toggle_share_status").prop("checked",true);
                $("#toggle_share_status").val(1);
                if(Entity.Device.shareType===1){
                    $("#curdev_sharestatus_device").html(_lang("device_sharetype_readonly"));
                    $("#devShareType_device").show();
                    $("#divider_share_device").show();
                    $("#toggle_setshare").removeAttr("checked","checked");
                    $("#toggle_setshare").prop("checked",false);
                    $("#toggle_setshare").val(0);
                }else if(Entity.Device.shareType===2){
                    $("#devShareType_device").show();
                    $("#divider_share_device").show();
                    $("#toggle_setshare").attr("checked","checked");
                    $("#toggle_setshare").prop("checked",true);
                    $("#curdev_sharestatus_device").html(_lang("device_sharetype_rw"));
                    $("#toggle_setshare").val(1);
                }
            }else{
                $("#curdev_isshared_device").html(_lang("device_sharetype_private"));
                $("#toggle_share_status").removeAttr("checked");
                $("#toggle_share_status").prop("checked",false);
                $("#toggle_share_status").val(0);
                $("#devShareType_device").hide();
                $("#divider_share_device").hide();
            }
            $("#city_device").html(Entity.Device.city);
            $("#curdev_info_device").html(Entity.Device.name);
        });
        
        //修改设备头像
        $("#deviceinfo_device").on("tap","img", function(){
            var tpl ='<div style="font-size:20px"><div class="fa fa-camera padding5 width100" id="camera_device">' + ' ' + _lang("tips_camera") +'</div><hr><div class="fa fa-image padding5 width100" id="album_device">'+ ' '+ _lang("tips_albums") + '</div></div>';
            var popup = $.ui.popup({
                id:"popup_changehead_device",
                title:"Alert! Alert!",
                message: tpl,
                cancelText:"Cancel me",
                cancelCallback: function(){console.log("cancelled");},
                doneText:"I'm do!",
                doneCallback: function(){console.log("Done for!");},
                cancelOnly:false,
                hideFooter:true,
                tapHide:true,
                suppressTitle:true,
                posOffset:50
            });
            var onSuccess = function(imageURI){           
                var timestamp=new Date().getTime();                
                var suc = function(result){    
                    publishDevInfoNew();
                    var img_id = Entity.Device._id;
                    var upinforesp = function(updateresp){
                        updatelocalDevice();
                    }
                    Entity.Device.dev_img = "/v1/avatars/" + img_id;
                    $.molmc.api.updateDeviceInfo(Entity.Device._id, Entity.Device, upinforesp);
                    var imghead = serverURL + '/v1/avatars/' + img_id;
                    $("#deviceinfo_device img").attr("src",imghead);
                };
                uploadFile(imageURI, Entity.Device._id, suc);
            };
            var onFail = function (message) {
                navigator.notification.alert(
                    _lang("tips_devimg_updatefail"),  // 显示信息
                    alertDismissed,         // 警告被忽视的回调函数
                    _lang("tips_title_tips"),            // 标题
                    _lang("g_tips_confirm")                  // 按钮名称
                );
            };
            $("#camera_device").bind("tap",function(){
                navigator.camera.getPicture(onSuccess, onFail, {quality:75, destinationType:Camera.DestinationType.FILE_URI, sourceType:Camera.PictureSourceType.CAMERA, allowEdit:true, targetWidth:128, targetHeight:128});
                popup.hide();
            });
            $("#album_device").bind("tap",function(){
                navigator.camera.getPicture(onSuccess, onFail, {quality:75, destinationType:Camera.DestinationType.FILE_URI, sourceType:Camera.PictureSourceType.PHOTOLIBRARY, allowEdit:true, targetWidth:128, targetHeight:128});
                popup.hide();
            });
        });
        
        $("#device").on("tap", "#addDeviceEmpty", function(){
            Entity.isCreateDev = true;
            $.ui.loadContent("#step1_configdev",false,false,"slide");
        });
        
        var timer_step1_configdev;
        //配置设备步骤1
        $("#step1_configdev").bind("loadpanel", function(){
            $(".headerleft").show();
            var status = 0;
            var count = 0;
            $("#btn_next").attr("value","0");
            $("#btn_next").hide();
            $("#redlight_device").css("color","black");
            $.molmc.utils.getLocation(function(point){
                Entity.point = point;
                require(["vendor/map.quick"], function(Map){
                    Map.initMap("myExploreMap", {lng:point.lng,lat:point.lat,layer:5}, {minZoom:4,maxZoom:16});
                    Map.LocalByPoint(point, function(city){
                        console.log(city);
                        if(city==undefined){
                            city = "北京市";
                        }
                        Entity.city = city;
                    });
                });
            });
            timer_step1_configdev = setInterval(function(){
                if(status === 0){
                    if(count>5){
                        $("#redlight_device").css("color","red");
                    }else{
                        $("#press_btn_device").css("font-size","1.5em");
                    }
                    status = 1;
                }else{
                    if(count>5){
                        $("#redlight_device").css("color","black");
                    }else{
                        $("#press_btn_device").css("font-size","1.3em");
                    }
                    status = 0;
                }
                count ++;
            },500);         

            var callback = function(list){   
                $("#btn_next").show();
                $("#btn_next").attr("value","1"); 
            };
            scaneWifi(callback);
        });
        $("#step1_configdev").bind("unloadpanel", function(){
            clearInterval(timer_step1_configdev);
        });
        $("#btn_next").bind("tap", function(){
            $.molmc.utils.setItem("notFirstConfig", true);
            if($("#btn_next").attr("value")==="0"){
                return;
            } 
            console.log("city=" + Entity.city + "; point="+ JSON.stringify(Entity.point));
            $.ui.loadContent("#deviceconfig",false,false,"slide");
        });

        //配置设备步骤2
        $("#deviceconfig").bind("loadpanel", function(){
            $(".headerleft").show();
            $("#btn_scane").show();
            if(Entity.isCreateDev===true){
                $.ui.setTitle(_lang("device_adddevice"));
            }else{
                $.ui.setTitle(_lang("device_bind"));
            }           
            
            $("#btn_scane").bind("tap", function(){
                var callback = function(list){
                    succCall(list);
                };
                scaneWifi(callback, true);                
            });
            $('#display_pwd').on("tap", function(){
                var status = $('#display_pwd').attr("value");
                var pwdValue = $('#wifipwd_config').val();
                console.log("tap");
                if (status=="0") {
                    $('#display_pwd').attr("value", 1);
                    $('#display_pwd').css("color", "black");
                    $('#pwdbox')[0].innerHTML='<input class="margintop10 disablediv" name="wifipwd" type="text" id="wifipwd_config" value="'+ pwdValue +'" placeholder="'+_lang("device_config_inputpwd")+'">';
                }else{
                    $('#display_pwd').attr("value", 0);
                    $('#display_pwd').css("color", "gray");
                    $('#pwdbox')[0].innerHTML='<input class="margintop10 disablediv" name="wifipwd" type="password" id="wifipwd_config" value="'+ pwdValue +'" placeholder="'+_lang("device_config_inputpwd")+'">';
                };
            });
            var succCall = function(list){
                $.ui.hideMask();
                if (list === undefined) {
                    return;
                };
                $("#devssidList").empty();
                $("#wifissidList").empty();
                var devselectTpl="";
                var wifiselectTpl="";
                for(var i=0; i<list.length; i++){
                    if(list[i].toLowerCase().indexOf("intorobot") !== -1){
                        devselectTpl = devselectTpl + '<option value="'+list[i]+'">'+list[i]+'</option>';
                    }
                    wifiselectTpl = wifiselectTpl + '<option value="'+list[i]+'">'+list[i]+'</option>';
                }
                if(devselectTpl === ""){
                    navigator.notification.confirm(_lang("device_config_notfountdev"), function(){}, _lang("tips_title_tips"), _lang("g_tips_confirm"));
                }
                devselectTpl = '<select autofocus name="devSsid" class="disablediv">'+devselectTpl+'</select>';
                wifiselectTpl = '<select name="wifiSsid" class="disablediv">'+wifiselectTpl+'</select>';
                $("#devssidList").append(devselectTpl);
                $("#wifissidList").append(wifiselectTpl);
            };
            succCall(Entity.ssidList);
            if ($.molmc.utils.getItem("notFirstConfig")) {
                $.molmc.utils.getLocation(function(point){
                    Entity.point = point;
                    require(["vendor/map.quick"], function(Map){
                        Map.initMap("myExploreMap", {lng:point.lng,lat:point.lat,layer:5}, {minZoom:4,maxZoom:16});
                        Map.LocalByPoint(point, function(city){
                            console.log(city);
                            if(city==undefined){
                                city = "北京市";
                            }
                            Entity.city = city;
                        });
                    });
                });
                if (Entity.ssidList === undefined) {
                    scaneWifi(succCall, true);
                };
            };        
        });        
        
        $('#wifipwd_config').focus(function(e) {
            $.ui.scrollToBottom("deviceconfig");
        });
        $("#deviceconfig").bind("unloadpanel", function(){
            $(".headerleft").hide();
            $("#wifipwd_config").val("");
            stopconfig();
            if(Entity.Tokens!==undefined & $.molmc.mainMqtt !== undefined){
                $.molmc.mainMqtt.disconnect();
                openMainMqtt(Entity.Tokens);
            }
        });
        
        $("#deviceconfig").on("tap", ".button", function(){           
            if(!configing){
                $.ui.showMask(_lang("tips_configuring"));
                configing = true;
                $("#deviceconfig .button").attr("disabled","disabled");
                var devssid = $("#deviceconfig select[name='devSsid']").val();
                var wifissid = $("#deviceconfig select[name='wifiSsid']").val();
                var wifipwd = $("#deviceconfig input[name='wifipwd']").val();
                var payload = {
                     devssid: devssid,
                     wifissid: wifissid,
                     wifipwd: wifipwd
                };            
                var succCall = function(result){
                    console.log("createDevice success callback: " + JSON.stringify(result));
                    if($.molmc.utils.getItem("count")==null){
                        $.molmc.utils.setItem("count", 1);
                    }
                    var num = $.molmc.utils.getItem("count");                    
                    if(Entity.city==undefined){
                        Entity.city = "北京市";
                        Entity.point.lat = 39.897445;
                        Entity.point.lng = 116.331398;
                    }
                    var newdev = {
                        uid:$.molmc.utils.getItem("uid"),
                        name:devssid + "_" + num,
                        nickname:$.molmc.utils.getItem("name"),
                        isPublic:true,
                        tags:"atom",
                        dev_img:"assets/img/intodunio.png",
                        shareType:1,
                        product_id:result,
                        city: Entity.city,
                        coordinate:[Entity.point.lng, Entity.point.lat],
                        description:devssid + "_" + num
                    };
                    var resp = function(devinfo){
                        var success = function(res){
                            stopconfig();
                            $.molmc.mainMqtt.disconnect();
                            if(Entity.isCreateDev !== true){                                
                                res = _lang("device_bind") + _lang("g_success");
                            }else {
                                res = _lang("device_create") + " " + newdev.name + " " + _lang("g_success");
                            }
                            navigator.notification.confirm(res,function(){
                                $.ui.loadContent("#device",false,true,"slide");
                            },_lang("tips_title_tips"),_lang("g_tips_confirm"));
                            openMainMqtt(Entity.Tokens);
                            publishDevInfoNew();
                            updatelocalTokens();
                            updatelocalDevice();
                            num = parseInt(num) + 1;
                            $.molmc.utils.setItem("count", num);                            
                        };
                        navigator.wificonfig.setDeviceInfo(devinfo, success, configNotification);
                    };
                    var count = 0;
                    var timer = setInterval(function(){
                        count = count + 1;
                        if(navigator.network.connection.type == Connection.WIFI){
                            if(Entity.isCreateDev === true){
                                console.log(JSON.stringify(newdev));
                                var failedCall = function (code) {
                                      configNotification("112");
                                };
                                $.molmc.api.createDevice(newdev, resp, failedCall);
                            }else{
                                var dev_id = Entity.Device._id;
                                var token = _.findWhere(Entity.Tokens, {device_id: dev_id, isPublic:false, clientType:"device"});
                                var devInfo = {
                                    device_id: dev_id,
                                    access_token: token.access_token
                                }
                                resp(devInfo);
                            }
                            clearInterval(timer);
                        }
                        if(count > 20){
                            clearInterval(timer);
                        }
                    },300);
                };
                setTimeout(function(){
                    configing = false; 
                    $("#deviceconfig .button").removeAttr("disabled");
                },5000);
                if($("#btn_devconfig").val() == "0"){
                    showconfig();
                    // $.molmc.utils.showToast(_lang("device_config_tip"), 280, 3000);
                    navigator.wificonfig.createDevice(payload, "connect", succCall, configNotification);
                    if($.molmc.mainMqtt !== undefined){
                    }
                }else if($("#btn_devconfig").val() == "1"){
                    stopconfig();
                    navigator.wificonfig.cancelConfig();
                }
            }            
        });
        
        $("#deviceinfo_device").on("tap", "#curdev_info_device_td", function(){
            $.ui.loadContent("#editdevinfo_device",false,false,"slide");
        });
        
        //修改设备名称
        $("#editdevinfo_device").bind("loadpanel", function(){
            $("#editdevinfo_device input").val(Entity.Device.name);
            $("#editdevinfo_device textarea").val(Entity.Device.description);
        });
        
        //保存修改设备信息
        $("#header_editdevinfo_device .button").bind("tap", function(){
            var name = $("#editdevinfo_device input").val();
            var description = $("#editdevinfo_device textarea").val();
            if(name.length===0||description===0){
                navigator.notification.confirm(_lang("g_error_cannotempty"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
                return;
            }
            if(!$.molmc.utils.checkInput(name)){
                navigator.notification.confirm(_lang("device_notice_name"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
                return;
            }
            if(!$.molmc.utils.checkdevDespInput(description)){
                navigator.notification.confirm(_lang("device_notice_desc"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
                return;
            }
            Entity.Device.name = name;
            Entity.Device.description = description;
            
            var upinforesp = function(updateresp){
                publishDevInfoNew();
                updatelocalDevice();
                $.ui.goBack();
            };
            $.molmc.api.updateDeviceInfo(Entity.Device._id, Entity.Device, upinforesp);
        });
        
        //修改设备权限
        $("#toggle_share_status").bind("change", function(){
            var userToken = _.findWhere(Entity.Tokens, {device_id:Entity.Device._id, isPublic:true, clientType:"user"});
            if($("#toggle_share_status").val() == 1){
                if(_.isEmpty(userToken)){
                    return;
                }
                userToken.access_control[Entity.Device._id] = 0;
                var response = function(result){
                    publishDevInfoNew();
                    $("#devShareType_device").hide();
                    $("#divider_share_device").hide();
                    updatelocalDevice();
                    updatelocalTokens();
                };
                $.molmc.api.updateDevToken(userToken, response);
                $("#toggle_share_status").val(0);
                $("#curdev_isshared_device").html(_lang("device_sharetype_private"));
            }else{
                var resp = function(result){
                    publishDevInfoNew();
                    $("#devShareType_device").show();
                    $("#divider_share_device").show();
                    updatelocalDevice();
                    updatelocalTokens();
                };
                if(!_.isEmpty(userToken)){
                    userToken.isPublic = true;
                    userToken.access_control[Entity.Device._id] = 1;
                    $.molmc.api.updateDevToken(userToken, resp);
                }else{
                    userToken={};
                    userToken.uid = $.molmc.utils.getItem("uid");
                    userToken.isPublic = true;
                    userToken.device_id = Entity.Device._id;
                    userToken.clientType = "user";
                    userToken.ttl = 0;
                    userToken.access_control = {};
                    userToken.access_control[Entity.Device._id] = 1;
                    $.molmc.api.createDevToken(userToken, resp);
                }                
                $("#toggle_share_status").val(1);
                $("#curdev_isshared_device").html(_lang("device_sharetype_public"));
            }
        });
        
        $("#toggle_setshare").bind("change", function(){
            var userToken = _.findWhere(Entity.Tokens, {device_id:Entity.Device._id, isPublic:true, clientType:"user"});
            var response = function(){
                publishDevInfoNew();
                updatelocalDevice();
                updatelocalTokens();
            };
            if($("#toggle_setshare").val() == 1){
                if(_.isEmpty(userToken)){
                    return;
                }
                userToken.access_control[Entity.Device._id] = 1; 
                $.molmc.api.updateDevToken(userToken, response);
                $("#toggle_setshare").val(0);
                $('#curdev_sharestatus_device').html(_lang("device_sharetype_readonly"));
            }else{
                if(_.isEmpty(userToken)){
                    return;
                }
                userToken.access_control[Entity.Device._id] = 2; 
                $.molmc.api.updateDevToken(userToken, response);
                $("#toggle_setshare").val(1);
                $('#curdev_sharestatus_device').html(_lang("device_sharetype_rw"));
            }
        })
    };

    var scaneWifi = function(callBack, showMask) {
        var succCall = function(list){     
            Entity.ssidList = list;
            callBack(list)
            $.ui.hideMask();
        };
        var failure = function(result){
            $.ui.hideMask();
        };
        navigator.wificonfig.getSsidList(succCall, failure);
        if(showMask===true){
            $.ui.showMask(_lang("device_wifi_scanning"));
        }
    };   
    
    //提示
    var configNotification = function(rescode){
        stopconfig();
        var res = "(" + _lang("error_code") + " : " + rescode + ") ";
        if(rescode == "100"){
            res = res + _lang("tcp_first_create_failed");
        }else if(rescode == "101"){
            res = res + _lang("tcp_second_create_failed");
        }else if(rescode == "102"){
            res = res + _lang("tcp_data_send_failed");
        }else if(rescode == "103"){
            res = res + _lang("tcp_data_receive_failed");
        }else if(rescode == "104"){
            res = res + _lang("tcp_disconnect_error");
        }else if(rescode == "105"){
            res = res + _lang("tcp_connect_timeout");
        }else if(rescode == "106"){
            res = res + _lang("tcp_json_parse_failed");
        }else if(rescode == "107"){
            res = res + _lang("tcp_hand_atom_failed");
        }else if(rescode == "108"){
            res = res + _lang("wifi_connect_atom_failed");
        }else if (rescode == "109") {
            res = res + _lang("wifi_reconnect_atom_failed");
        }else if (rescode == "110") {
            res = res + _lang("atom_connect_wifi_timeout");
        }else if (rescode == "111") {
            res = res + _lang("atom_receive_wifiinfo_failed");
        }else if (rescode == "112") {
            res = res + _lang("atom_set_devinfo_failed");
        };
        navigator.notification.confirm(res,function(){                                
            // $.ui.loadContent("#device",false,true,"slide");
        },_lang("tips_title_tips"),_lang("g_tips_confirm"));
    };
    //分享至微信
    var shareToWechat = function(wxscene, device, token, widget){        
        var scene = Wechat.Scene.TIMELINE;
        var title = _lang("wechat_share_title");
        var description = "";
        var widgetQeury = "";
        if(widget !== undefined){
            widgetQeury = "&widget_id=" + widget.widget_id;
        }
        if(wxscene === "session"){
            scene = Wechat.Scene.SESSION;
            description = _lang("device_devname") + ": " + device.name + "\n" + _lang("device_description")+ ": " + device.description + "\n"+ _lang("device_city") + ": " + device.city;
        }else if(wxscene === "timeline"){
            scene = Wechat.Scene.TIMELINE;
            if(token.access_control[device._id] == 1){
                title = "; 小伙伴们快过来围观吧～";
            }else if(token.access_control[device._id] == 2){
                title = "; 小伙伴们快过来控制下,非常有趣哦～";
            }
            title = "我分享了来自"+ device.city + "的设备" + device.name + title;
        }         
        var headurl = device.dev_img;
        if(headurl == "" || headurl == undefined){
            headurl = "assets/img/intodunio.png";
        }
        Wechat.isInstalled(function (installed) {
            if(installed == "0"){
                navigator.notification.confirm(_lang("wechat_not_install"), function(){}, _lang("tips_title_tips"), _lang("g_tips_confirm"));
                return;
            }
            Wechat.share({
                message: {
                    title: title,
                    description: description,
                    thumb: serverURL + '/' + headurl,
                    mediaTagName: "IntoRobot-TAG",
                    messageExt: "IntoRObot",
                    messageAction: "<action>dotalist</action>",
                    media: {
                        type: Wechat.Type.WEBPAGE,
                        webpageUrl: serverURL + "/share/www/index.html?device_id=" + device._id + widgetQeury
                    }
                },
                scene: scene   // share to wechat
            }, function () {
            }, function (reason) {
                if(reason.indexOf("取消并返回") !== -1){
                    return;
                }
                navigator.notification.confirm(_lang("wechat_share_err"), function(){}, _lang("tips_title_tips"), _lang("g_tips_confirm"));
            });
        }, function (reason) {
            navigator.notification.confirm(_lang("wechat_install_err"), function(){}, _lang("tips_title_tips"), _lang("g_tips_confirm"));
        });
    };
    
    var mShareToQQ = function(device, widget){
        var args = {};
        var widgetQeury = "";
        var headurl = device.dev_img;
        if(headurl == "" || headurl == undefined){
            headurl = "assets/img/intodunio.png";
        }
        if(widget !== undefined){
            widgetQeury = "&widget_id=" + widget.widget_id;
        }
        args.url = serverURL + "/share/www/index.html?device_id=" + device._id + widgetQeury;
        args.title = _lang("wechat_share_title");
        args.description = _lang("device_devname") + ": " + device.name + "\n" + _lang("device_description")+ ": " + device.description + "\n"+ _lang("device_city") + ": " + device.city;
        args.imageUrl = serverURL + '/' + headurl;
        args.appName = "IntoRobot";
        YCQQ.shareToQQ(function(){
            console.log("share success");
        },function(failReason){
            console.log(failReason);
        },args);
    };
    
    var getUserToken = function(Tokens){
        var usrToken;
        $.each(Tokens, function(id){
            if(Tokens[id].clientType === "user" && Tokens[id].isPublic === false){
                usrToken = Tokens[id].access_token;
                return false;                
            }
        });
        return usrToken;
    };
    
    var mShowDeviceList = function(flag){
        var responseToken = function(result){
            Entity.Tokens = result;
            openMainMqtt(result);            
        };
        var responseDev = function(result){
            Entity.Devices = result;            
//            $.ui.scrollToTop("#device");
            $.molmc.alwaysHideMask = false;            
            mGetTokens(responseToken, flag); 
            $.molmc.utils.showDevices($("#deviceList_device"), result);
            subOnlineStatus(Entity.Devices);
            Device.prototype.onSubUtopic();
        };
        if($.molmc.utils.checkNetwork()){           
            mGetPrivateDev(responseDev, flag);        
        }
    };
    
    var openMainMqtt = function(tokens){
        var usrToken = getUserToken(tokens);
        var options = {
            userName: usrToken,
            password: $.molmc.utils.getItem("account"),
            userID: $.molmc.utils.getItem("u_topic")
        }
        if(_.isEmpty($.molmc.mainMqtt)){
            $.molmc.mainMqtt = new $.molmc.mqtt(options);                    
        }else{
            $.molmc.mainMqtt.openConnect(options);
        }
    };
    
    var mGetPrivateDev = function(response, flag){
        if(Entity.Devices === undefined | flag === true){
            $.molmc.api.getDevices(response);
        }else{
            $.molmc.utils.showDevices($("#deviceList_device"), Entity.Devices);
            subOnlineStatus(Entity.Devices);
        }
    };
    // 显示收藏设备
    var showFavDevices = function(el, list){
        if(_.isEmpty(list)){
            return;
        }
        var listView = el;        
        listView.empty();
        for(var i = 0; i < list.length; i++){
            var headurl = list[i].dev_img;
            if(headurl == "" || headurl == undefined){
                headurl = "/assets/img/intodunio.png";
            }else{
                var pattern = /^[^\/]+/;
                if(pattern.test(headurl)){
                    headurl = "/" + headurl;
                }
            }
            var liTplObj = '<li id="'+i+'"><div style="float:left"><img style="width:80px;height:80px;margin-top:-8px;border-radius:50%;" src="'+ serverURL + headurl +'"></div><div style="margin-left:90px;height:65px;"><h3 style="color:rgb(93,93,216);margin-top:-5px;width:80%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+list[i].name+'</h3><h4 class="nowrap"  style="color:gray;margin-top:5px;">'+list[i].description+'</h4><h4 style="color:rgb(42, 132, 197);margin-top:5px;margin-left:5px;"><span class="icon location" style="margin:-5px;"></span>' + list[i].city + '</h4></div></li>';
            listView.append(liTplObj);
        }
    };
    
    // 显示示例设备
    var showDemoDevices = function(el, categoryList){
        if(_.isEmpty(categoryList)){
            return;
        }
        var listView = el;        
        listView.empty();
        for(var i=0, leni=categoryList.length; i<leni; i++){
            if(categoryList[i].name !== undefined){
                var tpldiv = '<li class="divider"><div><label style="width:auto;padding:3px 3px">'+ categoryList[i].name+'</label><div style="clear:both;"></div></div></li>';
                listView.append(tpldiv);
            }
            var list = categoryList[i].list;
            for(var j=0,lenj=list.length; j < lenj; j++){
                var headurl = list[j].dev_img;
                if(headurl == "" || headurl == undefined){
                    headurl = "/assets/img/intodunio.png";
                }else{
                    var pattern = /^[^\/]+/;
                    if(pattern.test(headurl)){
                        headurl = "/" + headurl;
                    }
                }
                var liTplObj = '<li data-id="'+list[j]._id+'"><div style="float:left"><img style="width:80px;height:80px;margin-top:-8px;border-radius:50%;" src="'+ serverURL + headurl +'"></div><div style="margin-left:90px;height:65px;"><h3 style="color:rgb(93,93,216);margin-top:-5px;width:80%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+list[j].name+'</h3><h4 class="nowrap"  style="color:gray;margin-top:5px;">'+list[j].description+'</h4></div></li>';
                listView.append(liTplObj);
            }
        }
    };

    var categoryDemo = function(demoDevList){
        if(demoDevList === undefined){
            return;
        }
        var categoryName = new Array();
        var categoriedList = new Array();
        for(var i=0, len=demoDevList.length; i<len; i++){
            var tempObj;
            var tempArry=[];
            if(categoryName.indexOf(demoDevList[i].category) === -1){
                categoryName.push(demoDevList[i].category);
                tempArry.push(demoDevList[i]);
                tempObj = {name:demoDevList[i].category, list:tempArry};
                categoriedList.push(tempObj);
            }else{
                categoriedList[categoryName.indexOf(demoDevList[i].category)].list.push(demoDevList[i]);                
            }
        }
        return categoriedList;
    }
    
    var updatelocalDevice= function(){
        var response =function(result){
            Entity.Devices = result;
        };
        $.molmc.api.getDevices(response);
    };
    var updatelocalTokens= function(){
        var response =function(result){
            Entity.Tokens = result;
        };
        $.molmc.api.getTokens(response);
    };
    var mGetTokens = function(response, flag){
        if(Entity.Tokens === undefined | flag === true){
            $.molmc.api.getTokens(response);
        }
    };
    
    var subOnlineStatus = function(devList){
        if(devList.length===undefined){
            return;
        }
        var el = $("#deviceList_device")[0].children;
        $.each(el, function(index){
            var dev = devList[el[index].id];
            if (dev===undefined) {
                return;
            };
            var dev_id = dev._id;
            if(dev.isPublic){
                $(el[index]).find(".share").addClass("fa-share-alt");
                $(el[index]).find(".share").css('color', 'limegreen');
            }else{
                $(el[index]).find(".share").removeClass("fa-share-alt");
            }
            if(dev.activated !== true) {
                return ;
            }
            var showStatus = function(i){
                if(Entity.status[i] == "online") {
                    $(el[i]).find(".link").removeClass("fa-unlink").addClass("fa-link");
                    $(el[i]).find(".link").css('color', 'limegreen');                    
                }else if(Entity.status[i] == "offline"){
                    $(el[i]).find(".link").removeClass("fa-link").addClass("fa-unlink");
                    $(el[i]).find(".link").css('color', 'darkgrey');
                }
            };
            var url = 'v1/' + dev_id + '/platform/default/info/online';
            $.molmc.mainMqtt.subscribe(url, 2, function(msg){
                Entity.status[index] = $.parseJSON(msg.payloadString).key;
                showStatus(index);
            });
            if(Entity.status.length<1){
                return;
            }
            showStatus(index);
        });
    };

    //检测控件是否有历史数据
    var mHasHistoryData = function(widget){
        console.log(widget);
        if(widget===undefined){
            return false;
        }
        if (widget.topics === undefined) {
            return false;
        };
        for (var i=0; i<widget.topics.length; i++) {
            if(widget.topics[i].history){
                return true;
            }
        };
        return false;
    };
    //发送更新topic
    var publishDevInfoNew = function(){
        var timeStamp = new Date().getTime().toString();
        $.molmc.utils.u_TimeStamp = timeStamp;
        var url = "v1/"+$.molmc.utils.getItem("u_topic")+"/channel/userDevice/cmd/updata";
        $.molmc.mainMqtt.publish(url, timeStamp, 0, false);
    };
    
    var subOneWidgetStatus = function(widList, mqtt){
        var topic = _.filter(widList[0].topics, function(m){
            return m.isData === true;
        });
        if(widList[0].isShow === false){
            return;
        }else{
            if(topic.length>0){
                var url = "v1/" + Entity.Device._id + topic[0].url;
                mqtt.subscribe(url, 2, function(msg){                        
                    widList[0].retain = msg.payloadString;
                });
            }
        } 
    };
    
    var subWidgetStatus = function(widList, mqtt){
        var el = $("#widgetList_device")[0].children;
        $.each(el, function(index){            
            var wid = widList[el[index].id];
            var topic = _.filter(wid.topics, function(m){
                return m.isData === true;
            });
            if(wid.isShow === false){
                return;
            }else{
                var url = "v1/" + Entity.Device._id + topic[0].url;
                var callbk_sub = function(){
                    mqtt.subscribe(url, 2, function(msg){
                        if(widList[el[index].id].topics[0].D_type === "BOOL"){
                            if(msg.payloadString == "1"){
                                var showVal = "";
                                showVal = _lang("g_on");
                            }else{
                                showVal = _lang("g_off");
                            }
                            $("#badge", $(el[index])).html(showVal);
                        }else{
                            var unit = widList[el[index].id].topics[0].attribute.unit;
                            $("#badge", $(el[index])).html(msg.payloadString +" "+ unit);
                        }                        
                        widList[el[index].id].retain = msg.payloadString;
                    });
                };
                if(topic.length>0){
                    mqtt.unsubscribe(url, callbk_sub);
                }
            }            
        });
    };

    var mgetiscollectdevs=function(dev_id){
        var response = function(){
            Entity.iscollect=false;
            for(var i=0; i<Entity.collectDevice.length; i++){     
                if(dev_id===Entity.collectDevice[i].device_id){
                    Entity.iscollect=true;
                    Entity.cur_id=Entity.collectDevice[i]._id;
                    i=Entity.collectDevice.length+1;
                }
            }
            if(!Entity.iscollect){
                Entity.cur_id=undefined;
            }
        } 
        if(Entity.collectDevice===undefined){
            mgetCollectDevs(true,response);
        }else{
            response();
        }       
        return Entity.iscollect;
    };
    
    var mgetCollectDevs=function(flag,nextFunc){
        var response = function(result){
            Entity.collectDevice=result;
            if($.isFunction(nextFunc)){
                nextFunc();
            }
        };
        if(flag||Entity.collectDevice===undefined){
            $.molmc.api.searchCollectDevices(response);
        } 
    };
    
    var mdeletecollectDevice = function(dev_id){
        var self = this;
        var response = function(){
            navigator.notification.confirm(_lang("device_unfavo_succ"), function(){}, _lang("tips_title_tips"), _lang("g_tips_confirm"));
            $("#heart_widgets_explore").removeClass("fa-heart").addClass("fa-heart-o");
                $("#heart_widgets_explore").css("color","gray");
            mgetCollectDevs(true);            
        }
        $.molmc.api.deleteCollectDevice(dev_id,response);
    };
    
    var deletecollectdevlist = function(dev_id,id){
        mdeletecollectDevice(dev_id);
        Entity.collectDevice.splice(id,1);
        if(Entity.collectDevice.length===0){
            $.molmc.utils.shownullDev($("#collectdevList_device"),"collect");
        }else{
            $.molmc.utils.showDevices($("#collectdevList_device"),Entity.collectDevice);
        }
    };
    
    // 上传文件到服务器 
	var uploadFile = function(imageURI, devid, sucresp) {
        var options = new FileUploadOptions(); 
		options.fileKey="file"; 
		options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1); 
		options.mimeType="image/jpeg";
		var ft = new FileTransfer();
		ft.upload(imageURI,
				serverURL + "/v1/avatars?x=0&y=0&h=128&w=128&device_id="+devid,
				sucresp, 
				function(error) { 
					console.log('Error uploading file ' + path + ': ' + error.code); 
				}, options);  
	};
    
    var showhistory = function(){
        $("#popup_adddevice").attr("data-status","history");
        var el = $("#widgetPanel_device");            
        require([fileSystemWidget + 0 + "/widget.js"],function(widget){
            widget.Show(el, Entity.curWidget, Entity.Device._id);
        });
    };
    var showdevweight = function(){
        $("#popup_adddevice").attr("data-status","widget");
        var el = $("#widgetPanel_device");
        require([fileSystemWidget + Entity.curWidget.widget_id + "/widget.js"],function(widget){
            widget.Show($("#showWidget_device"), el, Entity.curWidget, Entity.Device._id, $.molmc.mainMqtt);
        });
    };
    var showconfig = function(){
        $("#btn_devconfig").html(_lang("device_underconfig"));
        $("#btn_devconfig").val("1");
        // $("#text_cannel_device").addClass("partborder fa fa-pulse");
        $(".disablediv").attr("disabled","disabled");
    };
    var stopconfig = function(){
        $.ui.hideMask();
        $("#btn_devconfig").html(_lang("device_config_btn"));
        $("#btn_devconfig").val("0");
        // $("#text_cannel_device").removeClass("partborder fa fa-pulse");
        $(".disablediv").removeAttr("disabled");
    };
    
    Device.prototype = {
        deviceList:function(){
            return Entity.Devices;
        },
        getPrivateDev:function(response, flag){
            mGetPrivateDev(response, flag);
        },
        getTokens:function(response, flag){
            mGetTokens(response, flag);
        },
        showDeviceList:function(flag){
            mShowDeviceList(flag);
        },
        deletecollectDev:function(dev_id){
            mdeletecollectDevice(dev_id);
        },
        deletecollectdevlist:function(dev_id,id){
            deletecollectdevlist(dev_id,id);
        },
        getisCollectDevs:function(dev_id){
            return mgetiscollectdevs(dev_id);
        },
        getCollectDevs:function(flag){         
            mgetCollectDevs(flag);
        },
        device_idto_id_collect:function(device_id){
            if(Entity.cur_id===undefined){
                mgetiscollectdevs(device_id);
            }
            return Entity.cur_id;
        },
        onSubUtopic:function(){
            if(Entity.hasOnUtopic !== true){
                Entity.hasOnUtopic = true;
                $.molmc.mainMqtt.on($.molmc.utils.u_Topic, function(message){
                    if(message.payloadString != $.molmc.utils.u_TimeStamp){                        
                        if(Entity.inDevPanel === "none"){
                            updatelocalDevice();
                            updatelocalTokens();
                            return;
                        }
                        if(Entity.inDevPanel === true){
                            mShowDeviceList(true);
                        }else if(Entity.inDevPanel === "notify"){
                            updatelocalDevice();
                            updatelocalTokens();
                            navigator.notification.confirm(
                                _lang("g_tips_devinfomod"),
                                function(){
                                    $.ui.loadContent("#device", false, false, "slide")
                                },
                                _lang("tips_title_tips"),
                                _lang("g_tips_confirm")
                            );
                        }
                    }
                })
            }
        },
        hasHistoryData:function(widget){
           return mHasHistoryData(widget);
        },
        isUtopicInDevPanel:function(inDevpanel){
            Entity.inDevPanel = inDevpanel;
        },
        offSubUtopic:function(){
            $.molmc.mainMqtt.off($.molmc.utils.u_Topic);
        },
        updataDevAndToken:function(){
            updatelocalDevice();
            updatelocalTokens();
        },
        shareWechat:function(wxscene, device, token){
            shareToWechat(wxscene, device, token);
        },
        shareToQQ:function(device){
            mShareToQQ(device);
        }
    };
    
    $.molmc.device = new Device();
})(af);