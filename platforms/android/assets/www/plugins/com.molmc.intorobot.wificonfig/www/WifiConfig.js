cordova.define("com.molmc.intorobot.wificonfig.WifiConfig", function(require, exports, module) { var channel = require('cordova/channel'),
  utils = require('cordova/utils'),
  exec = require('cordova/exec'),
  cordova = require('cordova');

function WifiConfig() {

}
WifiConfig.prototype={
    getSsidList:function(success, error){
        exec(success, error, "WifiConfig", "getSsidList", []);
    },
    createDevice:function(payload, type, success, error){
        exec(success, error, "WifiConfig", "createDevice", [payload, type]);
    },
    setDeviceInfo:function(payload, success, error){
        exec(success, error, "WifiConfig", "setDeviceInfo", [payload]);
    },
    reConnectWifi:function(){
        var success = function(resp){
            console.log(resp)
        };
        var error = function(resp){
            console.log(resp)
        };
        exec(success, error, "WifiConfig", "reConnectWifi",[]);
    },
    cancelConfig:function(){
        console.log("call cancel Config");
        var success = function(resp){
            console.log(resp)
        };
        var error = function(resp){
            console.log(resp)
        };
        exec(success, error, "WifiConfig", "cancelConfig",[]);
    }
}

module.exports = new WifiConfig();

});
