package com.onepavala.app.data.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "expenses")
data class Expense(
    @PrimaryKey(autoGenerate = true) val expenseId: Long = 0,
    val userId: Int = 1,
    val amount: Double,
    val categoryId: Long,
    val paymentMethod: String? = null,  // "UPI", "Credit Card", "Debit Card", "Cash", "Other"
    val note: String? = null,
    val expenseDate: Long = System.currentTimeMillis(),
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
)
