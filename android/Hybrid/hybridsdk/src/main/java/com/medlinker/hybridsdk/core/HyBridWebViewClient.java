package com.medlinker.hybridsdk.core;

import android.net.Uri;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.medlinker.hybridsdk.action.HybridAction;
import com.medlinker.hybridsdk.utils.FileUtil;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * Created by vane on 16/6/2.
 */

public class HyBridWebViewClient extends WebViewClient {

    private WebView mWebView;

    public HyBridWebViewClient(WebView webView) {
        this.mWebView = webView;

    }

    private String mFilterHost;

    public void setHostFilter(String host) {
        mFilterHost = host;
    }

    @Override
    public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
        //TODO 需要重新讨论协议标准,建议url路径和本地的压缩包目录结构相同
        String tempUrl = url.replace("/webapp", "");
        //-----------------------------------------
        Uri uri = Uri.parse(tempUrl);
        File file = new File(FileUtil.getRootDir(view.getContext()).getAbsolutePath() + "/" + HybridConfig.FILE_HYBRID_DATA_PATH + "/" + uri.getPath());
        if (mFilterHost.equals(uri.getHost()) && file.exists()) {
            WebResourceResponse response = null;
            try {
                InputStream localCopy = new FileInputStream(file);
                String mimeType = getMimeType(tempUrl);
                response = new WebResourceResponse(mimeType, "UTF-8", localCopy);
            } catch (IOException e) {
                e.printStackTrace();
            }
            return response;
        }
        return super.shouldInterceptRequest(view, url);
    }

    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        Uri parse = Uri.parse(url);
        String scheme = parse.getScheme();
        if (HybridConfig.SCHEME.equals(scheme)) {
            String host = parse.getHost();
            String param = parse.getQueryParameter(HybridConstant.GET_PARAM);
            String callback = parse.getQueryParameter(HybridConstant.GET_CALLBACK);
            if (null == HybridConfig.TagnameMapping.mapping(host)) {
                return super.shouldOverrideUrlLoading(view, url);
            }
            try {
                hybridDispatcher(host, param, callback);
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InstantiationException e) {
                e.printStackTrace();
            }
            return false;
        }
        view.loadUrl(url);
        return false;
    }

    private void hybridDispatcher(String method, String params, String jsmethod) throws IllegalAccessException, InstantiationException {
        Class type = HybridConfig.TagnameMapping.mapping(method);
        HybridAction action = (HybridAction) type.newInstance();
        action.onAction(mWebView, params, jsmethod);
    }

    private String getMimeType(String url) {
        if (url.contains(".")) {
            int index = url.lastIndexOf(".");
            if (index > -1) {
                int paramIndex = url.indexOf("?");
                String type = url.substring(index + 1, paramIndex == -1 ? url.length() : paramIndex);
                switch (type) {
                    case "js":
                        return "text/javascript";
                    case "css":
                        return "text/css";
                    case "html":
                        return "text/html";
                    case "png":
                        return "image/png";
                    case "jpg":
                        return "image/jpg";
                    case "gif":
                        return "image/gif";
                }
            }
        }
        return "text/plain";
    }
}
