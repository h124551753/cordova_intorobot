<div id="widget12" style="padding:10px" class="fontsize">
    <div style="position:relative;font-size:0.7em;">
        <%- _lang('widgetlist_12_timerDes') %>
        <select name="waterTimer" id="waterTimer">
            <option value="1"><%- "1"+_lang('widgetlist_12_minute')%></option>
            <option value="2"><%- "2"+_lang('widgetlist_12_minute')%></option>
            <option value="5"><%- "5"+_lang('widgetlist_12_minute')%></option>
            <option value="10"><%- "10"+_lang('widgetlist_12_minute')%></option>
            <option value="0"><%- _lang('widgetlist_12_forever')%></option>
        </select>
    </div>
    <div id="sprinkler"></div>
    <div id="water" ></div>
    <img src=<%- fileSystemWidget + '12/img/flowerpot.png'%> style="position:absolute;left:50%;margin-left:-86px;">
    <div style="position: absolute;top: 100px;color: rgb(255, 97, 0);">
        <!-- <div>光照强度</div> -->
        <div><%- _lang('widget_illumination') %></div>
        <div>
            <i class="fa fa-sun-o" style="font-size: 1em;"></i><span id="widget12_illumination" style="margin-left: 10px;"></span>
        </div>
    </div>
    <div style="position: absolute;top: 150px;color: rgb(203, 8, 203);">
        <!-- <div>空气温度</div> -->
        <div><%- _lang('widget_airtemp') %></div>
        <div >
            <i id="img_temperature"></i><span id="widget12_airTemp" style="margin-left: 20px;"></span>
        </div>
    </div>
    <div style="position: absolute;top: 200px;color: rgb(86, 146, 255);">
        <!-- <div>空气湿度</div> -->
        <div><%- _lang('widget_airhumidity') %></div>
        <div >
            <i class="fa fa-tint"></i><span id="widget12_airHumidity" style="margin-left: 10px;"></span>
        </div>
    </div>
    <div style="position: absolute;top: 400px;color: rgb(86, 146, 255);">
        <!-- <div>土壤湿度</div> -->
        <div><%- _lang('widget_soilHumidity') %></div>
        <div>
            <i class="fa fa-tint"></i><span id="widget12_soilHumidity" style="margin-left: 10px;"></span>
        </div>
    </div>
            <input style="height:240px;width:1px;visibility: hidden;">
</div>
