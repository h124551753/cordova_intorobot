(function($) {
    "use strict";
    var Entity = {};
    Entity.curRecipe = {};
    Entity.editeRecipe={};
    var system_deviceId = "000000000000000000000001";
    var system_widgetId_message = 9997;
    var system_widgetId_date = 9998;
    var system_widgetId_mail = 9999;
    var systemDev={
    "_id":system_deviceId,
    "model":"system",
    "company":"molmc",
    "widgets":[
        // {
        //     "widget_id":system_widgetId_message, "tab":0,"duplicate":true,"ver":"1.0","widget_proto":"Message","type":"system","name":_lang('widgetlist_9997_name'),
        //     "description":_lang('widgetlist_9997_description'),
        //     "topics":[
        //     ],
        //     "actionList":[
        //         {"id":"010101","topicList":[]}
        //     ]
        // },
        {
            "widget_id":system_widgetId_date, "tab":0,"duplicate":true,"ver":"1.0","widget_proto":"Date","type":"sysdate","name": _lang('graphic_time'),
            "description":"sysdate",
            "topics":[
            ],
            "triggerList":[
                {"id":"010001", "topicList":[]},
                {"id":"010002", "topicList":[]},
                {"id":"010003", "topicList":[]}
            ]
        },
        {
            "widget_id":system_widgetId_mail, "tab":0,"duplicate":true,"ver":"1.0","widget_proto":"E-Mail","type":"sysmail","name": _lang('graphic_email'),
            "description":"sysdate",
            "topics":[
            ],
            "actionList":[
                {"id":"010001","topicList":[]}
            ]
        }
    ],
    "uid":$.molmc.utils.getItem("uid"),
    "name":_lang('graphic_system'),
    "description":"description",
    "dev_img": "assets/img/systemDev.png"
};
    var devList=[];
    var showDevList=[];
    var selectedTriggerDev;
    var selectedTriggerWid;
    var selectedActionDev;
    var selectedActionWid;
    var selectedTriggerEvent;
    var selectedActionEvent;
    var triggertapindex;
    var actiontapindex;
    var isCreate = false;
    var Graphic = function(){
        var self = this;
        $(document).on("applogout", function(){
            Entity={};
            Entity.curRecipe = {};
            Entity.editeRecipe={};
        });
        $("#graphic").bind( "loadpanel", function(){
            $.molmc.device.isUtopicInDevPanel("none");
            showRecipeList();
            $(".headerleft").hide();
        });
        $("#graphic").bind( "unloadpanel", function(){
            $(".headerleft").show();
        });
        $("#graphic").on("tap","li>div",function(event){
            Entity.curRecipe = Entity.showCollection[event.currentTarget.parentElement.id];
            selectedTriggerDev = getWidgetTID(Entity.curRecipe)[0];
            selectedTriggerWid = _.findWhere(selectedTriggerDev.widgets, {widget_id:getWidgetTID(Entity.curRecipe)[1]});
            selectedActionDev = getWidgetAID(Entity.curRecipe)[0];
            selectedActionWid = _.findWhere(selectedActionDev.widgets, {widget_id:getWidgetAID(Entity.curRecipe)[1]});
            if(_.isEmpty(selectedTriggerWid) | _.isEmpty(selectedActionWid)){
                var response = function(result){
                    showRecipeList(true);
                };
                navigator.notification.confirm(
                    _lang("graphic_nowidgets_err"),
                    function(button){
                        if(button === 1){
                            if(Entity.curRecipe._cls === "ScheduleTaskProducer"){
                                $.molmc.api.deleteSchedule(Entity.curRecipe._id, response);
                            }else{
                                $.molmc.api.deleteRecipe(Entity.curRecipe._id, response);
                            }
                        }else if(button === 2){
                        }
                    }, 
                    _lang("g_btn_delete"),
                    _lang("g_btn_yes") + "," + _lang("g_btn_no")
                );
                return;
            }
            selectedTriggerEvent = $.molmc.triggerEvent[Entity.curRecipe.factorID[0]];
            for(var i=0; i<selectedTriggerWid.triggerList.length; i++){
                if(selectedTriggerWid.triggerList[i].id == Entity.curRecipe.factorID[0]){
                    triggertapindex = i;
                }
            }            
            selectedActionEvent = $.molmc.actionEvent[Entity.curRecipe.factorID[1]];
            for(var i=0; i<selectedActionWid.actionList.length; i++){
                if(selectedActionWid.actionList[i].id == Entity.curRecipe.factorID[1]){
                    actiontapindex = i;
                }
            }
            isCreate = false;
            $.ui.loadContent("#showRecicp_graphic", false, false, "slide");
        });
        $("#graphic").on("longTap","li", function(event){
            var response = function(result){
                showRecipeList(true);
            };
            Entity.curRecipe = {};
            Entity.curRecipe = Entity.showCollection[event.currentTarget.id];
            navigator.notification.vibrate(50);
            navigator.notification.confirm(
                _lang("graphic_deleterecipe_tips"),
                function(button){
                    if(button === 1){
                        if(Entity.curRecipe._cls === "ScheduleTaskProducer"){
                            $.molmc.api.deleteSchedule(Entity.curRecipe._id, response);
                        }else{
                            $.molmc.api.deleteRecipe(Entity.curRecipe._id, response);
                        }
                    }else if(button === 2){
                    }
                }, 
                _lang("g_btn_delete"),
                _lang("g_btn_yes") + "," + _lang("g_btn_no")
            );
        });
        $("#graphic").on("change", "input", function(event){
            var index = event.currentTarget.attributes[0].value;
            var recipe = Entity.showCollection[index];
            if(event.currentTarget.value == "0"){
                event.currentTarget.value = "1";
                $(event.currentTarget.parentElement).removeClass("gray-filter");
                recipe.enabled = true;
            }else if(event.currentTarget.value == "1"){
                event.currentTarget.value = "0";
                $(event.currentTarget.parentElement).addClass("gray-filter");
                recipe.enabled = false;
            }
            var response = function(result){
                showRecipeList(true);
            };
            if (recipe.uid===undefined) {
                recipe.uid = $.molmc.utils.getItem("uid");
            };
            if(recipe._cls === "ScheduleTaskProducer"){
                $.molmc.api.updateSchedule(recipe, response);
            }else{
                $.molmc.api.updateRecipe(recipe, response);
            }
        });
        $("#showRecicp_graphic").bind("loadpanel", function(){
            var widgetA_id = getWidgetAID(Entity.curRecipe)[1];
            var widgetT_id =  getWidgetTID(Entity.curRecipe)[1];
            var triggerImg = fileSystemWidget + widgetT_id+"/img/ThumbS.png";
            var actionImg = fileSystemWidget + widgetA_id+"/img/ThumbS.png";
            $("#triggerimg_showRecipe").attr("src",triggerImg);
            $("#actionimg_showRecipe").attr("src",actionImg);
            $("#nameTile_graphic").html(Entity.curRecipe.description);
            settingTrigger(selectedTriggerEvent, $("#showRecicp_graphic #showtrigger_graphic"));
            settingAction(selectedActionEvent, $("#showRecicp_graphic #showaction_graphic"));
            if(!isCreate){
                Entity.editeRecipe = Entity.curRecipe;
                if(Entity.curRecipe.category === "recycle"){
                    $("#recipeswitch_graphic").attr("checked","checked");
                    $("#recipeswitch_graphic").prop("checked",true);
                    $("#recipeswitch_graphic").val(1);
                    $("#graphic_noticinfo_i").html(_lang('graphic_mode_recycleDec'));
                    $("#trigger_mode_graphic").html(_lang('graphic_mode_recycle'));
                }else if(Entity.curRecipe.category === "edge"){
                    $("#recipeswitch_graphic").removeAttr("checked","checked");
                    $("#recipeswitch_graphic").prop("checked",false);
                    $("#recipeswitch_graphic").val(0);
                    $("#graphic_noticinfo_i").html(_lang('graphic_mode_edgeDec'));
                    $("#trigger_mode_graphic").html(_lang('graphic_mode_edge'));
                }
            }else{
                if(Entity.curRecipe._cls !== "ScheduleTaskProducer" & selectedActionEvent.category === "recycle"){
                    $("#recipeswitch_graphic").attr("checked","checked");
                    $("#recipeswitch_graphic").prop("checked",true);
                    $("#recipeswitch_graphic").val(1);
                    $("#graphic_noticinfo_i").html(_lang('graphic_mode_recycleDec'));
                    $("#trigger_mode_graphic").html(_lang('graphic_mode_recycle'));
                    Entity.editeRecipe.category = "recycle";
                }else {
                    $("#recipeswitch_graphic").removeAttr("checked","checked");
                    $("#recipeswitch_graphic").prop("checked",false);
                    $("#recipeswitch_graphic").val(0);
                    $("#graphic_noticinfo_i").html(_lang('graphic_mode_edgeDec'));
                    $("#trigger_mode_graphic").html(_lang('graphic_mode_edge'));
                    Entity.editeRecipe.category = "edge";
                }
            }
            if(Entity.curRecipe._cls === "ScheduleTaskProducer" | selectedActionEvent.dataType === "E-Mail"){
                $("#recipeswitch_graphic").attr("disabled", "disabled");
                
            }else{
                $("#recipeswitch_graphic").removeAttr("disabled", "disabled");
            }
        });
        $("#showRecicp_graphic").on("change", "#recipeswitch_graphic", function(){
            if($("#recipeswitch_graphic").val() == 1){
                $("#recipeswitch_graphic").removeAttr("checked","checked");
                $("#recipeswitch_graphic").prop("checked",false);
                $("#recipeswitch_graphic").val(0);
                $("#graphic_noticinfo_i").html(_lang('graphic_mode_edgeDec'));
                $("#trigger_mode_graphic").html(_lang('graphic_mode_edge'));
                Entity.editeRecipe.category = "edge";
            }else{
                $("#recipeswitch_graphic").attr("checked","checked");
                $("#recipeswitch_graphic").prop("checked",true);
                $("#recipeswitch_graphic").val(1);
                $("#graphic_noticinfo_i").html(_lang('graphic_mode_recycleDec'));
                $("#trigger_mode_graphic").html(_lang('graphic_mode_recycle'));
                Entity.editeRecipe.category = "recycle";
            }
        });
        $("#showRecicp_graphic").on("change", "select[name='setactionStatus']", function(){
            if($("#showRecicp_graphic select[name='setactionStatus']").val()==0){
                $("#showRecicp_graphic tr[name='custom_value']").css("display","none");
            }else{
                $("#showRecicp_graphic tr[name='custom_value']").css("display","table-row");
            }
        });
        $("#createRecicp_graphic").bind("loadpanel",function(){
            showDevList = [];
            showDevList.push(systemDev);
            showDevList = showDevList.concat(devList);
            selectedTriggerDev = showDevList[0];
            selectedTriggerWid = showDevList[0].widgets[0];
            var el = $("#createRecicp_graphic .swiper-container-devlist .swiper-wrapper");
            appandList(showDevList, "device", "trigger", el);
            $("#devname_createRecicp").html(selectedTriggerDev.name);
            el = $("#createRecicp_graphic .swiper-container-widget .swiper-wrapper");
            appandList(selectedTriggerDev.widgets,"widget", "trigger", el);
            $("#widname_createRecicp").html(selectedTriggerWid.name);
            showTriggerEventList(selectedTriggerWid, $("#createRecicp_graphic .list"));
            showDevSwiper("trigger", "#createRecicp_graphic");
            showWidSwiper("trigger", "#createRecicp_graphic");
        });
        $("#createRecicp_graphic .list").on("tap", "i", function(event){
            var index = event.currentTarget.attributes["data-triggerid"].value;
            triggertapindex = index;
            selectedTriggerEvent = $.molmc.triggerEvent[selectedTriggerWid.triggerList[index].id];
            Entity.editeRecipe.devices =[];
            Entity.editeRecipe.devices[0] = selectedTriggerDev._id;
            Entity.editeRecipe.factorID=[];
            Entity.editeRecipe.factorID[0] = selectedTriggerWid.triggerList[index].id;
            $.ui.loadContent("#settingtrigger_graphic", false, false, "slide");
        });

        $("#createaction_graphic").bind("loadpanel",function(){
            showDevList = [];
            showDevList.push(systemDev);
            showDevList = showDevList.concat(devList);
            selectedActionDev = showDevList[0];
            selectedActionWid = showDevList[0].widgets[1];
            var el = $("#createaction_graphic .swiper-container-devlist .swiper-wrapper");
            appandList(showDevList, "device", "action", el);
            $("#devname_createAction").html(selectedActionDev.name);
            var el = $("#createaction_graphic .swiper-container-widget .swiper-wrapper");
            appandList(selectedActionDev.widgets,"widget", "action", el);
            $("#widname_createAction").html(selectedActionWid.name);
            showActionEventList(selectedActionWid, $("#createaction_graphic .list"));
            showDevSwiper("action", "#createaction_graphic");
            showWidSwiper("action", "#createaction_graphic");
        });
        $("#createaction_graphic .list").on("tap", "i", function(event){
            var index = event.currentTarget.attributes["data-actionid"].value;
            actiontapindex = index;
            selectedActionEvent = $.molmc.actionEvent[selectedActionWid.actionList[index].id];
            Entity.editeRecipe.devices[1] = selectedActionDev._id;
            Entity.editeRecipe.factorID[1] = selectedActionWid.actionList[index].id;
            $.ui.loadContent("#settingaction_graphic", false, false, "slide");
        });

        $("#settingtrigger_graphic").bind("loadpanel", function(){
            settingTrigger(selectedTriggerEvent, $("#settingtrigger_graphic .recipeinfobg"));
            $("#settingtrigger_graphic input[data-clear='true']").each(function(){
                $(this).val("");
            });            
        });
        $("#settingtrigger_graphic").on("tap", "#btn_settriggerconfirm", function(){
            if(getTriggerEdit(selectedTriggerEvent, "#settingtrigger_graphic .recipeinfobg")!==false)
                $.ui.loadContent("#createaction_graphic", false, false, "slide");
        });
        $("#settingaction_graphic").bind("loadpanel", function(){
            settingAction(selectedActionEvent, $("#settingaction_graphic .recipeinfobg"));
            $("#settingaction_graphic textarea[data-clear='true']").each(function(){
                $(this).html("");
            });
            $("#settingaction_graphic input[data-clear='true']").each(function(){
                $(this).val("");
            });
        });
        $("#settingaction_graphic").on("tap", "#btn_setactionconfirm", function(){
            if(getActionEdit(selectedActionEvent, "#settingaction_graphic .recipeinfobg") === false){
                return;
            }
            Entity.curRecipe = Entity.editeRecipe;
            isCreate = true;
            $.ui.loadContent("#showRecicp_graphic", false, false, "slide");
        });
        $("#settingaction_graphic").on("change", "select[name='setactionStatus']", function(){
            if($("#settingaction_graphic select[name='setactionStatus']").val()==0){
                $("#settingaction_graphic tr[name='custom_value']").css("display","none");
            }else{
                $("#settingaction_graphic tr[name='custom_value']").css("display","table-row");
            }
        });        
        $("#header_showgraphic").on("tap", "#save_recipe", function(){
            var response = function(result){
                if(isCreate){
                    $.molmc.utils.showToast(_lang("graphic_buildsucc"), 180, 2000);
                }else{
                    $.molmc.utils.showToast(_lang("graphic_updatesucc"), 180, 2000);
                }
                showRecipeList(true);
                $.ui.loadContent("#graphic", false, false, "slide");
                Entity.editeRecipe={};
            };
            if(getTriggerEdit(selectedTriggerEvent, "#showRecicp_graphic .recipeinfobg")===false){
                return;
            }
            if(getActionEdit(selectedActionEvent, "#showRecicp_graphic .recipeinfobg") === false){
                return;
            }            
            if(Entity.editeRecipe._cls === "ScheduleTaskProducer"){  
                var hour = parseInt(Entity.editeRecipe.crontab.hour);
                var d = new Date();
                hour = hour + parseInt(d.getTimezoneOffset())/60;
                if(hour<0){
                    hour = 24 + hour;
                }else if(hour > 23){
                    hour = hour - 24;
                }  
                Entity.editeRecipe.crontab.hour = hour+"";
            }            
            if(isCreate){
                if(Entity.editeRecipe._cls === "ScheduleTaskProducer"){                    
                    $.molmc.api.createSchedule(Entity.editeRecipe, response);
                }else{
                    $.molmc.api.createRecipe(Entity.editeRecipe, response);
                }
            }else{
                if(Entity.curRecipe._cls === "ScheduleTaskProducer"){
                    $.molmc.api.updateSchedule(Entity.editeRecipe, response);
                }else{
                    $.molmc.api.updateRecipe(Entity.editeRecipe, response);
                }
            }
        });
    };
    var showRecipeList = function(flag){
        devList = $.molmc.device.deviceList();
        var respRec = function(result){
            Entity.recipes = result;
            if(Entity.schedules === undefined | flag === true){
                $.molmc.api.getSchedules(respSch);
            }
        };
        var respSch = function(result){
            Entity.schedules = result;
            var listView = $("#recipeList_graphic");
            if(result.length===undefined){
                if(Entity.recipes.length===undefined){
                    $.molmc.utils.shownullDev(listView,"graphic");
                    return;
                }
                Entity.showCollection = Entity.recipes.slice(0,Entity.recipes.length);
            }else{
                Entity.showCollection = Entity.schedules.concat(Entity.recipes);
            }
            if(listView === undefined){
                return;
            }
            showCollection(listView, Entity.showCollection);
        };
        if(Entity.recipes === undefined | flag === true){
            $.molmc.api.getRecipes(respRec);
        }
    };
    var appandList = function(list, type, event, el){
        var img;
        var tpl;
        if(type==="device"){
            el.empty();
        }else if(type==="widget"){
            el.empty();
        }
        if(!_.isEmpty(list)){
            for(var i = 0; i< list.length; i++){
                if(type === "device"){
                    if(list[i].dev_img === undefined | list[i].dev_img == ""){
                        img = "img/intodunio.png";
                    }else{
                        img = serverURL + '/' + list[i].dev_img;
                    }
                }else if(type === "widget"){
                    img = fileSystemWidget + list[i].widget_id + "/img/ThumbS.png"
                }
                tpl ='<div data-imgId='+i+' class="swiper-slide" style="background:url('+img+') no-repeat;background-size: contain;background-size:90% 90%"></div>';
                if(type==="device"){
                    if(!_.isEmpty(list[i].widgets)){
                        var ishow = false;
                        for(var j=0; j<list[i].widgets.length; j++){
                            if(event === "trigger"){
                                if(!_.isEmpty(list[i].widgets[j].triggerList)){
                                    ishow = true;
                                }
                            }else if(event==="action"){
                                if(!_.isEmpty(list[i].widgets[j].actionList)){
                                    ishow = true;
                                }
                            }
                        }
                        if(ishow){
                            el.append(tpl);
                        }
                    }
                }else if(type==="widget"){
                    if(event === "trigger"){
                        if(!_.isEmpty(list[i].triggerList)){
                            el.append(tpl);
                        }
                    }else if(event==="action"){
                        if(!_.isEmpty(list[i].actionList)){
                            el.append(tpl);
                        }
                    }

                }
            }
        }
    };
    var mDevSwiper;
    var showDevSwiper = function(eventType, el){
        var dev_index = 0;
        if(!_.isEmpty(mDevSwiper)){
            mDevSwiper.destroy();
        }
        var container = el +' .swiper-container-devlist';
        var scrollbar = el + ' .swiper-scrollbar-devlist';
        var activeslide = el + ' .swiper-slide-active';
        mDevSwiper = new Swiper(container, {
            scrollbar: scrollbar,
            slidesPerView: 'auto',
            effect: 'coverflow',
            initialSlide: dev_index,
            scrollbarHide: true,
            centeredSlides: true,
            spaceBetween: 10,
            grabCursor: true,
            mousewheelControl:true,
            coverflow: {
                rotate: 0,
                stretch: 0,
                depth: 0,
                modifier: 1.0,
                slideShadows : false
            },
            onTap:function(sw, evt){
                if(sw.clickedIndex>=0){
                    sw.slideTo(sw.clickedIndex, 200);
                }
            },
            onTransitionEnd:function(sw){
                var active_slide = sw.wrapper.find(activeslide);
                if(active_slide.length > 0){
                    var index=active_slide[0].attributes["data-imgId"].value;
                    if(eventType==="trigger"){
                        selectedTriggerDev = showDevList[index];
                        for(var i=0; i<selectedTriggerDev.widgets.length; i++){
                            if(selectedTriggerDev.widgets[i].triggerList.length>0){
                                selectedTriggerWid = selectedTriggerDev.widgets[i];
                                break;
                            }
                        }                        
                        $("#devname_createRecicp").html(selectedTriggerDev.name);
                        var el = $("#createRecicp_graphic .swiper-container-widget .swiper-wrapper");
                        appandList(selectedTriggerDev.widgets,"widget", "trigger", el);
                        $("#widname_createRecicp").html(selectedTriggerWid.name);
                        showWidSwiper("trigger", "#createRecicp_graphic");
                        showTriggerEventList(selectedTriggerWid, $("#createRecicp_graphic .list"));
                    }else if(eventType==="action"){
                        selectedActionDev = showDevList[index];
                        $("#devname_createAction").html(selectedActionDev.name);
                        var el = $("#createaction_graphic .swiper-container-widget .swiper-wrapper");
                        appandList(selectedActionDev.widgets,"widget", "action", el);                        
                        if(selectedActionDev._id === system_deviceId){
                            selectedActionWid = selectedActionDev.widgets[1];
                        }else{
                            for(var i=0; i<selectedActionDev.widgets.length; i++){
                                if(selectedActionDev.widgets[i].actionList.length>0){
                                    selectedActionWid = selectedActionDev.widgets[i];
                                    break;
                                }
                            }                            
                        }
                        showActionEventList(selectedActionWid, $("#createaction_graphic .list"));
                        showWidSwiper("action","#createaction_graphic");
                        $("#widname_createAction").html(selectedActionWid.name);
                    }
                }
            }
        });
    };
    var showWidSwiper = function(eventType, el){
        var wid_index = 0;
        if(Entity.mWidSwiper !== undefined){
            Entity.mWidSwiper.destroy();
        }
        var container = el +' .swiper-container-widget';
        var scrollbar = el + ' .swiper-scrollbar-widget';
        var activeslide = el + ' .swiper-slide-active';

        Entity.mWidSwiper = new Swiper(container, {
            scrollbar: scrollbar,
            slidesPerView: 'auto',
            effect: 'coverflow',
            initialSlide: wid_index,
            scrollbarHide: true,
            centeredSlides: true,
            spaceBetween: 10,
            grabCursor: true,
            mousewheelControl:true,
            coverflow: {
                rotate: 0,
                stretch: 0,
                depth: 0,
                modifier: 1.0,
                slideShadows : false
            },
            onTap:function(sw, evt){
                if(sw.clickedIndex>=0){
                    sw.slideTo(sw.clickedIndex, 200);
                }
            },
            onTransitionEnd:function(sw){
                var active_slide = sw.wrapper.find(activeslide);
                if(active_slide.length > 0){
                    var index=active_slide[0].attributes["data-imgId"].value;
                    if(eventType==="trigger"){
                        selectedTriggerWid = selectedTriggerDev.widgets[index];
                        $("#widname_createRecicp").html(selectedTriggerWid.name);
                        showTriggerEventList(selectedTriggerWid, $("#createRecicp_graphic .list"));
                    }else if(eventType==="action"){
                        selectedActionWid = selectedActionDev.widgets[index];
                        $("#widname_createAction").html(selectedActionWid.name);
                        showActionEventList(selectedActionWid, $("#createaction_graphic .list"));
                    }
                }
            }
        });
    };
    var showTriggerEventList = function(widget, el){
        el.empty();
        var triggerList = widget.triggerList;
        var tpl;
        for(var i=0; i<triggerList.length; i++){
            tpl = '<li><table><tr><td><h3>'+$.molmc.triggerEvent[triggerList[i].id].name+'</h3></td><td rowspan="2" class="addaction"><i  data-triggerId='+i+' class="fa fa-plus-square"></i></td></tr><tr><td>'+$.molmc.triggerEvent[triggerList[i].id].description+'</td></tr></table></li>';
            el.append(tpl);
        }
    };
    var showActionEventList = function(widget, el){
        el.empty();
        if(widget.actionList === undefined){
            return;
        }
        var actionList = widget.actionList;
        var tpl;
        for(var i=0; i<actionList.length; i++){
            tpl = '<li><table><tr><td><h3>'+$.molmc.actionEvent[actionList[i].id].name+'</h3></td><td rowspan="2" class="addaction"><i  data-actionId='+i+' class="fa fa-plus-square"></i></td></tr><tr><td>'+$.molmc.actionEvent[actionList[i].id].description+'</td></tr></table></li>';
            el.append(tpl);
        }
    };
    var showCollection =function(el, list){
        if(_.isEmpty(list)){
            el.empty();
            var tpl = '<div style="font-size: 1.5em;text-align: center;margin-top: 50%; color: darkgray; background: #F2F2F2;"><div><a href="#createRecicp_graphic" class="fa fa-plus-circle" style="font-size: 4em;color: darkgray;margin-bottom:20px;" id=""></a></div><span class="empty">请点击添加联控</span></div>';
            el.append(tpl);
            return;
        }
        var listView = el;
        var hasGraphic = false;
        listView.empty();
        for(var i=0; i<list.length; i++){
            if(list[i].type === "graphic" && getWidgetAID(list[i]) !== undefined){
                hasGraphic = true;
                var gray = "gray-filter";
                var checked = "";
                var val = 0;
                if(list[i].enabled === true){
                    gray = "";
                    val =1;
                    checked = 'checked="checked"';
                }
                var description = list[i].description;            
                var widgetA_id = getWidgetAID(list[i])[1];
                var widgetT_id =  getWidgetTID(list[i])[1];
                var triggerImg = fileSystemWidget + widgetT_id+"/img/ThumbS.png";
                var actionImg = fileSystemWidget + widgetA_id+"/img/ThumbS.png";
                var liTplObj = '<li class="'+gray+'" id="'+ i +'" style="padding:5px 20px 5px 20px;"><input data-val="'+i+'" id="recipe_sw'+i+'" '+checked+' type="checkbox" value="'+val+'" class="toggle floright"/><label style="left:auto;top:20px;" for="recipe_sw'+i+'" data-on='+_lang("g_on")+' data-off='+_lang("g_off")+' class="floright rectangle midtoggle" ><span class="rectangle"></span></label><div style="width:80%;"><img style="width:80px;height:80px;float:left;border-radius: 100%;" src='+triggerImg+'><div style="float:left;height:80px;"><i class="fa fa-chevron-right" style="font-size:4em;margin-top:0.2em;color:#0088D1;"></i></div><img style="width:80px; height: 80px;border-radius: 100%;" src='+actionImg+'></div><div class="desc-nowrap" style="color:#4D6B21;width: auto;text-align:center;word-break:break-all;" class="desc-nowrap">'+description+'</div></li>';    
                listView.append(liTplObj);
            }            
        }
        if (hasGraphic === false) {
            el.empty();
            var tpl = '<div style="font-size: 1.5em;text-align: center;margin-top: 50%; color: darkgray; background: #F2F2F2;"><div><a href="#createRecicp_graphic" class="fa fa-plus-circle" style="font-size: 4em;color: darkgray;margin-bottom:20px;" id=""></a></div><span class="empty">请点击添加联控</span></div>';
            el.append(tpl);
        };
    };

    var settingTrigger = function(trigger, el){
        if(_.isEmpty(trigger)){
            return;
        }
        el.empty();
        var selectionTpl = "";
        var inputTpl ="";
        if(trigger.dataType==="Time"){
            if(!_.isEmpty(trigger.selectData)){
                for(var i=0; i<trigger.selectData.length; i++){
                    var selected = "";
                    if(!_.isEmpty(Entity.curRecipe.crontab)){
                        if(trigger.selectType === "day_of_month"){
                            if(i==(parseInt(Entity.curRecipe.crontab[trigger.selectType]) -1)){
                                selected = 'selected="selected"';
                            }
                        }else{
                            if(i==Entity.curRecipe.crontab[trigger.selectType]){
                                selected = 'selected="selected"';
                            }
                        }
                    }
                    selectionTpl = selectionTpl + '<option '+selected+' value='+i+'>'+trigger.selectData[i]+'</option>';
                }
                selectionTpl = '<tr><td>'+ _lang("graphic_trigger") + '</td><td style="text-align:right;"><select autofocus name="setTriggerTime" id="" style="width:inherit;">'+selectionTpl+'</select></td></tr>';
            }
            if(!_.isEmpty(Entity.curRecipe.crontab)){
                var localhour = parseInt(Entity.curRecipe.crontab.hour);
                if(isCreate!==true){
                    var d = new Date();
                    localhour = localhour - parseInt(d.getTimezoneOffset())/60;
                    if(localhour<0){
                        localhour = 24 + localhour;
                    }else if(localhour > 23){
                        localhour = localhour - 24;
                    }
                }
                var hour = "value=" + localhour;
                var min = "value=" + Entity.curRecipe.crontab["minute"];
            }
            var myDate = new Date();
            var hourdefualt = myDate.getHours();
            var mindefualt = myDate.getMinutes();
            inputTpl = '<tr><td>' + _lang("graphic_triggertime") +':</td><td style="text-align:right;width:60%" data-name="setTime"><input style="width:30%" disabled="disabled" type="number" min="0" max="23"'+hour+' data-name="hour" value="'+hourdefualt+'"/><span>'+ _lang("graphic_hour")+'</span><input style="width:30%" disabled="disabled" type="number" min="0" max="59" '+min+' data-name="minute" value="'+mindefualt+'"/><span>'+_lang("graphic_min")+'</span></td></tr>';
        }else if(trigger.dataType==="Number"){
            for(var i=0; i<trigger.exchange.length; i++){
                var selected = "";
                if(!_.isEmpty(Entity.curRecipe.exchange)){
                    if(Entity.curRecipe.exchange == trigger.exchange[i]){
                        selected = 'selected="selected"';
                    }
                }
                selectionTpl = selectionTpl + '<option '+selected+' value='+i+'>'+trigger.selectData[i]+'</option>';
            }
            selectionTpl = '<tr><td>'+_lang("graphic_logic") +':</td><td style="text-align:right;"><select name="factorlogic" style="width:inherit;">'+selectionTpl+'</select></td></tr>';
            var threshold="";
            if(!_.isEmpty(Entity.curRecipe.kwargs)){
                threshold = "value=" + Entity.curRecipe.kwargs.threshold;
            }
            inputTpl = '<tr><td>'+_lang("graphic_threshold")+':</td><td style="text-align:right;width:50%"><input style="width:100%" data-clear="true" type="number" data-name="factorVal-graphic" '+threshold+' /></td></tr>'
        }else if(trigger.dataType==="Bool"){
            var selectedon = "";
            var selectedoff = "";
            if(!_.isEmpty(Entity.curRecipe.kwargs)){
                if(Entity.curRecipe.kwargs.threshold==1){
                    selectedon = 'selected="selected"' ;
                }else{
                    selectedoff = 'selected="selected"';
                }
            }
            selectionTpl = '<option '+selectedon+' value="1">'+ _lang("g_on")+'</option><option '+selectedoff+' value="0">'+ _lang("g_off")+'</option>'
            selectionTpl = '<tr><td>'+_lang("graphic_choosesta")+':</td><td style="text-align:right;"><select name="setTriggerStatus" id="" style="width:inherit;">'+selectionTpl+'</select></td></tr>';
        }

        var topicTpl = "";
        if(!_.isEmpty(selectedTriggerWid.topics)){
            var topicindex = selectedTriggerWid.triggerList[triggertapindex].topicList[0];
            topicTpl = '<tr><td>'+_lang("graphic_sensors")+':</td><td style="text-align:right;">'+selectedTriggerWid.topics[topicindex].name+'</td></tr>';
        }
        var tpl = '<table cellspacing="10" style="width:100%;"><tr style="text-align:center;"><td colspan="3"><h3>'+_lang("graphic_trigger")+'</h3></td></tr><tr><td>'+_lang("device_devname")+':</td><td style="text-align:right;">'+selectedTriggerDev.name+'</td></tr><tr><td>'+_lang("device_setwidget_name")+':</td><td style="text-align:right;">'+selectedTriggerWid.name+'</td></tr>'+topicTpl+selectionTpl+inputTpl+'</table>';
        el.append(tpl);
        if(trigger.dataType==="Time"){
            $("td[data-name='setTime']").bind("tap",function(event){
                console.log(event);
                setTime();
            });
        }        
    };
    
    var setTime = function(){
        var options = {
                date: new Date(),
                mode: 'time'
            };
            function onSuccess(date) {
                console.log('Selected date: ' + date);
                var dataArray = date.toString().split(' ');
                var reg = /(\w+):(\w+)/;
                var r = dataArray[4].match(reg);
                $("input[data-name='hour']").val(r[1]);
                $("input[data-name='minute']").val(r[2]);
            };
            function onError(error) { // Android only
                console.log('Error: ' + error);
            };
            datePicker.show(options, onSuccess, onError);
    };
    
    var getTriggerEdit = function(trigger, el){
        Entity.editeRecipe._cls = trigger._cls;
        Entity.editeRecipe.task = trigger.task;
        Entity.editeRecipe.type = "graphic";
        Entity.editeRecipe.uid = $.molmc.utils.getItem("uid");
        Entity.editeRecipe.run_immediately = false;
        Entity.editeRecipe.kwargs = {};
        Entity.editeRecipe.enabled = true;
        if(selectedTriggerDev._id === system_deviceId){
            Entity.editeRecipe.description = trigger.name;
            Entity.editeRecipe.crontab={_cls:"Crontab", minute:"*", hour:"*", day_of_week:"*", day_of_month:"*", month_of_year:"*"};
        }else{
            Entity.editeRecipe.description = _lang("graphic_dev")+selectedTriggerDev.name+ _lang("graphic_s")+trigger.name;
            Entity.editeRecipe.crontab = {_cls: "Crontab"};
            var topicindex = selectedTriggerWid.triggerList[triggertapindex].topicList[0];
            Entity.editeRecipe.routing_key = "v1/" + selectedTriggerDev._id + selectedTriggerWid.topics[topicindex].url;
        }
        if(trigger.dataType==="Time"){
            var selectEl = el + ' select[name="setTriggerTime"]';
            var hourEl = el + ' input[data-name="hour"]';
            var minEl = el + ' input[data-name="minute"]';
            if($(selectEl).length > 0){
                if(trigger.selectType === "day_of_month"){
                    Entity.editeRecipe.crontab[trigger.selectType] = (parseInt($(selectEl).val()) + 1).toString();;
                }else{
                    Entity.editeRecipe.crontab[trigger.selectType] = $(selectEl).val();
                }
                Entity.editeRecipe.description = Entity.editeRecipe.description + trigger.selectData[$(selectEl).val()];
            }
            var hour = $(hourEl).val();
            var min = $(minEl).val();            
            if(hour>23 | hour<0 | min<0 | min>60){
                navigator.notification.alert(_lang("graphic_settimeerr"),"",_lang("tips_title_tips"),_lang("g_tips_confirm"));
                return false;
            }            
            Entity.editeRecipe.crontab.hour = hour;
            Entity.editeRecipe.crontab.minute = min;
            Entity.editeRecipe.routing_key = trigger.routing_key;
            Entity.editeRecipe.exchange = trigger.exchange;
            Entity.editeRecipe.description = Entity.editeRecipe.description + _lang("graphic_at") + hour + ":" + min;
        }else if(trigger.dataType==="Number"){
            var selectEl = el + ' select[name="factorlogic"]';
            var inputEl = el + ' input[data-name="factorVal-graphic"]';
            var threshold = $(inputEl).val();
            var topicindex = selectedTriggerWid.triggerList[triggertapindex].topicList[0];            
            if(selectedTriggerWid.topics[topicindex].attribute.max!==undefined){
                var max = parseFloat(selectedTriggerWid.topics[topicindex].attribute.max);
                if(parseFloat(threshold)>max){
                    navigator.notification.alert(_lang("graphic_maxerr"),"",_lang("tips_title_tips"),_lang("g_tips_confirm"));
                    return false;
                }
            };            
            if(selectedTriggerWid.topics[topicindex].attribute.max!==undefined){
                var min = parseFloat(selectedTriggerWid.topics[topicindex].attribute.min);
                if(parseFloat(threshold)<min){
                    navigator.notification.alert(_lang("graphic_minerr"),"",_lang("tips_title_tips"),_lang("g_tips_confirm"));
                    return false;
                }
            };            
            Entity.editeRecipe.kwargs.threshold = $(inputEl).val();
            Entity.editeRecipe.exchange = trigger.exchange[$(selectEl).val()];
            Entity.editeRecipe.description = Entity.editeRecipe.description + trigger.selectData[$(selectEl).val()] + $(inputEl).val();
        }else if(trigger.dataType==="Bool"){
            var selectEl = el + ' select[name="setTriggerStatus"]';
            Entity.editeRecipe.kwargs.threshold = $(selectEl).val();
            Entity.editeRecipe.exchange = trigger.exchange;
            Entity.editeRecipe.description = Entity.editeRecipe.description + _lang("graphic_is") + trigger.selectData[parseInt($(selectEl).val())];
        }
    };

    var settingAction = function(action, el){
        if(_.isEmpty(action)){
            return;
        }
        el.empty();
        var inputTpl = "";
        var topicTpl = "";
        if(action.dataType==="E-Mail"){
            var message = _.isEmpty(Entity.curRecipe.args)?"":Entity.curRecipe.args[2];
            inputTpl = '<tr><td>'+_lang("graphic_sendemail")+':</td></tr><tr><td colspan="2"><input type="email" name="email" value="'+$.molmc.utils.getItem("account")+'" disabled="disabled"/></td></tr><tr><td>'+_lang("graphic_sendecontent")+'</td></tr><tr><td colspan="2"><textarea type="text" data-clear="true" name="mailcontent" rows="2" placeholder=\"'+ _lang("graphic_inputcontent") +'\">'+message+'</textarea></td></tr>';
        }else if(action.dataType==="String"){
            var string = _.isEmpty(Entity.curRecipe.args)?"":Entity.curRecipe.args[2];
            inputTpl = '<tr><td>'+ _lang("graphic_trigger")+':</td></tr><tr><td colspan="2"><textarea type="text"  data-clear="true" name="stringcontent" rows="2" placeholder=\"'+ _lang("graphic_inputcontent") +'\">'+string+'</textarea></td></tr>';
        }else if(action.dataType==="Message"){
            var Message = _.isEmpty(Entity.curRecipe.args)?"":Entity.curRecipe.args[2];
            inputTpl = '<tr><td>'+ _lang("graphic_sendecontent")+':</td></tr><tr><td colspan="2"><textarea type="text" data-clear="true" name="message" rows="2" placeholder=\"'+ _lang("graphic_inputcontent") +'\">'+Message+'</textarea></td></tr>';
        }else if(action.dataType==="Bool"){
            var selectedon = "";
            var selectedoff = "";
            if(!_.isEmpty(Entity.curRecipe.args)){
                if(Entity.curRecipe.args[2]==1){
                    selectedon = 'selected="selected"' ;
                }else{
                    selectedoff = 'selected="selected"';
                }
            }
            inputTpl = '<tr><td>'+ _lang("graphic_trigger")+':</td><td style="text-align:right;"><select name="setactionStatus" id="" style="width:inherit;"><option '+selectedon+' value="1">'+ _lang("g_on")+'</option><option '+selectedoff+' value="0">'+ _lang("g_off")+'</option></select></td></tr>';
        }else if(action.dataType==="Number"){
            var threshold="";
            if(!_.isEmpty(Entity.curRecipe.args)){
                threshold = "value=" + Entity.curRecipe.args[2];
            }
            var topicIndex = selectedActionWid.actionList[actiontapindex].topicList[0];
            var unit = selectedActionWid.topics[topicIndex].attribute.unit;
            if (unit==undefined) {
                unit = "";
            };
            inputTpl = '<tr><td>'+_lang("graphic_action_setNumTitle")+':</td><td style="text-align:right;width:50%;line-height:45px;"><input style="width:70%;float:left;" data-clear="true" type="number" data-name="factorVal-graphic" '+threshold+' /><span>'+ unit +'</span></td></tr>'
        
        }else if(action.dataType==="Custom"){
            if(action.CustomType==="sprinkler"){
                var selectedon = "";
                var selectedoff = "";
                var custom_val_display = "";
                if(!_.isEmpty(Entity.curRecipe.args)){
                    if(JSON.parse(Entity.curRecipe.args[2]).status==1){
                        selectedon = 'selected="selected"' ;
                    }else{
                        selectedoff = 'selected="selected"';
                        custom_val_display = "none";
                    }
                }
                var inputselTpl = '<tr><td>'+ _lang("graphic_trigger")+':</td><td style="text-align:right;"><select name="setactionStatus" id="" style="width:inherit;"><option '+selectedon+' value="1">'+ _lang("g_on")+'</option><option '+selectedoff+' value="0">'+ _lang("g_off")+'</option></select></td></tr>';
                var selectTimeTpl="";
                var selected="";
                for(var i=0; i<action.selectTime.length; i++){
                    var selected = "";
                    if(!_.isEmpty(Entity.curRecipe.args)){
                        if(action.selectTime[i]==JSON.parse(Entity.curRecipe.args[2]).time){
                            selected = 'selected="selected"';
                        }
                    }
                    if(action.selectTime[i] == 0){
                        selectTimeTpl = selectTimeTpl + '<option '+selected+' value='+action.selectTime[i]+'>'+ _lang("widgetlist_12_forever")+'</option>';
                    }else{
                        selectTimeTpl = selectTimeTpl + '<option '+selected+' value='+action.selectTime[i]+'>'+action.selectTime[i]+ _lang("widgetlist_12_minute")+'</option>';
                    }
                }
                var inputTimeTpl = '<tr name="custom_value" style="display:'+custom_val_display+';"><td>'+ _lang("widgetlist_12_timerDes")+':</td><td style="text-align:right;"><select autofocus name="setactionTime" id="" style="width:inherit;">'+ selectTimeTpl +'</select><span></span></td></tr>';
                inputTpl = inputselTpl + inputTimeTpl;
            }else if(action.CustomType==="aircondition"){
                var selectedon = "";
                var selectedoff = "";
                var custom_val_display = "";
                if(!_.isEmpty(Entity.curRecipe.args)){
                    if(JSON.parse(Entity.curRecipe.args[2]).switch == "1"){
                        selectedon = 'selected="selected"' ;
                    }else{
                        selectedoff = 'selected="selected"';
                        custom_val_display = "none";
                    }
                }
                var inputselTpl = '<tr><td>'+ _lang("widgetlist_30_switch")+':</td><td style="text-align:right;"><select name="setactionStatus" id="" style="width:inherit;"><option '+selectedon+' value="1">'+ _lang("g_on")+'</option><option '+selectedoff+' value="0">'+ _lang("g_off")+'</option></select></td></tr>';
                var tempValue = 27;
                if(!_.isEmpty(Entity.curRecipe.args)){
                    tempValue = JSON.parse(Entity.curRecipe.args[2]).temp;
                }
                var inputTempTpl = '<tr name="custom_value" style="display:'+custom_val_display+';"><td>'+ _lang("action_050002_temp")+':</td><td style="text-align:right;"><input name="inputTemp" type="number" data-clear="true" value='+tempValue+' style="width:50px;"><span style="font-size:1.3em;">℃</span></td></tr>';
                inputTpl = inputselTpl + inputTempTpl;
            }else if (action.CustomType==="petfeed") {
                var selectedfeedon = "";
                var selectedfeedoff = "";
                if(!_.isEmpty(Entity.curRecipe.args)){
                    if( JSON.parse(Entity.curRecipe.args[2]).feed == "1"){
                        selectedfeedon = 'selected="selected"' ;
                    }else{
                        selectedfeedoff = 'selected="selected"';
                    }
                }
                var inputfeedTpl = '<tr><td>'+ _lang("widgetlist_51_feed_switch")+':</td><td style="text-align:right;"><select name="setactionfeedStatus" id="" style="width:inherit;"><option '+selectedfeedon+' value="1">'+ _lang("g_on")+'</option><option '+selectedfeedoff+' value="0">'+ _lang("g_off")+'</option></select></td></tr>';
                var selectedphotoon = "";
                var selectedphotooff = "";
                if(!_.isEmpty(Entity.curRecipe.args)){
                    if(JSON.parse(Entity.curRecipe.args[2]).photo == "1"){
                        selectedphotoon = 'selected="selected"' ;
                    }else{
                        selectedphotooff = 'selected="selected"';
                    }
                }
                var inputphotoTpl = '<tr><td>'+ _lang("widgetlist_51_photo_switch")+':</td><td style="text-align:right;"><select name="setactionphotoStatus" id="" style="width:inherit;"><option '+selectedphotoon+' value="1">'+ _lang("g_on")+'</option><option '+selectedphotooff+' value="0">'+ _lang("g_off")+'</option></select></td></tr>';
                inputTpl = inputfeedTpl + inputphotoTpl;
            }
        }
        if(!_.isEmpty(selectedActionWid.topics)){
            var topicIndex = selectedActionWid.actionList[actiontapindex].topicList[0];
            topicTpl = '<tr><td>'+ _lang("graphic_sensors")+':</td><td style="text-align:right;">'+selectedActionWid.topics[topicIndex].name+'</td></tr>';
        }
        var tpl = '<table cellspacing="10" style="width:100%;"><tr style="text-align:center;"><td colspan="3"><h3>'+ _lang("graphic_action")+'</h3></td></tr><tr><td>'+ _lang("device_devname")+':</td><td style="text-align:right;">'+selectedActionDev.name+'</td></tr><tr><td>'+ _lang("device_setwidget_name")+':</td><td style="text-align:right;">'+selectedActionWid.name+'</td></tr>'+topicTpl+inputTpl+'</table>';
        el.append(tpl);
    };

    var getActionEdit = function(action, el){
        var actionName = "";
        var args=[];
        if(selectedActionDev._id === system_deviceId){
            actionName = action.name;
        }else{
            actionName =  _lang("graphic_dev") + selectedActionDev.name + _lang("graphic_s") + action.name;
        }

        if(action.dataType ==="E-Mail"){
            var emailEl = el + ' input[name="email"]';
            var emailtextEl = el +' textarea[name="mailcontent"]';
            var msg = $(emailtextEl).val();
            $(messageEl).blur();
            if(msg.length===0){
                navigator.notification.confirm(_lang("g_error_cannotempty"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
                return false;
            }
            if(!$.molmc.utils.checkInput(msg)){
                navigator.notification.confirm(_lang("device_notice_content"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
                return false;
            }
            args[0] = "email";
            args[1] = $(emailEl).val();
            args[2] = msg;
            actionName = actionName + $(emailEl).val();
        }else if(action.dataType === "Message"){
            var messageEl = el + ' textarea[name="message"]';
            var msg = $(messageEl).val();
            $(messageEl).blur();
            if(msg.length===0){
                navigator.notification.confirm(_lang("g_error_cannotempty"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
                return false;
            }
            if(!$.molmc.utils.checkInput(msg)){
                navigator.notification.confirm(_lang("device_notice_content"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
                return false;
            }
            args[0] = "mqtt";
            args[1] = "v1/" + selectedActionDev._id + "/firmware/default/info/message";
            args[2] = msg;
            actionName = actionName + msg + _lang("graphic_toyou");
        }else if(action.dataType === "Bool"){
            var statusEl = el + ' select[name="setactionStatus"]';
            var topicIndex = selectedActionWid.actionList[actiontapindex].topicList[0];
            args[0] = "mqtt";
            args[1] = "v1/"+selectedActionDev._id+selectedActionWid.topics[topicIndex].url;
            args[2] = $(statusEl).val();
            actionName = actionName + action.selectData[parseInt($(statusEl).val())];
        }else if(action.dataType === "Number"){
            var inputEl = el + ' input[data-name="factorVal-graphic"]';
            var topicIndex = selectedActionWid.actionList[actiontapindex].topicList[0];
            args[0] = "mqtt";
            args[1] = "v1/"+selectedActionDev._id+selectedActionWid.topics[topicIndex].url;
            args[2] = $(inputEl).val();            
            var topicIndex = selectedActionWid.actionList[actiontapindex].topicList[0];
            var unit = selectedActionWid.topics[topicIndex].attribute.unit; 
            if (unit==undefined) {
                unit = "";
            };   
            actionName = actionName + _lang("graphic_action_setNumTitle") + args[2] + unit;
        }else if(action.dataType === "String"){
            var stringEl = el + ' textarea[name="stringcontent"]';
            var topicIndex = selectedActionWid.actionList[actiontapindex].topicList[0];
            var msg = $(stringEl).val();
            if(msg.length===0){
                navigator.notification.confirm(_lang("g_error_cannotempty"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
                return false;
            }
            if(!$.molmc.utils.checkInput(msg)){
                navigator.notification.confirm(_lang("device_notice_content"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
                return false;
            }
            args[0] = "mqtt";
            args[1] = "v1/"+selectedActionDev._id+selectedActionWid.topics[topicIndex].url;
            args[2] = msg;
            actionName = actionName + msg;
        }else if(action.dataType==="Custom"){
            var topicIndex = selectedActionWid.actionList[actiontapindex].topicList[0];
            if(action.CustomType==="sprinkler"){
                var statusEl = el + ' select[name="setactionStatus"]';
                var timeEl = el + ' select[name="setactionTime"]';
                var obj = {"status": parseInt($(statusEl).val()),"time":parseInt($(timeEl).val())};
                args[0] = "mqtt";
                args[1] = "v1/"+selectedActionDev._id+selectedActionWid.topics[topicIndex].url;
                args[2] = JSON.stringify(obj);
            }else if(action.CustomType==="aircondition"){
                var statusEl = el + ' select[name="setactionStatus"]';
                var tempEl = el + ' input[name="inputTemp"]';
                var obj = {"mode":0,"switch": parseInt($(statusEl).val()),"temp":parseInt($(tempEl).val())};
                args[0] = "mqtt";
                args[1] = "v1/"+selectedActionDev._id+selectedActionWid.topics[topicIndex].url;
                args[2] = JSON.stringify(obj);
            }else if (action.CustomType==="petfeed"){
                var feedEl = el + ' select[name="setactionfeedStatus"]';
                var photoEl = el + ' select[name="setactionphotoStatus"]';
                var obj = {"feed": parseInt($(feedEl).val()), "photo": parseInt($(photoEl).val())};
                args[0] = "mqtt";
                args[1] = "v1/"+selectedActionDev._id+selectedActionWid.topics[topicIndex].url;
                args[2] = JSON.stringify(obj);
            }
        }
        Entity.editeRecipe.description = _lang("graphic_if") + ' ' + Entity.editeRecipe.description + ","+_lang("graphic_then")+ ' ' + actionName;
        Entity.editeRecipe.args = args;
//        Entity.editeRecipe.category = action.category;
    };

    var getWidgetTID = function(recipe){
        if(!_.isEmpty(recipe.factorID)){
            var factorModel = $.molmc.triggerEvent[recipe.factorID[0]];
            var widgetT_id;
            if(factorModel.dataType === "Time"){
                var device = systemDev;
                widgetT_id = system_widgetId_date;
            }else{
                var url = recipe.routing_key;
                var devid_reg =  /^v1\/([\w]+)\//g;
                var device_id = devid_reg.exec(url)[1];
                var widget_reg =  /^v1\/[\w]+\/channel\/([\w]+)\//g;
                var widget_arr = widget_reg.exec(url)[1].split('_');
                devList = $.molmc.device.deviceList();
                var device = _.findWhere(devList, {_id: device_id});
                if(device){
                    var widgetlist = device.widgets;
                    if(widgetlist){
                        var widget = _.findWhere(widgetlist, {widget_proto: widget_arr[0], tab: parseInt(widget_arr[1])});
                        if(widget){
                            widgetT_id = widget.widget_id;
                        }
                    }
                }

            }
            return [device,widgetT_id];
        }
    };

    var getWidgetAID = function(recipe){
        if(!_.isEmpty(recipe.factorID)){
            var factorModel = $.molmc.actionEvent[recipe.factorID[1]];
            var widgetA_id;
            if(factorModel.dataType === "E-Mail"){
                var device = systemDev;
                widgetA_id = system_widgetId_mail;
            }else if(factorModel.dataType === "Message"){
                var device = systemDev;
                widgetA_id = system_widgetId_message;
            }else{                
                if((recipe.args !== undefined) && (!_.isEmpty(recipe.args[1]))){
                    var url = recipe.args[1];
                    var devid_reg =  /^v1\/([\w]+)\//g;
                    var device_id = devid_reg.exec(url)[1];
                    var widget_reg =  /^v1\/[\w]+\/channel\/([\w]+)\//g;
                    var widget_arr = widget_reg.exec(url)[1].split('_');
                    var devList = $.molmc.device.deviceList();
                    var device = _.findWhere(devList, {_id: device_id});
                    if(device){
                        var widgetlist = device.widgets;
                        if(widgetlist){
                            var widget = _.findWhere(widgetlist, {widget_proto: widget_arr[0], tab: parseInt(widget_arr[1])});
                            if(widget){
                                widgetA_id = widget.widget_id;
                            }
                        }
                    }
                }
            }
            return [device,widgetA_id];
        }
    };

    Graphic.prototype = {
        GetRecipes:function(response, flag){
            if(Entity.recipes === undefined | flag === true){
                $.molmc.api.getRecipes(response);
            }
        },
        GetSchedules:function(response, flag){
            if(Entity.schedules === undefined | flag === true){
                $.molmc.api.getSchedules(response);
            }
        },
        ShowRecipeList:function(flag){
            showRecipeList(flag);
        }
    };

    $.molmc.grapic = new Graphic();
})(af);