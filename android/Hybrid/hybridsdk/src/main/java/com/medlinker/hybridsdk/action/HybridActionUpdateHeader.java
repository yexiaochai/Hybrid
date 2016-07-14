package com.medlinker.hybridsdk.action;

import android.webkit.WebView;

import com.medlinker.hybridsdk.param.HybridParamUpdateHeader;

import de.greenrobot.event.EventBus;

/**
 * Created by vane on 16/6/6.
 */

public class HybridActionUpdateHeader extends HybridAction {

    @Override
    public void onAction(WebView webView, String params, String jsmethod) {
        HybridParamUpdateHeader hybridParam = mGson.fromJson(params, HybridParamUpdateHeader.class);
        hybridParam.id = webView.hashCode();
        EventBus.getDefault().post(hybridParam);
    }
}
