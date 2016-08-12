package com.molmc.intorobot.statusbar;
 
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;
 
public class StatusBarNotification extends CordovaPlugin {
    //  Action to execute
    public static final String NOTIFY = "notify";
    public static final String CLEAR = "clear";
    private boolean isDownloadSuc = false;

    /**
     *  Executes the request and returns PluginResult
     *
     *  @param action       Action to execute
     *  @param data         JSONArray of arguments to the plugin
     *  @param callbackContext  The callback context used when calling back into JavaScript.
     *
     *  @return             A PluginRequest object with a status
     * */
    @Override
    public boolean execute(String action, JSONArray data, CallbackContext callbackContext) {
        boolean actionValid = true;
        if (NOTIFY.equals(action)) {
            try {
                String tag = data.getString(0);
                String title = data.getString(1);
                String body = data.getString(2);
                String flag = data.getString(3);
                isDownloadSuc = data.getBoolean(4);
                Log.d("NotificationPlugin", "Notification: " + tag + ", " + title + ", " + body);
                int notificationFlag = getFlagValue(flag);
                showNotification(tag, title, body, notificationFlag);                
                if(isDownloadSuc){
                    try {
                        Thread.sleep(2000);
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                    installApp();
                }
            } catch (JSONException jsonEx) {
                Log.d("NotificationPlugin", "Got JSON Exception " + jsonEx.getMessage());
                actionValid = false;
            }
        } else if (CLEAR.equals(action)){
            try {
                String tag = data.getString(0);
                Log.d("NotificationPlugin", "Notification cancel: " + tag);
                clearNotification(tag);
            } catch (JSONException jsonEx) {
                Log.d("NotificationPlugin", "Got JSON Exception " + jsonEx.getMessage());
                actionValid = false;
            }
        } else {
            actionValid = false;
            Log.d("NotificationPlugin", "Invalid action : "+action+" passed");
        }
        return actionValid;
    }

    /**
     * Helper method that returns a flag value to be used for notification
     * by default it will return 16 representing FLAG_NO_CLEAR
     * 
     * @param flag
     * @return int value of the flag
     */
    private int getFlagValue(String flag) {
        int flagVal = Notification.FLAG_AUTO_CANCEL;
        
        // We trust the flag value as it comes from our JS constant.
        // This is also backwards compatible as it will be emtpy.
        if (flag!=null & flag.length()!=0){
            flagVal = Integer.parseInt(flag);
        }        
        return flagVal;
    }

    /**
     *  Displays status bar notification
     *
     *  @param tag Notification tag.
     *  @param contentTitle Notification title
     *  @param contentText  Notification text
     * */
    public void showNotification( CharSequence tag, CharSequence contentTitle, CharSequence contentText, int flag) {
        String ns = Context.NOTIFICATION_SERVICE;
        context = cordova.getActivity().getApplicationContext();
        mNotificationManager = (NotificationManager) context.getSystemService(ns);

        Notification noti = StatusNotificationIntent.buildNotification(context, tag, contentTitle, contentText, flag);
        mNotificationManager.notify(tag.hashCode(), noti);
    }

    /**
     * Cancels a single notification by tag.
     *
     * @param tag Notification tag to cancel.
     */
    public void clearNotification(String tag) {
        mNotificationManager.cancel(tag.hashCode());
    }

    /**
     * Removes all Notifications from the status bar.
     */
    public void clearAllNotifications() {
        mNotificationManager.cancelAll();
    }

    private void installApp(){
        String filePath = "/sdcard/IntoRobot/IntoRobot.apk";
        Uri uri = Uri.parse("file://"+ filePath);
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        intent.addCategory("android.intent.category.DEFAULT");
        intent.setDataAndType(uri, "application/vnd.android.package-archive");
        cordova.getActivity().getApplicationContext().startActivity(intent);
        System.exit(0);
    }
    
    /**
     * Called when a notification is clicked.
     * @param intent The new Intent passed from the notification.
     */
    @Override
    public void onNewIntent(Intent intent) {
        // The incoming Intent may or may not have been for a notification.
        String tag = intent.getStringExtra("notificationTag");
        if (tag != null) {
            this.webView.sendJavascript("window.Notification.callOnclickByTag('" + tag + "')");
        }
        Log.i("onNewIntent","clicked notification, please install your app");
        // 下载完成，点击安装 
        if(isDownloadSuc){
            installApp();
        }
    }
    private NotificationManager mNotificationManager;
    private Context context;
}