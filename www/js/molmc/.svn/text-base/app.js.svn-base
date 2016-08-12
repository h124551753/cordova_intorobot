(function($) {
    var APP = function(){
        /*
         * Please see the included README.md file for license terms and conditions.
         */

        // This file is a suggested starting place for your code.
        // It is completely optional and not required.
        // Note the reference that includes it in the index.html file.


        /*jslint browser:true, devel:true, white:true, vars:true */
        /*global $:false, intel:false app:false, dev:false, cordova:false */

        // This file contains your event handlers, the center of your application.
        // NOTE: see app.initEvents() in init-app.js for event handler initialization code.

        // function myEventHandler() {
        //     "use strict" ;
        // // ...event handler code here...
        // }

        // ...additional event handlers here...
        /*jslint sloppy:true, browser:true, devel:true, white:true, vars:true, eqeq:true */
        /*global intel:false*/
        /*
         * This function runs once the page is loaded, but the JavaScript bridge library is not yet active.
         */
        var that = this;
        var init = function () {
            $.molmc.goShowWidget = false;
            $.molmc.alwaysHideMask = false;
        };
        window.addEventListener("load", init, false);

        $.ui.ready(function(){
        });
         //  Prevent Default Scrolling
        var preventDefaultScroll = function(event)
        {
            // Prevent scrolling on this element
            window.scroll(0,0);
            return false;
        };
        window.document.addEventListener("touchmove", preventDefaultScroll, false);
        /*
         * Device Ready Code
         * This event handler is fired once the JavaScript bridge library is ready
         */
        var onDeviceReady=function(){                          // called when Cordova is ready
            fileSystemRoot = cordova.file.applicationStorageDirectory;
            fileSystemWidget = fileSystemRoot + "files/files/widgets/";
            if( window.Cordova && navigator.splashscreen ) {     // Cordova API detected
                /*--------------------------------------------------------*/
                cordova.getAppVersion.getVersionNumber(function (version) {
                  $.molmc.utils.appVersion = version;
                });
                $("#register").bind("loadpanel", function(){
                    $("#defaultHeader .backButton").show();
                    $("#header_register h1").html(_lang("g_btn_reg"));
                    changevldcode($("#vld_register"));
                });
                $("#register_phone").bind("loadpanel", function(){
                    $("#defaultHeader .backButton").show();
                    $("#header_register h1").html(_lang("g_phone_register"));
                    $("#header_register .headerright").show();
                });
                $("#vld_register_phone").bind("loadpanel", function(){
                    $("#defaultHeader .backButton").show();
                    $("#header_register h1").html(_lang("g_phone_register"));
                    $("#header_register .headerright").hide();
                    var phone = $("#phone_regphone").val();
                    $("#targetPhone").html(phone);
                    countTime(90);
                });

                $("#vld_register_phone").bind("unloadpanel", function(){
                    clearInterval(smsTimer);
                    $("#vldcodephone_regphone").val("");
                });

                $("#btn_login").bind("tap", function(){
                    that.Login();
                });
                $("#btn_register").bind("tap",function(){
                    var name =$("#name_register").val();
                    var email = $("#email_register").val();
                    var passwd = $("#pwd_register").val();
                    var vldcode = $("#vldcode_register").val();
                    that.Register(name, email, passwd, vldcode, "email");
                });
                $("#btn_getVldPhone").bind("tap",function(){
                    var phone = $("#phone_regphone").val();
                    var name = $("#name_regphone").val();
                    var password = $("#pwd_regphone").val();
                    var zone = $("#phone_zone").val();
                    checkRegphoneFormat(name, phone, zone, password);
                });

                $("#regetVld").bind("tap",function(){
                    var phoneNumb = $.molmc.utils.getItem("phoneNum");
                    var respTime = function(){
                        countTime(90);
                    };
                    $.molmc.api.getPhoneVldCode(phoneNumb, "86", respTime);
                });

                $("#btn_forgetpw").bind("tap",function(){
                    that.Forgetpw();
                });
                $("#btn_resetpw").bind("tap",function(){
                    that.Resetpw();
                });
                $("#vld_register").bind("tap", function(){
                    changevldcode($("#vld_register"));
                });
                $("#vld_regphone").bind("tap", function(){
                    changevldcode($("#vld_regphone"));
                });
                $("#btn_regphone").bind("tap", function(){
                    var phone = $("#phone_regphone").val();
                    var name = $("#name_regphone").val();
                    var password = $("#pwd_regphone").val();
                    var vldcode = $("#vldcodephone_regphone").val();
                    var zone = $("#phone_zone").val();
                    that.Register(name, phone, password, vldcode, "phone", zone);
                });
                $("#toggle_login").bind("change",function(){
                    if($("#toggle_login").val()==1){
                        $("#toggle_login").val(0);
                    }else{
                        $("#toggle_login").val(1);
                    }
                });
                scrollPanel($("#device"), "device");
                scrollPanel($("#graphic"), "graphic");
                 $.molmc.explore.pullUprefreshPage($("#explore"));
                $("#logout_about").bind("tap",function(){
                    var tpl = '<ul class="list" style="font-size:1.3em;"><li id="exitlogin"><i class="fa fa-user">'+ ' ' +  _lang("me_logout") + '</i></li><li id="exitapp" style="marging-top:10px;"><i class="fa fa-power-off">'+ ' ' + _lang("me_exit") + '</i></li></ul>';
                    var popup = $.ui.popup({
                        id:"popup_exit",
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
                    $("#popup_exit #exitlogin").bind("tap",function(){
                        $(document).trigger("applogout");
                        popup.hide();
                        that.Logout();
                        $.ui.loadContent("#login", false, false, "slide");
                    });
                    $("#popup_exit #exitapp").bind("tap",function(){
                        popup.hide();
                        that.Logout();
                        setTimeout(function(){
                            $.molmc.utils.exitApp();
                        },500);
                    });
                });
                $("#btn_submit").bind("tap",function(){
                    that.Feedback();
                });
                $("#btn_resetpassword").bind("tap",function(){
                    resetPassword();
                });
                $("#about").bind("loadpanel",function(){
                    $.molmc.device.isUtopicInDevPanel("none");
                    $("#account_about").html($.molmc.utils.getItem("account"));
                    $("#defaultHeader .backButton").hide();
                    var headUrl = $.molmc.utils.getItem($.molmc.utils.getItem("uid"));
                    console.log(headUrl);
                    if(headUrl != null){
                        console.log(headUrl);
                        $("#headimg").attr("src", headUrl);
                    }else{
                        $("#headimg").attr("src", "./img/user_placeholder.png");
                    }
                });
                $("#bind").bind("loadpanel",function(){
                    console.log("load bind");
                    $("#header_register h1").html(_lang("g_btn_bind"));
                    var headUrl = $.molmc.utils.getItem("headUrl");
                    if(headUrl != null){
                        $("#auth_head").attr("src", headUrl);
                    }
                });

                $("#bind").on("tap","#btn_bind", function(){
                    bindAccount();
                });

                $("#setting").bind("loadpanel",function(){
                    $("#defaultHeader .backButton").show();
                    $("#name_setting").html($.molmc.utils.getItem("name"));
                    $("#account_setting").html($.molmc.utils.getItem("account"));
                });
                $("#about_us").bind("loadpanel",function(){
                    $("#defaultHeader .backButton").show();
                    $("#about_us #appversion_about").html(_lang("me_version") + $.molmc.utils.appVersion)
                });
                $("#feedback").bind("loadpanel",function(){
                    $("#defaultHeader .backButton").show();
                    var placeholder = _lang("me_feedbackprompt");
                    $('textarea').val(placeholder);
                    $('textarea').addClass("fonthintcolor");
                    $('textarea').focus(function() {
                        if ($(this).val() == placeholder) {
                            $(this).val('');
                            $(this).removeClass("fonthintcolor");
                        }
                    });

                    $('textarea').blur(function() {
                        if ($(this).val() == '') {
                            $(this).val(placeholder);
                            $(this).addClass("fonthintcolor");
                        }
                    });

                });
                $("#about").on("tap", "#versioncheck_about", function(){
                    hideversionflag();
                    if(checkVersionCode($.molmc.utils.getItem("appVerInServer"), $.molmc.utils.appVersion)){
                        navigator.notification.confirm(
                            _lang("me_updateinfo"),
                            function(button){
                                if(button === 1){
                                    downloadFile();
                                }else if(button === 2){
                                }
                            },
                            _lang("me_updateprom"),
                            _lang("g_btn_yes") + "," + _lang("g_btn_no")
                        );
                    }else{
                        navigator.notification.alert(_lang("tips_app_latest"), "", _lang("tips_title_tips"), _lang("g_tips_confirm"));
                    }
                });
                $(".headerleft").bind("tap", function(){
                    $.ui.goBack();
                });
                $("#wechat_login").bind("tap", function(){
                    wechatLogin();
                });
                $("#qq_login").bind("tap", function(){
                    qqLogin();
                });
                //检查app版本
                checkVersion();
                navigator.splashscreen.hide();                 // hide splash screen
                var copySuccess = function(entry){
                    $.molmc.update.unzipWidgetsToData(entry.nativeURL);
                };
                $.molmc.update.initPath();    
                var widgetsZipPath = "file:///android_asset/www/js/molmc/widgets.zip";
                $.molmc.update.copyWidgetsZipToData(widgetsZipPath, copySuccess);
                $.molmc.update.langActionTrigger();
                $.molmc.api.initMap();
            }
        };
        document.addEventListener("deviceready", onDeviceReady, false);
    };

    var checkVersionCode = function(serVersion, localVersion) {
        var verInserver = serVersion.replace(/\./g, "");                    
        var verInLocal = localVersion.replace(/\./g, "");
        if(parseInt(verInserver) > parseInt(verInLocal)){
            return true;
        }else{
            return false;
        }
    };

    var initLogin = function(){
        $("#login").bind("loadpanel",function(){
            $.ui.clearHistory();
            if($.molmc.utils.getItem("autoLogin") === "true"){
                $("#toggle_login").attr("checked","checked");
                $("#toggle_login").prop("checked",true);
                $("#toggle_login").val(1);
            }else{
                $("#toggle_login").removeAttr("checked");
                $("#toggle_login").prop("checked",false);
                $("#toggle_login").val(0);
            }
            if(!_.isEmpty($.molmc.utils.getItem("account"))){
                $("#account_login").val($.molmc.utils.getItem("account"));
            }
        });

        if($.molmc.utils.getItem("autoLogin") == "true"){
            $("#toggle_login").attr("checked","checked");
            $("#toggle_login").prop("checked",true);
            $("#toggle_login").val(1);
            $.ui.loadContent("#device", false, false, "slide");
        }else{
            $("#toggle_login").removeAttr("checked");
            $("#toggle_login").prop("checked",false);
            $("#toggle_login").val(0);
        }

        if(!_.isEmpty($.molmc.utils.getItem("account"))){
            $("#account_login").val($.molmc.utils.getItem("account"));
        }
    };

    var changevldcode = function(el){
        var vldImgUrl = serverURL+"/v1/users?act=vldCodePrdc&type=image&_t=" + $.molmc.utils.getTimestamp();
        el.attr("src", vldImgUrl);
    };

    var checkRegphoneFormat = function(name, phone, zone, password){
        if(name.length===0 || phone.length===0 || password.length===0){
           navigator.notification.confirm(_lang("g_error_cannotempty"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
            return false;
        }
        if(password.length<6){
            navigator.notification.confirm(_lang("g_error_pwdatleast6"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
            return false;
        }
        if($.molmc.utils.checkPassword(password)<2){
            navigator.notification.confirm(_lang("g_error_pwdatleast2mode"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
            return false;
        }
        if(!$.molmc.utils.checkPhone(phone)){
            navigator.notification.confirm(_lang("g_error_phoneformat"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
            return false;
        }
        zone = zone.replace(/\+/, "");
        var checkSuc = function(){
            $.molmc.utils.setItem("phoneNum", phone);
            $.ui.loadContent("#vld_register_phone", false, false, "slide");
        };
        $.molmc.api.getPhoneVldCode(phone, "86", checkSuc);
    };

    var smsTimer;
    var countTime = function(seconds){
        if(seconds === undefined){
            seconds = 90;
        }
        $("#sec_count").html(seconds);
        $("#count_txt").html("秒后重新获取");
        $("#regetVld").attr("disabled", "disabled");
        smsTimer = setInterval(function(){
            seconds --;
            $("#sec_count").html(seconds);
            if(seconds === 0){
                $("#regetVld").removeAttr("disabled");
                $("#sec_count").html("");
                $("#count_txt").html("点击重新获取");
                clearInterval(smsTimer);
            }
        },1000);
    };
    var scrollPanel = function(el, panel){
        var myScroller;
        myScroller = el.scroller({
             verticalScroll:true,
             horizontalScroll:false,
             autoEnable:true}); //Fetch the scroller from cache

        myScroller.addPullToRefresh();
        myScroller.runCB=true;
        $.bind(myScroller, 'scrollend', function () {
        });
        $.bind(myScroller, 'scrollstart', function () {
            $.molmc.alwaysHideMask = true;
        });
        var hideClose;
        $.bind(myScroller, "refresh-release", function () {
            var that = this;
            if(panel == "device"){
                $.molmc.device.showDeviceList(true);
            }else if(panel == "graphic"){
                $.molmc.grapic.ShowRecipeList(true);
            }
            clearTimeout(hideClose);
            hideClose = setTimeout(function () {
                that.hideRefresh();
            }, 500);
            return false; //tells it to not auto-cancel the refresh
        });

        $.bind(myScroller, "refresh-cancel", function () {
            clearTimeout(hideClose);
        });
        myScroller.enable();
    };

    var checkVersion = function(){
        $.molmc.alwaysHideMask=true;
        var response = function(result){
            $.molmc.alwaysHideMask=false;
            if(result.significant === true && (result.app_version != $.molmc.utils.appVersion)){
                navigator.notification.confirm(
                    _lang("g_app_signigicant_update"),
                    function(button){
                        if(button === 1){
                            downloadFile();
                        }else if(button === 2){
                            initLogin();
                            if(result.app_version != $.molmc.utils.appVersion){
                                showversionflag();
                            }else{
                                hideversionflag();
                            }
                            $.molmc.utils.setItem("appVerInServer", result.app_version);
                        }
                    },
                    _lang("me_updateprom"),
                    _lang("g_btn_yes") + "," + _lang("g_btn_no")
                );
                return;
            }
            initLogin();
            if(checkVersionCode(result.app_version, $.molmc.utils.appVersion)){
                showversionflag();
            }else{
                hideversionflag();
            }
            $.molmc.utils.setItem("appVerInServer", result.app_version);
        };
        if($.molmc.utils.checkNetwork){
            $.molmc.api.checkVersion(response);
        }
    };

    var resetPassword = function(){
        var oldPwd = $("#old_resetpassword").val();
        var newPwd1 = $("#newpw_resetpassword").val();
        var newPwd2 = $("#repw_resetpassword").val();
        if(oldPwd.length===0 || newPwd1.length===0 || newPwd2.length===0){
            navigator.notification.confirm(_lang("g_error_cannotempty"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
            return false;
        }
        if(oldPwd===newPwd2){
            navigator.notification.confirm(_lang("g_error_oldpwdeqnew"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
            return false;
        }
        if(newPwd1!==newPwd2){
            navigator.notification.confirm(_lang("g_error_2pwdnotsame"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
            return false;
        }
        var response = function(result){
            $("#old_resetpassword").val("");
            $("#newpw_resetpassword").val("");
            $("#repw_resetpassword").val("");
            navigator.notification.confirm(_lang("g_newpwd_succ"),function(){
                $(document).trigger("applogout");
                $.molmc.app.Logout();
                $.ui.loadContent("#login", false, false, "slide");
            },_lang("tips_title_tips"),_lang("g_tips_confirm"));
        };
        var payload = {
            "account":$.molmc.utils.getItem("account"),
            "cur_password":oldPwd,
            "new_password":newPwd1
        };
        $.molmc.api.newPwd(payload, response);
    }

    var showversionflag = function(){
        $("#newVersionFlag").css("display","inline-block");
        $("#newVersionFlag_footer").show();
    }

    var hideversionflag = function(){
        $("#newVersionFlag").css("display","none");
        $("#newVersionFlag_footer").hide();
    }

    var downloadFile = function(){
        var fileTransfer = new FileTransfer();
        var uri = serverURL + "/downloads/apps/IntoRobot.apk";
        var filePath = "/sdcard/IntoRobot/"+ uri.substr(uri.lastIndexOf('/')+1);
        navigator.StatusBarNotification.notify(_lang("me_downprompt"),_lang("me_downloading"),Flag.FLAG_AUTO_CANCEL);
        fileTransfer.download(
            uri,
            filePath,
            function(entry) {
                navigator.StatusBarNotification.clear();
                navigator.notification.beep(1);
                navigator.StatusBarNotification.notify(_lang("me_downprompt"),_lang("me_downloaded"),Flag.FLAG_AUTO_CANCEL, true);
            },
            function(error) {
                navigator.StatusBarNotification.notify(_lang("me_downprompt"),_lang("me_downfail"),Flag.FLAG_AUTO_CANCEL);
                navigator.notification.confirm(_lang("explore_downloadfailed"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
            },
            false,
            {
                headers: {
                    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                }
            }
        );
    };

    var wechatLogin = function(){
        console.log("wechat login");
        var installed = function(installed){
            console.log("wechat installed");
            var scope = "snsapi_userinfo";
            var state = "intorobot_wechat";
            var onSuccess = function(result){
                console.log(result);
                var stateSuccess = function(resp){
                    console.log(resp);
                    checkAccountWechat(result.code, resp.state);
                };
                $.molmc.api.getAuthState(stateSuccess);
            };
            var onErr = function(err){
                console.log(err);
            };
            Wechat.auth(scope, state, onSuccess, onErr);
        };
        var error = function(err){
            navigator.notification.confirm(_lang("wechat_not_install"), function(){}, _lang("tips_title_tips"), _lang("g_tips_confirm"));
        };
        Wechat.isInstalled(installed, error);
    };

    var checkAccountWechat = function(code, state){
        var loginFunc = function(result){
            console.log(result);
            loginSuccess(result);
            $.molmc.utils.setItem("nickName", result.name);
            $.molmc.utils.setItem(result.uid, result.imgurl);
            $.molmc.utils.setItem("autoLogin", true);
            $.molmc.utils.setItem("loginType", "wechat");
            $.ui.loadContent("#device", false, false, "slide");
        };
        var registerFunc = function(data){
            console.log(data);
            $.molmc.utils.setItem("nickName", data.name);
            $.molmc.utils.setItem("headUrl", data.imgurl);
            $.molmc.utils.setItem("loginType", "wechat");
            $.ui.loadContent("#bind", false, false, "slide");
        };
        $.molmc.api.authCodeToAccessToken(code, state, loginFunc, registerFunc);
    };

    var qqLogin = function(){
        YCQQ.checkClientInstalled(function () {
            console.log('client is installed');
            var checkClientIsInstalled = 0;//default is 0,only for iOS
            YCQQ.ssoLogin(function (loginRes) {
                console.log(loginRes);
                var APPID_QQ = "1104708258";
                $.molmc.api.getQQAuthInfo(APPID_QQ, loginRes.access_token, loginRes.userid, function(result){
                    checkAccount(loginRes.userid, result);
                    $.molmc.utils.setItem("openid", loginRes.userid);
                    $.molmc.utils.setItem("nickName", result.nickname);
                    $.molmc.utils.setItem("headUrl", result.figureurl_qq_2);
                    $.molmc.utils.setItem("loginType", "qq");
                });
                // YCQQ.getUserInfo(function(result){
                //     console.log(result);
                //     checkAccount(loginRes.userid, result);
                //     $.molmc.utils.setItem("openid", loginRes.userid);
                //     $.molmc.utils.setItem("nickName", result.nickname);
                //     $.molmc.utils.setItem("headUrl", result.figureurl_qq_2);
                //     $.molmc.utils.setItem("loginType", "qq");
                // }, function(err){
                //     console.log(err);
                // });
            }, function (failReason) {
                console.log(failReason);
            }, checkClientIsInstalled);
        }, function () {
          // if installed QQ Client version is not supported sso,also will get this error
            navigator.notification.confirm(_lang("qq_not_install"), function(){}, _lang("tips_title_tips"), _lang("g_tips_confirm"));
        });
    };

    var checkAccount = function(openid, userInfo){
        var payload = {"openid": openid};
        var loginFunc = function(result){
            console.log(result);
            loginSuccess(result);
            if($.molmc.utils.getItem("headUrl") !== "null" & $.molmc.utils.getItem("headUrl") !== undefined){
                $.molmc.utils.setItem(result.uid, $.molmc.utils.getItem("headUrl"));
            }
            $.molmc.utils.setItem("autoLogin", true);
            $.ui.loadContent("#device", false, false, "slide");
        };
        var registerFunc = function(data){
            console.log(data);
            $.ui.loadContent("#bind", false, false, "slide");
        };
        $.molmc.api.authSearch(payload, loginFunc, registerFunc);
    };

    var bindAccount = function(){
        var name =$.molmc.utils.getItem("nickName");
        var account = $("#email_bind").val();
        var password = $("#pwd_bind").val();

        if(account.length===0 || password.length===0){
           navigator.notification.confirm(_lang("g_error_cannotempty"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
            return false;
        }
        if(password.length<6){
            navigator.notification.confirm(_lang("g_error_pwdatleast6"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
            return false;
        }

        if(!$.molmc.utils.checkEmail(account) && !$.molmc.utils.checkPhone(account)){
            navigator.notification.confirm(_lang("g_error_emailphoneformat"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
            return false;
        }

        if($.molmc.utils.getItem("loginType") === "wechat"){
            var payload = {
                "bind": true,
                "account": account,
                "name":name,
                "password":password
            };
        }else{
            var payload = {
                "bind": true,
                "openid":$.molmc.utils.getItem("openid"),
                "account": account,
                "name":name,
                "password":password
            };
        }
        var regSuccess = function(result){
            loginSuccess(result);
            if($.molmc.utils.getItem("headUrl") !== "null" && $.molmc.utils.getItem("headUrl") !== undefined){
                $.molmc.utils.setItem(result.uid, $.molmc.utils.getItem("headUrl"));
            }
            $.molmc.utils.setItem("autoLogin", true);
            $.molmc.utils.setItem("account", account);
            $.ui.loadContent("#device", false, false, "slide");
        };
        var failedCallback = function(code) {
            if (code === 605) {
                navigator.notification.confirm(
                    _lang("bind_nouser_content"),
                    function(button){
                        if(button === 1){
                            $.ui.loadContent("#register", false, false, "slide");
                        }else if(button === 2){
                        }
                    }, 
                    _lang("g_tips_error"),
                    _lang("g_btn_confirm") + "," + _lang("g_btn_cancel")
                );
            }else if (code === 606) {
                navigator.notification.confirm(_lang("bind_unactived_content"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
            };
        };
        $.molmc.api.authBind(payload, regSuccess, failedCallback);
    };

    var loginSuccess = function(result){
        $.molmc.utils.setItem("uid", result.uid);
        $.molmc.utils.setItem("account", result.account);
        $.molmc.utils.setItem("u_topic", result.u_topic);
        $.molmc.utils.setItem("name",result.name);
    };

    APP.prototype = {
        Login:function(remember){
            var account = $("#account_login").val();
            var pwd = $("#pwd_login").val();
            if(account.length===0||pwd.length===0){
                navigator.notification.confirm(_lang("g_error_cannotempty"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
                return false;
            }
            var payload = {
                "account": account,
                "password": pwd,
                "keepstay": true
            };
            var response = function(result){
                loginSuccess(result);
                // if($("#toggle_login").val()==1){
                    $.molmc.utils.setItem("autoLogin", true);
                // }
                // else{
                //     $.molmc.utils.setItem("autoLogin", false);
                // }
                $("#pwd_login").val("");
                $.ui.loadContent("#device", false, false, "slide");
            };
            if($.molmc.utils.checkEmail(account) || $.molmc.utils.checkPhone(account)){
                $.molmc.api.login(payload, response);
            }else{
                navigator.notification.confirm(_lang("g_error_emailphoneformat"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
            }
        },
        Register:function(name, email, passwd, vldcode, type, zone){
            if(name.length===0 || email.length===0 || passwd.length===0 || vldcode.length===0){
               navigator.notification.confirm(_lang("g_error_cannotempty"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
                return false;
            }            
            if(passwd.length<6){
                navigator.notification.confirm(_lang("g_error_pwdatleast6"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
                return false;
            }
            if($.molmc.utils.checkPassword(passwd)<2){
                navigator.notification.confirm(_lang("g_error_pwdatleast2mode"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
                return false;
            }
            if(!$.molmc.utils.checkEmail(email) && !$.molmc.utils.checkPhone(email)){
                navigator.notification.confirm(_lang("g_error_emailformat"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
                return false;
            }
            if (type == "email") {
                var payload = {
                    "name":name,
                    "account":email,
                    "password":passwd,
                    "vldCode":vldcode
                };
            }else if (type == "phone") {
                if (zone===undefined) {
                    navigator.notification.confirm(_lang("g_error_cannotempty"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
                    return false;
                };
                var mZone = zone.replace(/\+/, "");
                var payload = {
                    "name":name,
                    "account":email,
                    "password":passwd,
                    "vldCode":vldcode,
                    "zone":mZone
                };
            };
            
            var registresponse = function(){
                if ($.molmc.utils.checkPhone(email)) {
                    var tips = _lang("g_succ_phone_register");                    
                    $("#name_regphone").val("");
                    $("#phone_regphone").val("");
                    $("#pwd_regphone").val("");
                    $("#vldcode_regphone").val("");
                    $("#vldcodephone_regphone").val("");
                    $("#targetPhone").val("");                    
                }else{
                    var tips = _lang("g_succ_register");
                    $("#name_register").val("");
                    $("#email_register").val("");
                    $("#pwd_register").val("");
                    $("#vldcode_register").val("");
                };
                navigator.notification.confirm(tips, function(){
                    $.ui.loadContent("#login", false, false, "slide");
                }, _lang("g_tips_success"), _lang("g_tips_confirm"));
                
            };
            var checkresponse = function(){
                $.molmc.api.register(payload,registresponse);
            };
            $.molmc.api.checkVerifyCode(vldcode, checkresponse);
        },
        ChangevldCode:function(){
            changevldcode();
        },
        Forgetpw:function(){
            var account = $("#account_forgetpw").val();
            var payload = {
                "account": account
            };
            var respemail = function(result){
                $.molmc.utils.showToast(_lang("g_tip_getvldcode"),250,3000);
                $.ui.loadContent("#resetpw", false, false, "slide");
            };
            var respPhone = function(result){
                $.molmc.utils.showToast(_lang("g_tip_getphonevldcode"),250,3000);
                $.ui.loadContent("#resetpw", false, false, "slide");
            };
            if($.molmc.utils.checkEmail(account) || $.molmc.utils.checkPhone(account)){
                if($.molmc.utils.checkEmail(account)){
                    $.molmc.api.forgetpw(payload, respemail);
                }else{
                    $.molmc.api.forgetpw(payload, respPhone);
                }
            }else{
                navigator.notification.confirm(_lang("g_error_emailphoneformat"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
            }
        },
        Resetpw:function(){
            var vldcode = $("#verify").val();
            var pwd = $("#newpw_resetpw").val();
            var repwd = $("#repw_resetpw").val();
            if(vldcode.length===0 || pwd.length===0 || repwd.length===0){
                navigator.notification.confirm(_lang("g_error_cannotempty"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
                return false;
            }
            if(pwd!==repwd){
                navigator.notification.confirm(_lang("g_error_2pwdnotsame"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
                return false;
            }
            var payload = {
                "vldCode": vldcode,
                "password":pwd
            };
            var response = function(result){
                $.molmc.utils.showToast(_lang("g_succ_resetpw"),250,3000);
                $.ui.loadContent("#login", false, false, "slide");
            };
            $.molmc.api.resetpw(payload, response);
        },
        Feedback:function(){
            var text_feedback=$("#text_feedback").val();
            var payload={
                "content":text_feedback
            }
            var response = function(){
                navigator.notification.confirm(_lang("g_succ_feedback_thanks"), function(){}, _lang("g_tips_success"), _lang("g_tips_confirm"));
                $.ui.goBack();
            }
            if(text_feedback.length===0){
                navigator.notification.confirm(_lang("g_error_cannotempty"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
            }else{
                $.molmc.api.feedback(response,payload);
            }
        },
        Logout:function(){
            $.molmc.utils.setItem("autoLogin", false);
            $("#defaultHeader .backButton").show();
            if($.molmc.utils.getItem("loginType") == "qq"){
                var sucCall = function(result){
                    console.log(result);
                };
                var errCall = function(err){
                    console.log(err);
                }
                YCQQ.logout(sucCall, errCall);
            }
            $.molmc.api.logout();
        }
    };
    $.molmc.app = new APP();
})(af);
