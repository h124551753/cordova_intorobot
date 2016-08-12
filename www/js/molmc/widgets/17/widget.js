define(["tpl!./template/layout.tpl",
    "css!./css/slider_widget17"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    
    var ledBright;
    var ledLenght;
    var ledColor;
    var ledBrightBar;
    var ledLenghtBar;
    var ledColorBar;
    var selectedColor;
    var curjsonobj;
    var colordata;
    var imageData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAAAUCAYAAADIpHLKAAACOUlEQVRoQ+1bXU/DMAz02FgLEvD//+VWXpquBXxJ3Dr9GGPaG8dUua4dF0U+XR0nu2/9kxBEzmeJsm1FmibJriv1Nbsf5+Pg3uL4cQcRedYL8jVL6C/u+Vz3fvNx0G0sxtUuzlHvce31esr3kKbD3+vwNR1xzQ8Svl73dj9OxzeYxl6nb9BpxTSqhB5UwgYZsu7tjU63PQ8X9cX03xBHhkod3yXKXq/woVL/qUEnAzLq+hz2AL/8HLJ9y3q2X4vTpTgHGXRa2yj30kdZLfQw2msJox/8K+lUv+Rxk99WnEHj9/rr9If7NT3oO8wGeU1HHMQzf69j3Jf+7H27ESA+mX3SAySn0wSWNTDh2Rw85mcgM93A8RcQWNJjzBoIPCjmYILtAUkf33sjmDwIPFiQ7PeCYB7nM4MQYIvJH5M3g+KOpF8F10YcJHkdkzyBI+klCJI9geCoti0w/Rancol/b9IDCFsgMDB5UAAc0PG+CSBkkMQ2DwATGQSMQgaZPr/IIMXnFxnEGIYMUtYurEEiA5FByCBlzUEGIYOwBtHlGK5irdcoXMXiKta45MtVrOWS8WxJmDUIa5CpT8I+SLn6xRpk0d9gH4Q1CGsQ1iCsQdhJZyc9FeLspC8+m9hJn7azsJPOvVhprxj3YpV7urgXK39GkUHIIFc2MpJByCBkkLVdwWQQMsgjtsazD8I+CPsgPA/C8yDjoSmeB0nnUHgeJB66Yg3CGoQ1CGuQeMiKJwpvPEZLBvmffZAfcCDlAMU31bUAAAAASUVORK5CYII=";
    
//    var widget = function(){
//        $("#showWidget_device").bind("unloadpanel", function(){
//            $.molmc.goShowWidget = false;
//            destroy();    
//            $("#showWidget_device").unbind("unloadpanel");
//            $("#widgetPanel_device").empty();
//        });        
//    };
    var getEl =function(){
        ledBright = $("#widget17 #bright_txt");
        ledLenght = $("#widget17 #length_txt");
        ledColor = $("#widget17 #color_txt");
        ledBrightBar = $("#widget17 #lightbar-bright");
        ledLenghtBar = $("#widget17 #lightbar-length");
        ledColorBar = $("#widget17 #lightbar-color");
        ledColorBar.css({"background-image": "url("+imageData+")","background-repeat":"no-repeat","background-size":"cover"});
        var img = new Image;
        img.src = imageData;
        var canvas = document.createElement("canvas");
        var ctxt = canvas.getContext('2d');
        img.onload = function(){
            ctxt.drawImage(img, 0, 0);
            colordata = ctxt.getImageData(0, 0, img.width, 1).data;
            initAction(colordata);
        }
    };
    var initAction = function(colordata){
        selectedColor = {red:0,green:0,blue:0};
        ledBrightBar.molmcSlider({
            min:'0',
            max:'100',
            autoTemplate:true,
        });
        ledLenghtBar.molmcSlider({
            min:'0',
            max:'100',
            autoTemplate:true,
        });
        ledColorBar.bind("input", function(e){
//            ledColor.html(ledColorBar.val());
            $("button.active", this.$el).removeClass("active");
            /* Act on the event */
            var color_offset = parseInt(ledColorBar.val()/100*200);
            if(color_offset>199) color_offset =199;
            selectedColor = {
                red:colordata[color_offset*4],
                green:colordata[color_offset*4+1],
                blue:colordata[color_offset*4+2]
            };
            ledColor.css("background", "rgb("+selectedColor.red+","+selectedColor.green+","+selectedColor.blue+")");
            ledColorBar.inputFlag = true;
            
        });
        ledBrightBar.on('change', function(evt){    
            pubTopic(0);
        });
        ledLenghtBar.on('change', function(evt){     
            pubTopic(0);
            $("button.active", this.$el).removeClass("active");
        });
        ledColorBar.on('change', function(evt){    
            if(ledColorBar.inputFlag){
                pubTopic(0);
                ledColorBar.inputFlag = false;
            } 
        });
        $("#widget17").on("tap", "button", function(e){
            if(!$(e.currentTarget).hasClass("active")){
                $("button.active", this.$el).removeClass("active");
                $(e.currentTarget).addClass("active");
                var mode = parseInt(e.currentTarget.value);
                pubTopic(mode);
            }
            
        });
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
        url = "v1/" + device_id + topic[0].url;
        mMqtt.subscribe(url, 2, function(message){
            var status=JSON.parse(message.payloadString);
            console.log(status);
            ledBrightBar.molmcSlider("value", status.brightness);
            ledLenghtBar.molmcSlider("value", status.length);
            $("button.active", this.$el).removeClass("active");
            $('button[value="'+status.mode+'"]').addClass("active");
            var colorStr = status.rgb.toString(16);
            if(colorStr.length<6){
                colorStr = "#" + "000000".substr(colorStr.length) + colorStr;
            }else{
                colorStr = "#" + colorStr.substr(0, 6);
            }
            var colorRGB = colorRgb(colorStr);
            for(var i=0;i<200;i++){
                if(colorRGB.red == colordata[4*i] && colorRGB.green == colordata[4*i+1] 
                    && colorRGB.blue == colordata[4*i+2]){
                    ledColorBar.val(parseInt(i/2));
                    ledColor.css("background", "rgb("+colorRGB.red+","+colorRGB.green+","+colorRGB.blue+")");
                    selectedColor = {
                        red:colorRGB.red,
                        green:colorRGB.green,
                        blue:colorRGB.blue
                    }
                    break;
                }
            }
        });      
    };    
    
    var pubTopic = function(mod){
        var topic = mWidget.topics;
        var mode=0, length=0, brightness=0;
        var lenghtinput = $("#widget17 #lightbar-length input");;
        var brightinput = $("#widget17 #lightbar-bright input");
        if(lenghtinput.val() !== undefined){
            length = parseInt(lenghtinput.val());
        }
        if(brightinput.val() !== undefined){
            brightness = parseInt(brightinput.val());
        }
        if(mod !== undefined){
            mode = mod;
        }
        var hex = parseInt(colorHex(selectedColor).substr(1), 16);        
        var url = "v1/" + device_id +topic[0].url;
        var obj={
            mode:mode,
            length:length,
            brightness:brightness,
            rgb:hex
        }
        var payload = JSON.stringify(obj);
        if(curjsonobj===payload){
            return;
        };    
        curjsonobj = payload;
        mMqtt.publish(url, payload, 0, true);
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
    /*16进制颜色转为RGB格式*/  
    var colorRgb = function(hexStr){
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;  
        var sColor = hexStr.toLowerCase();  
        if(sColor && reg.test(sColor)){  
            if(sColor.length === 4){  
                var sColorNew = "#";  
                for(var i=1; i<4; i+=1){  
                    sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));     
                }  
                sColor = sColorNew;  
            }  
            //处理六位的颜色值  
            var sColorChange = [];  
            for(var i=1; i<7; i+=2){  
                sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));    
            }
            sColor = {
                red:sColorChange[0],
                green:sColorChange[1],
                blue:sColorChange[2]
            };
            return sColor;  
        }else{  
            return sColor;    
        }
    };

    var destroy = function(){
        $("#widget17").on("tap", "button");
        ledBrightBar.unbind("input");
        ledLenghtBar.unbind("input");
        ledColorBar.unbind("input");
        var topic = mWidget.topics;
        url = "mqtt:" + "v1/" + device_id + topic[1].url;
        mMqtt.off(url);
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
