define(["tpl!./template/layout.tpl",
    "css!./css/style_19"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    
    var temperature;
    var humidity;
    var rollover;
    var button;
    var ventilator;
    var heater;
    var ventilatorSW;
    var heaterSW;
    var imageData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAAUCAYAAADIpHLKAAACOUlEQVRoQ+1bXU/DMAz02FgLEvD//+VWXpquBXxJ3Dr9GGPaG8dUua4dF0U+XR0nu2/9kxBEzmeJsm1FmibJriv1Nbsf5+Pg3uL4cQcRedYL8jVL6C/u+Vz3fvNx0G0sxtUuzlHvce31esr3kKbD3+vwNR1xzQ8Svl73dj9OxzeYxl6nb9BpxTSqhB5UwgYZsu7tjU63PQ8X9cX03xBHhkod3yXKXq/woVL/qUEnAzLq+hz2AL/8HLJ9y3q2X4vTpTgHGXRa2yj30kdZLfQw2msJox/8K+lUv+Rxk99WnEHj9/rr9If7NT3oO8wGeU1HHMQzf69j3Jf+7H27ESA+mX3SAySn0wSWNTDh2Rw85mcgM93A8RcQWNJjzBoIPCjmYILtAUkf33sjmDwIPFiQ7PeCYB7nM4MQYIvJH5M3g+KOpF8F10YcJHkdkzyBI+klCJI9geCoti0w/Rancol/b9IDCFsgMDB5UAAc0PG+CSBkkMQ2DwATGQSMQgaZPr/IIMXnFxnEGIYMUtYurEEiA5FByCBlzUEGIYOwBtHlGK5irdcoXMXiKta45MtVrOWS8WxJmDUIa5CpT8I+SLn6xRpk0d9gH4Q1CGsQ1iCsQdhJZyc9FeLspC8+m9hJn7azsJPOvVhprxj3YpV7urgXK39GkUHIIFc2MpJByCBkkLVdwWQQMsgjtsazD8I+CPsgPA/C8yDjoSmeB0nnUHgeJB66Yg3CGoQ1CGuQeMiKJwpvPEZLBvmffZAfcCDlAMU31bUAAAAASUVORK5CYII=";

    var color;
    var colordata;
    var selectedColor;
    var curjsonobj;
    var getEl = function(){
        temperature = $('#widget19 #temperature');
        humidity = $('#widget19 #humidity');
        rollover = $('#widget19 #rollover');
        button = $('#widget19 button');
        ventilator = $('#widget19 #ventilator');
        heater = $('#widget19 #heater');
        ventilatorSW = $('#widget19 #ventilatorSW');
        heaterSW = $('#widget19 #heaterSW');
        ledBrightBar = $('#widget19 #lightbar-bright');
        ledBrightTxt = $('#widget19 #bright_txt');
        ledColorBar = $('#widget19 #lightbar-color');
        ledColorTxt = $('#widget19 #color_txt');
        selectedColor = {red:0,green:0,blue:0};
        var img = new Image;
        img.src = imageData;
        img.onload = function(){
            var canvas = document.createElement("canvas")
            var ctxt = canvas.getContext('2d');
            ctxt.drawImage(img, 0, 0);
            colordata = ctxt.getImageData(0, 0, img.width, 1).data;
            ledColorBar.css({"background-image": "url("+imageData+")","background-repeat":"no-repeat","background-size":"cover"});
            initAction();
        }
    };
    
    var initAction = function(){
        ledBrightBar.molmcSlider({
            min:'0',
            max:'100',
            autoTemplate:true,
        });
        ledColorBar.bind("input", function(e){
            $("button.active", this.$el).removeClass("active");
            /* Act on the event */
            var color_offset = parseInt(ledColorBar.val()/100*200);
            if(color_offset>199) color_offset =199;
            selectedColor = {
                red:colordata[color_offset*4],
                green:colordata[color_offset*4+1],
                blue:colordata[color_offset*4+2]
            };
            ledColorTxt.css("background", "rgb("+selectedColor.red+","+selectedColor.green+","+selectedColor.blue+")");
//            sendCommand();
            ledColorBar.inputFlag = true;
        });
        
        ledBrightBar.on('change', function(evt){ 
            sendCommand();
        });
        ledColorBar.on('change', function(evt){       //send data after touchend 
            if(ledColorBar.inputFlag){
                sendCommand();
                ledColorBar.inputFlag = false;
            } 
        });
        
        button.bind("tap", function(e){
            actionButton(e);
        });
        
        $("#widget19").on("click", "#ventilatorSW", function(e){
            if(!$(e.target).hasClass("pressed")){
                actionVent(e);
            }
        });
        
        $("#widget19").on("click", "#heaterSW", function(e){
            if(!$(e.target).hasClass("pressed")){
                actionHeater(e);
            }
        });
    };
    
    var actionButton = function(evt){
//        if(rollover.is(":hidden")){
//            sendMsg(rollover, "1");
//            rollover.show();
            rollover.css("display", "inline");
            rollover.addClass("flicker");
            pubTopic("rollover", "1");
//        }
    };
    var actionHeater = function(evt){
        var value = (evt.target).getAttribute("value");
        if(value === "1"){
//            heater.show();
            heater.css("display", "inline");
            heater.addClass("flicker");
        }
        else{
            heater.hide();
            heater.removeClass("flicker");
        }
        pubTopic("heater", value);
    };
    var actionVent = function(evt){
        var value = (evt.target).getAttribute("value");
        if(value === "1"){
//            ventilator.show();
            ventilator.css("display", "inline");
            ventilator.addClass("flicker");
        }
        else{
            ventilator.hide();
            ventilator.removeClass("flicker");
        }
        pubTopic("ventilator", value);
    };
    
    var setRadio = function(id, status){
        if(id === "heater"){
            if(status === "1"){
                $($("#heaterSW .button")[0]).removeClass("pressed");
                $($("#heaterSW .button")[1]).addClass("pressed");
                
            }
            else{
                $($("#heaterSW .button")[0]).addClass("pressed");
                $($("#heaterSW .button")[1]).removeClass("pressed");
            }
        }
        else{
            if(status === "1"){
                $($("#ventilatorSW .button")[0]).removeClass("pressed");
                $($("#ventilatorSW .button")[1]).addClass("pressed");
                
            }
            else{
                $($("#ventilatorSW .button")[0]).addClass("pressed");
                $($("#ventilatorSW .button")[1]).removeClass("pressed");
            }
        }
    };
    
    var sendCommand = function(){
        var length=0, brightness=0;
        if($('#lightbar-bright input').val() !== undefined){
            brightness=$('#lightbar-bright input').val();
        }
        var hex = parseInt(colorHex(selectedColor).substr(1), 16);
        var obj={
            brightness:parseInt(brightness),
            rgb:hex
//            rgb:selectedColor
        }
        pubLightTopic(obj);
    };
    var colorHex = function(rgb){
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        /*RGB颜色转换为16进制*/
        var that = "rgb("+rgb.red+","+rgb.green+","+rgb.blue+")";
        if(/^(rgb|RGB)/.test(that)){ 
            var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
            var strHex = "#";
            for(var i=0; i<aColor.length; i++){
                var hex = Number(aColor[i]).toString(16);
                if (hex.length == 1) {
                   hex = "0" + hex;
                } //问题出在这里
                if(hex === "0"){
                    hex += hex;  
                }
                strHex += hex;
            }
            if(strHex.length !== 7){
                strHex = that;   
            }
            return strHex;
        }else if(reg.test(that)){
            var aNum = that.replace(/#/,"").split("");
            if(aNum.length === 6){
                return that;  
            }else if(aNum.length === 3){
                var numHex = "#";
                for(var i=0; i<aNum.length; i+=1){
                    numHex += (aNum[i]+aNum[i]);
                }
                return numHex;
            }
        }else{
            return that;  
        }
    };
    
    var initView = function(el, wid, devId, mqtt){
        el.empty();
        mMqtt = mqtt;
        mWidget = wid;
        device_id = devId;
        var div = layoutTpl();
        el.append(div);
        getEl();
    };
    
    var initMqtt = function(){        
        var topic = mWidget.topics;
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
        var currentAmount = mWidget.retain;
        if(!_.isEmpty(currentAmount)){
            currentAmount = currentAmount.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                    .replace(/ /gi,"&nbsp;")
                                    .replace(/\'/g, "&#39;")
                                    .replace(/\"/g, "&quot;")
                                    .replace(/&/g, "&gt;")
                                    .replace(/\n/gi,"<br>");
            temperature.html(" "+parseFloat(currentAmount).toFixed(2)+" "+topic[0].attribute.unit);
        }

        mMqtt.on(url, function(message){
            var str = message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                .replace(/ /gi,"&nbsp;")
                                .replace(/\'/g, "&#39;")
                                .replace(/\"/g, "&quot;")
                                .replace(/&/g, "&gt;")
                                .replace(/\n/gi,"<br>");
            if(!_.isEmpty(temperature)){
                temperature.html(" "+parseFloat(str).toFixed(2)+" "+topic[0].attribute.unit);
            }
        });

        url = "v1/" + device_id + topic[1].url;
        mMqtt.subscribe(url, 2, function(message){
            var str=message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                .replace(/ /gi,"&nbsp;")
                                .replace(/\'/g, "&#39;")
                                .replace(/\"/g, "&quot;")
                                .replace(/&/g, "&gt;")
                                .replace(/\n/gi,"<br>");
            if(humidity){
                humidity.html(" "+parseFloat(str).toFixed(2)+" "+topic[1].attribute.unit);
            }
        });

        url = "v1/" + device_id + topic[3].url;
        mMqtt.subscribe(url, 2, function(message){
            var str=message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                .replace(/ /gi,"&nbsp;")
                                .replace(/\'/g, "&#39;")
                                .replace(/\"/g, "&quot;")
                                .replace(/&/g, "&gt;")
                                .replace(/\n/gi,"<br>");
            if(heater){
                if(str === "0"){
                    heater.hide();
                }else{
//                    heater.show();
                    heater.css("display", "inline");
                    str = "1";
                }
                heater.removeClass("flicker");
                setRadio("heater", str);
            }
        });

        url = "v1/" + device_id + topic[5].url;
        mMqtt.subscribe(url, 2, function(message){
            var str=message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                .replace(/ /gi,"&nbsp;")
                                .replace(/\'/g, "&#39;")
                                .replace(/\"/g, "&quot;")
                                .replace(/&/g, "&gt;")
                                .replace(/\n/gi,"<br>");
            if(rollover){
                if(str === "0"){
                    rollover.hide();
                }else{
//                    rollover.show();
                    rollover.css("display", "inline");
                    str= "1";
                }
                rollover.removeClass("flicker");
            }
        });

        url = "v1/" + device_id + topic[7].url;
        mMqtt.subscribe(url, 2, function(message){
            var str=message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                .replace(/ /gi,"&nbsp;")
                                .replace(/\'/g, "&#39;")
                                .replace(/\"/g, "&quot;")
                                .replace(/&/g, "&gt;")
                                .replace(/\n/gi,"<br>");
            if(ventilator){
                if(str === "0"){
                    ventilator.hide();
                }else{
//                    ventilator.show();
                    ventilator.css("display", "inline");
                    str = "1";
                }
                ventilator.removeClass("flicker");
                setRadio("ventilator", str);
            }
        });
    };
    
    var pubTopic = function(id, status){
        var topic = mWidget.topics;
        if(id === "heater"){
            url = "v1/" + device_id +topic[2].url;
        }else if(id === "rollover"){
            url = "v1/" + device_id +topic[4].url;
        }else if(id === "ventilator"){
            url = "v1/" + device_id +topic[6].url;
        }
        var payload = status;
        mMqtt.publish(url, payload, 0, true);  
    };
    
    var pubLightTopic = function(obj){
        var topic = mWidget.topics;
        var url = "v1/" + device_id +topic[8].url;
        var payload = JSON.stringify(obj);
        if(curjsonobj===payload){
            return;
        };    
        curjsonobj = payload;
        mMqtt.publish(url, payload, 0, true);
    };
    
    var destroy = function(){
        var topic = mWidget.topics;
        var url = "mqtt:" + "v1/" + device_id + topic[0].url;
        mMqtt.off(url);
        url = "v1/" + device_id + topic[0].url;
        mMqtt.unsubscribe(url);
        url = "v1/" + device_id +topic[1].url;
        mMqtt.unsubscribe(url);
        url = "v1/" + device_id +topic[3].url;
        mMqtt.unsubscribe(url);
        url = "v1/" + device_id +topic[5].url;
        mMqtt.unsubscribe(url);
        url = "v1/" + device_id +topic[7].url;
        mMqtt.unsubscribe(url);
        ventilatorSW.off("change", "input");
        heaterSW.off("change", "input");
        button.unbind("tap");
    };
    
    var widget={
        Show:function(panel, el, wid, devId, mqtt){
            panel.one("unloadpanel", function(){
                $.molmc.goShowWidget = false; 
                destroy();
                el.empty();
            });
            initView(el, wid, devId, mqtt);
            initMqtt();
        },
    };
    return widget;
});
