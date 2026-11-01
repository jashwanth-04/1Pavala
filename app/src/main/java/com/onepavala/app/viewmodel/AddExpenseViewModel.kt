package com.onepavala.app.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.onepavala.app.PavalaApp
import com.onepavala.app.data.entity.Category
import com.onepavala.app.data.entity.Expense
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class AddExpenseUiState(
    val amountString: String = "",
    val selectedCategory: Category? = null,
    val paymentMethod: String? = null,
    val note: String = "",
    val expenseDate: Long = System.currentTimeMillis(),
    val categories: List<Category> = emptyList(),
    val isLoading: Boolean = false,
    val isSaved: Boolean = false,
    val isEditing: Boolean = false,
    val amountError: String? = null
)

class AddExpenseViewModel(application: Application) : AndroidViewModel(application) {

    private val repo = (application as PavalaApp).repository

    private val _uiState = MutableStateFlow(AddExpenseUiState())
    val uiState = _uiState.asStateFlow()

    // Track the expense being edited so we can update it
    private var editingExpenseId: Long? = null

    init {
        viewModelScope.launch {
            repo.getActiveCategories().collect { categories ->
                _uiState.update { it.copy(categories = categories) }
            }
        }
    }

    fun loadForEditing(expenseId: Long) {
        if (editingExpenseId == expenseId) return // Already loaded
        editingExpenseId = expenseId
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            val expense = repo.getExpenseById(expenseId)
            if (expense != null) {
                val category = repo.getCategoryById(expense.categoryId)
                _uiState.update {
                    it.copy(
                        amountString = expense.amount.toString(),
                        selectedCategory = category,
                        paymentMethod = expense.paymentMethod,
                        note = expense.note ?: "",
                        expenseDate = expense.expenseDate,
                        isEditing = true,
                        isLoading = false
                    )
                }
            } else {
                _uiState.update { it.copy(isLoading = false) }
            }
        }
    }

    fun updateAmount(s: String) {
        // Only allow digits and a single decimal point
        val filtered = s.filter { it.isDigit() || it == '.' }
        val dotCount = filtered.count { it == '.' }
        val validAmount = if (dotCount > 1) {
            val firstDot = filtered.indexOf('.')
            filtered.substring(0, firstDot + 1) + filtered.substring(firstDot + 1).replace(".", "")
        } else {
            filtered
        }
        val amountError = if (validAmount.isNotEmpty()) {
            val value = validAmount.toDoubleOrNull()
            if (value != null && value <= 0) "Amount must be greater than 0" else null
        } else null
        _uiState.update { it.copy(amountString = validAmount, amountError = amountError) }
    }

    fun selectCategory(category: Category) {
        _uiState.update { it.copy(selectedCategory = category) }
    }

    fun selectPaymentMethod(method: String?) {
        _uiState.update { it.copy(paymentMethod = method) }
    }

    fun updateNote(note: String) {
        _uiState.update { it.copy(note = note) }
    }

    fun updateDate(date: Long) {
        _uiState.update { it.copy(expenseDate = date) }
    }

    fun saveExpense() {
        val state = _uiState.value
        val amount = state.amountString.toDoubleOrNull()

        if (amount == null || amount <= 0) {
            _uiState.update { it.copy(amountError = "Please enter a valid amount") }
            return
        }
        if (state.selectedCategory == null) {
            return
        }

        _uiState.update { it.copy(isLoading = true) }
        viewModelScope.launch {
            try {
                val now = System.currentTimeMillis()
                if (state.isEditing && editingExpenseId != null) {
                    val existing = repo.getExpenseById(editingExpenseId!!)
                    if (existing != null) {
                        repo.updateExpense(
                            existing.copy(
                                amount = amount,
                                categoryId = state.selectedCategory.categoryId,
                                paymentMethod = state.paymentMethod,
                                note = state.note.ifBlank { null },
                                expenseDate = state.expenseDate,
                                updatedAt = now
                            )
                        )
                    }
                } else {
                    repo.addExpense(
                        Expense(
                            amount = amount,
                            categoryId = state.selectedCategory.categoryId,
                            paymentMethod = state.paymentMethod,
                            note = state.note.ifBlank { null },
                            expenseDate = state.expenseDate,
                            createdAt = now,
                            updatedAt = now
                        )
                    )
                }
                _uiState.update { it.copy(isLoading = false, isSaved = true) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false) }
            }
        }
    }

    fun clearSaved() {
        _uiState.update { it.copy(isSaved = false) }
    }
}
