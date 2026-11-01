package com.onepavala.app.data.dao

import androidx.room.*
import com.onepavala.app.data.entity.Expense
import kotlinx.coroutines.flow.Flow

@Dao
interface ExpenseDao {
    @Query("SELECT * FROM expenses WHERE expenseDate >= :startOfMonth AND expenseDate < :endOfMonth ORDER BY expenseDate DESC")
    fun getExpensesByMonth(startOfMonth: Long, endOfMonth: Long): Flow<List<Expense>>

    @Query("SELECT * FROM expenses ORDER BY expenseDate DESC LIMIT :limit")
    fun getRecentExpenses(limit: Int): Flow<List<Expense>>

    @Query("SELECT * FROM expenses ORDER BY expenseDate DESC")
    fun getAllExpenses(): Flow<List<Expense>>

    @Query("SELECT * FROM expenses WHERE expenseId = :id LIMIT 1")
    suspend fun getExpenseById(id: Long): Expense?

    @Query("SELECT COALESCE(SUM(amount), 0.0) FROM expenses WHERE expenseDate >= :startOfMonth AND expenseDate < :endOfMonth")
    suspend fun getTotalForMonth(startOfMonth: Long, endOfMonth: Long): Double

    @Insert
    suspend fun insertExpense(expense: Expense): Long

    @Update
    suspend fun updateExpense(expense: Expense)

    @Delete
    suspend fun deleteExpense(expense: Expense)
}
