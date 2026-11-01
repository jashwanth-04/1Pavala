package com.onepavala.app.data.dao

import androidx.room.*
import com.onepavala.app.data.entity.UserProfile

@Dao
interface UserDao {
    @Query("SELECT * FROM user_profile WHERE userId = 1 LIMIT 1")
    suspend fun getUser(): UserProfile?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrUpdate(user: UserProfile)
}
