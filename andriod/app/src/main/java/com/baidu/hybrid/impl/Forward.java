package com.baidu.hybrid.impl;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.TextUtils;

import com.baidu.hybrid.HybridActivity;
import com.baidu.hybrid.NaActivity;
import com.baidu.kuai.hybrid.CommonUtils;
import com.baidu.kuai.hybrid.UrlHandler;

import java.io.Serializable;

/**
 * Forward Action
 */
public class Forward implements UrlHandler {

    protected Activity mActivity;

    public Forward(Activity mActivity) {
        this.mActivity = mActivity;
    }

    @Override
    public String getHandledUrlHost() {
        return "forward";
    }

    @Override
    public boolean handleUrl(Uri uri) {
        String param = uri.getQueryParameter("param");
        if (!TextUtils.isEmpty(param)) {
            ForwardParam forwardParam = CommonUtils.jsonToObject(param, ForwardParam.class);
            if ("native".equals(forwardParam.getType())) {
                Intent intent = new Intent(mActivity, NaActivity.class);
                Bundle bundle = new Bundle();
                bundle.putSerializable("data", forwardParam);
                intent.putExtras(bundle);
                mActivity.startActivity(intent);
            } else if ("webview".equals(forwardParam.getType())) {
                Intent intent = new Intent(mActivity, HybridActivity.class);
                Bundle bundle = new Bundle();
                bundle.putSerializable("data", forwardParam);
                intent.putExtras(bundle);
                mActivity.startActivity(intent);
            }
            return true;
        }
        return false;
    }

    /**
     * Hybird Forward请求参数
     */
    public static class ForwardParam implements Serializable {
        private String topage;
        private String type;
        private String data;

        public String getType() {
            return type;
        }

        public String getTopage() {
            return topage;
        }

        public void setTopage(String topage) {
            this.topage = topage;
        }

        public void setType(String type) {
            this.type = type;
        }
    }
}
