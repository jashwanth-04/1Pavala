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

        // Configure system status bar to be solid black matching 1Pavala theme
        Window window = getWindow();
        if (window != null) {
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(android.graphics.Color.BLACK);
        }

        // Apply system window insets so the app header never collides with
        // the Android status bar (clock, battery, Wi-Fi icons, camera cutout)
        if (getBridge() != null && getBridge().getWebView() != null) {
            WebView webView = getBridge().getWebView();

            ViewCompat.setOnApplyWindowInsetsListener(webView, (v, windowInsets) -> {
                Insets insets = windowInsets.getInsets(
                    WindowInsetsCompat.Type.statusBars() | WindowInsetsCompat.Type.displayCutout()
                );
                v.setPadding(0, insets.top, 0, 0);
                return windowInsets;
            });
            ViewCompat.requestApplyInsets(webView);

            // Register native bridge for saving exports directly into Android Downloads folder
            webView.addJavascriptInterface(new NativeExportBridge(this), "AndroidExportBridge");
        }
    }

    /**
     * Native JavascriptInterface that writes exported JSON/CSV files directly
     * into the public Downloads directory using MediaStore on Android 10+ (API 29+)
     * or standard external storage on older Android versions.
     */
    public static class NativeExportBridge {
        private final Context context;

        public NativeExportBridge(Context context) {
            this.context = context;
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
