package com.baidu.kuai.widget;

import android.content.Context;
import android.util.AttributeSet;
import android.webkit.WebView;
import android.widget.ProgressBar;

/**
 * 带进度条的WebView
 */
@SuppressWarnings("deprecation")
public class ProgressWebView extends WebView {

    private ProgressBar mProgressbar;

    public ProgressWebView(Context context, AttributeSet attrs) {
        super(context, attrs);
        mProgressbar = new ProgressBar(context, null, android.R.attr.progressBarStyleHorizontal);
        mProgressbar.setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, 10, 0, 0));
        addView(mProgressbar);
        // setWebChromeClient(new WebChromeClient());
    }

    // public class WebChromeClient extends android.webkit.WebChromeClient {
    // @Override
    // public void onProgressChanged(WebView view, int newProgress) {
    // if (newProgress == 100) {
    // mProgressbar.setVisibility(GONE);
    // } else {
    // if (mProgressbar.getVisibility() == GONE)
    // mProgressbar.setVisibility(VISIBLE);
    // mProgressbar.setProgress(newProgress);
    // }
    // super.onProgressChanged(view, newProgress);
    // }
    //
    // }

    @Override
    protected void onScrollChanged(int l, int t, int oldl, int oldt) {
        LayoutParams lp = (LayoutParams) mProgressbar.getLayoutParams();
        lp.x = l;
        lp.y = t;
        mProgressbar.setLayoutParams(lp);
        super.onScrollChanged(l, t, oldl, oldt);
    }

    public ProgressBar getProgressBar() {
        return mProgressbar;
    }
}
