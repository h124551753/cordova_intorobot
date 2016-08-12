/**
 * af.popup - a popup/alert library for html5 mobile apps
 * copyright Indiepath 2011 - Tim Fisher
 * Modifications/enhancements by Intel for App Framework
 *
 */
/* EXAMPLE
 $.query("body").popup({
        title:"Alert! Alert!",
        message:"This is a test of the emergency alert system!! Don't PANIC!",
        cancelText:"Cancel me",
        cancelCallback: function(){console.log("cancelled");},
        doneText:"I'm done!",
        doneCallback: function(){console.log("Done for!");},
        cancelOnly:false,
        doneClass:'button',
        cancelClass:'button',
        onShow:function(){console.log("showing popup");}
        autoCloseDone:true, //default is true will close the popup when done is clicked.
        suppressTitle:false //Do not show the title if set to true
  });

  You can programatically trigger a close by dispatching a "close" event to it.

 $.query("body").popup({title:'Alert',id:'myTestPopup'});
 $("#myTestPopup").trigger("close");

 */
/* global af */
(function ($) {
    "use strict";
    $.fn.popup = function (opts) {
        return new popup(this[0], opts);
    };
    var queue = [];
    var popup = (function () {
        var popup = function (containerEl, opts) {

            if (typeof containerEl === "string" || containerEl instanceof String) {
                this.container = document.getElementById(containerEl);
            } else {
                this.container = containerEl;
            }
            if (!this.container) {
                window.alert("Error finding container for popup " + containerEl);
                return;
            }

            try {
                if (typeof (opts) === "string" || typeof (opts) === "number")
                    opts = {
                        message: opts,
                        cancelOnly: "true",
                        cancelText: "OK"
                    };
                this.id = opts.id = opts.id || $.uuid(); //opts is passed by reference
                this.addCssClass = opts.addCssClass ? opts.addCssClass : "";
                this.suppressTitle = opts.suppressTitle || this.suppressTitle;
                this.title = opts.suppressTitle ? "" : (opts.title || "Alert");
                this.message = opts.message || "";
                this.cancelText = opts.cancelText || "Cancel";
                this.cancelCallback = opts.cancelCallback || function () {};
                this.cancelClass = opts.cancelClass || "button";
                this.doneText = opts.doneText || "Done";
                this.doneCallback = opts.doneCallback || function () {
                    // no action by default
                };
                this.hideFooter = (opts.hideFooter === undefined ? false : opts.hideFooter);
                this.tapHide = (opts.tapHide === undefined ? false : opts.tapHide);
                this.posOffset = (opts.posOffset === undefined ? 0 : opts.posOffset)
                this.doneClass = opts.doneClass || "button";
                this.cancelOnly = opts.cancelOnly || false;
                this.onShow = opts.onShow || function () {};
                this.autoCloseDone = opts.autoCloseDone !== undefined ? opts.autoCloseDone : true;

                queue.push(this);
                if (queue.length === 1)
                    this.show();
            } catch (e) {
                console.log("error adding popup " + e);
            }

        };

        popup.prototype = {
            id: null,
            addCssClass: null,
            title: null,
            message: null,
            cancelText: null,
            cancelCallback: null,
            cancelClass: null,
            doneText: null,
            doneCallback: null,
            doneClass: null,
            cancelOnly: false,
            onShow: null,
            autoCloseDone: null,
            suppressTitle: null,            
            hideFooter: null, // hhe add
            tapHide:null,
            posOffset:null,
            show: function () {
                var self = this;
                var footer, header;
                if(this.suppressTitle){
                    header = " ";
                }else{
                    header = "<header>" + this.title + "</header>";
                }
                if(this.hideFooter){
                    footer = " ";
                }else{
                    footer = "<footer>"+"<a href='javascript:;' class='" + this.cancelClass + "' id='cancel'>" + this.cancelText + "</a>"+"<a href='javascript:;' class='" + this.doneClass + "' id='action'>" + this.doneText + "</a>"+"<div style='clear:both'></div>"+"</footer>";
                }
                var markup = "<div id='" + this.id + "' class='afPopup hidden "+ this.addCssClass + "'>" + header+"<div>" + this.message + "</div>"+ footer + "</div>";
                $(this.container).append($(markup));
                var $el = $.query("#" + this.id);
                $el.bind("close", function () {
                    self.hide();
                });
                
                if (this.cancelOnly) {
                    $el.find("A#action").hide();
                    $el.find("A#cancel").addClass("center");
                }
                $el.find("A").each(function () {
                    var button = $(this);
                    button.bind("click", function (e) {
                        if (button.attr("id") === "cancel") {
                            self.cancelCallback.call(self.cancelCallback, self);
                            self.hide();
                        } else {
                            self.doneCallback.call(self.doneCallback, self);
                            if (self.autoCloseDone)
                                self.hide();
                        }
                        e.preventDefault();
                    });
                });
                self.positionPopup();
                $.blockUI(0.5, function(){
                    if(self.tapHide){
                        self.hide()
                    }                    
                });

                $el.bind("orientationchange", function () {
                    self.positionPopup();
                });

                //force header/footer showing to fix CSS style bugs
                $el.find("header").show();
                $el.find("footer").show();
                setTimeout(function(){
                    $el.removeClass("hidden").addClass("show");
                    self.onShow(self);
                    $.molmc.utils.setpopup(self,true);
                    $(document).trigger("popshow",[self,true]);
                },50);
            },

            hide: function () {
                var self = this;
                $.query("#" + self.id).addClass("hidden");
                $.unblockUI();
                if(!$.os.ie&&!$.os.android){
                    setTimeout(function () {
                        self.remove();
                    }, 250);
                }
                else
                    self.remove();
                $(document).trigger("pophide",[]);
            },

            remove: function () {
                var self = this;
                var $el = $.query("#" + self.id);
                $el.unbind("close");
                $el.find("BUTTON#action").unbind("click");
                $el.find("BUTTON#cancel").unbind("click");
                $el.unbind("orientationchange").remove();
                queue.splice(0, 1);
                if (queue.length > 0)
                    queue[0].show();
            },

            positionPopup: function () {
                var popup = $.query("#" + this.id);
                popup.css("top", ((window.innerHeight / 2.5) + window.pageYOffset) - (popup[0].clientHeight / 2) + this.posOffset + "px");
                popup.css("left", (window.innerWidth / 2) - (popup[0].clientWidth / 2) + "px");
            }
        };
        return popup;
    })();
    var uiBlocked = false;
    $.blockUI = function (opacity, callbk) {
        if (uiBlocked)
            return;
        opacity = opacity ? " style='opacity:" + opacity + ";'" : "";
        $.query("BODY").prepend($("<div id='mask'" + opacity + "></div>"));
        $.query("BODY DIV#mask").bind("touchstart", function (e) {
            e.preventDefault();
            if($.isFunction(callbk)){
                callbk();
            }
        });
        $.query("BODY DIV#mask").bind("touchmove", function (e) {
            e.preventDefault();
        });
        uiBlocked = true;
    };

    $.unblockUI = function () {
        uiBlocked = false;
        $.query("BODY DIV#mask").unbind("touchstart");
        $.query("BODY DIV#mask").unbind("touchmove");
        $("BODY DIV#mask").remove();
    };

})(af);
