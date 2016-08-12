<div id="widget13" style="padding:10px;" >
    <div style="position:relative;">
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
    <div id="water"></div>
    <div id="soil"></div>
    <div style="position: absolute; top: 250px; left: 200px; color: blue;">
        <div class="fontsize"><%- _lang('widget_soilHumidity') %></div>
        <div class="fontsize">
            <i class="fa fa-tint"></i> <span id="soil_val"></span>
        </div>
    </div>
</div>