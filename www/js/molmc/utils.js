//网站的主域名
var serverURL = 'http://192.168.0.77';
var serverMQTT = '192.168.0.77';

var fileSystemRoot;
var fileSystemWidget;
(function($) {
    "use strict";
    var Utils = function(){
        document.addEventListener('backbutton', BackbuttonClick, false);
        document.addEventListener("resume", resumeCallback, false);
        document.addEventListener("pause", pauseCallback, false);
    };

    var enableBackbutton = true;

    var resumeCallback = function(){        
        setTimeout(function(){
            console.log("resume");
            enableBackbutton = true;
        },300);
    };

    var pauseCallback = function(){
        console.log("pause");
        enableBackbutton = false;
    };

    var ispopupshow = false;
    var curpopup="";
    var mExitTime;
    $(document).on("popshow",function(arg){
        curpopup=arg.data[0];
    });
    $(document).on("pophide",function(){
        curpopup="";
    });
    var BackbuttonClick=function(){
        console.log("backbutton");
        if (enableBackbutton == false) {
            return;
        };
        var search=window.location.href;
        var strs = search.split("#");
        if(curpopup!==""){
            curpopup.hide();
            return;
        }
        if(strs[1]=='device' || strs[1]=='explore' || strs[1]=='graphic' || strs[1]=='about' || (strs[1]===undefined && $.molmc.utils.getItem("autoLogin")==="true")){
           $.ui.clearHistory();
           if(Date.now() - mExitTime > 2000 || mExitTime === undefined){
               mShowToast(_lang("utils_exit"));
               setTimeout(function(){
                   var _exitTipWarp = document.getElementById("exitTipWarp");
                   if(_exitTipWarp){
                       document.body.removeChild(_exitTipWarp);
                   }
               },2000);
               mExitTime = Date.now();
           }else{
               navigator.app.clearCache();
               navigator.app.exitApp();
           }
       }else if(strs[1]==undefined || strs[1]=='login'){
           $.molmc.utils.exitApp();
       }else if(strs[1]=='register_phone'){
            $.ui.loadContent("#login", true, true, "slide");
       }else{
            $.ui.goBack();
       }
    };

    var mShowToast = function(tip, width){
        if(width===undefined){
            width = "180px";
        }else{
            width = width + "px";
        }   
        var _tipWarp = document.getElementById("exitTipWarp");
        if(typeof(_tipWarp)==="undefined"||_tipWarp===null){
            _tipWarp = document.createElement("div");
            _tipWarp.id = "exitTipWarp";
            _tipWarp.style.display = "block";
            _tipWarp.style.position = "absolute";
            _tipWarp.style.textAlign = "center";
            _tipWarp.style.width = "100%";
            _tipWarp.style.zIndex = 99999;
            _tipWarp.style.left = "0px";
            _tipWarp.style.bottom = "100px";
            document.body.appendChild(_tipWarp);
        }
        var _tip = document.getElementById("exitTip");
        if(typeof(_tip)==="undefined"||_tip===null){
            _tip = document.createElement("div");
            _tip.id = "exitTip";
            _tip.style.display = "block";
            _tip.style.width = width;
            _tip.style.height = "35px";
            _tip.style.lineHeight = "35px";
            _tip.style.borderWidth = "0px";
            _tip.style.borderRadius = "10px";
            _tip.style.boxShadow = "0 0 20px #000";
            _tip.style.fontSize = "16px";
            _tip.style.backgroundColor = '#000';
            _tip.style.color = "#fff";
            _tip.style.margin="0 auto";
            _tip.style.opacity="0.7";
            _tipWarp.appendChild(_tip);
        }
        _tip.innerHTML = tip;
    };
    
    Utils.prototype = {
        /*
         *用户topic
         */
        u_Topic:"",
        /*
         *用户topic 发送时间
         */
        u_TimeStamp:"",
        /*
         *用户topic 发送时间
         */
        appVersion:"",
        /**
         * 检查网络情况
         * @returns {Boolean}
         */
        checkNetwork:function(){
            var strs = window.location.href.split("#");
            if(this.getItem("autoLogin") && strs[1]===undefined){
                return true;
            }
            var networkState = navigator.network.connection.type;
            if (networkState == Connection.NONE) {
                // navigator.notification.confirm(_lang("utils_tips_link"), function(info){}, _lang("tips_title_tips"), _lang("g_tips_confirm"));
                return false;
            }else{
                return true;
            }
        }, 
        /**
         * 检查WIFI是否连接
         * @returns {Boolean}
         */
        checkWifi:function(unShow){
            var networkState = navigator.network.connection.type;
            if (networkState !== Connection.WIFI) {
                if(!unShow){
                    navigator.notification.confirm(_lang("utils_tips_wifi"), function(info){}, _lang("tips_title_tips"), _lang("g_tips_confirm"));
                }                
                return false;
            }else{
                return true;
            }
        },
        /*
        写入loclstorage缓存
         * @param key
         * @param data
        */
        setItem:function(key, data){
            localStorage.setItem(key, data);
        },
        /*
        读取localstorage缓存
          * @param key
          * @returns
        */
        getItem:function(key){
            return localStorage.getItem(key);
        },
        /*
        清除localstorage
         * @param key
         */
        clearItem:function(key){
            return localStorage.removeItem(key);
        },
        /*
        获取时间戳的方法,返回s
         */
        getTimestamp:function(){
            var time =Date.parse(new Date());
            return time/1000;
        },
        /*
        时间戳转换为 2011年3月16日 16:50:43 格式
         * @param time
         */
        getDate:function(time){
            var tt= new Date(parseInt(time) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            return tt;
        },
        /*
        时间戳转换为 2011年3月16日 16:50:43 格式
         * @param time
         */
        loadOut:function(filename, filetype){
            //判断文件类型
            var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none";
            //判断文件名
            var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none";
            var allsuspects=document.getElementsByTagName(targetelement);
            //遍历元素， 并删除匹配的元素
            for (var i=allsuspects.length; i>=0; i--){
                if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1){
                    var url=allsuspects[i].getAttribute(targetattr)
                    allsuspects[i].parentNode.removeChild(allsuspects[i]);
                    return url;
                }
            }
        },
        /*
        退出app
        */
        exitApp:function() {  
            navigator.app.clearCache();
            navigator.app.exitApp();
        },
        
        /*
         * show toast
         */
        showToast:function(tip, width, time){
            mShowToast(tip, width);
            setTimeout(function(){
               var _exitTipWarp = document.getElementById("exitTipWarp");
               if(_exitTipWarp){
                   document.body.removeChild(_exitTipWarp);
               }
           },time);
        },
        /*
        检查email格式
        @param email
        */
        checkEmail:function(email){
            var reg = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
            return reg.test(email);
        },
        /*
        检查phone格式
        @param phone
        */
        checkPhone:function(phone){
            var reg = /^1\d{10}$/;
            return reg.test(phone);
        },
        /*
         *检测设备描述输入特殊字符
         */
        checkdevDespInput:function(str){
            var reg =  /^[\w\-\u4e00-\u9fa5\uFE30-\uFFA0。、,.\?!\s\']*$/g;
            return reg.test(str);
        },
        /*
         *检测输入特殊字符
         */
        checkInput:function(str){
            var reg = /^[\w\u4e00-\u9fa5]{1}[\w\-\u4e00-\u9fa5\uFE30-\uFFA0。、,.\?!\s\']*$/g;
            return reg.test(str);
        },
        /*
         * 检查密码类型
         */
        checkPassword:function(str){
            var CharMode = function (iN) {
                if (iN >= 48 && iN <= 57) //数字  
                    return 1;
                if (iN >= 65 && iN <= 90) //大写字母  
                    return 2;
                if (iN >= 97 && iN <= 122) //小写  
                    return 4;
                else
                    return 8; //特殊字符  
            }
            var bitTotal = function (num) {
                var modes = 0;
                for (i = 0; i < 4; i++) {
                    if (num & 1) modes++;
                    num >>>= 1;
                }
                return modes;
            }
            var Modes = 0;
            for (var i = 0; i < str.length; i++) {
                //测试每一个字符的类别并统计一共有多少种模式.  
                Modes |= CharMode(str.charCodeAt(i));
            }
            return bitTotal(Modes);
        },
        /*
         加载控件js和css文件
         * @param filename
         * @param filetype
         */
        loadInJsCss:function(filename, filetype){
            //如果文件类型为 .js ,则创建 script 标签，并设置相应属性
            if (filetype=="js"){
                var fileref=document.createElement('script');
                fileref.setAttribute("type","text/javascript");
                fileref.setAttribute("src", filename);
            }
            //如果文件类型为 .css ,则创建 script 标签，并设置相应属性
            else if (filetype=="css"){
                var fileref=document.createElement("link");
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("type", "text/css");
                fileref.setAttribute("href", filename);
            }
            if (typeof fileref!="undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref);
        },
        /*
         清除控件加载的js和css文件
         * @param filename
         * @param filetype
         */
        loadOutJsCss:function(filename, filetype){
            //判断文件类型
            var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none";
            //判断文件名
            var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none";
            var allsuspects=document.getElementsByTagName(targetelement);
            //遍历元素， 并删除匹配的元素
            for (var i=allsuspects.length; i>=0; i--){
                if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1){
                    var url=allsuspects[i].getAttribute(targetattr)
                    allsuspects[i].parentNode.removeChild(allsuspects[i]);
                    return url;
                }
            }
        },
        /*
         *获取设备位置信息
         *return point:obj{lat,lng}
         */
        getLocation:function(callback, showWitting) {
            var self = this;
            if(navigator.geolocation){
                if(showWitting){
                    $.ui.showMask(_lang('g_tips_loadmap'));
                }
                navigator.geolocation.getCurrentPosition(function(position){
                    $.ui.hideMask();
                    var lat = position.coords.latitude;  
                    var lng = position.coords.longitude;  
                    var point =  {lat:Math.abs(lat),lng:Math.abs(lng)};
                    callback(point);
                }, function(error){
                    $.ui.hideMask();
                    switch(error.code){
                        case error.TIMEOUT :
                            console.log( "连接超时，请重试 " );
                            if(self.getItem("localtionSetingFirst") == null | self.getItem("localtionSetingFirst") == undefined){
                                self.setItem("localtionSetingFirst", true)
                                navigator.notification.confirm(_lang("g_getLocationErr"), function(info){}, _lang("g_tips_warning"), _lang("g_tips_confirm"));
                            }
                            break;
                        case error.PERMISSION_DENIED :
                            console.log( " 您拒绝了使用位置共享服务，查询已取消" );
                            break;
                        case error.POSITION_UNAVAILABLE :  
                            console.log( "非常抱歉，我们暂时无法为您所在的星球提供位置服务");
                            break;
                    }
                    var point =  {lng:116.331398,lat:39.897445};
                    callback(point);
                }, 
                {
                    enableHighAccuracy:false,
                    timeout : 5000
                });  
            }else{
                var point =  {lng:116.331398,lat:39.897445};
                callback(point);
            }
        },
        /*
         * 显示控件列表
         */
        showWidgets:function(el, list,isadd){
            var listView = el;
            listView.empty();
            if(list===undefined){
                if(isadd===true){
                    var liTplObj = '<div style="font-size: 1.5em;text-align: center;margin-top: 50%; color:darkgray; background: #F2F2F2;"><div><a href="#demo_device" class="fa fa-plus-circle" style="font-size: 4em;color: darkgray;margin-bottom:20px;" id=""></a></div><span>请点击添加控件</span></div>';
                }else{
                    var liTplObj = '<div style="margin:10px">没有找到相关控件</div>';
                }
                listView.append(liTplObj);
                return;
            }
            if(list.length === 0 ){
                if(isadd===true){
                    var liTplObj = '<div style="font-size: 1.5em;text-align: center;margin-top: 50%; color:darkgray; background: #F2F2F2;"><div><a href="#" class="fa fa-plus-circle" style="font-size: 4em;color: darkgray;margin-bottom:20px;" id=""></a></div><span>请点击添加控件</span></div>';
                }else{
                    var liTplObj = '<div style="margin:10px">没有找到相关控件</div>';
                }
                listView.append(liTplObj);
                return;
            }
            for(var i=0; i<list.length; i++){
                var widgetHead = fileSystemWidget + list[i].widget_id + "/img/ThumbS.png";
                var name = list[i].name;
                var description = list[i].description;
                var badge = "";
                if(!_.isEmpty(list[i].retain)){
                    if(list[i].topics[0].D_type === "BOOL"){
                        if(list[i].retain == "1"){
                            badge = _lang("g_on");
                        }else{
                            badge = _lang("g_off");
                        }
                    }else{
                        badge = list[i].retain + " " +list[i].topics[0].attribute.unit;
                    }
                }
                var liTplObj = '<li id="'+ i +'" ><div style="float:left"><img style="width:80px;height:80px;margin-top:-8px;border-radius:50%;" src="'+ widgetHead +'"></div><div style="margin-left:90px;height:65px;"><h3 style="color:rgb(93,93,216);margin-top=-5px;">' + name + '</h3><h4 id="badge" style="color:rgb(42, 132, 197); margin-top:5px;">'+ badge +'</h4><h4 class="nowrap" style="color:gray;margin-top:5px;">'+ description + '</h4></div></li>';
                listView.append(liTplObj);
            }
        },
        /*
         * 显示设备列表
         */
        showDevices:function(el, list, options){
            if(list.length===0||list.length===undefined){
                var strs = window.location.href.split("#");
                if(strs[1]==="device"||strs[1]===undefined){
                    this.shownullDev(el,"mydev");
                }else if(strs[1]==="collectdev_device"){
                    this.shownullDev(el,"mydev");
                }else if(strs[1]==="graphic"){
                    this.shownullDev(el,"graphic");
                }
                return;
            }
            if(_.isEmpty(list)){      
                return;
            }
            var listView = el;
            listView.empty();
            if(list.length == 0){
                return;
            }else{

            }
            var j=0;
            
            for(var i=0; i<list.length; i++){
                if(list[i].typeofli==="listlabel"){
                    var liTplObj = ' <li class="divider"><div><label style="width:auto;padding:3px 3px">'+list[i].tag+'</label><label class="fa fa-list" id="list'+j+'" style="float:right;margin-right:-40px;padding:6px 3px" ></label><div style="clear:both"></div></div></li>';
                    listView.append(liTplObj);
                    j++;
                    continue;
                }
                if(list[i].typeofli==="replylabel"){
                    var liTplObj = ' <li class="divider"><div><label style="width:auto;padding:3px 3px">'+list[i].tag+'</label><label class="fa fa-reply" id="list'+j+'" style="float:right;margin-right:-40px;padding:6px 3px" ></label><div style="clear:both"></div></div></li>';
                    listView.append(liTplObj);
                    j++;
                    continue;
                }
                if(list[i].typeofli==="text"){
                    var liTplObj = ' <li class="divider"><div><label style="width:auto;padding:3px 3px">'+list[i].tag+'</label><div style="clear:both"></div></div></li>';
                    listView.append(liTplObj);
                    continue;
                }
                if(list[i].typeofli==="none"){
                    var liTplObj = '<li>'+_lang("explore_nodevice")+'</li>';
                    listView.append(liTplObj);
                    continue;
                }
                var headurl = list[i].dev_img;

                var name = list[i].name;
                var city = list[i].city;
                var description = list[i].description;
                var  iscollect=$.molmc.device.getisCollectDevs(list[i]._id);
                var iscollecttpl="";
                if(iscollect){
                    iscollecttpl='<span class="af-badge" style="margin-top:38px;color:red;" ><a class="fa fa-heart"></a></span>';
                }
                var pattern = /^[^\/]+/;
                if(pattern.test(headurl)){
                    headurl = "/" + headurl;
                }
                if(!_.isEmpty(options) && options.flag_collect===true){
                      var liTplObj = '<li id="'+ i +'"><div style="float:left"><img style="width:80px;height:80px;margin-top:-8px;border-radius:50%;" src="'+ serverURL + headurl +'"></div><div style="margin-left:90px;height:65px;"><h3 style="color:rgb(93,93,216);margin-top:-5px;width:80%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + name + '</h3><h4 class="nowrap"  style="color:gray;margin-top:5px;">'+ description + '</h4><h4 style="color:rgb(42, 132, 197);margin-top:5px;margin-left:5px;"><span class="icon location" style="margin:-5px;"></span>' + city + '</h4><span class="af-badge" style="margin-top:10px;"><a class="link fa fa-wifi"></a></span>'+iscollecttpl+'<span class="af-badge br" style="margin-bottom:10px;"><a class="share fa"></a></span></span></div></li>';
                } else if(!_.isEmpty(options) && options.img===false){
                    var liTplObj = '<li id="'+ i +'"><div style="height:65px;"><h3 style="color:rgb(93,93,216);margin-top:-5px;width:80%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + name + '</h3><h4 class="nowrap"  style="color:gray;margin-top:5px;">'+ description + '</h4><h4 style="color:rgb(42, 132, 197);margin-top:5px;margin-left:5px;"><span class="icon location" style="margin:-5px;"></span>' + city + '</h4><span class="af-badge" style="margin-top:10px;"><a class="fa fa-exclamation-circle"></a></span><span class="af-badge" style="margin-top:43px;"><a class="fa fa-wifi"></a></span><span class="af-badge br" style="margin-bottom:10px;"><a class="fa fa-share-alt"></a></span></span></div></li>';
                }else{
                    var liTplObj = '<li id="'+ i +'"><div style="float:left"><img style="width:80px;height:80px;margin-top:-8px;border-radius:50%;" src="'+ serverURL + headurl +'"></div><div style="margin-left:90px;height:65px;"><h3 style="color:rgb(93,93,216);margin-top:-5px;width:80%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + name + '</h3><h4 class="nowrap"  style="color:gray;margin-top:5px;">'+ description + '</h4><h4 style="color:rgb(42, 132, 197);margin-top:5px;margin-left:5px;"><span class="icon location" style="margin:-5px;"></span>' + city + '</h4><span class="af-badge" style="margin-top:10px;"><a class="link fa fa-exclamation-circle"></a></span><span class="af-badge" style="margin-top:43px;"><a class="fa fa-wifi"></a></span><span class="af-badge br" style="margin-bottom:10px;"><a class="share fa fa-share-alt"></a></span></span></div></li>';
                }
                listView.append(liTplObj);
            }
        },
        
        shownullDev:function(el, text){
            var tiptext;
            var href;
            if(text==="collect"){
                href="explore";
                tiptext=_lang("g_colldev_empty");
            }else if(text==="mydev"){
                href="";                
                tiptext=_lang("g_device_empty");
            }else if(text==="graphic"){
                href="createRecicp_graphic";
                tiptext=_lang("g_graphic_empty");
            }
            var listView = el;
            listView.empty();
            var liTplObj = '<div style="font-size: 1.5em;text-align: center;margin-top: 50%; color: darkgray; background: #F2F2F2;"><div><a href="#'+href+'" class="fa fa-plus-circle" style="font-size: 4em;color: darkgray;margin-bottom:20px;" id="addDeviceEmpty"></a></div><span>'+tiptext+'</span></div>';
            listView.append(liTplObj);
        },
        setpopup:function(popup,isshow){
            curpopup=popup;
            ispopupshow=isshow;
        }
    };
    $.molmc.utils = new Utils();
})(af);

var _G_LANG;
var g_lang = "zh";
var currentBrowserLanguage = navigator.language;
// require(["lang"],function(lang){
    // $.molmc.Lang = lang;
    _G_LANG = {
        zh: $.molmc.Lang._G_ZH,
        en: $.molmc.Lang._G_EN
    };

    g_lang = "zh";
    currentBrowserLanguage = navigator.language;
    if(!currentBrowserLanguage){
        currentBrowserLanguage = navigator.browserLanguage;
    }

    if(currentBrowserLanguage.toLowerCase() == "zh-cn")
    {
        currentBrowserLanguage = 'zh';     
    }else if(currentBrowserLanguage.toLowerCase() ==  "zh-tw" || currentBrowserLanguage.toLowerCase() == "zh-hk"){
        currentBrowserLanguage = 'zht';
    }else{
        currentBrowserLanguage = 'zh';
    }
// });


_lang = function(key){
    // return _G_LANG[g_lang][key] ? _G_LANG[g_lang][key] : key;
    if(currentBrowserLanguage == 'zh' || currentBrowserLanguage == 'en'){
        return _G_LANG[currentBrowserLanguage][key] ? _G_LANG[currentBrowserLanguage][key] : key;
    }else{
        if(key == 'g_lang_caption'){
            return '繁體中文';
        }
        var string = _G_LANG.zh[key]
        if(typeof string == 'object'){
            var array =[];
            string.forEach(function(elem){
                array.push(Traditionalized(elem));
            })
            return array;
        }
        return _G_LANG.zh[key] ? Traditionalized(_G_LANG.zh[key]) : key;
    }
};
