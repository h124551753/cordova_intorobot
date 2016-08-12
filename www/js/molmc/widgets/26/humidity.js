/**
 * @author huangguozhen@molmc.com
 */
(function($){

    var initParam = {
        goalAmount: 200,
        currentAmount: 0,
        animationTime: 1000,
        tickMarkSegementCount: 4,
        widthOfNums: 50,
        preAmount:0,
        unit:'%'
    };
    var defaults = {};

    var img = {
        glassTopImg: fileSystemWidget + "2/img/glassTop.png",
        glassBodyImg: fileSystemWidget + "2/img/glassBody.png",
        redVerticalImg: fileSystemWidget + "26/img/redVertical.png",
        tooltipFGImg: fileSystemWidget + "2/img/tickShine.png",
        glassBottomImg: fileSystemWidget + "26/img/glassBottom.png",
        tootipPointImg: fileSystemWidget + "2/img/tooltipPoint.png",
        tooltipMiddleImg: fileSystemWidget + "2/img/tooltipMiddle.png",
        tooltipButtImg: fileSystemWidget + "2/img/tooltipButt.png",
    };

    var img_high = {
        glassTopImg2x: fileSystemWidget + "2/img/glassTop2x.png",
        glassBodyImg2x: fileSystemWidget + "2/img/glassBody2x.png",
        redVerticalImg2x: fileSystemWidget + "26/img/redVertical2x.png",
        tooltipFGImg2x: fileSystemWidget + "2/img/tickShine2x.png",
        glassBottomImg2x: fileSystemWidget + "26/img/glassBottom2x.png",
        tootipPointImg2x: fileSystemWidget + "2/img/tooltipPoint2x.png",
        tooltipMiddleImg2x: fileSystemWidget + "2/img/tooltipMiddle2x.png",
        tooltipButtImg2x: fileSystemWidget + "2/img/tooltipButt2x.png",
    };

    // const
    var arrayOfImages;
    var imgsLoaded = 0;
    var tickHeight = 40;
    var mercuryHeightEmpty = 0;
    var numberStartY = 6;
    var thermTopHeight = 13;
    var thermBottomHeight = 51;
    var tooltipOffset = 15; 
    var heightOfBody;
    var mercuryId;
    var tooltipId;
    var resolution2x = false;
    var Humidity = function(){
    
    };

    Humidity.prototype = {
        humidityCreate: function(options, el){
            defaults = $.extend(initParam, options);
//            return this.each(function(){
//                var $this = $(this);
                determineImageSet();
                createGraphics(el);
//            });
        },
        humidityUpdate: function(options, el) {
            animateHumidity(options, el);
        },
    };

    var determineImageSet = function(){
        resolution2x = window.devicePixelRatio == 2;//check if resolution2x
        if(resolution2x){   
            //switch the regular for 2x res graphics
            img.glassTopImg    = img_high.glassTopImg2x;
            img.glassBodyImg   = img_high.glassBodyImg2x;
            img.redVerticalImg = img_high.redVerticalImg2x;
            img.glassBottomImg = img_high.glassBottomImg2x;
            img.tootipPointImg = img_high.tootipPointImg2x;
            img.tooltipButtImg = img_high.tooltipButtImg2x;  
        }
    };

    //visually create the thermometer
    var createGraphics = function(el) {
        el.html(
            "<div id='therm-numbers'>" + 
                "<div class='therm-number pos0'></div>" + 
                "<div class='therm-number pos1'></div>" + 
                "<div class='therm-number pos2'></div>" + 
                "<div class='therm-number pos3'></div>" + 
            "</div>" + 
            "<div id='therm-graphics'>" + 
                "<img id='therm-top' src='"+img.glassTopImg+"'></img>" + 
                "<img id='therm-body-bg' src='"+img.glassBodyImg+"' ></img>" + 
                "<img id='therm-body-mercury' src='"+img.redVerticalImg+"'></img>" + 
                "<div id='therm-body-fore'></div>" + 
                "<img id='therm-bottom' src='"+img.glassBottomImg+"'></img>" + 
                "<div id='therm-tooltip'>" + 
                    "<img class='tip-left' src='"+img.tootipPointImg+"'></img>" + 
                    "<div class='tip-middle'><p>"+defaults.currentAmount+defaults.unit+"</p></div>" + 
                    "<img class='tip-right' src='"+img.tooltipButtImg+"'></img>" + 
                "</div>" + 
            "</div>"
        );

        //preload and add the background images
        $('<img/>').attr('src', img.tooltipFGImg).load(function(){
            $(this).remove();
            $("#therm-body-fore", el).css("background-image", "url('"+img.tooltipFGImg+"')");
            checkIfAllImagesLoaded();
        });
        
        $('<img/>').attr('src', img.tooltipMiddleImg).load(function(){
            $(this).remove();
            $("#therm-tooltip .tip-middle", el).css("background-image", "url('" + img.tooltipMiddleImg + "')");
            checkIfAllImagesLoaded();
        });

        //adjust the css
        heightOfBody = defaults.tickMarkSegementCount * tickHeight;
        $("#therm-graphics", el).css("left", defaults.widthOfNums)
        $("#therm-body-bg", el).css("height", heightOfBody);
        $("#widget-humidity", el).css("height",  heightOfBody + thermTopHeight + thermBottomHeight);
        $("#therm-body-fore", el).css("height", heightOfBody);
        $("#therm-bottom", el).css("top", heightOfBody + thermTopHeight);
        mercuryId = $("#therm-body-mercury", el);
        mercuryId.css("top", heightOfBody + thermTopHeight);
        tooltipId = $("#therm-tooltip", el);
        tooltipId.css("top", heightOfBody + thermTopHeight - tooltipOffset);
        
        //add the numbers to the left
        var numbersDiv = $("#therm-numbers", el);
        var countPerTick = defaults.goalAmount/defaults.tickMarkSegementCount;
        var commaSepCountPerTick = commaSeparateNumber(countPerTick);
        
        //add the number
        for ( var i = 0; i < defaults.tickMarkSegementCount; i++ ) {
            
            var yPos = tickHeight * i + numberStartY;
            // var style = $("<style>.pos" + i + " { top: " + yPos + "px; width:"+defaults.widthOfNums+"px }</style>", el);
            // $("html > head", el).append(style);
            var dollarText = commaSeparateNumber(defaults.goalAmount - countPerTick * i);
            // $( numbersDiv ).append( "<div class='therm-number pos" + i + "'>" +dollarText+ "</div>" );
            $(".pos"+i, el).html(dollarText);
            $(".pos"+i, el).css({ top: yPos + "px", width: defaults.widthOfNums+"px" });
        }
        
        //check that the images are loaded before anything
        arrayOfImages = new Array( "#therm-top", "#therm-body-bg", "#therm-body-mercury", "#therm-bottom", ".tip-left", ".tip-right");
        preload(arrayOfImages, el);
        initHumidity({currentAmount:defaults.currentAmount}, el);
    };

    //check if each image is preloaded
    var preload = function(arrayOfImages, el) {
        for(i=0;i<arrayOfImages.length;i++){
            $(arrayOfImages[i], el).load(function() {
                checkIfAllImagesLoaded(el);
            });
        }
    };

    //check that all the images are preloaded
    var checkIfAllImagesLoaded = function(el){
        imgsLoaded++;
        if(imgsLoaded == arrayOfImages.length+2){
//            $("#widget-thermometer", el).fadeTo(200, 1, function(){    //linhz_to 
                // animateHumidity({}, el);
//            });
        }
    };

    //animate the thermometer
    var initHumidity = function(options, el){
        var op = $.extend(defaults, options, true);
        var percentageComplete = op.currentAmount/defaults.goalAmount;
        var mercuryHeight = Math.round(heightOfBody * percentageComplete); 
        var newMercuryTop = heightOfBody + thermTopHeight - mercuryHeight;
        
        mercuryId.css({height:mercuryHeight +1, top:newMercuryTop });
        tooltipId.css({top:newMercuryTop - tooltipOffset});
        
        var tooltipTxt = $("#therm-tooltip .tip-middle p", el);
        defaults.startValue = mercuryHeight;
        //change the tooltip number as it moves
        tooltipTxt.html(op.currentAmount);

        defaults.preAmount = op.currentAmount;
    };

    //animate the humidity
    var animateHumidity = function(options, el){
//        var op = $.extend(defaults, options, true);
//        var percentageComplete = op.currentAmount/defaults.goalAmount;
//        var mercuryHeight = Math.round(heightOfBody * percentageComplete); 
//        var newMercuryTop = heightOfBody + thermTopHeight - mercuryHeight;
//        
//        mercuryId.animate({height:mercuryHeight +1, top:newMercuryTop }, defaults.animationTime);
//        tooltipId.animate({top:newMercuryTop - tooltipOffset}, {duration:defaults.animationTime});
//        
//        var tooltipTxt = $("#therm-tooltip .tip-middle p", el);
//        
//        //change the tooltip number as it moves
//        $({tipAmount: defaults.preAmount}).animate({tipAmount: op.currentAmount}, {
//            duration:defaults.animationTime,
//            step:function(){
//                tooltipTxt.html(parseFloat(this.tipAmount).toFixed(2) + defaults.unit);
//            }
//        });
//
//        defaults.preAmount = op.currentAmount;
        var op = $.extend(defaults, options, true);
        var percentageComplete = op.currentAmount/defaults.goalAmount;
        var mercuryHeight = Math.round(heightOfBody * percentageComplete) - defaults.startValue;; 
        var newMercuryTop = heightOfBody + thermTopHeight - mercuryHeight;
        var tooltipTxt = $("#therm-tooltip .tip-middle p", el);
        var height = (mercuryHeight + defaults.startValue + 1) + "px";
        mercuryId.css3Animate({height:height,width:"18px",y:-mercuryHeight, time:defaults.animationTime});
        tooltipId.css3Animate({y:-mercuryHeight, time:defaults.animationTime, success:function(){
                tooltipTxt.html(parseFloat(op.currentAmount).toFixed(2) + defaults.unit);
            }});
        defaults.preAmount = op.currentAmount;
    };

    //format the numbers with $ and commas
    var commaSeparateNumber = function(val){
        val = Math.round(val);
        while (/(\d+)(\d{3})/.test(val.toString())){
          val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        return val + defaults.unit;
    };
    
    $.molmc.humidity = new Humidity();
})(af);