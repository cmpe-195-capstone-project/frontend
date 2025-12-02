package com.amberalert.utils;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;

import android.content.Context;
import android.os.Build;

import androidx.core.app.NotificationCompat;

import com.amberalert.R;

public class NotificationHelper {

    public static final String CHANNEL_ID = "emberalert_channel";
    public static final String CHANNEL_NAME = "Ember Alert";
    public static final String CHANNEL_DESC = "Realtime emergency notifications";
    private final Context ctx;

    public NotificationHelper(Context ctx) {
        this.ctx = ctx.getApplicationContext();
    }

    public void createChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_HIGH);
            channel.setDescription(CHANNEL_DESC);

            NotificationManager manager = ctx.getSystemService(NotificationManager.class);
            manager.createNotificationChannel(channel);
        }
    }

    public void sendNotification(String title, String message) {
        Notification notification = new NotificationCompat.Builder(ctx, CHANNEL_ID)
                .setContentTitle(title)
                .setContentText(message)
                .setSmallIcon(R.drawable.noti_icon)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .build();

        NotificationManager manager = null;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            manager = ctx.getSystemService(NotificationManager.class);
        }

        if (manager != null) {
            manager.notify((int) System.currentTimeMillis(), notification);
        }
    }
}
