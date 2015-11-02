package com.baidu.hybrid.impl;

import android.app.Activity;
import android.net.Uri;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.TextUtils;
import android.text.style.ImageSpan;
import android.view.View;
import android.webkit.WebView;

import com.baidu.kuai.hybrid.CommonUtils;
import com.baidu.kuai.hybrid.UrlHandler;
import com.baidu.kuai.utils.LogUtils;
import com.nostra13.universalimageloader.core.ImageLoader;

import java.io.File;

public class UpdateHeader implements UrlHandler {
    private static final String TAG = "UpdateHeader";
    protected HeaderView mHeader;
    protected WebView mWebView;
    protected Activity mActivity;
    private static final String JS_PATH = "javascript:window.Hybrid.Header_Event.";

    public UpdateHeader(Activity mActivity, HeaderView mHeader, WebView mWebView) {
        this.mActivity = mActivity;
        this.mHeader = mHeader;
        this.mWebView = mWebView;
    }


    @Override
    public String getHandledUrlHost() {
        return "updateheader";
    }

    @Override
    public boolean handleUrl(Uri uri) {
        String param = uri.getQueryParameter("param");
        if (!TextUtils.isEmpty(param)) {
            final Header header = CommonUtils.jsonToObject(param, Header.class);
            LogUtils.e(TAG, param);
            mHeader.mTvTitle.setText(header.getTitle().getTitle());
            mHeader.mTvTitle.setOnClickListener(new View.OnClickListener() {

                @Override
                public void onClick(View v) {
                    StringBuilder sb = new StringBuilder();
                    sb.append(JS_PATH).append(header.getTitle().getCallback()).append("()");
                    LogUtils.e(TAG, "content = " + sb);
                    mWebView.loadUrl(sb.toString());
                }
            });
            if (TextUtils.isEmpty(header.getTitle().getSubtitle())) {
                mHeader.mTvSubtitle.setVisibility(View.GONE);
            } else {
                mHeader.mTvSubtitle.setText(header.getTitle().getSubtitle());
                mHeader.mTvSubtitle.setVisibility(View.VISIBLE);
            }

            if (!TextUtils.isEmpty(header.getTitle().getRighticon())) {
                String icon = header.getTitle().getRighticon();
                File tmp = CommonUtils.getLocalRootFile();
                File path = new File(tmp, icon);
                LogUtils.e(TAG, "path = " + Uri.fromFile(path).toString());
                SpannableString ss = new SpannableString(header.getTitle().getTitle() + " ");
                ImageSpan span = new ImageSpan(mHeader.mTvTitle.getContext(), Uri.fromFile(path), ImageSpan.ALIGN_BASELINE);
                int length = header.getTitle().getTitle().length();
                ss.setSpan(span, length, length + 1, Spannable.SPAN_INCLUSIVE_EXCLUSIVE);
                mHeader.mTvTitle.setText(ss);
            }

            if (header.getLeft().size() > 0) {
                mHeader.mIvLeft.setVisibility(View.VISIBLE);
                mHeader.mIvLeft.setOnClickListener(new View.OnClickListener() {

                    @Override
                    public void onClick(View v) {
                        mActivity.finish();
                    }
                });
//                final Header.Action action = header.getLeft().get(0);
//                View.OnClickListener listener = new View.OnClickListener() {
//
//                    @Override
//                    public void onClick(View v) {
//                        StringBuilder sb = new StringBuilder();
//                        sb.append(JS_PATH).append(action.getCallback()).append("()");
//                        LogUtils.e("updateheader", "content = " + sb);
//                        mWebView.loadUrl(sb.toString());
//                    }
//                };
//                if (!TextUtils.isEmpty(action.getIcon())) {
//                    if (action.getIcon().startsWith("http")) {
//                        ImageLoader.getInstance().displayImage(action.getIcon(), mHeader.mIvLeft);
//                    } else {
//                        File tmp = CommonUtils.getLocalRootFile();
//                        File icon = new File(tmp, action.getIcon());
//                        LogUtils.e(TAG, "icon = " + Uri.fromFile(icon).toString());
//                        ImageLoader.getInstance().displayImage(Uri.fromFile(icon).toString(), mHeader.mIvLeft);
//                    }
//                    mHeader.mTvLeft.setVisibility(View.GONE);
//                    mHeader.mIvLeft.setVisibility(View.VISIBLE);
//                    mHeader.mIvLeft.setOnClickListener(listener);
//                } else {
//                    mHeader.mTvLeft.setText(action.getValue());
//                    mHeader.mTvLeft.setVisibility(View.VISIBLE);
//                    mHeader.mIvLeft.setVisibility(View.GONE);
//                    mHeader.mTvLeft.setOnClickListener(listener);
//                }
            } else {
//                mHeader.mIvLeft.setVisibility(View.VISIBLE);
//                mHeader.mIvLeft.setOnClickListener(new View.OnClickListener() {
//
//                    @Override
//                    public void onClick(View v) {
//                        mActivity.finish();
//                    }
//                });
            }

            if (header.getRight().size() > 0) {
                final Header.Action action = header.getRight().get(0);
                View.OnClickListener listener = new View.OnClickListener() {

                    @Override
                    public void onClick(View v) {
                        StringBuilder sb = new StringBuilder();
                        sb.append(JS_PATH).append(action.getCallback()).append("()");
                        LogUtils.e(TAG, "content = " + sb);
                        mWebView.loadUrl(sb.toString());
                    }
                };
                if (!TextUtils.isEmpty(action.getIcon())) {
                    if (action.getIcon().startsWith("http")) {
                        ImageLoader.getInstance().displayImage(action.getIcon(), mHeader.mIvRight);
                    } else {
                        File tmp = CommonUtils.getLocalRootFile();
                        File icon = new File(tmp, action.getIcon());
                        LogUtils.e("updateheader", "icon = " + Uri.fromFile(icon).toString());
                        ImageLoader.getInstance().displayImage(Uri.fromFile(icon).toString(), mHeader.mIvRight);
                    }
                    mHeader.mTvRight.setVisibility(View.GONE);
                    mHeader.mIvRight.setVisibility(View.VISIBLE);
                    mHeader.mIvRight.setOnClickListener(listener);
                } else {
                    mHeader.mTvRight.setText(action.getValue());
                    mHeader.mTvRight.setVisibility(View.VISIBLE);
                    mHeader.mIvRight.setVisibility(View.GONE);
                    mHeader.mTvRight.setOnClickListener(listener);
                }
            }
            return true;
        }
        return false;
    }

}
