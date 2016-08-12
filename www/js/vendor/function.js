/**
 * @author wanggefei
 */

 //slider
(function($){
    var defaultOpt = {
        max:'90',
        min:'0',
        step:'1',
        value:'0',
        autoTemplate:true
    }
    $.fn.molmcSlider = function(options, value){
        if(options === 'destroy'){
            return this.each(function(){
                $(this).off('input');
                $(this).off('touchstart');
                $(this).off('touchend');
                $(this).empty();
            });
        }else if(options === 'value'){
            console.log("slider:" + value);
            $(this).children("input").val(value);
            // console.log($(this).children("input"));
            $(this).children('label').html(value);
        }else{
            if(_.isEmpty(options)){
                options = {};
            }
            var opt = $.extend(defaultOpt, options);
            return this.each(function(){
                var $this = $(this);
                var html;
                var $inputElem;
                console.log("=====opt.autoTemplate========"+opt.autoTemplate);
                if(opt.autoTemplate){
                    $this.addClass('molmcSlider');
                    html = "<input class='molmcSlider-input' type='range' min='" + opt.min + "' max='" + opt.max + "' step='" + opt.step + "' value='" + opt.value + "'>";
                    html = html + "<label class='molmcSlider-label'>" + opt.value + "</label>";
                    $this.html(html);
                    $inputElem = $this.children('input');
                }else{
                    $this.parent().css('height', '34px');
                    $this.addClass('molmcSlider-input');
                    $this.siblings('label').addClass('molmcSlider-label');
                    $inputElem = $this;
                }
                $inputElem.inputFlag = false;
                $inputElem.on('input', function(evt){
                    $inputElem.siblings('label').html($inputElem.val());
                    $inputElem.trigger("change");
                    if(_.isFunction(opt.change)){
                    }
                });
                $inputElem.on('touchstart', function(evt){
                    $inputElem.siblings('label').html($inputElem.val());
                    $inputElem.trigger("strat");
                    if(_.isFunction(opt.start)){
                        opt.start(evt);
                    }
                    $inputElem.inputFlag = true;
                });
                $inputElem.on('touchend', function(evt){
                    if($inputElem.inputFlag){
                        $inputElem.siblings('label').html($inputElem.val());
                        $inputElem.trigger("stop");
                        if(_.isFunction(opt.stop)){
                            opt.stop(evt);
                        }
                        $inputElem.inputFlag = false;
                    } 
                });
            });
        } 
    }
})(af);