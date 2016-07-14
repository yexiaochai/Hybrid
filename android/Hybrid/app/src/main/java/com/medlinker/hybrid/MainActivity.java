package com.medlinker.hybrid;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;

import com.google.gson.GsonBuilder;
import com.medlinker.hybridsdk.action.HybridAction;
import com.medlinker.hybridsdk.core.HybridConfig;
import com.medlinker.hybridsdk.core.HybridConstant;
import com.medlinker.hybridsdk.param.HybridParamAnimation;
import com.medlinker.hybridsdk.param.HybridParamForward;
import com.medlinker.hybridsdk.ui.HybridWebViewActivity;
import com.medlinker.hybridsdk.utils.ActivityUtil;

import java.util.Iterator;
import java.util.Set;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        findViewById(R.id.enter_h5).setOnClickListener(this);
        findViewById(R.id.enter_native).setOnClickListener(this);
        jump();
    }

    @Override
    public void onClick(View v) {
        String url = null;
        switch (v.getId()) {
            case R.id.enter_h5:
//                url = "http://kq.medlinker.com/webapp/kq-desk/login.html";
                url = "http://kq.medlinker.com/webapp/kq-desk/admorgs.html";
                break;
            case R.id.enter_native:
                url = "http://yexiaochai.github.io/Hybrid/webapp/demo/index.html";
                break;
        }

        Intent intent = new Intent(this, DemoMainActivity.class);
        intent.putExtra("url", url);
        startActivity(intent);
    }

    private void jump() {
        Uri data = getIntent().getData();
        if (null == data) return;
        String url = data.toString();
        Uri parse = Uri.parse(url);
        String scheme = parse.getScheme();
        if (HybridConfig.SCHEME.equals(scheme)) {
            String param = parse.getQueryParameter(HybridConstant.GET_PARAM);
            onAction(param);
        }
    }

    private void onAction(String params) {
        HybridParamForward hybridParam = HybridAction.mGson.fromJson(params, HybridParamForward.class);
//        Bundle bundle = new Bundle();
//        bundle.putString(HybridConstant.INTENT_EXTRA_KEY_TOPAGE, hybridParam.topage);
//        bundle.putSerializable(HybridConstant.INTENT_EXTRA_KEY_ANIMATION, hybridParam.animate);
//        bundle.putBoolean(HybridConstant.INTENT_EXTRA_KEY_HASNAVGATION, hybridParam.hasnavgation);
//        ActivityUtil.toSimpleActivity(this, HybridWebViewActivity.class, hybridParam.animate, bundle);


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
                ActivityUtil.toActivity(this, intent, hybridParam.animate);
                break;
            case H5:
                Bundle bundle = new Bundle();
                bundle.putString(HybridConstant.INTENT_EXTRA_KEY_TOPAGE, hybridParam.topage);
                bundle.putSerializable(HybridConstant.INTENT_EXTRA_KEY_ANIMATION, hybridParam.animate);
                bundle.putBoolean(HybridConstant.INTENT_EXTRA_KEY_HASNAVGATION, hybridParam.hasnavgation);
                ActivityUtil.toSimpleActivity(this, HybridWebViewActivity.class, hybridParam.animate, bundle);
                break;
        }

    }
}
