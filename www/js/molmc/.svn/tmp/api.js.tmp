(function($) {
    "use strict";
    var API = function(){
        
    };
    var showAlert = function(err){
        console.log("err: " + err);
    };
    var httpRequest = function(type, url, payload, suc_callback, sync){
        
        if(sync == undefined){
            sync = true;
        }
        if(payload){
            payload=JSON.stringify(payload)
        }
        if($.molmc.utils.checkNetwork()){
            if(!$.molmc.alwaysHideMask){
                $.ui.showMask(_lang("device_loading"));        
            }
            $.ajax({
                type: type,
                url: url,
                data: payload,
                dataType: "json",
                timeout: 5000,
                contentType:"application/json",
                success: function(result){
                    $.ui.hideMask();
                    if($.isFunction(suc_callback)){
                        suc_callback(result);
                    }
                },
                error: function(result){
                    $.ui.hideMask();
                    $.molmc.utils.showToast(_lang("g_error_connecterrretry"),200,2000);
                },
                async: sync
            });
        }
    };
    var apiType = {
        Login: 1,
        Register : 2,
        GetDevices : 3,
        ResetPw :4,
        CheckVldCode:5,
        pubDevice:6,
        pubtoken:7
    };
    
    var showerrconf=function(str){
        navigator.notification.confirm(str, showAlert, _lang("g_tips_error"), _lang("g_tips_confirm"));
    };
    
    var responseErr = function(code, apitype){
        switch(code){
            case 400:{
                if(apitype===apiType.ResetPw||apitype===apiType.CheckVldCode){
                    showerrconf(_lang("g_error_vldcode"));
                }
                else{
                    showerrconf(_lang("g_error_dataretry"));
                }
                break;
            }
            case 401:{
                if ($.molmc.utils.getItem("autoLogin")==true) {
                    $.ui.loadContent("#login", false, false, "slide");                    
                };
                $.molmc.utils.setItem("autoLogin", false);
                break;
            }
            case 403:{                
                showerrconf(_lang("g_error_data"));
                break;
            }
            case 404:{
                if(apitype===apiType.CheckVldCode){
                    showerrconf(_lang("g_error_vldcode_timeout"));
                }else if(apitype===apiType.pubDevice){
                    showerrconf(_lang("device_cancleshared"));
                }else if(apitype===apiType.pubtoken){
                    
                }else{
                    showerrconf(_lang("g_error_datanoexist"));
                }
                break;
            }
            case 405:{
                showerrconf(_lang("g_error_namelength"));
                break;
            }
            case 407:{
                showerrconf(_lang("g_error_on_openid"));
                break;
            }
            case 500:{
                showerrconf(_lang("g_error_sys"));
                break;
            }
            case 503:{  
                showerrconf(_lang("g_error_link"));
                break;
            }
            case 504:{
                showerrconf(_lang("g_error_uploadfile"));
                break;
            }
            case 520:{
                showerrconf(_lang("g_error_msgveri"));
                break;
            }
            case 601:{
                if(apitype===apiType.Register){
                    showerrconf(_lang("g_error_regied"));
                }
                else{
                    showerrconf(_lang("g_error_regied"));
                }
                break;
            }
            case 602:{
                if(apitype===apiType.Register){
                    showerrconf(_lang("g_error_emailed"));
                }
                else{
                    showerrconf(_lang("g_error_emailed"));
                }
                break;
            }
            case 603:{
                showerrconf(_lang("g_error_activexpir"));
                break;
            }
            case 604:{
                showerrconf(_lang("g_error_accountpwd"));
                break;
            }
            case 605:{
                showerrconf(_lang("g_error_accountreg"));       
                break;
            }
            case 606:{
                if(apitype===apiType.Login){
                    showerrconf(_lang("g_error_accountactiv"));
                }
                else{
                    showerrconf(_lang("g_error_accountactiv"));
                }
                break;
            }
            case 607:{
                showerrconf(_lang("g_error_bind"));
                break;
            }
            case 608:{
                showerrconf(_lang("g_error_activecode"));
                break;
            }
            case 701:{
                showerrconf(_lang("g_error_accetoken"));
                break;
            }
            case 702:{
                showerrconf(_lang("g_error_userinfo"));
                break;
            }
            case 705:{
                showerrconf(_lang("g_error_device_over"));
                break;
            }
            default: {
                break;
            }
        };
    };
    
    API.prototype = {
        /*
        账号登录
        * @param payload
        * @param nextFunc
        */
        login:function(payload, nextFunc){
            var url = serverURL + "/v1/users?act=login";
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code, apiType.Login);
                }
            };
            httpRequest("POST", url, payload, suc_call);
        },
        /*
        授权登录openid查询
        * @param payload
        * @param loginFunc
        * @param registerFunc
        */
        authSearch:function(payload, loginFunc, registerFunc){
            var url = serverURL + "/v1/users?act=search";
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(loginFunc)){
                        loginFunc(result.data);
                    }
                }else if(code === 605){
                    if($.isFunction(registerFunc)){
                        registerFunc(result.data);
                    }
                }else{
                    responseErr(code, apiType.Login);
                }
            };
            httpRequest("POST", url, payload, suc_call);
        },
        /*
        第三方授权登录帐号绑定
        * @param payload
        * @param nextFunc
        */
        authBind:function(payload, nextFunc, failedCallback){
            var url = serverURL + "/v1/users?act=bind";
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    if (failedCallback!==undefined && (code === 606 || code ===605)) {
                        failedCallback(code);
                    }else{
                        responseErr(code, apiType.Login);
                    }
                }
            };
            httpRequest("POST", url, payload, suc_call);
        },
        /*
        第三方授权登录从服务器上获取状态码
        * @param nextFunc
        */
        getAuthState:function(nextFunc){
            var url = serverURL + "/v1/users?act=stateCodePrdc";
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data); 
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("GET", url, null, suc_call);
        },
        /*
        第三方授权登录用code换取accesstoken
        * @param nextFunc
        */
        authCodeToAccessToken:function(authCode, state, loginFunc, registerFunc){
            var url = serverURL + "/v1/users?act=oauth&client=wechat_mobile&code=" + authCode +"&state="+ state;
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(loginFunc)){
                        loginFunc(result.data);
                    }
                }else if(code == 605){
                    if($.isFunction(registerFunc)){
                        registerFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("GET", url, null, suc_call);
        },
         /*
        第三方授权登录从腾讯开放平台获取QQ用户信息
        * @param aappid
        * @param accessToken
        * @param openId
        * @param nextFunc
        */
        getQQAuthInfo:function(appid, accessToken, openId, nextFunc){
            var url = "https://graph.qq.com/user/get_user_info?oauth_consumer_key="+appid+"&access_token="+accessToken+"&openid="+openId;
            var suc_call = function(result){
                if(result !== undefined){
                    if($.isFunction(nextFunc)){
                        nextFunc(result);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("GET", url, null, suc_call);
        },
        /*
        注册账号
        * @param payload
        * @param nextFunc
        */
        register:function(payload, nextFunc){
            var url = serverURL + "/v1/users?act=register";
            var suc_call = function(result){
                var code = result.code;
                if(code === 201){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code, apiType.Register);
                    $.molmc.app.ChangevldCode();
                }
            };
            httpRequest("POST", url, payload, suc_call);
        },
        /*
        忘记密码
        * @param payload
        * @param nextFunc
        */
        forgetpw:function(payload, nextFunc){
            var url = serverURL + "/v1/users?act=forgetpw";
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("POST", url, payload, suc_call);
        },
         /*
        找回密码
        * @param payload
        * @param nextFunc
        */
        resetpw:function(payload, nextFunc){
            var url = serverURL + "/v1/users?act=resetpw";
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }
                else{  
                    responseErr(code,apiType.ResetPw);
                }
            };
            httpRequest("POST", url, payload, suc_call);
        },
        
         /*
         重置新密码
        * @param payload
        * @param nextFunc
        */
        newPwd:function(payload, nextFunc){
            var url = serverURL + "/v1/users?act=newpw";
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }
                else{  
                    responseErr(code,apiType.ResetPw);
                }
            };
            httpRequest("POST", url, payload, suc_call);
        },
        /*
        获取手机短信验证码
        * @param phone
        * @param nextFunc
        */
        getPhoneVldCode:function(phone, zone, nextFunc){
            var url = serverURL + "/v1/users?act=vldCodePrdc&type=sms&phone=" + phone + "&zone=" + zone + "&t=" + $.molmc.utils.getTimestamp();
            var suc_call = function(result){
                var code = result.code;
                if(code === 200 || code === 201){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data); 
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("GET", url, null, suc_call);
        },        
        /*
        检测验证码
        * @param vldcode
        * @param nextFunc
        */
        checkVerifyCode:function(vldcode, nextFunc){             
            var url = serverURL + "/v1/users?act=vldCodeVrfy&vldCode=" + vldcode;
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data); 
                    }
                }else{
                    responseErr(code,apiType.CheckVldCode);
//                   navigator.notification.confirm(_lang("g_error_vldcode"), function(){}, _lang("g_tips_error"), _lang("g_tips_confirm"));
                }
            };
            httpRequest("GET", url, null, suc_call);
        }, 
        /*
         * 意见反馈
         */
        feedback:function(nextFunc,payload){
            var url = serverURL + "/v1/users?act=feedback&type=device";          
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("POST", url, payload, suc_call);
        },
        /*
         *检查app版本
         */
        checkVersion:function(nextFunc){
            if(device.platform.toLowerCase() !== "android"){
                return;
            }
            var url = serverURL + "/v1/resources?act=update&type=" + device.platform.toLowerCase();
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("GET", url, null, suc_call);
        },
        /*
         * 退出登录
         */
        logout:function(nextFunc){
            var url = serverURL + "/v1/users?act=logout";          
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("GET", url, null, suc_call);
        },

        /*
         *创建一个设备
         */
        createDevice:function(payload, nextFunc, failedCallback){
            var url = serverURL + "/v1/devices";
            var suc_call = function(result){
                var code = result.code;
                if(code === 201){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    if ($.isFunction(failedCallback)&&code!==401) {
                        failedCallback(code);
                    }else{
                        responseErr(code);
                    }
                }
            };
            httpRequest("POST", url, payload, suc_call);

        },
        /*
        获取设备列表
        * @param nextFunc
        */
        getDevices:function(nextFunc){
            var url = serverURL + "/v1/devices?uid=" + $.molmc.utils.getItem("uid");
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code, apiType.GetDevices);
                }
            };            
            httpRequest("GET", url, null, suc_call);
        },
        /*
        获取单个设备信息
        * @param devid
        * @param nextFunc
        */
        getDeviceInfo:function(devid, nextFunc){
            var url = serverURL + "/v1/devices/" + devid;
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };            
            httpRequest("GET", url, null, suc_call);
        },
        /*
         * 更新设备信息  
         */
        updateDeviceInfo:function(devId, payload, nextFunc){
           var url = serverURL + "/v1/devices/" + devId;
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("PUT", url, payload, suc_call);   
        },
        /*
         *获取参考设备列表
         */
        getDemoDevList:function(nextFunc){
            var url = serverURL + "/v1/devices?act=search&type=demo";
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };            
            httpRequest("GET", url, null, suc_call);
        },
        /*
         *修改repaint一个参考设备到我的一个设备中
         */
        repaintDemoDev:function(devid, demodevid, nextFunc){
            var url = serverURL + "/v1/devices/"+devid+"?act=repaint&ref_id="+demodevid;
            var suc_call = function(result){
                var code = result.code;
                if(code === 200 || code === 201){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };            
            httpRequest("GET", url, null, suc_call);
        },
        /*
         *复制一个示例工程
         */
        forkDemoApp:function(appid, nextFunc){
            var url = serverURL + "/v1/demos/"+appid+"?act=fork";
            var suc_call = function(result){
                var code = result.code;
                if(code === 200 || code === 201){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };            
            httpRequest("GET", url, null, suc_call);
        },
        /*
         *编译app
         */
        compileApp:function(appid, nextFunc){
            var url = serverURL + "/v1/bins?type=app&act=flash&id="+appid;
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };            
            httpRequest("POST", url, null, suc_call);
        },
        /*
        搜索热门设备
        * @param nextFunc
        */
        searchHotDevices:function(nextFunc){
            var url = serverURL + "/v1/devices?act=search&type=hotspot";
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("GET", url, null, suc_call);
        },
         /*
        搜索收藏设备
        * @param nextFunc
        */
        searchCollectDevices:function(nextFunc){
            var url = serverURL + "/v1/favorites";
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("GET", url, null, suc_call,false);
        },
         /*
        删除收藏设备
        * @param dev_id
        * @param nextFunc
        */
        deleteCollectDevice:function(dev_id,nextFunc){
            var url = serverURL + "/v1/favorites/"+dev_id;
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("DELETE", url, null, suc_call);
        },
         /*
        删除设备
        * @param dev_id
        * @param nextFunc
        */
        deleteDevice:function(dev_id,nextFunc){
            var url = serverURL + "/v1/devices/"+dev_id;
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("DELETE", url, null, suc_call);
        },
        /*
        搜索公共设备
        * @param nextFunc
        * @param queryStr
        */
        searchPubDevices:function(nextFunc, queryStr, page, size){            
            if(page === undefined){
                page = 1;
            }
            if(size === undefined){
                size = 20;
            }
            var url;
            if(queryStr === undefined){
                url = serverURL + "/v1/devices?act=search&type=public&page=1";
            }else{
                queryStr = encodeURI(queryStr)
                
                url = serverURL + "/v1/devices?act=search&type=public&page="+page+"&size="+size;
                if(queryStr!==""){
                    url+="&"+queryStr;
                }
            }
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("GET", url, null, suc_call);
        },
        /*
        搜索单个公共设备的信息
        * @param nextFunc
        */
        getPubDevice:function(nextFunc, devId, onerror){
            var url = serverURL + "/v1/devices?act=search&type=public&device_id=" + devId;          
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
//                    responseErr(code,apiType.pubDevice);
                    if($.isFunction(onerror)){
                        onerror();
                    }
                }
            };
            httpRequest("GET", url, null, suc_call);
        },
        /*
        收藏单个设备
        * @param nextFunc
        */
        collectDevice:function(payload,nextFunc){
            var url = serverURL + "/v1/favorites";          
            var suc_call = function(result){
                var code = result.code;
                if(code === 200||code === 201){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("POST", url, payload, suc_call);
        },
        /*
         * 获取tokens
         */
        getTokens:function(nextFunc){
            var url = serverURL + "/v1/tokens?uid=" + $.molmc.utils.getItem("uid");   
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("GET", url, null, suc_call, false);
        },
        /*
         * 获取我的设备token
         */
        getDeviceToken:function(nextFunc, devId){
            var url = serverURL + "/v1/tokens?device_id=" + devId;         
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("GET", url, null, suc_call);
        },
        /*
         * 获取公共设备token
         */
        getPubDevToken:function(nextFunc, devId){
            var url = serverURL + "/v1/tokens?act=search&type=public&device_id=" + devId;         
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code,apiType.pubtoken);
                }
            };
            httpRequest("GET", url, null, suc_call, false);
        },
        /*
         *创建一个公共token
         */
        createDevToken:function(payload, nextFunc){
            var url = serverURL + "/v1/tokens?type=public";         
            var suc_call = function(result){
                var code = result.code;
                if(code === 201){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("POST", url, payload, suc_call);
        },
        /*
         * 更新设备公共token
         */
        updateDevToken:function(payload, nextFunc){
            var url = serverURL + "/v1/tokens/"+payload._id+"?type=public";         
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("PUT", url, payload, suc_call);
        },
        /*
         * 删除设备公共token
         */
        deleteDevToken:function(tokenId, nextFunc){
            var url = serverURL + "/v1/tokens/"+tokenId+"?type=public";         
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("DELETE", url, payload, suc_call);
        },
        /*
         * 获取recipe信息
         */
        getRecipes:function(nextFunc){
            var url = serverURL + "/v1/recipes";          
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("GET", url, null, suc_call);
        },
        /*
         * 获取schedule信息
         */
        getSchedules:function(nextFunc){
            var url = serverURL + "/v1/schedules";          
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("GET", url, null, suc_call);
        },
        /*
         * 创建recipe
         */
        createRecipe:function(payload, nextFunc){
            var url = serverURL + "/v1/recipes";
            var suc_call = function(result){
                var code = result.code;
                if(code === 201){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("POST", url, payload, suc_call);
        },
        /*
         * 创建schedule
         */
        createSchedule:function(payload, nextFunc){
            var url = serverURL + "/v1/schedules";
            var suc_call = function(result){
                var code = result.code;
                if(code === 201){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("POST", url, payload, suc_call);
        },
        /*
         * 更新 recipe
         */
        updateRecipe:function(payload, nextFunc){
            var url = serverURL + "/v1/recipes/" + payload._id;
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("PUT", url, payload, suc_call);
        },
        /*
         * 更新 schedule
         */
        updateSchedule:function(payload, nextFunc){
            var url = serverURL + "/v1/schedules/" + payload._id;
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc(result.data);
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("PUT", url, payload, suc_call);
        },
        /*
         * 删除 recipe
         */
        deleteRecipe:function(id, nextFunc){
            var url = serverURL + "/v1/recipes/" + id;
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc();
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("DELETE", url, null, suc_call);
        },
        /*
         * 删除 schedule
         */
        deleteSchedule:function(id, nextFunc){
            var url = serverURL + "/v1/schedules/" + id;
            var suc_call = function(result){
                var code = result.code;
                if(code === 200){
                    if($.isFunction(nextFunc)){
                        nextFunc();
                    }
                }else{
                    responseErr(code);
                }
            };
            httpRequest("DELETE", url, null, suc_call);
        },
        initMap:function(){
            $.molmc.position = {
                localCountry : 'China',
                city : '北京市',
                lat : 39.90923,
                lng : 116.397428
            };
            var url = serverURL + '/v1/resources?act=geoip';
            httpRequest("GET", url, null, function(result) {
                console.log(result);
                $.molmc.position = {};
                if(result.code == 200 ) {
                  $.molmc.position = {
                    localCountry : result.data.country || 'China',
                    city : result.data.city || '北京市',
                    lat : parseFloat(result.data.latitude) || 39.90923,
                    lng : parseFloat(result.data.longitude) || 116.397428
                  };
                }else{
                  $.molmc.localCountry = '';
                  $.molmc.position = {
                    localCountry : 'China',
                    city : '北京市',
                    lat : 39.90923,
                    lng : 116.397428
                  };
                }
                if($.molmc.position.localCountry.toLowerCase() == 'china'){
                    require(["http://webapi.amap.com/maps?v=1.3&key=e79fe1ecb0923cd5e4a4945955a4536e"], function() {});
                }else{
                    // require(["vendor/map/initMap"], function() {});
                    // $("#goToRegister").attr("href", "#register");
                    // $("#goToPhoneReg").hide();
                }
            });
            

        }
    };
    $.molmc.api = new API();
})(af);
