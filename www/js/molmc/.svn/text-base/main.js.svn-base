requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        text: "vendor/text",
        tpl: "vendor/underscore-tpl",
        framework: "vendor/highcharts/standalone-framework",
        highstock: "vendor/highcharts/highstock",
        highchart_more: "vendor/highcharts/highcharts-more",
		solidgauge: "vendor/highcharts/solid-gauge",
        action: "molmc/action",
        trigger: "molmc/trigger",
        lang: "molmc/lang"
//        baidu_api_quick: "http://api.map.baidu.com/getscript?type=quick&file=feature&ak=mBmfyGzkoLzKuiT7d0GSEo9l&t=20140109092002",
    },
    shim: {
        highstock: ["framework"],
        highchart_more: ["highstock"],
        solidgauge:["highchart_more"]
    },
    map: {
        '*': {
          'css': "vendor/css"
        }
    }
});

// Start the main app logic.
require(['text', 'tpl'], function() {
    console.log("require ready!");
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
});
// Start the main app logic.
require(['lang'], function() {
    console.log("require ready!");
    
});