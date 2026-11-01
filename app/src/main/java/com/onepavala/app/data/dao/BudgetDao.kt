package com.onepavala.app.data.dao

import androidx.room.*
import com.onepavala.app.data.entity.Budget
import kotlinx.coroutines.flow.Flow

@Dao
interface BudgetDao {
    @Query("SELECT * FROM budgets WHERE month = :month AND year = :year LIMIT 1")
    suspend fun getBudgetForMonth(month: Int, year: Int): Budget?

    @Query("SELECT * FROM budgets WHERE month = :month AND year = :year LIMIT 1")
    fun getBudgetForMonthFlow(month: Int, year: Int): Flow<Budget?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertOrReplace(budget: Budget)

    @Update
    suspend fun updateBudget(budget: Budget)
}
