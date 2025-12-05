// this is basically a helper for when the popup occures and the user can choose the choice of ignoring the warning 
package com.amberalert.utils;

import android.app.NotificationManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log; 

public class NotificationActionReceiver extends BroadcastReceiver {

    public static final String ACTION_IGNORE_ALERT = "com.amberalert.ACTION_IGNORE_ALERT";
    public static final String EXTRA_NOTIFICATION_ID = "notification_id";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (ACTION_IGNORE_ALERT.equals(intent.getAction())) {
            int id = intent.getIntExtra(EXTRA_NOTIFICATION_ID, 0);
            Log.d("NotificationReceiver", "Ignore clicked for id=" + id);

            if (id != 0) {
                NotificationManager manager =
                        (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
                if (manager != null) {
                    manager.cancel(id);
                }
            }
        }
    }

}
