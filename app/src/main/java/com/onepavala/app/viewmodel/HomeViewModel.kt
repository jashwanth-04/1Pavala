package com.onepavala.app.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.onepavala.app.PavalaApp
import com.onepavala.app.data.entity.Budget
import com.onepavala.app.data.entity.Category
import com.onepavala.app.data.entity.Expense
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.util.Calendar

data class HomeUiState(
    val userName: String = "",
    val currency: String = "₹",
    val currentMonthTotal: Double = 0.0,
    val budget: Budget? = null,
    val recentExpenses: List<Expense> = emptyList(),
    val categories: List<Category> = emptyList(),
    val isLoading: Boolean = true,
    val currentMonth: Int = Calendar.getInstance().get(Calendar.MONTH) + 1,
    val currentYear: Int = Calendar.getInstance().get(Calendar.YEAR)
)

class HomeViewModel(application: Application) : AndroidViewModel(application) {

    private val repo = (application as PavalaApp).repository

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState = _uiState.asStateFlow()

    val budgetPercentage: Float
        get() {
            val state = _uiState.value
            return (state.currentMonthTotal / (state.budget?.amount ?: 1.0))
                .toFloat()
                .coerceIn(0f, 1f)
        }

    init {
        val calendar = Calendar.getInstance()
        val currentMonth = calendar.get(Calendar.MONTH) + 1
        val currentYear = calendar.get(Calendar.YEAR)

        // Collect categories and recent expenses together
        viewModelScope.launch {
            combine(
                repo.getActiveCategories(),
                repo.getRecentExpenses(10)
            ) { categories, recentExpenses ->
                Pair(categories, recentExpenses)
            }.collect { (categories, recentExpenses) ->
                _uiState.update {
                    it.copy(
                        categories = categories,
                        recentExpenses = recentExpenses
                    )
                }
            }
        }

        // Load user profile, monthly total, and budget
        viewModelScope.launch {
            val userProfile = repo.getUserProfile()
            val monthlyTotal = repo.getMonthlyTotal(currentMonth, currentYear)
            val budget = repo.getBudgetForMonth(currentMonth, currentYear)
            _uiState.update {
                it.copy(
                    userName = userProfile?.name ?: "",
                    currency = userProfile?.currency ?: "₹",
                    currentMonthTotal = monthlyTotal,
                    budget = budget,
                    isLoading = false
                )
            }
        }

        // Collect live budget updates
        viewModelScope.launch {
            repo.getBudgetForMonthFlow(currentMonth, currentYear).collect { budget ->
                _uiState.update { it.copy(budget = budget) }
            }
        }
    }

    fun deleteExpense(expense: Expense) {
        viewModelScope.launch {
            repo.deleteExpense(expense)
            // Refresh monthly total after deletion
            val state = _uiState.value
            val newTotal = repo.getMonthlyTotal(state.currentMonth, state.currentYear)
            _uiState.update { it.copy(currentMonthTotal = newTotal) }
        }
    }
}
