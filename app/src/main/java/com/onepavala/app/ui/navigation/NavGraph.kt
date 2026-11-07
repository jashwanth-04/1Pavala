package com.onepavala.app.ui.navigation

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalanceWallet
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.onepavala.app.data.repository.ExpenseRepository
import com.onepavala.app.ui.screen.AddExpenseScreen
import com.onepavala.app.ui.screen.BudgetScreen
import com.onepavala.app.ui.screen.HomeScreen
import com.onepavala.app.ui.screen.InsightsScreen
import com.onepavala.app.ui.screen.OnboardingScreen
import com.onepavala.app.ui.screen.SettingsScreen
import com.onepavala.app.ui.theme.PrimaryBlue

object Routes {
    const val ONBOARDING = "onboarding"
    const val HOME = "home"
    const val ADD_EXPENSE = "add_expense"
    const val INSIGHTS = "insights"
    const val BUDGET = "budget"
    const val SETTINGS = "settings"

    fun editExpense(id: Long): String = "edit_expense/$id"
}

@Composable
fun MainApp(repository: ExpenseRepository, initialRoute: String? = null) {
    var startDestination by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(Unit) {
        val profile = repository.getUserProfile()
        startDestination = if (profile == null) Routes.ONBOARDING else Routes.HOME
    }

    if (startDestination == null) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = PrimaryBlue)
        }
        return
    }

    val navController = rememberNavController()

    // Handle deep navigation from Widget click
    LaunchedEffect(initialRoute) {
        if (initialRoute != null && initialRoute != Routes.HOME) {
            navController.navigate(initialRoute) {
                launchSingleTop = true
            }
        }
    }

    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    val showBottomBar = currentRoute in listOf(
        Routes.HOME,
        Routes.INSIGHTS,
        Routes.BUDGET,
        Routes.SETTINGS
    )

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                PavalaBottomNav(navController = navController, currentRoute = currentRoute)
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = startDestination!!,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Routes.ONBOARDING) {
                OnboardingScreen(
                    onComplete = {
                        navController.navigate(Routes.HOME) {
                            popUpTo(0) { inclusive = true }
                        }
                    }
                )
            }
            composable(Routes.HOME) {
                HomeScreen(navController = navController)
            }
            composable(Routes.ADD_EXPENSE) {
                AddExpenseScreen(navController = navController)
            }
            composable("edit_expense/{expenseId}") { backStackEntry ->
                val expenseId = backStackEntry.arguments?.getString("expenseId")?.toLongOrNull()
                AddExpenseScreen(navController = navController, editExpenseId = expenseId)
            }
            composable(Routes.INSIGHTS) {
                InsightsScreen()
            }
            composable(Routes.BUDGET) {
                BudgetScreen()
            }
            composable(Routes.SETTINGS) {
                SettingsScreen()
            }
        }
    }
}

@Composable
fun PavalaBottomNav(navController: NavController, currentRoute: String?) {
    data class NavItem(val route: String, val label: String, val icon: @Composable () -> Unit)

    val items = listOf(
        NavItem(Routes.HOME, "Home") { Icon(Icons.Default.Home, contentDescription = "Home") },
        NavItem(Routes.INSIGHTS, "Insights") { Icon(Icons.Default.BarChart, contentDescription = "Insights") },
        NavItem(Routes.BUDGET, "Budget") { Icon(Icons.Default.AccountBalanceWallet, contentDescription = "Budget") },
        NavItem(Routes.SETTINGS, "Settings") { Icon(Icons.Default.Settings, contentDescription = "Settings") }
    )

    NavigationBar {
        items.forEach { item ->
            NavigationBarItem(
                selected = currentRoute == item.route,
                onClick = {
                    navController.navigate(item.route) {
                        launchSingleTop = true
                        restoreState = true
                        popUpTo(Routes.HOME) { saveState = true }
                    }
                },
                icon = item.icon,
                label = { Text(item.label) }
            )
        }
    }
}
