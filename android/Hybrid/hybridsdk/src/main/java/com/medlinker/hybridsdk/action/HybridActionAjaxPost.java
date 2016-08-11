package com.medlinker.hybridsdk.action;

import android.webkit.WebView;

import com.medlinker.hybridsdk.param.HybridParamAjax;

import de.greenrobot.event.EventBus;

/**
 * Created by vane on 16/6/2.
 */

public class HybridActionAjaxPost extends HybridAction {

    @Override
    public void onAction(final WebView webView, String params, final String jsmethod) {
        HybridParamAjax hybridParam = mGson.fromJson(params, HybridParamAjax.class);
        hybridParam.tagname = HybridParamAjax.ACTION.POST;
        hybridParam.callback = jsmethod;
        EventBus.getDefault().post(hybridParam);
    }
}
