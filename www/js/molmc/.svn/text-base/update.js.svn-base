(function($) {
    "use strict";
    var serverListJson={};
    var BaseFilePath;

    var LangPath;
    var ActionPath;
    var TriggerPath;
    
    var Update = function(){
         
    };    
    var checkFileExists = function(filePath, fileName, existCB, notFoundCB){
        var ongetDirSuccess = function(fileEntry){
            var onCheckError = function(err){
                if(_.isFunction(notFoundCB)){
                    notFoundCB(err);
                }else{
                    navigator.notification.confirm(_lang("g_file_notfound"), null, _lang("g_tips_error"), _lang("g_tips_confirm"));
                }
            };
            fileEntry.getFile(fileName, {create:false}, existCB, onCheckError);
        }
        window.resolveLocalFileSystemURL(filePath, ongetDirSuccess, fail);
    };
    
    var removeDir = function(dirPath, removeSuccessCB, noFile){
        var ongetDirSuccess = function(fileEntry){
            fileEntry.removeRecursively(removeSuccessCB, fail);
        };
        var failCall = function(result){
            console.log(result);
            noFile();
        };
        window.resolveLocalFileSystemURL(dirPath, ongetDirSuccess, failCall);
    };
    
    var removeFile = function(filePath){
        var ongetDirSuccess = function(fileEntry){
            var removeSuccessCB = function(result){
            };
            fileEntry.remove(removeSuccessCB, fail);
        };
        window.resolveLocalFileSystemURL(filePath, ongetDirSuccess, fail);
    };
    
    //download wigetlist.json from server
    var downloadWidgetList = function(onSuccess){
        var fileTransfer = new FileTransfer();
        var uri = serverURL + "/downloads/package/widgets/widgetslist.json";
        var filePath = fileSystemRoot + "cache/widgetslist.json";
        downloadFile(uri, filePath, onSuccess);
    };

    //download lang.js from server
    var downloadLang = function(onSuccess){
        var fileTransfer = new FileTransfer();
        var uri = serverURL + "/downloads/package/widgets/lang_ser.js";
        console.log(uri)
        downloadFile(uri, LangPath, onSuccess);
    };

    //download action.js from server
    var downloadAcion = function(onSuccess){
        var fileTransfer = new FileTransfer();
        var uri = serverURL + "/downloads/package/widgets/action.js";
        console.log(uri)
        downloadFile(uri, ActionPath, onSuccess);
    };

    //download action.js from server
    var downloadTrigger = function(onSuccess){
        var fileTransfer = new FileTransfer();
        var uri = serverURL + "/downloads/package/widgets/trigger.js";
        console.log(uri)
        downloadFile(uri, TriggerPath, onSuccess);
    };

    //download file from uri to filePath
    var downloadFile= function(uri, filePath, onSuccess){
        var fileTransfer = new FileTransfer();
        fileTransfer.download(
            uri,
            filePath,
            function(entry) {
                if (_.isFunction(onSuccess)) {                    
                    onSuccess(entry);
                };
            },
            function(error) {
                console.log(error);
            },
            false,
            {
                headers: {
                    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                }
            }
        );
    };

    var readAsText = function(fileEntry, onloadCB){
        var gotFile = function(file){
            var reader = new FileReader();                
            reader.onload = onloadCB;                
            reader.onerror = fail;            
            reader.readAsText(file);
        };        
        fileEntry.file(gotFile, readFail);
    };
    
    var checkWidgetsVer = function(localWidgetListJson, serverWidgetListJson){
        var widgetUpdateList = [];
        serverListJson = serverWidgetListJson;
//        for(var i=0; i<localWidgetListJson.list.length; i++){
//            for(var j=0; j<serverWidgetListJson.list.length; j++){
//                if(localWidgetListJson.list[i].widget_id === serverWidgetListJson.list[j].widget_id){
//                    if(localWidgetListJson.list[i].ver !== serverWidgetListJson.list[j].ver){
//                        widgetUpdateList.push(localWidgetListJson.list[i].widget_id);
//                    }
//                    break;
//                }
//            }
//        }
        var isFind = false;
        for(var i=0; i<serverWidgetListJson.list.length; i++){
            isFind = false;
            for(var j=0; j<localWidgetListJson.list.length; j++){
                if(localWidgetListJson.list[j].widget_id === serverWidgetListJson.list[i].widget_id){
                    isFind = true;
                    if(localWidgetListJson.list[j].ver !== serverWidgetListJson.list[i].ver){
                        widgetUpdateList.push(serverWidgetListJson.list[i].widget_id);
                    }
                    break;
                }
            }
            if(isFind === false){
                widgetUpdateList.push(serverWidgetListJson.list[i].widget_id);
            }
        }
        downloadWidgets(widgetUpdateList);
    };
    
    var downloadWidgets = function(widgetList){
        console.log(widgetList);
        if (widgetList!=undefined && widgetList.length>0) {
            downloadLang(function(){
                require([LangPath],function(lang){
                    $.molmc.Lang = lang;
                });
            });
            downloadAcion(function(){
                require([ActionPath],function(action){
                    $.molmc.actionEvent = action;
                });
            });
            downloadTrigger(function(){
                require([TriggerPath],function(trigger){
                    $.molmc.triggerEvent = trigger;
                });
            });
        };
        for(var i=0; i<widgetList.length; i++){
            if(i === (widgetList.length - 1)){
                var unzipSuccess = function(){
                    var filePath = fileSystemWidget + "widgetslist.json";
                    var ongetDirSuccess = function(fileEntry){
                        var onSuccess = function(writer){
                            writer.onwrite = function(evt){
                                console.log("update widgetlist success");
                            };
                            writer.error = readFail;
                            writer.write(JSON.stringify(serverListJson));
                            console.log("unzip widget success...");
                        };
                        fileEntry.createWriter(onSuccess, fail);
                    };
                    window.resolveLocalFileSystemURL(filePath, ongetDirSuccess, fail);
                };
                downloadWidget(widgetList[i], unzipSuccess);
            }else{
                downloadWidget(widgetList[i]);
            }            
        }
    };

        
    var downloadWidget = function(widget_id, unzipSuccess){
        var fileTransfer = new FileTransfer();
        var uri = serverURL + "/downloads/package/widgets/" + widget_id + ".zip";
        var filePath = fileSystemRoot + "cache/" + widget_id + ".zip";
        console.log("download widget: " + filePath);
        fileTransfer.download(
            uri,
            filePath,
            function(entry) {
                var dirPath = fileSystemWidget + widget_id;
                var removeSuccesBC = function(){
                    unzipWidget(entry.nativeURL, unzipSuccess);
                };                
                removeDir(dirPath, removeSuccesBC, removeSuccesBC);
            },
            function(error) {
                console.log(error);
            },
            false,
            {
                headers: {
                    "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                }
            }
        );
    };
    
    var unzipWidget = function(filePath, unzipSuccess){
        var progress = 0;
        var fileUrl = filePath;
        var dirUrl = fileSystemWidget;
        zip.unzip(fileUrl, dirUrl, function(result) {
            if(result == 0){
                if(_.isFunction(unzipSuccess)){
                    unzipSuccess(result);
                }
            }
        }, function(progressEvent) {
           progress = progressEvent.loaded / progressEvent.total;
        });
    };

    var fail = function(error) { 
		console.log(error.code); 
	};  
    
    var readFail = function(evt){
        console.log("read fail:" + evt.target.errot.code);
    };
    
    Update.prototype = {
        initPath:function(){
            BaseFilePath = fileSystemRoot + "files/files/";
            LangPath = BaseFilePath + "lang_ser.js";
            ActionPath = BaseFilePath + "action.js";
            TriggerPath = BaseFilePath + "trigger.js";
        },
        checkWidgetsUpdate:function(){
            var onDownloadWidgetListSuccess = function(listFileEntry){
                var readSuccess = function(serverList){
                    var exist = function(widgetsListEntry){
                        var readLocalListSuccess = function(localList){
                            var localJson = JSON.parse(localList.target.result.toString());
                            var servertJson = JSON.parse(serverList.target.result.toString());
                            checkWidgetsVer(localJson, servertJson);
                        }
                        readAsText(widgetsListEntry, readLocalListSuccess);
                    };
                    checkFileExists(fileSystemWidget, "widgetslist.json", exist);
                };
                readAsText(listFileEntry, readSuccess);
            };
            downloadWidgetList(onDownloadWidgetListSuccess);            
        },    
        unzipWidgetsToData:function(filePath){
            var self = this;
            var ongetDirSuccess = function(fileSystem){
                var progress = 0;
                var dirUrl = fileSystem.root.nativeURL;
                zip.unzip(filePath, dirUrl, function(result) {
                    if(result == 0){
                        var filePath = fileSystemRoot + "files/files/widgets.zip";
                        removeFile(filePath);
                        console.log("unzip widgets success: " + result);
                        if($.molmc.utils.checkWifi(true)){
                            self.checkWidgetsUpdate();
                        } 
                        return;
                    }
                    console.log("unzip widgets faild");
                }, function(progressEvent) {
//                    progress = progressEvent.loaded / progressEvent.total;
                });
            };
            window.requestFileSystem(LocalFileSystem.PERSISTENT,0,ongetDirSuccess, fail);
        },    
        copyWidgetsZipToData:function(filePath, onCopyDirSuccess){
            var self = this;
            var exist = function(){
                if($.molmc.utils.checkWifi(true)){
                    self.checkWidgetsUpdate();
                }                            
            };
            var notfound =function(){
                var onSuccess = function(dirEntry){
                    var ongetDirSuccess = function(fileSystem){
                        dirEntry.copyTo(fileSystem.root,"widgets.zip",onCopyDirSuccess, fail);
                    };
                    window.requestFileSystem(LocalFileSystem.PERSISTENT,0,ongetDirSuccess, fail);            
                };
                window.resolveLocalFileSystemURL(filePath, onSuccess, fail);
            };
            window.resolveLocalFileSystemURL(fileSystemWidget, exist, notfound);
        },
        langActionTrigger:function(){
            checkFileExists(BaseFilePath, "lang_ser.js", function(){
                require([LangPath],function(lang){
                    $.molmc.Lang = lang;
                });
            },function(err){
                console.log(err);
            });
            checkFileExists(BaseFilePath, "action.js", function(){
                require([ActionPath],function(action){
                    $.molmc.actionEvent = action;
                });
            },function(){
                require(["action"],function(action){
                    $.molmc.actionEvent = action;
                });
            });
            checkFileExists(BaseFilePath, "trigger.js", function(){
                require([TriggerPath],function(trigger){
                    $.molmc.triggerEvent = trigger;
                });
            },function(){
                require(["trigger"],function(trigger){
                    $.molmc.triggerEvent = trigger;
                });
            });
        }     
    };
    
    $.molmc.update = new Update();
})(af);
