package com.amberalert.utils;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;

import androidx.core.app.NotificationCompat;

import com.amberalert.R;
import com.amberalert.utils.NotificationActionReceiver;

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

    public void sendEvacNotification(String title, String message, double safeLat, double safeLng) {
        // make sure channel exists
        createChannel();

        int notificationId = (int) System.currentTimeMillis();

        NotificationCompat.Builder builder =
                new NotificationCompat.Builder(this.ctx, CHANNEL_ID)
                        .setContentTitle(title)
                        .setContentText(message)
                        .setStyle(new NotificationCompat.BigTextStyle().bigText(message))
                        .setSmallIcon(R.drawable.noti_icon)
                        .setPriority(NotificationCompat.PRIORITY_HIGH)
                        .setCategory(NotificationCompat.CATEGORY_ALARM)
                        .setAutoCancel(true);

        // --- Navigate action: open Google Maps navigation to the safe zone ---
        Uri gmmIntentUri = Uri.parse("google.navigation:q=" + safeLat + "," + safeLng + "&mode=d");
        Intent mapIntent = new Intent(Intent.ACTION_VIEW, gmmIntentUri);
        mapIntent.setPackage("com.google.android.apps.maps");

        PendingIntent navigatePendingIntent = PendingIntent.getActivity(
                ctx,
                1,
                mapIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        builder.addAction(
                R.drawable.noti_icon,   // you can change this to a better icon
                "Navigate",
                navigatePendingIntent
        );

        // --- Ignore action: cancel this notification via NotificationActionReceiver ---
        Intent ignoreIntent = new Intent(ctx, NotificationActionReceiver.class);
        ignoreIntent.setAction(NotificationActionReceiver.ACTION_IGNORE_ALERT);
        ignoreIntent.putExtra(NotificationActionReceiver.EXTRA_NOTIFICATION_ID, notificationId);

        PendingIntent ignorePendingIntent = PendingIntent.getBroadcast(
                ctx,
                2,
                ignoreIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        builder.addAction(
                R.drawable.noti_icon,   // you can change this to a close icon
                "Ignore",
                ignorePendingIntent
        );

        Notification notification = builder.build();

        NotificationManager manager =
                (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);

        if (manager != null) {
            manager.notify(notificationId, notification);
        }
    }
}
