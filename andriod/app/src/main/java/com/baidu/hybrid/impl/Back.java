package com.baidu.hybrid.impl;

import android.app.Activity;
import android.net.Uri;

public class Back extends Forward {
    public Back(Activity mActivity) {
        super(mActivity);
    }

    @Override
    public String getHandledUrlHost() {
        return "back";
    }

    @Override
    public boolean handleUrl(Uri uri) {
//        String param = uri.getQueryParameter("param");
//        if (!TextUtils.isEmpty(param)) {
//            ForwardParam forwardParam = CommonUtils.jsonToObject(param, ForwardParam.class);
//            if ("native".equals(forwardParam.getType())) {
//                //TODO
//                Intent intent = new Intent(mActivity, NaActivity.class);
//                Bundle bundle = new Bundle();
//                bundle.putSerializable("data", forwardParam);
//                intent.putExtras(bundle);
//                mActivity.startActivity(intent);
//            } else if ("webview".equals(forwardParam.getType())) {
//                //TODO
//                Intent intent = new Intent(mActivity, HybridActivity.class);
//                Bundle bundle = new Bundle();
//                bundle.putSerializable("data", forwardParam);
//                intent.putExtras(bundle);
//                mActivity.startActivity(intent);
//            }
//            return true;
//        }
        mActivity.finish();
        return true;
    }
}
