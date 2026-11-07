package com.onepavala.app.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import com.onepavala.app.MainActivity
import com.onepavala.app.R

/**
 * AppleMediumWidgetProvider
 * 4x2 Apple-style medium home screen widget featuring glanceable
 * budget progress and a tactile 1-tap "Record Expense" action.
 */
class AppleMediumWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    companion object {
        const val ACTION_ADD_EXPENSE = "com.onepavala.app.ACTION_ADD_EXPENSE"

        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val views = RemoteViews(context.packageName, R.layout.widget_apple_medium)

            // Direct 1-tap intent for Record Expense button
            val addExpenseIntent = Intent(context, MainActivity::class.java).apply {
                action = ACTION_ADD_EXPENSE
                putExtra("navigate_to", "add_expense")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            val addPendingIntent = PendingIntent.getActivity(
                context,
                2001,
                addExpenseIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.btn_medium_add_expense, addPendingIntent)

            // Direct intent for tapping the balance/left section to open main overview
            val openAppIntent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            val openAppPendingIntent = PendingIntent.getActivity(
                context,
                2002,
                openAppIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_medium_root, openAppPendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }
}
