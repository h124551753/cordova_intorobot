define(["tpl!./template/layout.tpl","css!./css/style45"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    var count;
    var curValue;
    var Timer;

    var defaults = {
        from: 0, // the number the element should start at
        to: 0, // the number the element should end at
        speed: 1000, // how long it should take to count between the target numbers
        refreshInterval: 100, // how often the element should be updated
        decimals: 0, // the number of decimal places to show
        formatter: formatter, // handler for formatting the value before rendering
        onUpdate: null, // callback method for every time the element is updated
        onComplete: null // callback method for when the element finishes updating
    };
    
    var getEl =function(){
        count = $('#count-number');
        curValue = 0;
    };
    var initView = function(el, wid, devId, mqtt){
        el.empty();
        mMqtt = mqtt;
        mWidget = wid;
        device_id = devId;
        var div = layoutTpl();
        el.append(div);
        getEl();
        setValue(0);
    };
    
    var initMqtt = function(){        
        var topic = mWidget.topics;
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
        if(!_.isEmpty(mWidget.retain)){
            var currentAmount = mWidget.retain;
            currentAmount = currentAmount.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                    .replace(/ /gi,"&nbsp;")
                                    .replace(/\'/g, "&#39;")
                                    .replace(/\"/g, "&quot;")
                                    .replace(/&/g, "&gt;")
                                    .replace(/\n/gi,"<br>");
            setValue(parseInt(currentAmount));
        }
        mMqtt.on(url, function(message){
            var str=message.payloadString.replace(/<(.+?)>/gi,"&lt;$1&gt;")
                                .replace(/ /gi,"&nbsp;")
                                .replace(/\'/g, "&#39;")
                                .replace(/\"/g, "&quot;")
                                .replace(/&/g, "&gt;")
                                .replace(/\n/gi,"<br>");
            setValue(parseInt(str));
        });        
    }; 
    var countTo = function(options){
        options = options || {};
        return count.each(function() {
            // set options for current element
            var settings = $.extend({}, defaults, options);

            // how many times to update the value, and how much to increment the value on each update
            var loops = Math.ceil(settings.speed / settings.refreshInterval),
                increment = (settings.to - settings.from) / loops;

            // references & variables that will change with each update
            var self = this;
            var loopCount = 0;
            var value = settings.from;
                // data = $self.data('countTo') || {};

            // $self.data('countTo', data);

            // if an existing interval can be found, clear it first
            if (Timer) {
                clearInterval(Timer);
            }
            Timer = setInterval(updateTimer, settings.refreshInterval);

            // initialize the element with the starting value
            render(value);

            function updateTimer() {
                value += increment;
                loopCount++;

                render(value);

                if (typeof(settings.onUpdate) == 'function') {
                    settings.onUpdate = value;
                }

                if (loopCount >= loops) {
                    // remove the interval
                    // $self.removeData('countTo');
                    clearInterval(Timer);
                    value = settings.to;

                    if (typeof(settings.onComplete) == 'function') {
                        settings.onComplete = value;
                    }
                }
            };

            function render(value) {
                var formattedValue = formatter(value, settings);
                count.html(formattedValue);
            };
        });
    };
    var countToDestroy = function() {
        if (Timer) {
            clearInterval(Timer);
        }
    };
    var formatter = function(value, settings) {
        return value.toFixed(settings.decimals);
    };
    var setValue = function(value){
        countTo({
            from:curValue,
            to:value
        });
        curValue = value;
    };
    var destroy = function(){
        countToDestroy();
        var topic = mWidget.topics;
        var url = "mqtt:" + "v1/" + device_id + topic[0].url;
        mMqtt.off(url);
        url = "v1/" + device_id + topic[0].url;
        mMqtt.unsubscribe(url);
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
