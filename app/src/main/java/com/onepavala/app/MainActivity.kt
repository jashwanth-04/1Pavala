package com.onepavala.app

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.mutableStateOf
import com.onepavala.app.ui.navigation.MainApp
import com.onepavala.app.ui.navigation.Routes
import com.onepavala.app.ui.theme.PavalaTheme
import com.onepavala.app.widget.QuickExpenseWidgetProvider

class MainActivity : ComponentActivity() {
    private val initialRouteState = mutableStateOf<String?>(null)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        extractTargetRoute(intent)
        setContent {
            PavalaTheme {
                MainApp(
                    repository = (application as PavalaApp).repository,
                    initialRoute = initialRouteState.value
                )
            }
        }
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        setIntent(intent)
        extractTargetRoute(intent)
    }

    private fun extractTargetRoute(intent: Intent?) {
        if (intent?.action == QuickExpenseWidgetProvider.ACTION_ADD_EXPENSE ||
            intent?.getStringExtra("navigate_to") == "add_expense"
        ) {
            initialRouteState.value = Routes.ADD_EXPENSE
        }
    }
}
