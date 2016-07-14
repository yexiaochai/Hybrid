package com.medlinker.hybridsdk.action;

import android.webkit.WebView;

import com.medlinker.hybridsdk.param.HybridParamAjax;

import de.greenrobot.event.EventBus;

/**
 * Created by vane on 16/6/2.
 */

public class HybridActionAjaxGet extends HybridAction {

    @Override
    public void onAction(WebView webView, String params, String jsmethod) {
        HybridParamAjax hybridParam = mGson.fromJson(params, HybridParamAjax.class);
        hybridParam.callback = jsmethod;
        EventBus.getDefault().post(hybridParam);
    }
}
