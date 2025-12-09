package com.amberalert;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Binder;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.amberalert.utils.NotificationHelper;
import com.amberalert.utils.WebSocketHelper;

import java.util.concurrent.ScheduledExecutorService;

import okhttp3.OkHttpClient;
import okhttp3.WebSocket;


public class ForegroundService extends Service {

    public static final String CHANNEL_ID = "emberalert_channel";
    // TODO: Store this in environment var later
    public static final String BASE_WS = "ws://localhost:8000/ws";
    private OkHttpClient client;
    private NotificationHelper notificationHelper;
    public static ForegroundService Instance;
    private WebSocketHelper wsHelper;

    public class LocalBinder extends Binder {
        public ForegroundService getService() {
            // Return this instance of the service so callers can use it
            return ForegroundService.this;
        }
    }

    private final IBinder binder = new LocalBinder();

    @Override
    public void onCreate() {
        super.onCreate();
        notificationHelper = new NotificationHelper(this);
        notificationHelper.createChannel();
        Instance = this;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        String id = intent.getStringExtra("id");
        if (id == null) id = "N/A";

        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Ember Alert Notifications Active")
                .setContentText("Monitoring alerts...")
                .setSmallIcon(R.drawable.noti_icon)
                .setOngoing(false)
                .setSilent(true)
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
        wsHelper = new WebSocketHelper(this, id);
        wsHelper.startSocket();
        return START_STICKY;
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    public void sendLocationUpdate(double latitude, double longitude) {
        if (wsHelper != null) {
            wsHelper.sendLocationUpdate(latitude, longitude);
        }
    }

}
