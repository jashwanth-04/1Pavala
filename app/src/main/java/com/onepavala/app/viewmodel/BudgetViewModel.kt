package com.onepavala.app.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.onepavala.app.PavalaApp
import com.onepavala.app.data.entity.Budget
import com.onepavala.app.data.entity.NotificationSettings
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.util.Calendar

data class BudgetUiState(
    val budget: Budget? = null,
    val currentSpent: Double = 0.0,
    val inputAmount: String = "",
    val isEditing: Boolean = false,
    val notificationSettings: NotificationSettings? = null,
    val currentMonth: Int = Calendar.getInstance().get(Calendar.MONTH) + 1,
    val currentYear: Int = Calendar.getInstance().get(Calendar.YEAR),
    val isLoading: Boolean = true
) {
    val budgetPercentage: Float
        get() = (currentSpent / (budget?.amount ?: 1.0)).toFloat().coerceIn(0f, 1f)

    val remainingAmount: Double
        get() = (budget?.amount ?: 0.0) - currentSpent
}

class BudgetViewModel(application: Application) : AndroidViewModel(application) {

    private val repo = (application as PavalaApp).repository

    private val _uiState = MutableStateFlow(BudgetUiState())
    val uiState = _uiState.asStateFlow()

    init {
        val calendar = Calendar.getInstance()
        val currentMonth = calendar.get(Calendar.MONTH) + 1
        val currentYear = calendar.get(Calendar.YEAR)

        // Collect live budget updates
        viewModelScope.launch {
            repo.getBudgetForMonthFlow(currentMonth, currentYear).collect { budget ->
                _uiState.update { it.copy(budget = budget) }
            }
        }

        // Load notification settings and monthly total
        viewModelScope.launch {
            val settings = repo.getNotificationSettings()
            val spent = repo.getMonthlyTotal(currentMonth, currentYear)
            _uiState.update {
                it.copy(
                    notificationSettings = settings,
                    currentSpent = spent,
                    isLoading = false
                )
            }
        }

        // Collect live notification settings
        viewModelScope.launch {
            repo.getNotificationSettingsFlow().collect { settings ->
                if (settings != null) {
                    _uiState.update { it.copy(notificationSettings = settings) }
                }
            }
        }
    }

    fun startEditing() {
        val currentBudget = _uiState.value.budget
        _uiState.update {
            it.copy(
                isEditing = true,
                inputAmount = currentBudget?.amount?.let { amt ->
                    if (amt == amt.toLong().toDouble()) amt.toLong().toString() else amt.toString()
                } ?: ""
            )
        }
    }

    fun updateInput(s: String) {
        // Only allow numeric input (digits and one decimal point)
        val filtered = s.filter { it.isDigit() || it == '.' }
        val dotCount = filtered.count { it == '.' }
        val validInput = if (dotCount > 1) {
            val firstDot = filtered.indexOf('.')
            filtered.substring(0, firstDot + 1) + filtered.substring(firstDot + 1).replace(".", "")
        } else filtered
        _uiState.update { it.copy(inputAmount = validInput) }
    }

    fun saveBudget() {
        val state = _uiState.value
        val amount = state.inputAmount.toDoubleOrNull() ?: return
        if (amount <= 0) return

        viewModelScope.launch {
            val now = System.currentTimeMillis()
            val existingBudget = state.budget
            val budget = existingBudget?.copy(amount = amount, updatedAt = now)
                ?: Budget(
                    month = state.currentMonth,
                    year = state.currentYear,
                    amount = amount,
                    createdAt = now,
                    updatedAt = now
                )
            repo.saveBudget(budget)
            _uiState.update { it.copy(isEditing = false) }
        }
    }

    fun cancelEditing() {
        _uiState.update { it.copy(isEditing = false) }
    }

    fun toggleBudget75(enabled: Boolean) {
        updateNotificationSettings { it.copy(budget75Enabled = enabled) }
    }

    fun toggleBudget90(enabled: Boolean) {
        updateNotificationSettings { it.copy(budget90Enabled = enabled) }
    }

    fun toggleBudget100(enabled: Boolean) {
        updateNotificationSettings { it.copy(budget100Enabled = enabled) }
    }

    fun toggleBudgetAlerts(enabled: Boolean) {
        updateNotificationSettings { it.copy(budgetAlertsEnabled = enabled) }
    }

    private fun updateNotificationSettings(transform: (NotificationSettings) -> NotificationSettings) {
        val current = _uiState.value.notificationSettings ?: NotificationSettings(
            expenseRemindersEnabled = true,
            budgetAlertsEnabled = true,
            budget75Enabled = true,
            budget90Enabled = true,
            budget100Enabled = true,
            reminderTime = "21:00"
        )
        val updated = transform(current)
        _uiState.update { it.copy(notificationSettings = updated) }
        viewModelScope.launch {
            repo.saveNotificationSettings(updated)
        }
    }
}
