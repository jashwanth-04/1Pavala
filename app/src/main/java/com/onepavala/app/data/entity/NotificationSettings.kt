package com.onepavala.app.data.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "notification_settings")
data class NotificationSettings(
    @PrimaryKey val id: Int = 1,
    val expenseRemindersEnabled: Boolean = true,
    val budgetAlertsEnabled: Boolean = true,
    val budget75Enabled: Boolean = true,
    val budget90Enabled: Boolean = true,
    val budget100Enabled: Boolean = true,
    val reminderTime: String = "20:00"
)
