define(["tpl!./template/chart.tpl",
    "highstock"], function(layoutTpl){
    var cssUrl_bak=[];
    var tempData = [];
    var topicindex = [];
    var myHis;
    var g_widget, g_device_id;
    Highcharts.setOptions({
        global: {
            useUTC: false
        },
        lang:{
            months:_lang('widgetlist_0_months'),
            shortMonths:_lang('widgetlist_0_shortMonths'),
            weekdays:_lang('widgetlist_0_weekdays')
        }
    });
    var options = {
        credits: {enabled: false},
        legend: {enabled: true},
        navigator: {enabled: true},
        rangeSelector: {
            buttons: [],
            inputEnabled: false,
        },
        lang: {
            noData: "No Data"
        },
        noData: {
            style: {
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#303030'
            }
        },
        exporting: { enabled: false },
    };

    var widget = function(){
        $("#showWidget_device").bind("unloadpanel", function(){
            $.molmc.goShowWidget = false;
            destroy();    
            // $("#showWidget_device").unbind("unloadpanel");
            $("#widgetPanel_device").empty();
        });        
    };
    
    var initView = function(el){
        el.empty();
        var div = layoutTpl();
        el.append(div);
    };    
      
    var initData = function(el, widget, device_id){
        myHis = new Highcharts.StockChart($.extend(options, {
            chart : {
                renderTo: 'history_chart',
                backgroundColor:'#F2F2F2'
            },
            title: {text: null},
            tooltip: {
                pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y:.2f}{series.options.unit}'
            },
            series : (function(){
                var data = [], mySeries={};
                _.forEach(widget.topics, function(m){
                    if (m.isData == true && m.history == true) {
                        mySeries = {};
                        mySeries.data = [""];
                        if (m.isData == true && m.history == true) {
                            mySeries.name = m.name;
                            mySeries.type = 'line';
                            if(m.attribute & m.attribute.unit){
                                mySeries.unit = ' '+m.attribute.unit;
                            }else{
                                mySeries.unit = '';
                            }
                            if (m.D_type.toUpperCase() == 'BOOL') {
                                mySeries.step = 'left';
                            }
                            data.push(mySeries);
                        }
                    }
                });
                return data;
            }())
        }));
        getHisData(widget.topics, device_id, myHis);
    };
    
    var getHisData = function(topics, device_id, chart, type){        
        var start, end, size;        
        var ser = [];
        var i = 0;
        if(type === undefined){
            type = '1D';
        }
        _.forEach(topics, function(m){
            if (m.isData == true && m.history == true) {
                end = Math.ceil((new Date()).getTime() / 1000);
                if(_.isArray(tempData[type]) && tempData[type][i]){
                    ser = [];
                    _.forEach(tempData[type][i].data, function(point){
                        ser.push([(point.timestamp)*1000, parseFloat(point.value)]);                        
                    });
                    chart.series[i].setData(ser);
                }else{
                    if(type === '1D'){
                        start = end - 24*60*60;
                    }else if(type == '7D'){
                        start = end - 7*24*60*60;
                    }else{
                        start = end - 30*24*60*60;
                    }
                    tempData[type] = [];
                    $.ajax({
                        context:{topicIntex:i},
                        url: serverURL+"/v1/datapoints",
                        data: {topic: "v1/" + device_id+m.url, start: start, end: end, size:400},
                        dataType: 'json',
                        type: "GET",
                        async: true,
                        success: function(data,arg1,arg2){
                            var url = decodeURIComponent(arg2.url);
                            var topicIndex = this.topicIntex;
                            if (data.code == 200) {                            
                                ser = [];
                                if(_.isEmpty(data.data)){                                    
                                    return;
                                }
                                _.forEach(data.data, function(point){
                                    ser.push([point.timestamp*1000, parseFloat(point.value)]);
                                });
                                tempData[type][topicIndex] = data;
                                chart.series[topicIndex].setData(ser); 
                                
                            }
                        }
                    });
                }
                i++;
            }
        });
    }

    var initAction = function(){
        $("#widget0").on("tap", "button", function(event){
            var type = $(event.currentTarget).val();
            getHisData(g_widget.topics, g_device_id, myHis, type);
        });
    };
    
    var pubTopic = function(){
    };    
    
    var destroy = function(){
        myHis = {};
    };
    
    widget.prototype={
        Show:function(el, widget, device_id){
            
            tempData = [];
            topicindex = [];
            g_widget = widget;
            g_device_id = device_id;
            initView(el);
            initData(el, widget, device_id);
            initAction();
        },
    };
    var Widget = new widget();
    return Widget;
});
