package com.baidu.kuai.hybrid;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.text.TextUtils;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.baidu.kuai.utils.LogUtils;

import java.util.HashMap;
import java.util.Map;


public class HyBridWebViewClient extends WebViewClient {
    private static final String TAG = "HyBridWebViewClient";
    private Activity mActivity;
    private WebView mWebview;

    private Map<String, UrlHandler> mHyBridHandlerMap;

    public HyBridWebViewClient(Activity activity, WebView webView) {
        super();
        this.mActivity = activity;
        this.mWebview = webView;
        mHyBridHandlerMap = new HashMap<String, UrlHandler>();
    }

    public Map<String, UrlHandler> addHyBridUrlHandler(UrlHandler handler) {
        mHyBridHandlerMap.put(handler.getHandledUrlHost(), handler);
        return mHyBridHandlerMap;
    }


    @Override
    public void onPageStarted(WebView view, String url, Bitmap favicon) {
        super.onPageStarted(view, url, favicon);
    }

    @Override
    public void onPageFinished(WebView view, String url) {
        super.onPageFinished(view, url);
        if (mActivity != null) {
            mActivity.setTitle(view.getTitle());
        }
    }

    @Override
    public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
        LogUtils.e(TAG, "onReceivedError = " + failingUrl);
        LogUtils.e(TAG, "errorCode = " + errorCode + " description " + description);
        super.onReceivedError(view, errorCode, description, failingUrl);
    }

    @Override
    public boolean shouldOverrideUrlLoading(final WebView view, String url) {
        LogUtils.e(TAG, "shouldOverrideUrlLoading = " + url);
        Uri uri = Uri.parse(url);
        String scheme = uri.getScheme();

        if (UrlHandler.HYBRID_SCHEME.equalsIgnoreCase(scheme)) {
            String host = uri.getHost();
            if (!TextUtils.isEmpty(host)) {
                UrlHandler handler = mHyBridHandlerMap.get(host);
                if (handler != null && handler.handleUrl(uri)) {
                    return true;
                } else {

                }
            }
            return super.shouldOverrideUrlLoading(view, url);
        } else if (UrlHandler.HTTP.equalsIgnoreCase(scheme) || UrlHandler.HTTPS.equalsIgnoreCase(scheme)) {
            LogUtils.d(TAG, "shouldOverrideUrlLoading = " + url);
            view.loadUrl(url);
            return true;
        } else if (UrlHandler.TEL.equalsIgnoreCase(scheme)) {
            telDialPhone(url);
            return true;
        } else if (UrlHandler.SMSTO.equalsIgnoreCase(scheme)) {
            smsTo(url);
            return true;
        } else if (UrlHandler.MAILTO.equalsIgnoreCase(scheme)) {
            String[] addresses = new String[1];
            addresses[0] = uri.getHost();
            composeEmail(addresses, null);
            return true;
        }
        return super.shouldOverrideUrlLoading(view, url);
    }

    /**
     * @param url tel:13400010001
     */
    private void telDialPhone(String url) {
        try {
            Intent callIntent = new Intent(Intent.ACTION_DIAL, Uri.parse(url));
            mActivity.startActivity(callIntent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * @param url "smsto:13200100001"
     */
    private void smsTo(String url) {
        try {
            Uri uri = Uri.parse(url);
            Intent it = new Intent(Intent.ACTION_SENDTO, uri);
            mActivity.startActivity(it);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void composeEmail(String[] addresses, String subject) {
        Intent intent = new Intent(Intent.ACTION_SENDTO);
        intent.setData(Uri.parse("mailto:"));
        intent.putExtra(Intent.EXTRA_EMAIL, addresses);
        intent.putExtra(Intent.EXTRA_SUBJECT, subject);
        if (intent.resolveActivity(mActivity.getPackageManager()) != null) {
            mActivity.startActivity(intent);
        }
    }





    /**
     * 在OverrideUrl中处理各种自定义scheme的URLhandler
     */
    public UrlHandler getUrlHandler(String host) {
        return mHyBridHandlerMap.get(host);
    }

}
