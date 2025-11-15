package com.amberalert.utils;

import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import org.json.JSONObject;

import java.util.Objects;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.WebSocket;
import okhttp3.WebSocketListener;
import okio.ByteString;

public class WebSocketHelper {
    private NotificationHelper notificationHelper;
    private WebSocket ws;
    private OkHttpClient client;
    // TODO: Store this in environment var later
    public static final String BASE_WS = "ws://10.0.2.2:8000/ws";
    private String id;
    private String latitude;
    private String longitude;
    private Context ctx;

    public WebSocketHelper(Context ctx, String id, String latitude, String longitude) {
        this.ctx = ctx;
        this.id = id;
        this.latitude = latitude;
        this.longitude = longitude;
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
                notificationHelper.sendNotification("new notifcation", text);
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
                Log.d("Websocket", "Here is the longitude: " + longitude + " and latitude: " + latitude  + " - i am sending to server");
                try {
                    JSONObject obj = new JSONObject();

                    obj.put("latitude", latitude);
                    obj.put("longitude", longitude);

                    webSocket.send(obj.toString());
                    Log.d("Websocket", "I sent data to server" + obj.toString());
                } catch (Exception e) {
                    Log.e("Websocket", "JSON error: " + e.getMessage());
                }

                Log.d("Websocket", "Connection opened");
            }
        });
    }
}
