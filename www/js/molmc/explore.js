(function($) {
    "use strict";
    var Entity = {};
    var curDevId;
    var nowclick=null;
    var temperaturestring = "tag=temperature";
    var switchstring = "tag=switch";
    var pagenum=1;
    var ispullrefresh = false;
    
    var Explore = function(){
        var self = this;
        initexplore();
        $(document).on("applogout", function(){
            initexplore();
        });
        $("#explore").bind( "loadpanel", function(){
            $.molmc.alwaysHideMask = true;
            ispullrefresh = false;
            $.molmc.device.isUtopicInDevPanel("none");
            $("#header_explore h1").html(_lang("g_title_explore"));
            var j = 0;
            var hotresponse = function(result){
                Entity.ArrayDevice[j]=result;    
                Entity.hotDevices=result;
                if(_.isEmpty(result)){
                    Entity.Devicespart[j]=[getlistlabel("","none")];
                }else{
                    if(result.length>5){
                        Entity.Devicespart[j]=Entity.ArrayDevice[j].slice(0,5);
                    }else{
                        Entity.Devicespart[j]=result.slice(0,result.length);
                    }

                    Entity.Devicespart[j].unshift(getlistlabel(_lang("explore_popdevs"),"listlabel"));
                }
                if(_.isEmpty(Entity.label)){
                    Entity.label=[_lang("explore_popdevs")];
                }
                else{
                    Entity.label=Entity.label.concat(_lang("explore_popdevs"));
                }
                if(Entity.Devicesshow.length===1 || Entity.Devicesshow.length===0){
                    Entity.Devicesshow=Entity.Devicespart[j];
                }else{
                    if(!_.isEmpty(result)){
                        if(Entity.Devicesshow[0].typeofli=="listlabel"){
                            Entity.Devicesshow=Entity.Devicesshow.concat(Entity.Devicespart[j]);
                        }
                    }
                }
                
                $.molmc.utils.showDevices($("#pubDevList_explore"), Entity.Devicesshow,{flag_collect:true});   
                Entity.tempDevices = Entity.Devicesshow.slice(0,Entity.Devicesshow.length);
                j++;
            }; 
            var nearresponse = function(result){
               
                Entity.ArrayDevice[j]=result;    
                Entity.nearDevices=result;
                if(_.isEmpty(result)){
                    Entity.Devicespart[j]=[getlistlabel("","none")];
                }else{
                    if(result.length>5){
                        Entity.Devicespart[j]=Entity.ArrayDevice[j].slice(0,5);
                    }else{
                        Entity.Devicespart[j]=result.slice(0,result.length);
                    }
                    Entity.Devicespart[j].unshift(getlistlabel(_lang("explore_nearbydevs"),"listlabel"));
                }
                if(_.isEmpty(Entity.label)){
                    Entity.label=[_lang("explore_nearbydevs")];
                }
                else{
                    Entity.label=Entity.label.concat(_lang("explore_nearbydevs"));
                }
                if(Entity.Devicesshow.length===1|| Entity.Devicesshow.length===0){
                    Entity.Devicesshow=Entity.Devicespart[j];
                }else{
                    if(!_.isEmpty(result)){
                        if(Entity.Devicesshow[0].typeofli=="listlabel"){
                            Entity.Devicesshow=Entity.Devicesshow.concat(Entity.Devicespart[j]);
                        }
                    }
                }
                $.molmc.utils.showDevices($("#pubDevList_explore"), Entity.Devicesshow,{flag_collect:true});   
                Entity.tempDevices = Entity.Devicesshow.slice(0,Entity.Devicesshow.length);
                j++;
            };
            self.searchHotDevices(hotresponse);
            self.searchNearbyDevices(nearresponse);
            $(".headerleft").hide();
        });
        $("#explore").bind( "unloadpanel", function(){
            if(nowclick!==null){
                nowclick.style.background="inherit";
                nowclick.style.color="#53575E";
                $("#input_search_explore").val("");
            }
            $(".headerleft").show();
        });
        $("#widgets_explore").bind( "loadpanel", function(){
            $("#header_widget_explore h1").html(Entity.CurDevice.name);
            $("#popup_widList_explore").html("");
            $("#popup_widList_explore").attr("data-status", "widgetList");
            $("#popup_widList_explore").addClass("fa fa-ellipsis-v").removeClass("button");
            $.molmc.utils.showWidgets($("#widgetList_explore"), Entity.CurDevice.widgets);
            $("#device_name_explore").html(Entity.CurDevice.name);
            $("#location_city_explore").html(Entity.CurDevice.city);
            $("#device_creater_explore").html(Entity.CurDevice.description);
            $("#device_image_explore").attr("src",serverURL + '/' + Entity.CurDevice.dev_img);
            if(Entity.isDemoDev === true){
                $("#heart_widgets_explore").removeClass("fa-heart-o").removeClass("fa-heart").addClass("fa-code-fork");
                $("#heart_widgets_explore").css("color","gray");
                $("#popup_widList_explore").hide();
            }else{
                $("#popup_widList_explore").show();
                if(getiscollectdev(Entity.CurDevice._id)){
                    $("#heart_widgets_explore").removeClass("fa-heart-o").removeClass("fa-code-fork").addClass("fa-heart");
                    $("#heart_widgets_explore").css("color","red");
                }else{
                    $("#heart_widgets_explore").removeClass("fa-heart").removeClass("fa-code-fork").addClass("fa-heart-o");
                    $("#heart_widgets_explore").css("color","gray"); 
                }
            }
            setTimeout(function(){
                subWidgetStatus(Entity.CurDevice.widgets, $.molmc.pubMqtt);
            },500);
        });
        
        $("#widgets_explore").bind( "unloadpanel", function(){            
            if(!$.molmc.goShowWidget){
                $.molmc.mainMqtt.unsubscribeAll();
            }
            if(Entity.isDemoDev === true){
                $.ui.hideMask();
                var url = self.forkSubUrl;
                $.molmc.mainMqtt.unsubscribe(url);
            }
        }); 
        var showhistory = function(){
            $("#popup_widList_explore").html(_lang("device_widgetshow"));
            $("#popup_widList_explore").attr("data-status","history");
            var el = $("#widgetPanel_explore");            
            require([fileSystemWidget + 0 + "/widget.js"],function(widget){
                widget.Show(el, Entity.curWidget, Entity.CurDevice._id);
            });
        };
        
        var showWidget = function(){
            $("#header_widget_explore h1").html(Entity.curWidget.name);            
            $("#popup_widList_explore").html(_lang("device_historyinfo"));
            $("#popup_widList_explore").attr("data-status","widget");
            $("#popup_widList_explore").removeClass("fa fa-ellipsis-v").addClass("button");
            if($.molmc.device.hasHistoryData(Entity.curWidget)){
                $("#popup_widList_explore").show();
            }else{
                $("#popup_widList_explore").hide();
            }
            var el = $("#widgetPanel_explore");
            require([fileSystemWidget + Entity.curWidget.widget_id + "/widget.js"], function(widget){
                widget.Show($("#showWidget_explore"), el, Entity.curWidget, Entity.CurDevice._id, $.molmc.pubMqtt);
            });
        };
        
        $("#showWidget_explore").bind( "loadpanel", function(){
            showWidget();
        });
        
        //        添加fork/微信分享
        $("#popup_widList_explore").bind("tap",function(){
            if($("#popup_widList_explore").attr("data-status")==="widgetList"){
                var tplcollect = "";
                if(Entity.isDemoDev === true){
                    tplcollect ='<div style="font-size:17px;bottom-border:1px solid;"><span class="fa fa-code-fork padding5 width100" id="pop_fork_explore">' + ' ' + _lang("explore_forkdemoDev") + '</span></div>';
                }
                tplcollect = tplcollect + '<div style="font-size:17px"><span class="fa fa-wechat padding5 width100" id="pop_sendtosession_explore">'+ ' ' + _lang("device_sharetoSession") + '</span></div>';
                tplcollect = tplcollect + '<div style="font-size:17px"><span class="fa fa-share-square-o padding5 width100" id="pop_sharetotimeline_explore">'+ ' ' + _lang("device_sharetoTimeline") + '</span></div>';
                tplcollect = tplcollect + '<div style="font-size:17px"><span class="fa fa-qq padding5 width100" id="pop_sharetoqq_explore">'+ ' ' + _lang("device_sharetoqq") + '</span></div>';

                var popupexp = $.ui.popup({
                    id:"popup_add",
                    title:"Alert! Alert!",
                    message: tplcollect,
                    cancelText:"Cancel me",
                    cancelCallback: function(){},
                    doneText:"I'm done!",
                    doneCallback: function(){},
                    cancelOnly:false,
                    hideFooter:true,
                    tapHide:true,
                    suppressTitle:true,
                    posOffset:50
                });
                $("#popup_add").css({
                    "left":"auto",
                    "top":"45px",
                    "right":"0",
                    "width":"auto",
                    "padding":"0",
                    "border-radius":"0"
                });
                $("#popup_add #pop_fork_explore").bind("tap",function(){
                    popupexp.hide();
                    forkDemoToMyDev(Entity.CurDevice._id, Entity.CurDevice.application_id);
                });
                $("#popup_add #pop_sendtosession_explore").bind("tap",function(){
                    popupexp.hide();
                    $.molmc.device.shareWechat("session", Entity.CurDevice, Entity.CurToken);
                });
                $("#popup_add #pop_sharetotimeline_explore").bind("tap",function(){
                    popupexp.hide();
                    $.molmc.device.shareWechat("timeline", Entity.CurDevice, Entity.CurToken);
                });
                $("#popup_add #pop_sharetoqq_explore").bind("tap",function(){
                    popupexp.hide();
                    $.molmc.device.shareToQQ(Entity.CurDevice);
                });
            }else if($("#popup_widList_explore").attr("data-status")==="widget"){
                showhistory();
            }else if($("#popup_widList_explore").attr("data-status")==="history"){
                showWidget();
            }
        });
//        搜索按钮
        $("#btn_search_explore").bind("tap",function(){
            pagenum=1;
            unitesearch();
        });
        
//        点击查看设备
        $("#explore").on("tap","li",function(event){
            if(event.currentTarget.id===""){
                return;
            }
            $.molmc.device.getCollectDevs();
            var device_id = Entity.Devicesshow[event.currentTarget.id]._id;
            self.getDevices(device_id,undefined,event.currentTarget.id); 
        });
        
//        点击查看更多设备
        var clickmorenum;
        $("#explore").on("tap","label",function(event){   
            if(event.currentTarget.id===""){
                return;
            }
            if(Entity.ismore){
                Entity.ArrayDevice[clickmorenum].splice(0,1);
                Entity.ismore=false;
                Entity.Devicesshow=Entity.tempDevices.slice(0,Entity.tempDevices.length);
            }
            else{
                Entity.ismore=true;
                clickmorenum=event.currentTarget.id.substr(4);
                Entity.ArrayDevice[clickmorenum].unshift(getlistlabel(Entity.label[clickmorenum],"replylabel"));
                Entity.Devicesshow=Entity.ArrayDevice[clickmorenum].slice(0,Entity.ArrayDevice[clickmorenum].length);
            }
            $.molmc.utils.showDevices($("#pubDevList_explore"),Entity.Devicesshow,{flag_collect:true});
        });
        
//        点击收藏
        $("#heart_widgets_explore").on("tap",function(event){
            console.log(Entity.isDemoDev);
            if(Entity.isDemoDev === true){
                forkDemoToMyDev(Entity.CurDevice._id, Entity.CurDevice.application_id);
            }else{
                var uid = $.molmc.utils.getItem("uid");
                var device_id = Entity.CurDevice._id;
                var name = Entity.CurDevice.name;
                var description = Entity.CurDevice.description;
                var city = Entity.CurDevice.city;
                var dev_img =Entity.CurDevice.dev_img;
                var payload = {
                    "uid":uid,
                    "device_id":device_id,
                    "name":name,
                    "description":description,
                    "city":city,
                    "dev_img":dev_img
                };
                var response = function(result){
                    navigator.notification.confirm(_lang("explore_favorsucc"), function(){}, _lang("tips_title_tips"), _lang("g_tips_confirm"));
                    $.molmc.device.getCollectDevs(true);
                    $("#heart_widgets_explore").removeClass("fa-heart-o").addClass("fa-heart");
                    $("#heart_widgets_explore").css("color","red");                
                };

                if(!getiscollectdev(device_id)){
                    $.molmc.api.collectDevice(payload,response); 
                }else{
                    var _id = $.molmc.device.device_idto_id_collect(device_id);
                    $.molmc.device.deletecollectDev(_id);                
                }
            }
        });
        
//        点击查看控件信息
        $("#widgets_explore").on("tap","li",function(event){
            $.molmc.goShowWidget = true;
            Entity.curWidget = Entity.CurDevice.widgets[event.currentTarget.id];
            $.ui.loadContent("#showWidget_explore", false, false, "slide");
        });    
        
//        点击标签
        $(".label_hot").bind("tap",function(){
            if(nowclick!==null){
                nowclick.style.background="inherit";
                nowclick.style.color="#53575E";
            }
            nowclick=this;
            nowclick.style.background="#0088D1";
            nowclick.style.color="#ffffff";
            pagenum=1;
            unitesearch();
        });
    };
    //上拉加载
    var pullUpRefresh = function(el){
        var myScroller = el.scroller({
             verticalScroll:true,
             horizontalScroll:false,
             infinite:true,
             autoEnable:true
        });
        myScroller.addInfinite();
        $.bind(myScroller,"infinite-scroll",function(){
            var self = this;
            $.bind(myScroller,"infinite-scroll-end",function(){
                $.unbind(myScroller, "infinite-scroll-end");
                self.clearInfinite();
                if(!ispullrefresh){
                    return;
                }
                pagenum++;
                unitesearch(pagenum,20);
                self.scrollToBottom();
            });
        });
        myScroller.enable();
    };
    
    var initexplore = function(){
        Entity={};
        Entity.ArrayDevice = new Array();
        Entity.Devicespart = new Array();
        Entity.Devicesshow = new Array();
        Entity.label = new Array();
        Entity.ismore=false;
        curDevId="";
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
                            $("#badge", $(el[index])).html(msg.payloadString + " "+ unit);
                        }
                        widList[el[index].id].retain = msg.payloadString;
                    });
                };
                if(topic.length>0){
                    if(mqtt){
                        mqtt.unsubscribe(url, callbk_sub);
                    }
                }
            }            
        });
    };
    
    var getiscollectdev=function(dev_id){
        var a = $.molmc.device.getisCollectDevs(dev_id);
        return a;    
    };

    var getlistlabel = function(tag,type_li){
        var labels={};
        labels.typeofli=type_li;
        labels.tag=tag;
        return labels;
    };
    
    var forkDemoToMyDev = function(demoid, appid){
        var devlist = $.molmc.device.deviceList();
        popList(devlist, demoid, appid);
    };
    
    var popList = function(List, demoid, appid){
        if(_.isEmpty(List)){
            navigator.notification.confirm(_lang("g_warning_nodeveices"), function(){}, _lang("tips_title_tips"), _lang("g_tips_confirm"));
            return;
        }
        var tpl = "";
        for(var i=0; i<List.length; i++){
            tpl = tpl + '<li data-id="'+List[i]._id+'">'+List[i].name+'</li>';
        }
        tpl = '<ul class="list" style="overflow:auto;max-height:300px">'+ tpl +'</ul>';
        var popup = $.ui.popup({
            id:"popup_List",
            title:_lang("device_select_demodev"),
            message: tpl,
            cancelText:"Cancel me",
            cancelCallback: function(){},
            doneText:"I'm done!",
            doneCallback: function(){},
            cancelOnly:false,
            hideFooter:true,
            tapHide:true,
            suppressTitle:false,
            posOffset:50
        });
        setTimeout(function(){
            $("#popup_List").on("tap", "li", function(event){
                popup.hide();
                var mydevid = event.currentTarget.attributes[0].value;
                Entity.forkDevId = mydevid;
                repaintDev(mydevid, demoid, appid);
            });
        },500);
        
    };
    
    var repaintDev = function(mydevid, ref_id, appid){
        $.ui.showMask(_lang("explore_repaintdev_tips"));
        var response = function(result){
            navigator.notification.confirm(
                _lang("explore_checkdevonline"),
                function(button){
                    if(button === 1){
                        compileApp(mydevid, result.application_id);
                    }else if(button === 2){
                    }
                }, 
                _lang("tips_title_tips"),
                _lang("g_btn_yes") + "," + _lang("g_btn_no")
            );             
        };
        $.molmc.api.repaintDemoDev(mydevid, ref_id, response);
    };
  
    var compileApp = function(devid, appid){
        $.ui.showMask(_lang("explore_compileapp"));
        var response = function(result){
            updateDeviceHard(result, devid);
        }
        $.molmc.api.compileApp(appid,response);
    };
    
    var updateDeviceHard = function(jsonString, devid){
        var subUrl = "v1/"+ devid +"/platform/default/info/notify";
        var pubUrl = "v1/"+ devid +"/firmware/default/action/flash";
        $.molmc.mainMqtt.subscribe(subUrl, 2, function(message){                        
            clearTimeout(timer);
            if(message.payloadString == "10"){                            
                var msg = _lang("explore_rdytoupdatehard");
                $.ui.showMask(msg);
                return;
            }else if(message.payloadString == "11"){
                $.ui.hideMask();
                var msg = _lang("explore_downloadhardfailed");
            }else if(message.payloadString == "12"){                            
                var msg = _lang("explore_downloadhardsucc");
                $.ui.showMask(msg);
                return;
            }else if(message.payloadString == "13"){
                $.ui.hideMask();
                var msg = _lang("explore_writehardfailed");
            }else if(message.payloadString == "14"){
                $.ui.hideMask();
                var msg = _lang("explore_writehardsucc");
                $.molmc.device.updataDevAndToken();
                navigator.notification.confirm(msg, function(){
                    $.ui.loadContent("#device", false, false, "slide");
                }, _lang("tips_title_tips"), _lang("g_tips_confirm"));
                return;
            }else if(message.payloadString == "20"){
                var msg = _lang("explore_rdyupdatetoken");
                $.ui.showMask(msg);
            }else if(message.payloadString == "21"){
                var msg = _lang("explore_updatetokenfailed");
                $.ui.hideMask();
            }else if(message.payloadString == "22"){
                var msg = _lang("explore_updatetokensucc");
                $.ui.hideMask();
                return;
            }else if(message.payloadString == "30"){
                var msg = _lang("explore_rdyresetboad");
                $.ui.showMask(msg);
                return;
            }else if(message.payloadString == "31"){
                var msg = _lang("explore_resetfailed");
                $.ui.hideMask();
            }else if(message.payloadString == "32"){
                $.ui.hideMask();
                var msg = _lang("explore_resetsucc");
                navigator.notification.confirm(msg, function(){
                    $.ui.loadContent("#device", false, false, "slide");
                }, _lang("tips_title_tips"), _lang("g_tips_confirm"));
                return;
            }
            navigator.notification.confirm(msg, function(){}, _lang("tips_title_tips"), _lang("g_tips_confirm"));
        }, function(){           
            $.ui.showMask(_lang("explore_downloadtoupdatehard")); 
            var payload = JSON.stringify(jsonString);
            $.molmc.mainMqtt.publish(pubUrl, payload, 0, false);
        });
        var timer = setTimeout(function(){
            $.ui.hideMask();
            $.molmc.mainMqtt.unsubscribe(subUrl);
            navigator.notification.confirm(_lang("explore_downloadfailed"), function(){}, _lang("tips_title_tips"), _lang("g_tips_confirm"));
        }, 5000);     
    };
    
    var unitesearch = function(page,size){
        ispullrefresh = true;
        var response = function(result){
            if(page==1||page==undefined){
                if(result.length===undefined){
                    Entity.Devicesshow=new Array();
                    Entity.Devicesshow.unshift(getlistlabel("","none"));
                }
                else{
                    Entity.Devicesshow=result;
                    Entity.Devicesshow.unshift(getlistlabel(_lang("explore_devlist"),"text"));
                }
            }
            else{
                if(result.length===undefined){
                    pagenum--;
                    $.molmc.utils.showToast(_lang("explore_nomoredev"),170,2000);
                }
                else{
                    Entity.Devicesshow=Entity.Devicesshow.concat(result);
                }
            }
            $.molmc.utils.showDevices($("#pubDevList_explore"), Entity.Devicesshow,{flag_collect:true});      
        }
        var queryStr = "";
        if($("#input_search_explore").val()!==""){
            queryStr+="&fuzzy="+ $("#input_search_explore").val();
        }
        if(nowclick!==null){
            if(nowclick.innerText===_lang("explore_temperature")){
                queryStr +=temperaturestring; 
            }
            else if(nowclick.innerText===_lang("explore_switch")){
                queryStr += switchstring;
            }else if(nowclick.innerText===_lang("explore_limitless")){
            }
        }
        $.molmc.api.searchPubDevices(response,queryStr,page,size);
    } 
    Explore.prototype = {
        forkSubUrl:"v1/"+ Entity.forkDevId +"/platform/default/info/notify",
        searchHotDevices:function(response, flag){
            if(Entity.hotDevices === undefined | flag){
                $.molmc.api.searchHotDevices(response);  
            }else{
                Entity.Devicesshow=Entity.tempDevices.slice(0,Entity.tempDevices.length);
                $.molmc.utils.showDevices($("#pubDevList_explore"),Entity.Devicesshow,{flag_collect:true});
                $.ui.scrollToTop("explore");
            }
        },
        searchNearbyDevices:function(response, flag){
            if(Entity.nearDevices === undefined | flag){
                var local = function(point){
                var lat = point.lat;
                var lng = point.lng;  
                $.molmc.api.searchPubDevices(response,"lat="+lat+"&lng="+lng+"&dist=50");
             };
            $.molmc.utils.getLocation(local);
            }else{
                Entity.Devicesshow=Entity.tempDevices.slice(0,Entity.tempDevices.length);
                $.molmc.utils.showDevices($("#pubDevList_explore"),Entity.Devicesshow,{flag_collect:true});
                $.ui.scrollToTop("explore");
            }         
        },
        getPubdevInfo:function(response, devId, onerror){
            if(curDevId !== devId){
                if(Entity.isDemoDev === false){
                    $.molmc.api.getPubDevice(response, devId, onerror);
                }else{
                    $.molmc.api.getDeviceInfo(devId, response);
                }
            }else{
                $.ui.loadContent("#widgets_explore", false, false, "slide");
            }
        },
        getPubDevToken:function(response, devId){
            $.molmc.api.getPubDevToken(response, devId);
        },
        setIsDemo:function(flag){
            Entity.isDemoDev = flag;
        },
        getDevices:function(dev_id, isdemo,num,id){
            if(isdemo !== undefined){
                Entity.isDemoDev = isdemo;
            }else{
                Entity.isDemoDev = false;
            }
            var respdev = function(result){ 
                curDevId = result._id;
                Entity.CurDevice = result;
                $.ui.loadContent("#widgets_explore", false, false, "slide");
            };
            var resptoken = function(result){
                Entity.CurToken = result;
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
            var onerror = function(){
                navigator.notification.confirm(
                    _lang("explore_deivce_private"),
                    function(button){
                        if(button === 1){
                            $.molmc.device.deletecollectdevlist(id, num);
                        }else if(button === 2){
                        }
                    }, 
                    _lang("tips_title_tips"),
                    _lang("g_btn_yes") + "," + _lang("g_btn_no")
                );
            }
            if($.molmc.utils.checkNetwork()){
                if(Entity.isDemoDev === false){
                    this.getPubDevToken(resptoken, dev_id);
                }
                this.getPubdevInfo(respdev, dev_id, onerror);
            }
        },
        setcurdevices:function(curdevice){
            Entity.CurDevice=curdevice;
        },
        setcurdevtoken:function(curdevtoken){
            Entity.CurToken=curdevtoken;
        },
        pullUprefreshPage:function(el){
            pullUpRefresh(el);
        }
    };
    
    $.molmc.explore = new Explore();
})(af);