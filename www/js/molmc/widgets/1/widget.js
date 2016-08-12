define(["tpl!./template/chart.tpl", "highchart_more"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];
    
    var speeder;
    var point;

    // var widget = {};

    var Speeder_base = {
        chart: {
            renderTo: 'chart_widget1',
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            backgroundColor:'#F2F2F2',
            plotBorderWidth: 0,
            plotShadow: false
        },
        credits: {
            enabled: false
        },
        title: {
            text: _lang('widget_speedsensor'),
        },
        pane: {
            startAngle: -150,
            endAngle: 150,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },

        // the value axis
        yAxis: {
            min: 0,
            max: 100,

            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',

            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto'
            },
            title: {
                text: 'km/h'
            },
            plotBands: [{
                from: 0,
                to: 60,
                color: '#55BF3B' // green
            }, {
                from: 60,
                to: 80,
                color: '#DDDF0D' // yellow
            }, {
                from: 80,
                to: 100,
                color: '#DF5353' // red
            }]
        },
        series: [{
            name: 'Speed',
            data: [0],
            tooltip: {
                valueSuffix: ' km/h'
            }
        }]
    };
    var getSpeeder = function() {
        var topic = mWidget.topics;
        var max = parseInt(topic[0].attribute.max);
        var min = parseInt(topic[0].attribute.min);
        var len = Math.abs(max-min);
        var speed = Speeder_base;
        speed.yAxis.min = min;
        speed.yAxis.max = max;
        speed.yAxis.title.text = topic[0].attribute.unit;
        speed.series[0].name = mWidget.name;
        speed.series[0].tooltip.valueSuffix = topic[0].attribute.unit;
        speed.yAxis.plotBands[0].from = min;
        speed.yAxis.plotBands[0].to = 0.6 * len + min;
        speed.yAxis.plotBands[1].from = 0.6 * len + min;
        speed.yAxis.plotBands[1].to = 0.8 * len + min;
        speed.yAxis.plotBands[2].from = 0.8 * len + min;
        speed.yAxis.plotBands[2].to = max;
        var currentAmount;
        if(mWidget.retain){
            var currentAmount = parseInt(mWidget.retain) > parseInt(topic[0].attribute.max) ? parseInt(mWidget.retain) % parseInt(topic[0].attribute.max) : parseInt(mWidget.retain);
            speed.series[0].data[0] = currentAmount;
        }else{
            speed.series[0].data[0] = parseInt(topic[0].attribute.min);
        }
        return speed;
    }
    
    var getEl =function(){
       var setting = getSpeeder();
        // var setting = Speeder_base;
//        speeder = $('#chart').highcharts(setting).highcharts();
        speeder = new Highcharts.Chart(setting);
        point = speeder.series[0].points[0];
    };
    var initView = function(el, wid, devId, mqtt){
        el.empty();
        mMqtt = mqtt;
        mWidget = wid;
        device_id = devId;
        if(cssUrl_bak){
            cssUrl_bak.forEach(function(model){
                $.molmc.utils.loadInJsCss(model, "css");
            });
        }
        var div = layoutTpl();
        el.append(div);
        getEl();
    };
    
    var initMqtt = function(){
        var topic = mWidget.topics;
        var maxVal = parseInt(topic[0].attribute.max);
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
        // var currentAmount;
        // if(mWidget.retain){
        //     var currentAmount = parseInt(mWidget.retain) > parseInt(topic[0].attribute.max) ? parseInt(mWidget.retain) % parseInt(topic[0].attribute.max) : parseInt(mWidget.retain);
        //     point.update(currentAmount);
        // }else{
        //     currentAmount = 0;
        // }

        mMqtt.on(url, function(message){
            var newVal = parseInt(message.payloadString) > parseInt(topic[0].attribute.max) ? parseInt(message.payloadString) % parseInt(topic[0].attribute.max) : parseInt(message.payloadString);
            if(speeder && speeder.renderTo){
                point.update(newVal);
            }
        });
    };      
    
    var destroy = function(){        
        var topic = mWidget.topics;
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
        mMqtt.off(url);
        url = "v1/" + device_id + topic[0].url;
        mMqtt.unsubscribe(url);
        if(speeder.renderTo){
            speeder.destroy();
        }
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
