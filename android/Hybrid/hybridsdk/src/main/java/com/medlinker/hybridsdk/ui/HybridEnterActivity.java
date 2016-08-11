package com.medlinker.hybridsdk.ui;

import android.net.Uri;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;

import com.google.gson.GsonBuilder;
import com.medlinker.hybridsdk.core.HybridConfig;
import com.medlinker.hybridsdk.core.HybridConstant;
import com.medlinker.hybridsdk.param.HybridParamForward;
import com.medlinker.hybridsdk.utils.ActivityUtil;

/**
 * Created by vane on 16/7/13.
 */

public class HybridEnterActivity extends AppCompatActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        jump();
        finish();
    }

    private void jump() {
        Uri data = getIntent().getData();
        if (null == data) return;
        String url = data.toString();
        Uri parse = Uri.parse(url);
        String scheme = parse.getScheme();
        if (HybridConfig.SCHEME.equals(scheme)) {
            String host = parse.getHost();
            String param = parse.getQueryParameter(HybridConstant.GET_PARAM);
            String callback = parse.getQueryParameter(HybridConstant.GET_CALLBACK);
            onAction(param);
        }
    }

    private void onAction(String params) {
        HybridParamForward hybridParam = new GsonBuilder().create().fromJson(params, HybridParamForward.class);
        Bundle bundle = new Bundle();
        bundle.putString(HybridConstant.INTENT_EXTRA_KEY_TOPAGE, hybridParam.topage);
        bundle.putSerializable(HybridConstant.INTENT_EXTRA_KEY_ANIMATION, hybridParam.animate);
        bundle.putBoolean(HybridConstant.INTENT_EXTRA_KEY_HASNAVGATION, hybridParam.hasnavgation);
        ActivityUtil.toSimpleActivity(this, HybridWebViewActivity.class, hybridParam.animate, bundle);
    }
}
