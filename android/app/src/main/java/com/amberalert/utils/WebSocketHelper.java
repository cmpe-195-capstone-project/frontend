package com.amberalert.utils;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Objects;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okio.ByteString;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import androidx.core.app.NotificationCompat;

import com.amberalert.R;
import com.amberalert.utils.NotificationActionReceiver;



public class WebSocketHelper {
    private NotificationHelper notificationHelper;
    private WebSocket ws;
    private OkHttpClient client;

    public static final String BASE_WS = "ws://18.222.188.44/ws";
    // public static final String BASE_WS = "ws://10.0.2.2:8000/ws";

    private String id;

    private Context ctx;

    public WebSocketHelper(Context ctx, String id) {
        this.ctx = ctx;
        this.id = id;
        this.notificationHelper = new NotificationHelper(ctx);
    }
    public void startSocket() {
        client = new OkHttpClient();

        Request request = new Request.Builder()
                .url(BASE_WS + "/alert?id=" + this.id)
                .build();

        ws = client.newWebSocket(request, new WebSocketListener() {
            // Called after connection is fully closed
            @Override
            public void onClosed(@NonNull WebSocket webSocket, int code, @NonNull String reason) {
                super.onClosed(webSocket, code, reason);
            }

            // Called when the server stops connection
            @Override
            public void onClosing(@NonNull WebSocket webSocket, int code, @NonNull String reason) {
                super.onClosing(webSocket, code, reason);
            }

            // Called when there is some sort of connection error
            @Override
            public void onFailure(@NonNull WebSocket webSocket, @NonNull Throwable t, @Nullable Response response) {
                Log.d("Websocket", "Failed to connect to websocket");
            }

            // Called when the server sends a message
            @Override
            public void onMessage(@NonNull WebSocket webSocket, @NonNull String text) {
                Log.d("Websocket", "Received text: " + text);
                try {
                    // Try to parse the text as JSON
                    JSONObject json = new JSONObject(text);
                    String type = json.optString("type");

                    if (type.equals("fire_alert")) {
                        JSONArray fires = json.getJSONArray("fires");

                        double safeLat = json.optDouble("safe_latitude", Double.NaN);
                        double safeLng = json.optDouble("safe_longitude", Double.NaN);
                        boolean hasSafe = !Double.isNaN(safeLat) && !Double.isNaN(safeLng);

                        for (int i = 0; i < fires.length(); i++) {
                            JSONObject fire = fires.getJSONObject(i);

                            String name = fire.getString("name");
                            String fireType = fire.getString("fire_type");
                            String location = fire.getString("location");
                            String acresBurned = fire.getString("acres_burned");

                            String title = String.format("%s - %s", fireType, name);
                            String message = String.format("%s burned at: %s", acresBurned, location);

                            if (hasSafe) {
                                showEvacNotification(title, message, safeLat, safeLng);
                            } else {
                                notificationHelper.sendNotification(title, message);
                            }
                        }
                    }

                } catch (Exception e) {
                    Log.d("Websocket", "Error parsing JSON: " + e.getMessage());
                }
            }

            // Called when the server sends a message (binary data)
            @Override
            public void onMessage(@NonNull WebSocket webSocket, @NonNull ByteString bytes) {
                super.onMessage(webSocket, bytes);
            }

            // Called when websocket connection opens successfully
            @Override
            public void onOpen(@NonNull WebSocket webSocket, @NonNull Response response) {
                // When the connection first connects send users location of the default location
                Log.d("Websocket", "Connection opened");
            }
        });
    }
    public void sendLocationUpdate(double latitude, double longitude) {
        Log.d("Websocket", "Here is the update location - longitude: " + longitude + " and latitude: " + latitude  + ", I am sending to server");
        if(ws != null) {
            try {
                JSONObject json = new JSONObject();
                json.put("type", "update_location");
                json.put("latitude", latitude);
                json.put("longitude", longitude);
                json.put("radius", 5000);

                ws.send(json.toString());
                Log.d("Websocket", "I sent data to server: " + json.toString());
            } catch (Exception e) {
                Log.e("Websocket", "Failed to send update: " + e.getMessage());
            }
        }
    }

    private void showEvacNotification(String title, String message, double safeLat, double safeLng) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    NotificationHelper.CHANNEL_ID,
                    NotificationHelper.CHANNEL_NAME,
                    NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription(NotificationHelper.CHANNEL_DESC);

            NotificationManager manager = ctx.getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }

        int notificationId = (int) System.currentTimeMillis();

        NotificationCompat.Builder builder =
                new NotificationCompat.Builder(this.ctx, NotificationHelper.CHANNEL_ID)
                        .setContentTitle(title)
                        .setContentText(message)
                        .setStyle(new NotificationCompat.BigTextStyle().bigText(message))
                        .setSmallIcon(R.drawable.noti_icon)
                        .setPriority(NotificationCompat.PRIORITY_HIGH)
                        .setCategory(NotificationCompat.CATEGORY_ALARM)
                        .setAutoCancel(true);

        // Navigate → Google Maps to safe zone
        Uri gmmIntentUri = Uri.parse("google.navigation:q=" + safeLat + "," + safeLng + "&mode=d");
        Intent mapIntent = new Intent(Intent.ACTION_VIEW, gmmIntentUri);
        mapIntent.setPackage("com.google.android.apps.maps");

        PendingIntent navigatePendingIntent = PendingIntent.getActivity(
                ctx,
                1,
                mapIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        builder.addAction(R.drawable.noti_icon, "Navigate", navigatePendingIntent);

        // Ignore → cancel this notification
        Intent ignoreIntent = new Intent(ctx, NotificationActionReceiver.class);
        ignoreIntent.setAction(NotificationActionReceiver.ACTION_IGNORE_ALERT);
        ignoreIntent.putExtra(NotificationActionReceiver.EXTRA_NOTIFICATION_ID, notificationId);

        PendingIntent ignorePendingIntent = PendingIntent.getBroadcast(
                ctx,
                2,
                ignoreIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        builder.addAction(R.drawable.noti_icon, "Ignore", ignorePendingIntent);

        Notification notification = builder.build();

        NotificationManager manager =
                (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);

        if (manager != null) {
            manager.notify(notificationId, notification);
        }
    }
}
