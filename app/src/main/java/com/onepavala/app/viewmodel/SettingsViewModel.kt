package com.onepavala.app.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.onepavala.app.PavalaApp
import com.onepavala.app.data.entity.NotificationSettings
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class SettingsUiState(
    val userName: String = "",
    val currency: String = "₹",
    val notificationSettings: NotificationSettings? = null,
    val isEditingName: Boolean = false,
    val nameInput: String = "",
    val isLoading: Boolean = true
)

class SettingsViewModel(application: Application) : AndroidViewModel(application) {

    private val repo = (application as PavalaApp).repository

    private val _uiState = MutableStateFlow(SettingsUiState())
    val uiState = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            val userProfile = repo.getUserProfile()
            val notificationSettings = repo.getNotificationSettings()
            _uiState.update {
                it.copy(
                    userName = userProfile?.name ?: "",
                    currency = userProfile?.currency ?: "₹",
                    notificationSettings = notificationSettings,
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

    fun startEditingName() {
        _uiState.update { it.copy(isEditingName = true, nameInput = it.userName) }
    }

    fun updateNameInput(s: String) {
        _uiState.update { it.copy(nameInput = s) }
    }

    fun saveName() {
        val nameInput = _uiState.value.nameInput.trim()
        if (nameInput.isBlank()) return
        viewModelScope.launch {
            val existing = repo.getUserProfile()
            if (existing != null) {
                repo.saveUser(
                    existing.copy(
                        name = nameInput,
                        updatedAt = System.currentTimeMillis()
                    )
                )
            }
            _uiState.update { it.copy(userName = nameInput, isEditingName = false) }
        }
    }

    fun cancelEditName() {
        _uiState.update { it.copy(isEditingName = false) }
    }

    fun toggleExpenseReminders(enabled: Boolean) {
        updateNotificationSettings { it.copy(expenseRemindersEnabled = enabled) }
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
