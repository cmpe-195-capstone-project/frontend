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

public class WebSocketHelper {
    private NotificationHelper notificationHelper;
    private WebSocket ws;
    private OkHttpClient client;
    // TODO: Store this in environment var later
    public static final String BASE_WS = "ws://10.0.2.2:8000/ws";
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

                        for(int i = 0; i < fires.length(); i++) {
                            String name = json.getString("name");
                            String fireType = json.getString("fire_type");
                            String location = json.getString("location");
                            String acresBurned = json.getString("acres_burned");

                            String title = String.format("%s - %s", fireType, name);
                            String message = String.format("%s burned at: %s", acresBurned, location);

                            notificationHelper.sendNotification(title, message);
                        }
                    } else if (type.equals("message")) {
                        String message = json.getString("message");
                        notificationHelper.sendNotification("Ember Alert", message);
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


                ws.send(json.toString());
                Log.d("Websocket", "I sent data to server: " + json.toString());
            } catch (Exception e) {
                Log.e("Websocket", "Failed to send update: " + e.getMessage());
            }
        }
    }
}
