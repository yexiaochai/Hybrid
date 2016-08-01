package com.medlinker.hybridsdk.ui;

import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.text.TextUtils;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.medlinker.hybridsdk.R;
import com.medlinker.hybridsdk.core.HyBridWebViewClient;
import com.medlinker.hybridsdk.core.HybridConfig;
import com.medlinker.hybridsdk.core.HybridJsInterface;
import com.medlinker.hybridsdk.widget.HybridWebView;

/**
 * Created by vane on 16/6/5.
 */

public class HybridBaseActivity extends AppCompatActivity {

    protected HybridWebView mWebView;
    protected HyBridWebViewClient mWebViewClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Fresco.initialize(this);
        setContentView(R.layout.hybrid_webview_act);
        mWebView = (HybridWebView) findViewById(R.id.hybrid_webview);
        initConfig(mWebView);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            ActivityCompat.requestPermissions(this, permissions, REQUEST_CODE); // without sdk version check
        }
    }

    /**
     * 需要设置webview的属性则重写此方法
     *
     * @param webView
     */
    protected void initConfig(WebView webView) {
        WebSettings settings = webView.getSettings();
        settings.setAllowFileAccess(true);
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        settings.setUserAgentString(settings.getUserAgentString() + " hybrid_1.0.0 ");
        mWebViewClient = new HyBridWebViewClient(webView);
        webView.setWebViewClient(mWebViewClient);
        webView.addJavascriptInterface(new HybridJsInterface(), HybridConfig.JSInterface);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
    }

    protected void loadUrl(String url) {
        if (TextUtils.isEmpty(url)) return;
        mWebViewClient.setHostFilter(Uri.parse(url).getHost());
        mWebView.loadUrl(url);
    }

    @Override
    public boolean isDestroyed() {
        if (Build.VERSION.SDK_INT >= 17) {
            return super.isDestroyed();
        } else {
            return isFinishing();
        }
    }

    private String[] permissions = {"android.permission.WRITE_EXTERNAL_STORAGE", "android.permission.READ_PHONE_STATE", "android.permission.WRITE_SETTINGS"};
    private static final int REQUEST_CODE = 0x11;

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == REQUEST_CODE) {
            if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                // save file
            } else {
                Toast.makeText(getApplicationContext(), "PERMISSION_DENIED", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
