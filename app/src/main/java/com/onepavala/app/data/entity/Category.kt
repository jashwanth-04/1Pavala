package com.onepavala.app.data.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "categories")
data class Category(
    @PrimaryKey(autoGenerate = true) val categoryId: Long = 0,
    val name: String,
    val iconName: String,   // e.g. "food", "transport"
    val colorHex: String,   // e.g. "#FF9800"
    val isDefault: Boolean = true,
    val isActive: Boolean = true,
    val createdAt: Long = System.currentTimeMillis()
)
