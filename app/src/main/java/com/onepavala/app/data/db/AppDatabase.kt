package com.onepavala.app.data.db

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.onepavala.app.data.dao.BudgetDao
import com.onepavala.app.data.dao.CategoryDao
import com.onepavala.app.data.dao.ExpenseDao
import com.onepavala.app.data.dao.NotificationSettingsDao
import com.onepavala.app.data.dao.UserDao
import com.onepavala.app.data.entity.Budget
import com.onepavala.app.data.entity.Category
import com.onepavala.app.data.entity.Expense
import com.onepavala.app.data.entity.NotificationSettings
import com.onepavala.app.data.entity.UserProfile
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [
        UserProfile::class,
        Category::class,
        Expense::class,
        Budget::class,
        NotificationSettings::class
    ],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {

    abstract fun userDao(): UserDao
    abstract fun categoryDao(): CategoryDao
    abstract fun expenseDao(): ExpenseDao
    abstract fun budgetDao(): BudgetDao
    abstract fun notificationSettingsDao(): NotificationSettingsDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "pavala_database"
                )
                    .addCallback(DatabaseCallback())
                    .build()
                INSTANCE = instance
                instance
            }
        }

        private class DatabaseCallback : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    CoroutineScope(Dispatchers.IO).launch {
                        populateDefaultCategories(database.categoryDao())
                    }
                }
            }

            private suspend fun populateDefaultCategories(categoryDao: CategoryDao) {
                val defaultCategories = listOf(
                    Category(name = "Food",          iconName = "food",          colorHex = "#FF9800", isDefault = true, isActive = true),
                    Category(name = "Groceries",     iconName = "groceries",     colorHex = "#4CAF50", isDefault = true, isActive = true),
                    Category(name = "Transport",     iconName = "transport",     colorHex = "#2196F3", isDefault = true, isActive = true),
                    Category(name = "Shopping",      iconName = "shopping",      colorHex = "#9C27B0", isDefault = true, isActive = true),
                    Category(name = "Entertainment", iconName = "entertainment", colorHex = "#E91E63", isDefault = true, isActive = true),
                    Category(name = "Bills",         iconName = "bills",         colorHex = "#795548", isDefault = true, isActive = true),
                    Category(name = "Healthcare",    iconName = "healthcare",    colorHex = "#F44336", isDefault = true, isActive = true),
                    Category(name = "Education",     iconName = "education",     colorHex = "#009688", isDefault = true, isActive = true),
                    Category(name = "Travel",        iconName = "travel",        colorHex = "#00BCD4", isDefault = true, isActive = true),
                    Category(name = "Personal",      iconName = "personal",      colorHex = "#FFC107", isDefault = true, isActive = true),
                    Category(name = "Subscriptions", iconName = "subscriptions", colorHex = "#3F51B5", isDefault = true, isActive = true),
                    Category(name = "Other",         iconName = "other",         colorHex = "#9E9E9E", isDefault = true, isActive = true)
                )
                categoryDao.insertCategories(defaultCategories)
            }
        }
    }
}
