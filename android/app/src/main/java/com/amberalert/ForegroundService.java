package com.amberalert;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.amberalert.utils.NotificationHelper;
import com.amberalert.utils.WebSocketHelper;

import java.util.concurrent.locks.ReadWriteLock;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okio.ByteString;

public class ForegroundService extends Service {

    public static final String CHANNEL_ID = "emberalert_channel";
    // TODO: Store this in environment var later
    public static final String BASE_WS = "ws://localhost:8000/ws";
    private WebSocket ws;
    private OkHttpClient client;
    private NotificationHelper notificationHelper;

    @Override
    public void onCreate() {
        super.onCreate();
        notificationHelper = new NotificationHelper(this);
        notificationHelper.createChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        String id = intent.getStringExtra("id");
        if (id == null) id = "N/A";
        String lon = intent.getStringExtra("longitude");
        String lat = intent.getStringExtra("latitude");

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Ember Alert Active")
                .setContentText("Monitoring alerts in real-time…")
                .setSmallIcon(R.drawable.noti_icon)
                .setOngoing(true)
                .build();

        // Android 12/13/14 safe start
        if (Build.VERSION.SDK_INT >= 34) {
            startForeground(
                    1,
                    notification,
                    ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC
            );
        } else {
            startForeground(1, notification);
        }
        WebSocketHelper wsHelper = new WebSocketHelper(this, id, lat, lon);
        wsHelper.startSocket();
        return START_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null; // this is a started service, not bound

    }
}
