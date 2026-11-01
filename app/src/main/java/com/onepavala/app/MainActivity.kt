package com.onepavala.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import com.onepavala.app.ui.navigation.MainApp
import com.onepavala.app.ui.theme.PavalaTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            PavalaTheme {
                MainApp(repository = (application as PavalaApp).repository)
            }
        }
    }
}
