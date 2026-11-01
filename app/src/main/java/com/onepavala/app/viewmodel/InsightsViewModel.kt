package com.onepavala.app.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.onepavala.app.PavalaApp
import com.onepavala.app.data.entity.Category
import com.onepavala.app.data.entity.Expense
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.util.Calendar

data class CategoryBreakdown(
    val category: Category,
    val total: Double,
    val percentage: Float
)

data class MonthlyHistory(
    val month: Int,
    val year: Int,
    val total: Double,
    val label: String
)

data class InsightsUiState(
    val categories: List<Category> = emptyList(),
    val categoryBreakdown: List<CategoryBreakdown> = emptyList(),
    val monthlyHistory: List<MonthlyHistory> = emptyList(),
    val selectedMonth: Int = Calendar.getInstance().get(Calendar.MONTH) + 1,
    val selectedYear: Int = Calendar.getInstance().get(Calendar.YEAR),
    val totalSpent: Double = 0.0,
    val isLoading: Boolean = true
)

class InsightsViewModel(application: Application) : AndroidViewModel(application) {

    private val repo = (application as PavalaApp).repository

    private val _uiState = MutableStateFlow(InsightsUiState())
    val uiState = _uiState.asStateFlow()

    // Cache all expenses and categories for recalculations
    private var allExpenses: List<Expense> = emptyList()
    private var allCategories: List<Category> = emptyList()

    private val monthAbbreviations = listOf(
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    )

    init {
        viewModelScope.launch {
            combine(
                repo.getAllExpenses(),
                repo.getActiveCategories()
            ) { expenses, categories ->
                Pair(expenses, categories)
            }.collect { (expenses, categories) ->
                allExpenses = expenses
                allCategories = categories
                val state = _uiState.value
                val breakdown = computeCategoryBreakdown(expenses, categories, state.selectedMonth, state.selectedYear)
                val history = computeMonthlyHistory(expenses)
                val total = breakdown.sumOf { it.total }
                _uiState.update {
                    it.copy(
                        categories = categories,
                        categoryBreakdown = breakdown,
                        monthlyHistory = history,
                        totalSpent = total,
                        isLoading = false
                    )
                }
            }
        }
    }

    fun selectMonth(month: Int, year: Int) {
        _uiState.update { it.copy(selectedMonth = month, selectedYear = year) }
        recalculate(month, year)
    }

    fun selectNextMonth() {
        val state = _uiState.value
        val now = Calendar.getInstance()
        val currentMonth = now.get(Calendar.MONTH) + 1
        val currentYear = now.get(Calendar.YEAR)

        if (state.selectedMonth == currentMonth && state.selectedYear == currentYear) return

        val cal = Calendar.getInstance()
        cal.set(Calendar.YEAR, state.selectedYear)
        cal.set(Calendar.MONTH, state.selectedMonth - 1)
        cal.add(Calendar.MONTH, 1)
        val nextMonth = cal.get(Calendar.MONTH) + 1
        val nextYear = cal.get(Calendar.YEAR)
        selectMonth(nextMonth, nextYear)
    }

    fun selectPreviousMonth() {
        val state = _uiState.value
        val cal = Calendar.getInstance()
        cal.set(Calendar.YEAR, state.selectedYear)
        cal.set(Calendar.MONTH, state.selectedMonth - 1)
        cal.add(Calendar.MONTH, -1)
        val prevMonth = cal.get(Calendar.MONTH) + 1
        val prevYear = cal.get(Calendar.YEAR)
        selectMonth(prevMonth, prevYear)
    }

    private fun recalculate(month: Int, year: Int) {
        val breakdown = computeCategoryBreakdown(allExpenses, allCategories, month, year)
        val history = computeMonthlyHistory(allExpenses)
        val total = breakdown.sumOf { it.total }
        _uiState.update {
            it.copy(
                categoryBreakdown = breakdown,
                monthlyHistory = history,
                totalSpent = total
            )
        }
    }

    private fun computeCategoryBreakdown(
        expenses: List<Expense>,
        categories: List<Category>,
        month: Int,
        year: Int
    ): List<CategoryBreakdown> {
        val filtered = expenses.filter { expense ->
            val cal = Calendar.getInstance()
            cal.timeInMillis = expense.expenseDate
            cal.get(Calendar.MONTH) + 1 == month && cal.get(Calendar.YEAR) == year
        }

        val totalForMonth = filtered.sumOf { it.amount }
        if (totalForMonth == 0.0) return emptyList()

        return categories.mapNotNull { category ->
            val categoryTotal = filtered
                .filter { it.categoryId == category.categoryId }
                .sumOf { it.amount }
            if (categoryTotal > 0) {
                CategoryBreakdown(
                    category = category,
                    total = categoryTotal,
                    percentage = (categoryTotal / totalForMonth).toFloat()
                )
            } else null
        }.sortedByDescending { it.total }
    }

    private fun computeMonthlyHistory(expenses: List<Expense>): List<MonthlyHistory> {
        val result = mutableListOf<MonthlyHistory>()
        val cal = Calendar.getInstance()

        for (i in 5 downTo 0) {
            val historyCal = Calendar.getInstance()
            historyCal.timeInMillis = cal.timeInMillis
            historyCal.add(Calendar.MONTH, -i)

            val m = historyCal.get(Calendar.MONTH) + 1
            val y = historyCal.get(Calendar.YEAR)

            val total = expenses
                .filter { expense ->
                    val expCal = Calendar.getInstance()
                    expCal.timeInMillis = expense.expenseDate
                    expCal.get(Calendar.MONTH) + 1 == m && expCal.get(Calendar.YEAR) == y
                }
                .sumOf { it.amount }

            result.add(
                MonthlyHistory(
                    month = m,
                    year = y,
                    total = total,
                    label = monthAbbreviations[m - 1]
                )
            )
        }
        return result
    }
}
