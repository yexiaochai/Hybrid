package com.medlinker.hybridsdk.action;


import android.webkit.WebView;

import de.greenrobot.event.EventBus;

/**
 * Created by vane on 16/6/6.
 */

public class HybridActionShowLoading extends HybridAction {

    @Override
    public void onAction(WebView webView, String params, String jsmethod) {
        HybridActionShowLoading hybridParam = mGson.fromJson(params, HybridActionShowLoading.class);
        EventBus.getDefault().post(hybridParam);
    }
}
