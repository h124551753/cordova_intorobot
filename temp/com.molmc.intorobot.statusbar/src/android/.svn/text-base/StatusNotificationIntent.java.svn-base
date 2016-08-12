/*
 * @Title:  StatusNotificationIntent.java
 * @Copyright:  MOLMC Co., Ltd. Copyright 2013-2015,  All rights reserved
 * @Description:  TODO<请描述此文件是做什么的>
 * @author:  hhe
 * @data:  15 Aug, 2015 8:23:49 pm
 * @version:  V1.0
 */ 
package com.molmc.intorobot.statusbar;

import android.app.Notification;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;

import com.molmc.intorobot.R;

/**
 * @author hhe
 *
 */
public class StatusNotificationIntent {
    public static Notification buildNotification( Context context, CharSequence tag, CharSequence contentTitle, CharSequence contentText, int flag ) {
        int icon = R.drawable.notification;
        long when = System.currentTimeMillis();
        Notification noti = new Notification(icon, contentTitle, when);
        noti.flags |= flag;

        PackageManager pm = context.getPackageManager();
        Intent notificationIntent = pm.getLaunchIntentForPackage(context.getPackageName());
        notificationIntent.addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        notificationIntent.putExtra("notificationTag", tag);

        PendingIntent contentIntent = PendingIntent.getActivity(context, 0, notificationIntent, 0);
        noti.setLatestEventInfo(context, contentTitle, contentText, contentIntent);
        return noti;
    }
}