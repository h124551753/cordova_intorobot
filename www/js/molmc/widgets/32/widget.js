define(["tpl!./template/layout.tpl", "solidgauge"], function(layoutTpl){
    var mMqtt;
    var mWidget;
    var device_id;
    var url;
    var cssUrl_bak=[];

    var pressure;
    var altitude;

    var tempretureChart;
    var pressureChart;
    var relativeHeightChart;
    var altitudeChart;

    var getEl =function(){
        pressure = $("#pressure");
        altitude = $("#altitude");
    };
    var initView = function(el, wid, devId, mqtt){
        el.empty();
        mMqtt = mqtt;
        mWidget = wid;
        device_id = devId;
        var div = layoutTpl();
        el.append(div);
        getEl();
        var pressureSetting = getAttr(mWidget, 0);
        var altitudeSetting = getAttr(mWidget, 1);        
        console.log(Highcharts.merge(defaults, pressureSetting));
        pressureChart = new Highcharts.Chart(Highcharts.merge(defaults, pressureSetting));
        altitudeChart = new Highcharts.Chart(Highcharts.merge(defaults, altitudeSetting));
        
        // pressureChart.series[0].points[0].update(parseFloat(currentAmount));
    };
    
    var initMqtt = function(){
        var topic = mWidget.topics;        
        url = "mqtt:" + "v1/" + device_id + topic[0].url;
        mMqtt.on(url, function(message){            
            var value = message.payloadString;
            if(pressure){
                pressureChart.series[0].points[0].update(parseFloat(value));
            }
        });
        url = "v1/" + device_id + topic[1].url;
        mMqtt.subscribe(url, 2, function(message){
            var value = message.payloadString;
            if(altitude){
                altitudeChart.series[0].points[0].update(parseFloat(value));
            }
        });        
    };    
    
    
    var defaults = {
        chart: {
            type: 'solidgauge',
        },
        credits: {
            enabled: false
        },
        title: null,
        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },
        tooltip: {
            enabled: false
        },
        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickPixelInterval: 400,
            tickWidth: 0,
            title: {
                y: -70
            },
            labels: {
                y: 16
            }
        },
        plotOptions: {
            solidgauge: {
                dataLabels: {
                    y: 5,
                    borderWidth: 0,
                    useHTML: true
                }
            }
        }
    };

    var getAttr = function(options, index) {
        var max = parseInt(options.topics[index].attribute.max),
            min = parseInt(options.topics[index].attribute.min);
        var len = Math.abs(max - min);
        var renderDiv = "pressure";        
        if(!_.isEmpty(options.retain)){
            var currentAmount = options.retain;
            var initData = parseFloat(currentAmount);
        }else{
            var initData = min;
        }
        if(index===0){
            renderDiv = "pressure";
        }else if(index === 1){
            renderDiv = "altitude";
            initData = min;
        }
        var attribute = {
            chart: {
                type: 'solidgauge',
                backgroundColor:'#F2F2F2',
                renderTo: renderDiv
            },
            yAxis:{
                min:min,
                max:max,
                title: {
                    text: options.topics[index].name
                }
            },
            series: [{
                name: options.topics[index].name,
                data: [initData],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y:.2f}</span><br/>' +
                           '<span style="font-size:12px;color:silver">'+ options.topics[index].attribute["unit"] +'</span></div>'
                },
                tooltip: {
                    valueSuffix: ' '+options.topics[index].attribute["unit"]
                }
            }]
        };
        return attribute;
    };

    
    var destroy = function(){
        var topic = mWidget.topics;
        var url = "mqtt:" + "v1/" + device_id + topic[0].url;
        mMqtt.off(url);
        url = "v1/" + device_id + topic[0].url;
        mMqtt.unsubscribe(url);
        url = "v1/" + device_id + topic[1].url;
        mMqtt.unsubscribe(url);
        if(pressureChart){
            pressureChart.destroy();
        }
        if(altitudeChart){
            altitudeChart.destroy();
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
