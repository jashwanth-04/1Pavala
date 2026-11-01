package com.onepavala.app.data.dao

import androidx.room.*
import com.onepavala.app.data.entity.NotificationSettings
import kotlinx.coroutines.flow.Flow

@Dao
interface NotificationSettingsDao {
    @Query("SELECT * FROM notification_settings WHERE id = 1 LIMIT 1")
    suspend fun getSettings(): NotificationSettings?

    @Query("SELECT * FROM notification_settings WHERE id = 1 LIMIT 1")
    fun getSettingsFlow(): Flow<NotificationSettings?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrReplace(settings: NotificationSettings)
}
