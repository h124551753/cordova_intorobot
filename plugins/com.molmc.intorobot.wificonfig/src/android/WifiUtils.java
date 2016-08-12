package com.molmc.intorobot.wificonfig;

import java.util.ArrayList;
import java.util.List;

import android.R.integer;
import android.content.Context;
import android.content.res.Configuration;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.ScanResult;
import android.net.wifi.WifiConfiguration;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.net.wifi.WifiManager.WifiLock;
import android.util.Log;

public class WifiUtils {
    private WifiManager localWifiManager;//提供Wifi管理的各种主要API，主要包含wifi的扫描、建立连接、配置信息等
    private List<ScanResult> wifiScanList;//ScanResult用来描述已经检测出的接入点，包括接入的地址、名称、身份认证、频率、信号强度等
    private List<WifiConfiguration> wifiConfigList;//WIFIConfiguration描述WIFI的链接信息，包括SSID、SSID隐藏、password等的设置
    private WifiInfo wifiConnectedInfo;//已经建立好网络链接的信息
    private WifiLock wifiLock;//手机锁屏后，阻止WIFI也进入睡眠状态及WIFI的关闭
    private Context mContext;
    private int timeCount = 0;
    
    public WifiUtils( Context context){
        localWifiManager = (WifiManager)context.getSystemService(Context.WIFI_SERVICE);
        mContext = context;
        getConnectedInfo();
    }
    
    //检查WIFI状态
    public int WifiCheckState(){
        return localWifiManager.getWifiState();
    }
    
    //开启WIFI
    public void WifiOpen(){
        if(!localWifiManager.isWifiEnabled()){
            localWifiManager.setWifiEnabled(true);
        }
    }
  //检查是否连接成功
    public boolean isWifiConnected(){
        ConnectivityManager conManager = (ConnectivityManager) mContext.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo mWifi = conManager.getNetworkInfo(ConnectivityManager.TYPE_WIFI);
        return mWifi.isConnected() & mWifi.isAvailable();
    }
    //关闭WIFI
    public void WifiClose(){
        if(!localWifiManager.isWifiEnabled()){
            localWifiManager.setWifiEnabled(false);
        }
    }
    
    //扫描wifi
    public void WifiStartScan(){
        localWifiManager.startScan();
    }
    
    //得到Scan结果
    public List<ScanResult> getScanResults(){
        getConfiguration();
        return localWifiManager.getScanResults();//得到扫描结果
    }

    //计算信号强度
    public int calculateSinal(int level){
        return localWifiManager.calculateSignalLevel(level, 100);
    }
    
    //Scan结果转为Sting
    public List<String> scanResultToString(List<ScanResult> list){
        List<String> strReturnList = new ArrayList<String>();
        for(int i = 0; i < list.size(); i++){
            ScanResult strScan = list.get(i);
            String str = strScan.toString();
            boolean bool = strReturnList.add(str);
            if(!bool){
            }
        }
        return strReturnList;
    }
    
    //得到Wifi配置好的信息
    public void getConfiguration(){
        wifiConfigList = localWifiManager.getConfiguredNetworks();//得到配置好的网络信息
    }
    //判定指定WIFI是否已经配置好,依据WIFI的地址BSSID,返回NetId
    public int IsConfiguration(String SSID){
        String ssid = "\"" + SSID + "\"";
        for(int i = 0; i < wifiConfigList.size(); i++){
            if(wifiConfigList.get(i).SSID.equals(ssid)){//地址相同
                return wifiConfigList.get(i).networkId;
            }
        }
        return -1;
    }

    public void removeNetwork(String ssid){
        ssid = "\"" + ssid + "\"";
        for(int i=0; i<wifiConfigList.size(); i++){
            if(ssid.equals(wifiConfigList.get(i).SSID)){
                localWifiManager.removeNetwork(wifiConfigList.get(i).networkId);
            }
        }
    }
    //添加指定WIFI的配置信息,原列表不存在此SSID
    public int AddWifiConfig(List<ScanResult> wifiList,String ssid,String pwd){
        int wifiId = -1;
        for(int i = 0;i < wifiList.size(); i++){
            ScanResult wifi = wifiList.get(i);
            if(wifi.SSID.equals(ssid)){
                WifiConfiguration wifiCong = new WifiConfiguration();
                wifiCong.SSID = "\""+wifi.SSID+"\"";//\"转义字符，代表"
                wifiCong.preSharedKey = "\""+pwd+"\"";//WPA-PSK密码
                wifiCong.hiddenSSID = false;
                wifiCong.status = WifiConfiguration.Status.ENABLED;
                wifiId = localWifiManager.addNetwork(wifiCong);//将配置好的特定WIFI密码信息添加,添加完成后默认是不激活状态，成功返回ID，否则为-1
                if(wifiId != -1){
                    return wifiId;
                }
            }
        }
        return wifiId;
    }
    
    public void disbleNetwork(List<ScanResult> results){
        if (results == null) {
            return;
        }
        List<WifiConfiguration> configs = localWifiManager.getConfiguredNetworks();
        for(ScanResult scan : results){
            for(WifiConfiguration  config : configs){
                if (scan.SSID.equals(config.SSID)) {
                    Log.i("disbleNetwork", "disable network:" + config.SSID);
                    localWifiManager.disableNetwork(config.networkId);
                }
            }
        }
        
    }
    
    //连接指定Id的WIFI
    public boolean ConnectWifi(int wifiId){
        timeCount = 0;
        int reConnectCount = 0;
        for(int i = 0; i < wifiConfigList.size(); i++){
            WifiConfiguration wifi = wifiConfigList.get(i);
            if(wifi.networkId == wifiId){
                while(!(localWifiManager.enableNetwork(wifiId, true))){//激活该Id，建立连接
                    if (timeCount > 5) {
                        return false;
                    }
                    try {
                        timeCount++;
                        Thread.sleep(100);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                while(!localWifiManager.reassociate()){
                    if (reConnectCount > 5) {
                        return false;
                    }
                    try {
                        reConnectCount++;
                        Thread.sleep(500);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
                for(int j=0; j<20; j++){
                    try { 
                        Thread.sleep(500);
                        if(isWifiConnected()){
                            Thread.sleep(1000);
                            return true;
                        } 
                    } catch (Exception e) {
                        // TODO: handle exception
                    }
                }
            }
        }
        return false;
    }
    
    public void connectTagWIfi(int wifiId) {
        localWifiManager.enableNetwork(wifiId, true);
    }
    
    //创建一个WIFILock
    public void createWifiLock(String lockName){
        wifiLock = localWifiManager.createWifiLock(lockName);
    }
    
    
    //锁定wifilock
    public void acquireWifiLock(){
        wifiLock.acquire();
    }
    
    //解锁WIFI
    public void releaseWifiLock(){
        if(wifiLock.isHeld()){//判定是否锁定
            wifiLock.release();
        }
    }
    
    //得到建立连接的信息
    public void getConnectedInfo(){
        wifiConnectedInfo = localWifiManager.getConnectionInfo();
    }
    //得到连接的MAC地址
    public String getConnectedMacAddr(){
        return (wifiConnectedInfo == null)? "NULL":wifiConnectedInfo.getMacAddress();
    }
    
    //得到连接的名称SSID
    public String getConnectedSSID(){
        return (wifiConnectedInfo == null)? "NULL":wifiConnectedInfo.getSSID();
    }
    
    //得到连接的IP地址
    public int getConnectedIPAddr(){
        return (wifiConnectedInfo == null)? 0:wifiConnectedInfo.getIpAddress();
    }
    
    //得到连接的ID
    public int getConnectedID(){
        return (wifiConnectedInfo == null)? 0:wifiConnectedInfo.getNetworkId();
    }
    
    /**
     * 获取当前wifi的通道
     * @param ssid
     */
    public String getWifiChannel(String ssid){
        String mChannel = "";
        List<ScanResult> results = getScanResults();
        for (int i = 0; i < results.size(); i++) {
            if(results.get(i).SSID.equals(ssid)){
                mChannel = getChannelByFrequency(results.get(i).frequency);
            }
        }
        return mChannel;
    }                

    /**
     * 获取当前wifi的安全加密信息
     * @param ssid
     */
    public String getWifiSecurity(String ssid){
        String mSecurity = "";
        List<ScanResult> results = getScanResults();
        for (int i = 0; i < results.size(); i++) {
            if(results.get(i).SSID.equals(ssid)){
                mSecurity = getsecurity(results.get(i).capabilities);
            }
        }
        return mSecurity;
    }
   
    private String getsecurity(String str) {  
        if(str.contains("WPA-PSK-CCMP") | str.contains("WPA-PSK-TKIP+CCMP") | str.contains("WPA-PSK-AES")){
            return "WPAPSK/AES";
        }else if(str.contains("WPA2-PSK-CCMP") | str.contains("WPA2-PSK-TKIP+CCMP") | str.contains("WPA2-PSK-AES")){
            return "WPA2PSK/AES";
        }else if(str.contains("WPA2-PSK-TRIP")){
            return "WPA2PSK/TRIP";
        }else if(str.contains("WPA-PSK-TRIP")){
            return "WPAPSK/TRIP";
        }else if(str.contains("WEP")){
            return "WEP";
        }
        return "WPAPSK/AES";
    }
    
    /**
     * 根据频率获得信道
     *
     * @param frequency
     * @return
     */
    private String getChannelByFrequency(int frequency) {
        int channel = -1;
        switch (frequency) {
        case 2412:
            channel = 1;
            break;
        case 2417:
            channel = 2;
            break;
        case 2422:
            channel = 3;
            break;
        case 2427:
            channel = 4;
            break;
        case 2432:
            channel = 5;
            break;
        case 2437:
            channel = 6;
            break;
        case 2442:
            channel = 7;
            break;
        case 2447:
            channel = 8;
            break;
        case 2452:
            channel = 9;
            break;
        case 2457:
            channel = 10;
            break;
        case 2462:
            channel = 11;
            break;
        case 2467:
            channel = 12;
            break;
        case 2472:
            channel = 13;
            break;
        case 2484:
            channel = 14;
            break;
        case 5745:
            channel = 149;
            break;
        case 5765:
            channel = 153;
            break;
        case 5785:
            channel = 157;
            break;
        case 5805:
            channel = 161;
            break;
        case 5825:
            channel = 165;
            break;
        default:
            return "auto";
        }
        return String.valueOf(channel);
    }
}
