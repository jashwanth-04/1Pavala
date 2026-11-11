package com.onepavala.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;

public class QuickRecordWidgetProvider extends AppWidgetProvider {

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_quick_record);

        // 1. Record Expense Action (Opens Floating Dialog)
        Intent recordIntent = new Intent(context, FloatingActionActivity.class);
        recordIntent.setAction("com.onepavala.app.ACTION_RECORD_EXPENSE");
        recordIntent.putExtra("mode", "floating");
        recordIntent.putExtra("action", "add");
        recordIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent recordPendingIntent = PendingIntent.getActivity(
                context, 
                1001, 
                recordIntent, 
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_btn_record, recordPendingIntent);

        // 2. Recent Transactions Action (Opens Floating Dialog)
        Intent recentIntent = new Intent(context, FloatingActionActivity.class);
        recentIntent.setAction("com.onepavala.app.ACTION_RECENT_TRANSACTIONS");
        recentIntent.putExtra("mode", "floating");
        recentIntent.putExtra("action", "recent");
        recentIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent recentPendingIntent = PendingIntent.getActivity(
                context, 
                1002, 
                recentIntent, 
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_btn_recent, recentPendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
