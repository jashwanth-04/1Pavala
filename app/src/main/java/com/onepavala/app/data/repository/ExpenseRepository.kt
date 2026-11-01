package com.onepavala.app.data.repository

import com.onepavala.app.data.db.AppDatabase
import com.onepavala.app.data.entity.Budget
import com.onepavala.app.data.entity.Category
import com.onepavala.app.data.entity.Expense
import com.onepavala.app.data.entity.NotificationSettings
import com.onepavala.app.data.entity.UserProfile
import kotlinx.coroutines.flow.Flow

class ExpenseRepository(private val db: AppDatabase) {

    // ── User ─────────────────────────────────────────────────────────────────

    suspend fun getUserProfile(): UserProfile? = db.userDao().getUser()

    suspend fun saveUser(user: UserProfile) = db.userDao().insertOrUpdate(user)

    // ── Categories ────────────────────────────────────────────────────────────

    fun getActiveCategories(): Flow<List<Category>> =
        db.categoryDao().getActiveCategories()

    suspend fun getCategoryById(id: Long): Category? =
        db.categoryDao().getCategoryById(id)

    // ── Expenses ──────────────────────────────────────────────────────────────

    fun getExpensesByMonth(month: Int, year: Int): Flow<List<Expense>> {
        val (start, end) = getMonthRange(month, year)
        return db.expenseDao().getExpensesByMonth(start, end)
    }

    fun getRecentExpenses(limit: Int = 10): Flow<List<Expense>> =
        db.expenseDao().getRecentExpenses(limit)

    fun getAllExpenses(): Flow<List<Expense>> =
        db.expenseDao().getAllExpenses()

    suspend fun addExpense(expense: Expense): Long =
        db.expenseDao().insertExpense(expense)

    suspend fun updateExpense(expense: Expense) =
        db.expenseDao().updateExpense(expense)

    suspend fun deleteExpense(expense: Expense) =
        db.expenseDao().deleteExpense(expense)

    suspend fun getExpenseById(id: Long): Expense? =
        db.expenseDao().getExpenseById(id)

    /** Returns 0.0 if there are no expenses in the given month. */
    suspend fun getMonthlyTotal(month: Int, year: Int): Double {
        val (start, end) = getMonthRange(month, year)
        return db.expenseDao().getTotalForMonth(start, end)
    }

    // ── Budget ────────────────────────────────────────────────────────────────

    suspend fun getBudgetForMonth(month: Int, year: Int): Budget? =
        db.budgetDao().getBudgetForMonth(month, year)

    fun getBudgetForMonthFlow(month: Int, year: Int): Flow<Budget?> =
        db.budgetDao().getBudgetForMonthFlow(month, year)

    suspend fun saveBudget(budget: Budget) =
        db.budgetDao().insertOrReplace(budget)

    // ── Notification Settings ─────────────────────────────────────────────────

    /** Returns a default [NotificationSettings] instance if none is stored yet. */
    suspend fun getNotificationSettings(): NotificationSettings =
        db.notificationSettingsDao().getSettings() ?: NotificationSettings()

    suspend fun saveNotificationSettings(settings: NotificationSettings) =
        db.notificationSettingsDao().insertOrReplace(settings)

    fun getNotificationSettingsFlow(): Flow<NotificationSettings?> =
        db.notificationSettingsDao().getSettingsFlow()

    // ── Private Helpers ───────────────────────────────────────────────────────

    private fun getMonthRange(month: Int, year: Int): Pair<Long, Long> {
        val cal = java.util.Calendar.getInstance()
        cal.set(year, month - 1, 1, 0, 0, 0)
        cal.set(java.util.Calendar.MILLISECOND, 0)
        val start = cal.timeInMillis
        cal.add(java.util.Calendar.MONTH, 1)
        val end = cal.timeInMillis
        return Pair(start, end)
    }
}
