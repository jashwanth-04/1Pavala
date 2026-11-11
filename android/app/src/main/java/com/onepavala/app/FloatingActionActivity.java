package com.onepavala.app;

import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.Window;
import com.getcapacitor.BridgeActivity;

public class FloatingActionActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        Window window = getWindow();
        if (window != null) {
            window.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        }

        super.onCreate(savedInstanceState);

        if (getBridge() != null && getBridge().getWebView() != null) {
            getBridge().getWebView().setBackgroundColor(Color.TRANSPARENT);

            Intent intent = getIntent();
            String action = (intent != null && intent.getStringExtra("action") != null) 
                    ? intent.getStringExtra("action") 
                    : "add";

            getBridge().getWebView().post(() -> {
                String targetUrl = "https://localhost/?mode=floating&action=" + action;
                getBridge().getWebView().loadUrl(targetUrl);
            });
        }
    }

    @Override
    public void onBackPressed() {
        finish();
    }
}
