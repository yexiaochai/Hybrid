package com.medlinker.hybridsdk.action;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebView;

import com.medlinker.hybridsdk.core.HybridConfig;
import com.medlinker.hybridsdk.core.HybridConstant;
import com.medlinker.hybridsdk.param.HybridParamAnimation;
import com.medlinker.hybridsdk.param.HybridParamForward;
import com.medlinker.hybridsdk.ui.HybridWebViewActivity;
import com.medlinker.hybridsdk.utils.ActivityUtil;

import java.util.Iterator;
import java.util.Set;

/**
 * Created by vane on 16/6/2.
 */

public class HybridActionForward extends HybridAction {

    @Override
    public void onAction(WebView webView, String params, String jsmethod) {
        HybridParamForward hybridParam = mGson.fromJson(params, HybridParamForward.class);
        switch (hybridParam.type) {
            case NATIVE:
                Uri uri = Uri.parse(HybridConfig.SCHEME + "://" + hybridParam.topage);
                Intent intent = new Intent(HybridConfig.ACTIONPRE + uri.getHost());
                Set<String> names = uri.getQueryParameterNames();
                if (null != names && !names.isEmpty()) {
                    Iterator<String> iterator = names.iterator();
                    while (iterator.hasNext()) {
                        String next = iterator.next();
                        intent.putExtra(next, uri.getQueryParameter(next));
                    }
                }
                ActivityUtil.toActivity(webView.getContext(), intent, hybridParam.animate);
                break;
            case H5:
                if (HybridParamAnimation.NONE.equals(hybridParam.animate)) {
                    webView.loadUrl(hybridParam.topage);
                } else {
                    Bundle bundle = new Bundle();
                    bundle.putString(HybridConstant.INTENT_EXTRA_KEY_TOPAGE, hybridParam.topage);
                    bundle.putSerializable(HybridConstant.INTENT_EXTRA_KEY_ANIMATION, hybridParam.animate);
                    bundle.putBoolean(HybridConstant.INTENT_EXTRA_KEY_HASNAVGATION, hybridParam.hasnavgation);
                    ActivityUtil.toSimpleActivity(webView.getContext(), HybridWebViewActivity.class, hybridParam.animate, bundle);
                }
                break;
        }
    }
}
