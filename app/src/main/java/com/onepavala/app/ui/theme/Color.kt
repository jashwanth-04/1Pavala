package com.onepavala.app.ui.theme

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.AttachMoney
import androidx.compose.material.icons.filled.Category
import androidx.compose.material.icons.filled.DirectionsCar
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Flight
import androidx.compose.material.icons.filled.Movie
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Receipt
import androidx.compose.material.icons.filled.Restaurant
import androidx.compose.material.icons.filled.School
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector

// --- Brand Colors ---
val PrimaryBlue = Color(0xFF1565C0)
val PrimaryLight = Color(0xFF1E88E5)
val PrimaryContainer = Color(0xFFE3F2FD)
val OnPrimary = Color(0xFFFFFFFF)

val SecondaryGreen = Color(0xFF2E7D32)
val SecondaryContainer = Color(0xFFE8F5E9)
val OnSecondary = Color(0xFFFFFFFF)

val WarningAmber = Color(0xFFF57F17)
val WarningContainer = Color(0xFFFFF8E1)

val ErrorRed = Color(0xFFC62828)

val Background = Color(0xFFF8F9FF)
val Surface = Color(0xFFFFFFFF)
val OnSurface = Color(0xFF1C1B1F)
val OnSurfaceVariant = Color(0xFF49454F)
val SurfaceVariant = Color(0xFFF1F3F9)

// --- Category Colors ---
val CategoryRed = Color(0xFFE53935)
val CategoryOrange = Color(0xFFFB8C00)
val CategoryYellow = Color(0xFFFDD835)
val CategoryGreen = Color(0xFF43A047)
val CategoryTeal = Color(0xFF00897B)
val CategoryBlue = Color(0xFF1E88E5)
val CategoryIndigo = Color(0xFF3949AB)
val CategoryPurple = Color(0xFF8E24AA)
val CategoryPink = Color(0xFFD81B60)
val CategoryBrown = Color(0xFF6D4C41)
val CategoryGray = Color(0xFF757575)
val CategoryCyan = Color(0xFF00ACC1)

// --- Utility ---
fun hexToColor(hex: String): Color = try {
    Color(android.graphics.Color.parseColor(hex))
} catch (e: Exception) {
    Color.Gray
}

fun getCategoryIcon(iconName: String): ImageVector = when (iconName.lowercase()) {
    "food" -> Icons.Default.Restaurant
    "groceries" -> Icons.Default.ShoppingCart
    "transport" -> Icons.Default.DirectionsCar
    "shopping" -> Icons.Default.ShoppingBag
    "entertainment" -> Icons.Default.Movie
    "bills" -> Icons.Default.Receipt
    "healthcare" -> Icons.Default.Favorite
    "education" -> Icons.Default.School
    "travel" -> Icons.Default.Flight
    "personal" -> Icons.Default.Person
    "subscriptions" -> Icons.AutoMirrored.Filled.List
    "other" -> Icons.Default.Category
    else -> Icons.Default.AttachMoney
}
