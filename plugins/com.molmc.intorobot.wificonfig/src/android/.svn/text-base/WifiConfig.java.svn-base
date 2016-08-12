package com.molmc.intorobot.wificonfig;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaActivity;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.R.integer;
import android.R.string;
import android.annotation.SuppressLint;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiManager;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;

public class WifiConfig extends CordovaPlugin {
    
    private static final String ATOMPWD = "intorobot";
    
    private static final int TCP_FIRST_CREATE_FAILED = 100;     //第一次连接Atom失败请检查设备是否进入配置模式
    private static final int TCP_SECOND_CREATE_FAILED = 101;    //第二次连接Atom失败：建立数据连接失败,请重试
    private static final int TCP_DATA_SEND_FAILED = 102;        //向Atom发送数据发送失败,请重试
    private static final int TCP_DATA_RECEIVE_FAILED = 103;     //接收来自Atom的响应数据失败,请重试
    private static final int TCP_DISCONNECT_ERROR = 104;        //TCP连接中断,请重试
    private static final int TCP_CONNECT_TIMEOUT = 105;         //TCP连接超时,请重试
    private static final int TCP_JSON_PARSE_FAILED = 106;       //JSON数据解析失败,请重试
    private static final int TCP_HAND_ATOM_FAILED = 107;        //设备握手失败,请将Atom STM32复位后重试

    private static final int WIFI_CONNECT_ATOM_FAILED = 108;    //WIFI连接Atom失败,请重试
    private static final int WIFI_RECONNECT_ATOM_FAILED = 109;  //WIFI第二次连接Atom失败,请重试
    private static final int ATOM_CONNECT_WIFI_TIMEOUT = 110;   //Atom连接网络超时, 请检查密码是否正确或网络环境是否良好
    private static final int ATOM_RECEIVE_WIFIINFO_FAILED = 111;    //Atom接收网络数据失败,请将Atom MT7620N复位后重试
    private static final int ATOM_SET_DEVINFO_FAILED = 112;     //Atom设置平台数据失败，请重试

    private static final int CONFIG_DEV_SUCC = 200;     //创建设备成功
    
    private static final int RECONNECT_WIFI = 450;
    
     
    
    public WifiConfig() {
        Log.i("WifiConfig", "constructor...");
    }
    
    //wifi
    private WifiUtils mWifiUtils;
    private List<ScanResult> wifiResultList;
    private List<ScanResult> deviceWifi = new ArrayList<ScanResult>();
    private List<ScanResult> hotpotWifi = new ArrayList<ScanResult>();
    private String currentConnectWifi;
    
    private WifiTcp tcpConnect;

    private String wifiSSid;
    private String wifiPassword;
    private String deviceSSid;
    private String product_id;
    private String channel;
    private String security;
    private String deviceid;
    private String token;

    private boolean isReconnect = false;
    private int delayCount = 0;
    private int wifiConnectCount = 0;
    private int tcpCreateCount = 0;
    
    private int netId;
    
    private CordovaWebView mCordovaWebView;
    private CallbackContext mCallbackContext;
    private CordovaInterface mCordovaInterface;


    /**
     * Sets the context of the Command. This can then be used to do things like
     * get file paths associated with the Activity.
     *
     * @param cordova The context of the main Activity.
     * @param webView The CordovaWebView Cordova is running in.
     */
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        mCordovaInterface = cordova;
        mCordovaWebView = webView;
        mWifiUtils = new WifiUtils(cordova.getActivity());
        currentConnectWifi = mWifiUtils.getConnectedSSID().replaceAll("\"","");
    }

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action            The action to execute.
     * @param args              JSONArry of arguments for the plugin.
     * @param callbackContext   The callback id used when calling back into JavaScript.
     * @return                  True if the action was valid, false if not.
     */
    @SuppressLint("HandlerLeak")
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        ///TODO 自定义实现
        if(action.equals("getSsidList")){
            mCallbackContext = callbackContext;
            new scanWifiThread().start();
            return true;
        }else if(action.equals("createDevice")){
            mCallbackContext = callbackContext;
            delayCount = 0;
            wifiConnectCount = 0;
            tcpCreateCount=0;
            isReconnect = false;
            JSONObject jsonObj = args.getJSONObject(0);
            deviceSSid = jsonObj.getString("devssid");
            wifiSSid = jsonObj.getString("wifissid");
            wifiPassword = jsonObj.getString("wifipwd");
            new wifiConnectThread(deviceSSid).start();
            return true;
        }else if(action.equals("setDeviceInfo")){
            mCallbackContext = callbackContext;
            JSONObject jsonObj = args.getJSONObject(0);
            deviceid = jsonObj.getString("device_id");
            token = jsonObj.getString("access_token");
            tcpConnect.sendDeviceInfo(deviceid, token);
            return true;
        }else if(action.equals("reConnectWifi")){            
            return true;
        }else if(action.equals("cancelConfig")){
            if (tcpConnect!=null) {
                tcpConnect.setFinished();
                tcpConnect.closeTcp();
            }
            return true;
        }
        return false;
    }
    
    private Handler mHandler = new Handler(){
        @Override
        public synchronized void handleMessage(Message msg) {
            super.handleMessage(msg);
            switch (msg.what) {
            case WifiTcp.TIMER_RECONNECT:
                new wifiConnectThread(deviceSSid).start();
                break;
            case WifiTcp.TCP_CREATE_FAILED:
                if(tcpCreateCount<3){
                    new wifiConnectThread(deviceSSid).start();
                    tcpCreateCount++;
                }else{
                    if (isReconnect){
                        connectToOriginalSSid(TCP_SECOND_CREATE_FAILED);
                    }else{
                        connectToOriginalSSid(TCP_FIRST_CREATE_FAILED);
                    }
                }
                break;
            case WifiTcp.TCP_RECEIVE_ERR:
                connectToOriginalSSid(TCP_DATA_RECEIVE_FAILED);
                break;
            case WifiTcp.TCP_SEND_ERR:
                connectToOriginalSSid(TCP_DATA_SEND_FAILED);
                break;
            case WifiTcp.TCP_DISCONNECT_ERR:
                connectToOriginalSSid(TCP_DISCONNECT_ERROR);
                break;
            case WifiTcp.DATA_JSON_ERR:
                connectToOriginalSSid(TCP_JSON_PARSE_FAILED);
                break;
            case WifiTcp.TCP_CONNECT_TIMEOUT:
                connectToOriginalSSid(TCP_CONNECT_TIMEOUT);
                break;
            case WifiTcp.CONNECT_DEV_FAILED:
                connectToOriginalSSid(WIFI_CONNECT_ATOM_FAILED);
                break;
            case WifiTcp.RECONNECT_DEV_FAILED:
                connectToOriginalSSid(WIFI_RECONNECT_ATOM_FAILED);
                break;
            case RECONNECT_WIFI:
                wifiConnectCount++;
                new wifiConnectThread(deviceSSid).start();
                break;
            case WifiTcp.TCP_CREATE_SUCCESS:
                if (!isReconnect){
                    tcpConnect.handDevice();
                }else{
                    tcpConnect.checkDeviceWifiStatus();
                }
                break;
            case WifiTcp.HAND_DEVICE:
                try {
                    JSONObject handResult = new JSONObject((String)msg.obj);
                    if (handResult.getInt("status") == 200){
                        product_id = handResult.getString("product_id");
                        tcpConnect.checkDeviceWifiStatus();
                    }else{
                        connectToOriginalSSid(TCP_HAND_ATOM_FAILED);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
            case WifiTcp.CHECK_DEVICE_STATUS:
                try {
                    JSONObject checkResult = new JSONObject((String) msg.obj);
                    if (checkResult.getInt("status") == 200){
                        delayCount++;
                        String ssid = checkResult.getString("ssid");
                        if (!isReconnect){
                            if (ssid.equals(wifiSSid)){
                                mCallbackContext.success(product_id);
                            } else {
                                tcpConnect.sendWifiInfo(wifiSSid, wifiPassword, channel, security);
                            }
                        }else{
                            mCallbackContext.success(product_id);
                        }
                    }else{
                        if (!isReconnect){
                            tcpConnect.sendWifiInfo(wifiSSid, wifiPassword, channel, security);
                        } else {
                            delayCount++;
                            if (delayCount>10){
                                delayCount = 0;
                                connectToOriginalSSid(ATOM_CONNECT_WIFI_TIMEOUT);
                            }else{
                                tcpConnect.checkDeviceWifiStatus(2000);
                            }
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
            case WifiTcp.SEND_WIFI_INFO:
                try {
                    JSONObject wifiResult = new JSONObject((String)msg.obj);
                    if (wifiResult.getInt("status") == 200){
                        tcpConnect.setFinished();
                        delayCount=0;
                        tcpCreateCount = 0;
                        isReconnect = true;
                        countTimer(5);
                    }else{
                        delayCount++;
                        if (delayCount>3){
                            delayCount=0;
                            connectToOriginalSSid(ATOM_RECEIVE_WIFIINFO_FAILED);
                        }else {
                            tcpConnect.sendWifiInfo(wifiSSid, wifiPassword, channel, security);
                        }
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;
            case WifiTcp.SEND_DEVICE_INFO:
                tcpConnect.setFinished();
                try {
                    JSONObject deviceResult = new JSONObject((String) msg.obj);
                    if (deviceResult.getInt("status") == 200) {
                        mCallbackContext.success(CONFIG_DEV_SUCC);    
                        new Timer().schedule(new TimerTask() {                            
                            @Override
                            public void run() {
                                connectToOriginalSSid();
                            }
                        }, 2000);
                    }else{
                        connectToOriginalSSid(ATOM_SET_DEVINFO_FAILED);
                    }
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                break;            
            default:
                break;
            }
        };
    };

    //扫描并获取wifi ssid列表
    private JSONArray getSsidList() {
        wifiResultList = scanWifi();
        JSONArray ssidList = new JSONArray();
        if(wifiResultList != null){
            ssidList = scanResultToJsonArray(wifiResultList);
        }
        return ssidList;
    }
    
    private List<ScanResult> scanWifi(){
        int timeCount = 0;
        if (mWifiUtils.WifiCheckState() == WifiManager.WIFI_STATE_DISABLED){
            mWifiUtils.WifiOpen();
            while (mWifiUtils.WifiCheckState()!=WifiManager.WIFI_STATE_ENABLED){
                timeCount++;
                if (timeCount > 25){
                    break;
                }
                delayMs(200);
            }
        }
        mWifiUtils.WifiStartScan();
        delayMs(3000);
        return mWifiUtils.getScanResults();
    }

    //ScanResult类型转为String
    private JSONArray scanResultToJsonArray(List<ScanResult> listScan){
        JSONArray ssidArray = new JSONArray();
        ComparatorLevel comparator = new ComparatorLevel();
        Collections.sort(listScan, comparator);
        for(int i = 0; i <listScan.size(); i++){
            ScanResult strScan = listScan.get(i);
            if (!TextUtils.isEmpty(strScan.SSID)) {
                ssidArray.put(strScan.SSID);
            }
        }
        return ssidArray;
    }
    
    private boolean findSSidFromScan(String ssid, boolean disable){
        List<ScanResult> results = scanWifi();
        if (results==null) {
            return false;
        }
        if (disable) {
            mWifiUtils.disbleNetwork(results);
        }
        for(ScanResult result : results){
            Log.i("findSSidFromScan", result.SSID);            
            if(result.SSID.equals(ssid)) {
                return true;
            }
        }
        return false;
    }
 
    //first指定ssidwifi
    private boolean firstConnectBySsid(String ssid, String wifipwd){
        if (wifipwd != null) {
            mWifiUtils.removeNetwork(ssid);
            netId = mWifiUtils.AddWifiConfig(wifiResultList, ssid, wifipwd);
            if (netId != -1) {
                mWifiUtils.getConfiguration();// 添加了配置信息，要重新得到配置信息
                return mWifiUtils.ConnectWifi(netId);
            }
        }
        return false;
    }
    
    //链接指定ssidwifi
    private boolean connectBySsid(String ssid, String wifipwd){
        int wifiItemId = mWifiUtils.IsConfiguration(ssid);
        if(wifiItemId != -1){
            return mWifiUtils.ConnectWifi(wifiItemId);
        }else{ //没有配置好信息，配置
            return firstConnectBySsid(ssid, wifipwd);
        }
    }
    
  //定时操作
    private void countTimer(final int sec){
        new Thread(new Runnable() {
            @Override
            public void run() {
                for (int i = 0; i < sec; i++) {
                    delayMs(500);
                    if(!mWifiUtils.isWifiConnected()){
                        new wifiConnectThread(deviceSSid).start();
                        return;
                    }
                    delayMs(500);
                    if(!mWifiUtils.isWifiConnected()){
                        new wifiConnectThread(deviceSSid).start();
                        return;
                    }
                }

                Message msg = mHandler.obtainMessage();
                msg.what = WifiTcp.TIMER_RECONNECT;
                msg.obj = "正在重新连接Atom设备...";
                mHandler.sendMessage(msg);
            }
        }).start();
    }
    
    //连接到初始wifi
    private void connectToOriginalSSid(int errCode){
        mCallbackContext.error(errCode);
        connectToOriginalSSid();
    }
    
    //连接到初始wifi
    private void connectToOriginalSSid(){
        if (tcpConnect!=null) {
            tcpConnect.setFinished();
            tcpConnect.closeTcp();
        }
        new Thread(new Runnable() {
            @Override
            public void run() {
                String reconnectWifi = currentConnectWifi;
                if (TextUtils.isEmpty(currentConnectWifi)) {
                    reconnectWifi = wifiSSid;
                }
                connectBySsid(reconnectWifi, wifiPassword);
            }
        }).start();
    }
    
    class scanWifiThread extends Thread{
        /* (non-Javadoc)
         * @see java.lang.Thread#run()
         */
        @Override
        public void run() {
          JSONArray ssidList = new JSONArray();
          ssidList = getSsidList();
          mCallbackContext.success(ssidList);
        }
    }
    
    class wifiConnectThread extends Thread{
        private String ssid;
        private String wifipwd = ATOMPWD;
        public wifiConnectThread(String ssid) {
            this.ssid = ssid;
        }
        /* (non-Javadoc)
         * @see java.lang.Thread#run()
         */
        @Override
        public void run() {
            boolean status = false;
            if (tcpConnect!=null){
                tcpConnect.closeTcp();
                tcpConnect = null;
            }
            channel = mWifiUtils.getWifiChannel(wifiSSid);
            security = mWifiUtils.getWifiSecurity(wifiSSid);
            status =  firstConnectBySsid(this.ssid, this.wifipwd);            
            if (status) {
                wifiConnectCount = 0;
//                delayMs(2000);
                tcpConnect = new WifiTcp(mCordovaInterface.getActivity(), mHandler);
                tcpConnect.start();
            }else {
                Message msg = mHandler.obtainMessage();
                if (wifiConnectCount < 3) {
//                    delayMs(1000);
                    msg.what = RECONNECT_WIFI;
                }else{
                    if (isReconnect) {
                        msg.what = WifiTcp.RECONNECT_DEV_FAILED;
                    }else {
                        msg.what = WifiTcp.CONNECT_DEV_FAILED;
                    }
                }
                mHandler.sendMessage(msg);
            }
        }
    }
    
    /**
     * 延时 ms
     * @param ms
     */
    private void delayMs(int ms){
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    
    class ComparatorLevel implements Comparator<Object>{
        @Override
        public int compare(Object lhs, Object rhs) {
            // TODO Auto-generated method stub
            ScanResult level0=(ScanResult) lhs;
            ScanResult level1=(ScanResult) rhs;
          
            if(mWifiUtils.calculateSinal(level0.level) <= mWifiUtils.calculateSinal(level1.level)){
                return 1;
            }else{
                return -1;
            }
        }
        
    }
}
