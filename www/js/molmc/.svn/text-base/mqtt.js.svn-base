(function($) {
    var randomStr = function(num) {
        var x="0123456789qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
        var timestamp = new Date().getTime();
        var tmp = '';
        for(var i=0; i<num; i++)  {
            tmp  +=  x.charAt(Math.ceil(Math.random()*100000000)%x.length);
        }
        return timestamp.toString().substr(-10, 10) + tmp;
    };

    var Mqtt = function(options) {
        var host = serverMQTT;
        var port = 11883;
        var ssl = false;
        var thatModel = this;
        this.outbox= [];
        this.subscriptions= [];
        this.messages= [];
        this.connected= 0;//-1:lost connect; 0: not connect; 1:connecting; 2:connected
        this.username= "";
        this.password= "";
        this.reConnectCount=0;
        this.reConnectTimer;

        this.initialize = function(options){
            if(!_.isObject(options)){
                options= {};
            }
            if(!_.isEmpty(options.userID)){
                thatModel.userID = options.userID;
                delete options.userID;
            }
            clientId = randomStr(13);
            thatModel.ws = new Paho.MQTT.Client(host, port, clientId);
            thatModel.defaultTopicList = [
                {"topic": "v1/service/platform/default/info/time"}
            ];
            if(!_.isEmpty(thatModel.userID)){
                thatModel.defaultTopicList.push({"topic": "v1/"+ thatModel.userID +"/channel/userDevice/cmd/updata"})
            }
            // thatModel.connected = 0; 
            thatModel.openConnect(options);
        };

        this.onConnect = function() {
            thatModel.connected = 2;
            var subscriptionsBak = thatModel.subscriptions;
            thatModel.subscriptions = _.filter(thatModel.subscriptions, function (elem) {
                return elem.status === 1;
            });
            
            subscriptionsBak.forEach(function(elem){
                if(elem.status === 0){
                    thatModel.subscribe(elem.topic, elem.qos, null, elem.subSucCallback);
                } 
            });

            thatModel.defaultTopicList.forEach(function(elem){  //add default topic
                thatModel.subscribe(elem.topic, 2);
            });

            thatModel.outbox.forEach(function(elem){
                thatModel.publish(elem.topic, elem.payload, elem.qos, elem.retain);
            });
            thatModel.outbox=[];
        };

        this.onMessageArrived = function(message){
            var topic = "mqtt:"+message.destinationName;
            thatModel.trigger(topic, message);
        };

        //onConnectionLost 3 conditions, 
        // 1. accident lost : onConnectionLostAccident;  
        // 2. manual and reconnect : onConnectionLostManualReConnect; 
        // 3. manual and not reconnect : onConnectionLostManualNotConnect
        this.onConnectionLostAccident = function(message){
            thatModel.connected = -1;
            thatModel.messages = [];
            //thatModel.subscriptions = [];
            // thatModel.username = "";
            thatModel.openConnect({userName: thatModel.username, password:thatModel.password});
            if (message.errorCode !== 0) {
                throw new Error("debug: " + message.errorMessage);
            }
        };

        this.onFailure = function(message) {
            thatModel.connected = -1;
            if(thatModel.reConnectTimer){
                clearTimeout(thatModel.reConnectTimer);
            }
            var count = thatModel.reConnectCount*thatModel.reConnectCount*50;
            if(count<5000){
                thatModel.reConnectCount++;
            }
            thatModel.reConnectTimer = setTimeout(function(){
                thatModel.openConnect({userName: thatModel.username, password:thatModel.password}, true);
            }, count);
            throw new Error('error: ' + message.errorMessage);
        };

        this.openConnect = function(options, reConnectFlag) {
            if(!_.isObject(options)){
                options= {};
            }
            if(!_.isEmpty(options.userID)){
                thatModel.userID = options.userID;
                delete options.userID;
            }
            if(_.isEmpty(options.userName)){
                return;
            }
            if(reConnectFlag !== true){
                thatModel.reConnectCount = 0;
                if(thatModel.reConnectTimer){
                    clearTimeout(thatModel.reConnectTimer);
                }
            }
            var defaults = {
                timeout: 10,
                userName: "",
                password: $.molmc.utils.getItem("account"),
                // willMessage: {},
                keepAliveInterval: 50,
                cleanSession: true,
                useSSL: ssl,
                // invocationContext: {},
                onSuccess: thatModel.onConnect,
                onFailure: thatModel.onFailure
                // hosts: {},
                // ports: {}
            };
            var op = $.extend(defaults, options);
//            var onConnectionLostManualReConnect;
            // if (!Mqtt.ws.isConnected()) {
            if (thatModel.connected === 0) {
                thatModel.ws.connect(op);
                thatModel.connected = 1;
                thatModel.username = op.userName;
                thatModel.password = op.password
            }else if(thatModel.connected === -1){
                op.onSuccess = function(){
                    var subscriptionsBak = thatModel.subscriptions;
                    thatModel.subscriptions = [];
                    subscriptionsBak.forEach(function(elem){
                        thatModel.connected = 2;
                        thatModel.subscribe(elem.topic, elem.qos);
                    });
                }
                thatModel.ws.connect(op);
                thatModel.connected = 1;
                thatModel.username = op.userName;
                thatModel.password = op.password;
            }else {
                // 判断用户token是否改变
                if ((thatModel.connected === 2) && thatModel.username !== op.userName) {
                    var onConnectionLostManualReConnect = function(){
                        thatModel.ws.connect(op);
                        thatModel.connected = 1;
                        thatModel.username = op.userName;
                        thatModel.password = op.password;
                        thatModel.ws.onConnectionLost = thatModel.onConnectionLostAccident;
                    }
                    thatModel.disconnect(onConnectionLostManualReConnect);
                }
//                else{
//                    return;
//                }
                return;
            }
            
//            if(_.isFunction(onConnectionLostManualReConnect)){
//                thatModel.ws.onConnectionLost = onConnectionLostManualReConnect
//            }else{
//                thatModel.ws.onConnectionLost = thatModel.onConnectionLostAccident;
//            }
            thatModel.ws.onConnectionLost = thatModel.onConnectionLostAccident;
            thatModel.ws.onMessageArrived = thatModel.onMessageArrived;
        };

        this.disconnect = function(callback) {
            if (thatModel.ws !== undefined && thatModel !== null) {
                thatModel.subscriptions.forEach(function(elem){
                    thatModel.off("mqtt:"+elem.topic);
                });

                if(_.isFunction(callback)){
                    thatModel.ws.onConnectionLost = callback;
                }else{
                    thatModel.ws.onConnectionLost = function(){
                        thatModel.connected = 0;
                    };
                }
                
                if(thatModel.connected === 1 || thatModel.connected === 2){
                    thatModel.ws.disconnect();
                }
                if(thatModel.reConnectTimer){
                    clearTimeout(thatModel.reConnectTimer);
                }
                thatModel.connected = 0;
                thatModel.subscriptions = [];
                thatModel.messages = [];
                //onConnectionLostManualNotConnect
                // thatModel.ws = undefined;
            }
        },


        this.publish = function(topic, payload, qos, retain) {
            var message = new Paho.MQTT.Message(payload);
            message.destinationName = topic;
            message.qos = qos;
            //message.qos = 0;
            message.retained = retain;

            if(thatModel.connected!==2){
                if (_.findWhere(thatModel.outbox, {'topic': topic})) {
                    return false;
                }
                thatModel.outbox.push({topic: topic, payload:payload, qos:qos, retain:retain});
            }else{
                thatModel.ws.send(message);
            }            
            return true;
        };

        this.subscribe = function(topic, qosNr, callback, subSucCallback){
            if (topic.length < 1) {
                return false;
            }
            if (_.findWhere(thatModel.subscriptions, {'topic': topic})) {
                return true;
            }
            if(_.isFunction(callback)){
                thatModel.off("mqtt:"+topic);//when qos=0 queue first message rec then sub suc callback, so on sub callback here
                thatModel.on("mqtt:"+topic, callback);
            }
            
            // save topic sub list, qos=0's sub first rec, and callback's unsub is call, so that push it now.
            var subscription = {'topic': topic, 'qos': qosNr, 'status': 0, subSucCallback:subSucCallback};
            thatModel.subscriptions.push(subscription);
            if(thatModel.connected === 2){
                thatModel.ws.subscribe(topic, {qos: qosNr, onSuccess:function(){
                    var element = _.findWhere(thatModel.subscriptions, {'topic': topic});
                    if(_.isObject(element)){
                        element.status = 1;
                        element.subSucCallback = null;
                    }
                    if(_.isFunction(subSucCallback)){
                        subSucCallback();
                    }
                }});
            }
            
            return true;
        };

        //not sub or unsub success callback
        this.unsubscribe = function(topic, callback) {
            if (!_.findWhere(thatModel.subscriptions, {'topic': topic})) {
                if(callback){
                    callback();
                }
                return false;
            }
            if(thatModel.connected !== 2){
                thatModel.off("mqtt:"+topic);
            }else{
                thatModel.ws.unsubscribe(topic, {onSuccess: function(){
                    // del sub list topic
                    thatModel.subscriptions = _.filter(thatModel.subscriptions, function (item) {
                        return item.topic != topic;
                    });
                    thatModel.off("mqtt:"+topic);
                    if(callback){
                        callback();
                    }
                }});
            }
            return true;
        };

        this.unsubscribeAll = function() {
            _.each(thatModel.subscriptions, function(item){
                if(!_.findWhere(thatModel.defaultTopicList, {topic:item.topic})){
                    thatModel.off("mqtt:"+item.topic);
                    if(thatModel.connected === 2){
                        thatModel.ws.unsubscribe(item.topic, {onSuccess: function(){}});
                    }
                    thatModel.subscriptions = _.filter(thatModel.subscriptions, function (element) {
                        return element.topic != item.topic;
                    });
                }                 
            });
        };

        this.on = $.molmc.Events.on;
        this.off = $.molmc.Events.off;
        this.trigger = $.molmc.Events.trigger;

        this.initialize.apply(this, arguments);
    };

    $.molmc.mqtt = Mqtt;
})(af);