package com.baidu.kuai.hybrid;

import android.app.Activity;
import android.view.View;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.baidu.kuai.utils.LogUtils;
import com.baidu.kuai.widget.ProgressWebView;

public class HyBridChromeClient extends WebChromeClient {
    private TextView mTvLog;
    private StringBuilder sb = new StringBuilder(512);
    private Activity mActivity;

    public HyBridChromeClient(Activity a) {
        this(a, null);
    }

    public HyBridChromeClient(Activity a, TextView logTextView) {
        super();
        this.mTvLog = logTextView;
        mActivity = a;
    }


    @Override
    public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
        if (mTvLog != null) {
            if (sb.length() > 512) {
                String tmp = sb.substring(256);
                sb.setLength(0);
                sb.append(tmp);
            }
            sb.append(consoleMessage.message());
            sb.append("\n");
            mTvLog.setText(sb);
        }
        LogUtils.d("onConsoleMessage", consoleMessage.message());
        return super.onConsoleMessage(consoleMessage);
    }

    @Override
    public void onProgressChanged(WebView view, int newProgress) {
        if (view instanceof ProgressWebView) {
            ProgressWebView pwv = (ProgressWebView) view;
            ProgressBar pb = pwv.getProgressBar();
            pb.setProgress(newProgress);
            if (newProgress > 90) {
                pb.setVisibility(View.GONE);
            } else {
                pb.setVisibility(View.VISIBLE);
            }
        }
        super.onProgressChanged(view, newProgress);
    }
}
