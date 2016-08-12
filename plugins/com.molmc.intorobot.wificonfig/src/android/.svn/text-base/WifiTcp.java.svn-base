/*
 * @Title:  wifiTcp.java
 * @Copyright:  MOLMC Co., Ltd. Copyright 2013-2015,  All rights reserved
 * @Description:  TODO<请描述此文件是做什么的>
 * @author:  hhe
 * @data:  3 Aug, 2015 10:29:49 pm
 * @version:  V1.0
 */
package com.molmc.intorobot.wificonfig;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketAddress;
import java.net.SocketTimeoutException;
import java.util.Locale;
import java.util.TimeZone;
import java.util.Timer;
import java.util.TimerTask;

import org.json.JSONException;
import org.json.JSONObject;

import android.R.integer;
import android.content.Context;
import android.os.Handler;
import android.os.Message;
import android.util.Log;

/**
 * @author hhe
 *
 */
public class WifiTcp extends Thread{
    /************ atom配置 TCP 常数代码 ************/
    public static final int TIMER_RECONNECT = 100;

    public static final int TCP_CREATE_FAILED = 400;
    public static final int TCP_RECEIVE_ERR = 401;
    public static final int TCP_SEND_ERR = 402;
    public static final int TCP_DISCONNECT_ERR = 403;
    public static final int DATA_JSON_ERR = 404;
    public static final int TCP_CONNECT_TIMEOUT = 405;

    public static final int TCP_CREATE_SUCCESS = 500;

    public static final int HAND_DEVICE = 600;
    public static final int SEND_WIFI_INFO = 601;
    public static final int CHECK_DEVICE_STATUS = 602;
    public static final int SEND_DEVICE_INFO = 603;
    
    public static final int CONNECT_DEV_FAILED = 604;
    public static final int RECONNECT_DEV_FAILED = 605;

    private static final String IP = "192.168.8.1";
    private static final int PORT = 5555;
    
    private Context context;
    private Handler mHandler;
    private Socket mSocket = null;
    private BufferedReader mBufferedReader = null;
    private PrintWriter mPrintWriter = null;

    private int cmd;
    private int timeCount = 0;

    private boolean isCancel = false;
    private boolean isFinished = false;

    public WifiTcp(Context context, Handler handler){
        this.context = context;
        this.mHandler = handler;
    }
    
    /* (non-Javadoc)
     * @see java.lang.Thread#run()
     */
    @Override
    public void run() {
        // TODO Auto-generated method stub
//        delayMs(3000);
        connectTcp();
    }
    
    private boolean createSocket(){
        try {
            mSocket = new Socket();
            SocketAddress address = new InetSocketAddress(IP, PORT);
            mSocket.connect(address, 2000);
            mSocket.setSoTimeout(10*1000);
            mBufferedReader = new BufferedReader(new InputStreamReader(mSocket.getInputStream()));
            mPrintWriter = new PrintWriter(mSocket.getOutputStream(), true);
        } catch (IOException e) {
            e.printStackTrace();
            sendMessage(TCP_CREATE_FAILED, "建立数据连接失败,请重试");
            return false;
        }
        return true;
    }
    
    //建立tcp链接
    public void connectTcp(){
        isCancel = false;
        isFinished = false;
        timeCount = 0;
        if (!createSocket()){
            return;
        }
        while(!mSocket.isConnected()){
            if (isCancel | timeCount > 10){
                sendMessage(TCP_CREATE_FAILED, "建立数据连接失败,请重试");
                return;
            }
            try {
                Thread.sleep(200);
                timeCount++;
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        sendMessage(TCP_CREATE_SUCCESS, "数据连接成功");
        receiveFromTcp();
    }
    
    /**
     * 延时函数
     * @param ms
     */
    private void delayMs(int ms){
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    
    /**
     * 接收数据
     */
    private void receiveFromTcp(){
        int count = 0;
        char[] buffer = new char[1024];
        while (mSocket.isConnected()&&!isFinished) {
            try {
                if ((count = mBufferedReader.read(buffer)) > 0) {
                    String recvMessage = getInfoBuff(buffer, count); // 消息换行
                    sendMessage(cmd, recvMessage);
                }
            } catch (Exception e) {
                if (!isFinished) {
                    sendMessage(TCP_RECEIVE_ERR, "TCP接收数据失败");
                }
                e.printStackTrace();
                return;
            }
        }
    }

    public void closeTcp(){
        isFinished = true;
        if (mPrintWriter!=null) {
            mPrintWriter.close();
        }
        try {
            if (mBufferedReader!=null) {
                mBufferedReader.close();
            }
            if (mSocket!=null) {
                mSocket.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void sendMessage(int what, Object object){
        Message msg = mHandler.obtainMessage();
        msg.what = what;
        msg.obj = object;
        mHandler.sendMessage(msg);
    }


    /**
     * 从buff中读取数据
     * @param buff
     * @param count
     * @return
     */
    private String getInfoBuff(char[] buff, int count) {
        char[] temp = new char[count];
        for (int i = 0; i < count; i++) {
            temp[i] = buff[i];
        }
        return new String(temp);
    }

    /**
     * 检测TCP是否建立成功（握手设备）
     */
    public void handDevice(){
        JSONObject jsonObj = new JSONObject();
        try {
            jsonObj.put("command", "hello");
            cmd = HAND_DEVICE;
            sendToServer(jsonObj);
        } catch (Exception e) {
            e.printStackTrace();
            sendMessage(DATA_JSON_ERR, "数据解析错误,请重试");
        }
    }

    /***
     * 检测设备是否成功连接到WIFI
     */
    public void checkDeviceWifiStatus() {
        JSONObject jsonCheck = new JSONObject();
        try {
            jsonCheck.put("command", "checkWifi");
            cmd = CHECK_DEVICE_STATUS;
            sendToServer(jsonCheck);
        } catch (JSONException e) {
            e.printStackTrace();
            sendMessage(DATA_JSON_ERR, "数据解析错误,请重试");
        }
    }

    /**
     * 检测设备是否成功连接到WIFI
     * @param delayms
     */
    public void checkDeviceWifiStatus(final int delayms) {
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                checkDeviceWifiStatus();
            }
        }, delayms);
    }

    /***
     * 将选择的WIFI SSID和密码发送至设备
     */
    public void sendWifiInfo(String ssid, String password, String channel, String security){
        JSONObject jsonWifiInfo = new JSONObject();
        JSONObject jsonSetWifi = new JSONObject();
        if(password == null || password.length() <= 0){
            security = "";
        }
        try{
            jsonWifiInfo.put("passwd", password);
            jsonWifiInfo.put("ssid", ssid);
            jsonWifiInfo.put("channel", channel);
            jsonWifiInfo.put("security", security);
            jsonSetWifi.put("value", jsonWifiInfo);
            jsonSetWifi.put("command", "sendWifiInfo");
            cmd = SEND_WIFI_INFO;
            sendToServer(jsonSetWifi);
        }catch (JSONException e) {
            e.printStackTrace();
            sendMessage(DATA_JSON_ERR, "数据解析错误,请重试");
        }
    }

    /***
     * 将设备信息发送到服务器
     */
    public void sendDeviceInfo(String deviceid, String token) {
        String cloud = "EN";
        double zone = TimeZone.getDefault().getRawOffset()/3600000.0f;
        String language = Locale.getDefault().getLanguage();
        if(language.equalsIgnoreCase("zh")){
            cloud = "CN";
        }else{
            cloud = "CN";
        }
        JSONObject jsonSetInfo = new JSONObject();
        JSONObject jsonSet = new JSONObject();
        try {
            jsonSetInfo.put("device_id", deviceid);
            jsonSetInfo.put("access_token", token);
            jsonSetInfo.put("cloud", cloud);
            jsonSetInfo.put("zone", zone);
            jsonSet.put("value", jsonSetInfo);
            jsonSet.put("command", "sendDeviceInfo");
            cmd = SEND_DEVICE_INFO;
            sendToServer(jsonSet);
        } catch (JSONException e) {
            e.printStackTrace();
            sendMessage(DATA_JSON_ERR, "数据解析错误,请重试");
        }
    }

    /**
     * 发送数据到设备服务器
     * @param json
     */
    public void sendToServer(JSONObject json){
        if(!isCancel){
            if(mSocket.isConnected()){
                try {
                    mPrintWriter.print(json.toString().replace("\\", "").trim());
                    mPrintWriter.flush();
                } catch (Exception e) {
                    e.printStackTrace();
                    sendMessage(TCP_SEND_ERR, "数据发送失败,请重试");
                }
            }else{
                sendMessage(TCP_DISCONNECT_ERR, "数据连接中断,请重试");
            }
        }
    }

    /**
     * 设置取消配置
     * @param cancel
     */
    public void setCancel(boolean cancel){
        this.isCancel = cancel;
    }

    /**
     * 创建设备结束
     */
    public void setFinished(){
        this.isFinished = true;
    }

    /**
     * 检测tcp是否连接
     * @return
     */
    public boolean isConnected(){
        if (mSocket!=null){
            return mSocket.isConnected();
        }else {
            return false;
        }
    }
}
