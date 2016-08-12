define(["vendor/map/AMap", "vendor/map/GoogleMap"], function(Gaode, Google) {
    if($.molmc.position.localCountry.toLowerCase() == 'china'){
        return Gaode;
    }else{
        return Google;
    }
});
