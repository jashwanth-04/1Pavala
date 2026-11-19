package com.onepavala.app;

import android.content.ContentValues;
import android.content.Context;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.provider.MediaStore;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Configure system status bar to be solid black with white icons matching 1Pavala theme
        Window window = getWindow();
        if (window != null) {
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(android.graphics.Color.BLACK);
            window.setNavigationBarColor(android.graphics.Color.BLACK);

            // Enable short-edges cutout mode so camera punch-hole/notch insets are properly reported
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                WindowManager.LayoutParams lp = window.getAttributes();
                lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
                window.setAttributes(lp);
            }
        }

        // Apply system window insets dynamically so the web app header and bottom navigation
        // automatically sit cleanly inside safe areas across all Android devices and edge-to-edge modes
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();

            NativeExportBridge bridge = new NativeExportBridge(this);
            webView.addJavascriptInterface(bridge, "AndroidExportBridge");

            ViewCompat.setOnApplyWindowInsetsListener(webView, (v, windowInsets) -> {
                Insets statusBarInsets = windowInsets.getInsets(
                    WindowInsetsCompat.Type.statusBars() | WindowInsetsCompat.Type.displayCutout()
                );
                Insets navBarInsets = windowInsets.getInsets(
                    WindowInsetsCompat.Type.navigationBars()
                );

                float density = getResources().getDisplayMetrics().density;
                int topDp = Math.round(statusBarInsets.top / density);
                int bottomDp = Math.round(navBarInsets.bottom / density);

                bridge.updateInsets(topDp, bottomDp);

                // Inject dynamic CSS safe area variables directly into documentElement
                webView.post(() -> {
                    String js = String.format(
                        "document.documentElement.style.setProperty('--sat', '%dpx');" +
                        "document.documentElement.style.setProperty('--sab', '%dpx');" +
                        "window.__SAFE_AREA_TOP = %d;" +
                        "window.__SAFE_AREA_BOTTOM = %d;" +
                        "window.dispatchEvent(new CustomEvent('safeareachange', { detail: { top: %d, bottom: %d } }));",
                        topDp, bottomDp, topDp, bottomDp, topDp, bottomDp
                    );
                    webView.evaluateJavascript(js, null);
                });

                return windowInsets;
            });
            ViewCompat.requestApplyInsets(webView);
        }
    }

    /**
     * Native JavascriptInterface that provides:
     * 1. Synchronous and dynamic safe-area insets (status bar & navigation bar heights)
     * 2. Direct file exports into public Downloads directory via MediaStore on Android 10+
     */
    public static class NativeExportBridge {
        private final Context context;
        private volatile int safeAreaTopDp = 0;
        private volatile int safeAreaBottomDp = 0;

        public NativeExportBridge(Context context) {
            this.context = context;
        }

        public void updateInsets(int topDp, int bottomDp) {
            this.safeAreaTopDp = topDp;
            this.safeAreaBottomDp = bottomDp;
        }

        @JavascriptInterface
        public int getSafeAreaTop() {
            return safeAreaTopDp;
        }

        @JavascriptInterface
        public int getSafeAreaBottom() {
            return safeAreaBottomDp;
        }

        @JavascriptInterface
        public String exportFile(String filename, String content, String mimeType) {
            try {
                byte[] bytes = content.getBytes(StandardCharsets.UTF_8);

                // Modern Android (API 29+) Scoped Storage via MediaStore
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentValues values = new ContentValues();
                    values.put(MediaStore.MediaColumns.DISPLAY_NAME, filename);
                    values.put(MediaStore.MediaColumns.MIME_TYPE, mimeType);
                    values.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);

                    Uri uri = context.getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                    if (uri != null) {
                        try (OutputStream os = context.getContentResolver().openOutputStream(uri)) {
                            if (os != null) {
                                os.write(bytes);
                                os.flush();
                                new Handler(Looper.getMainLooper()).post(() ->
                                    Toast.makeText(context, "Saved to Downloads: " + filename, Toast.LENGTH_LONG).show()
                                );
                                return "Downloads/" + filename;
                            }
                        }
                    }
                }

                // Fallback for pre-Android 10 or if MediaStore insert returns null
                File downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                if (!downloadsDir.exists()) {
                    downloadsDir.mkdirs();
                }
                File destFile = new File(downloadsDir, filename);
                try (FileOutputStream fos = new FileOutputStream(destFile)) {
                    fos.write(bytes);
                    fos.flush();
                }

                // Scan file so it is indexed immediately in Android's Files/Recents
                MediaScannerConnection.scanFile(
                    context,
                    new String[]{destFile.getAbsolutePath()},
                    new String[]{mimeType},
                    null
                );

                new Handler(Looper.getMainLooper()).post(() ->
                    Toast.makeText(context, "Saved to Downloads: " + filename, Toast.LENGTH_LONG).show()
                );

                return "Downloads/" + filename;
            } catch (Exception e) {
                e.printStackTrace();
                new Handler(Looper.getMainLooper()).post(() ->
                    Toast.makeText(context, "Export error: " + e.getMessage(), Toast.LENGTH_SHORT).show()
                );
                return null;
            }
        }
    }
}
