package com.onepavala.app

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.onepavala.app.data.db.AppDatabase
import com.onepavala.app.data.repository.ExpenseRepository

class PavalaApp : Application() {

    val database by lazy { AppDatabase.getDatabase(this) }
    val repository by lazy { ExpenseRepository(database) }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val manager = getSystemService(NotificationManager::class.java)

            val budgetChannel = NotificationChannel(
                CHANNEL_BUDGET_ALERTS,
                getString(R.string.channel_budget_alerts),
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "Alerts when you are approaching your monthly budget limit"
            }

            val reminderChannel = NotificationChannel(
                CHANNEL_EXPENSE_REMINDERS,
                getString(R.string.channel_expense_reminders),
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Daily reminders to record your expenses"
            }

            manager.createNotificationChannels(listOf(budgetChannel, reminderChannel))
        }
    }

    companion object {
        const val CHANNEL_BUDGET_ALERTS = "budget_alerts"
        const val CHANNEL_EXPENSE_REMINDERS = "expense_reminders"
    }
}
