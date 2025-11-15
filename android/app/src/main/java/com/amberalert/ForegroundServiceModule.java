package com.amberalert;

import android.os.Build;

import androidx.annotation.NonNull;

import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.content.Intent;

public class ForegroundServiceModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    ForegroundServiceModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "ForegroundServiceModule";
    }

    @ReactMethod
    public void startService(String id, String latitude, String longitude) {
        Intent serviceIntent = new Intent(reactContext, ForegroundService.class);
        serviceIntent.putExtra("id", id);
        serviceIntent.putExtra("longitude", longitude);
        serviceIntent.putExtra("latitude", latitude);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactContext.startForegroundService(serviceIntent);
        } else {
            reactContext.startService(serviceIntent);
        }
    }

    @ReactMethod
    public void stopService() {
        Intent serviceIntent = new Intent(reactContext, ForegroundService.class);
        reactContext.stopService(serviceIntent);
    }
}
