package com.baidu.hybrid;

import android.app.DownloadManager;
import android.content.Context;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.view.View;
import android.webkit.DownloadListener;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.baidu.hybrid.demo.R;
import com.baidu.hybrid.impl.Back;
import com.baidu.hybrid.impl.Forward;
import com.baidu.hybrid.impl.HeaderView;
import com.baidu.hybrid.impl.UpdateApp;
import com.baidu.hybrid.impl.UpdateHeader;
import com.baidu.kuai.base.ActionBarActivity;
import com.baidu.kuai.hybrid.CommonUtils;
import com.baidu.kuai.hybrid.HyBridChromeClient;
import com.baidu.kuai.hybrid.HyBridWebViewClient;
import com.baidu.kuai.utils.LogUtils;
import com.nostra13.universalimageloader.core.DisplayImageOptions;
import com.nostra13.universalimageloader.core.ImageLoader;
import com.nostra13.universalimageloader.core.ImageLoaderConfiguration;

import java.io.File;

public class HybridActivity extends ActionBarActivity implements View.OnClickListener {
    private WebView mWebView;
    private HeaderView mHeader;
    private String mUrl = "http://m.baidu.com";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        DisplayImageOptions options;
        options =
                new DisplayImageOptions.Builder().cacheOnDisc(true)
                        .cacheInMemory(true).build();

        ImageLoaderConfiguration config =
                new ImageLoaderConfiguration.Builder(this).defaultDisplayImageOptions(options)
                        .build();
        ImageLoader.getInstance().init(config);

        setContentView(R.layout.ac_hybrid);
        mWebView = (WebView) findViewById(R.id.wv_content);
        initConfig();
        int[] ids = {R.id.btn_forward, R.id.btn_refresh, R.id.btn_clear, R.id.btn_back};
        for (int id : ids) {
            findViewById(id).setOnClickListener(this);
        }
        mWebView.loadUrl(mUrl);
        hideActionBar();
//        showActionBar();
//        getActionBarController().addTextAction("Local").setOnActionClickListener(new OnActionClickListener() {
//            @Override
//            public void onClick(Action action) {
//                File tmp = CommonUtils.getLocalRootFile();
//                Uri uri = Uri.fromFile(new File(tmp, "hotel/index.html"));
//                mWebView.loadUrl(uri.toString());
//            }
//        });
//        getActionBarController().addTextAction("输入URL").setOnActionClickListener(new OnActionClickListener() {
//            @Override
//            public void onClick(Action action) {
//                final EditText editText = new EditText(HybridActivity.this);
//                editText.setText("http://www.");
//                AlertDialog.Builder b = new AlertDialog.Builder(HybridActivity.this);
//                b.setView(editText);
//                b.setPositiveButton("确定", new DialogInterface.OnClickListener() {
//                    @Override
//                    public void onClick(DialogInterface dialog, int which) {
//                        mWebView.loadUrl(editText.getText().toString());
//                    }
//                });
//                b.create().show();
//            }
//        });
        Bundle bundle = getIntent().getExtras();
        if (bundle != null) {
            Forward.ForwardParam param = (Forward.ForwardParam) bundle.getSerializable("data");
            if (param == null) {
                return;
            }
            setTitle(param.getTopage());
            File tmp = CommonUtils.getLocalRootFile();
            Uri uri = Uri.fromFile(new File(tmp, param.getTopage()));
            mWebView.loadUrl(uri.toString());
        }
    }

    private void initConfig() {
        WebSettings settings = mWebView.getSettings();
        settings.setAllowFileAccess(true);
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
        settings.setUserAgentString(settings.getUserAgentString() + "");
        HyBridWebViewClient webviewClient = new HyBridWebViewClient(HybridActivity.this, mWebView);
        Forward forward = new Forward(this);
        webviewClient.addHyBridUrlHandler(forward);

        mHeader = new HeaderView();
        mHeader.initView(findViewById(R.id.inc_header_bar));
        UpdateHeader updateHeader = new UpdateHeader(this, mHeader, mWebView);
        webviewClient.addHyBridUrlHandler(updateHeader);

        Back back = new Back(this);
        webviewClient.addHyBridUrlHandler(back);

        UpdateApp updateApp = new UpdateApp(this, mWebView);
        webviewClient.addHyBridUrlHandler(updateApp);

        mWebView.setWebViewClient(webviewClient);
        mWebView.setWebChromeClient(new HyBridChromeClient(this));

        mWebView.setDownloadListener(new DownloadListener() {

            @Override
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype,
                                        long contentLength) {
                LogUtils.e(TAG, "onDownloadStart = " + url);
                Uri uri = Uri.parse(url);
                if ("http".equals(uri.getScheme()) || "https".equals(uri.getScheme())) {
                    final Context context = mWebView.getContext();
                    String serviceString = Context.DOWNLOAD_SERVICE;
                    DownloadManager downloadManager;
                    downloadManager = (DownloadManager) context.getSystemService(serviceString);
                    DownloadManager.Request request = new DownloadManager.Request(uri);
                    String name = uri.getLastPathSegment();
                    request.setTitle("下载" + name);
                    request.setDescription(contentDisposition);
                    request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                    request.setDestinationInExternalFilesDir(context, Environment.DIRECTORY_DOWNLOADS, name);
                    // request.setAllowedNetworkTypes(Request.NETWORK_WIFI);
                    try {
                        downloadManager.enqueue(request);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        });


    }

    @Override
    public void onBackPressed() {
        if (mWebView != null && mWebView.canGoBack()) {
            mWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    @Override
    public void onClick(View v) {
        int id = v.getId();
        if (id == R.id.btn_clear) {
            cleanCache(this);
            mWebView.reload();
        } else if (id == R.id.btn_refresh) {
            mWebView.reload();
        } else if (id == R.id.btn_back) {
            mWebView.goBack();
        } else if (id == R.id.btn_forward) {
            mWebView.goForward();
        }
    }

    private void cleanCache(Context context) {
        context.deleteDatabase("webview.db");
        context.deleteDatabase("webviewCache.db");
    }
}
