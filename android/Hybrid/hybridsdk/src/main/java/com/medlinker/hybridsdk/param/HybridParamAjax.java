package com.medlinker.hybridsdk.param;

import org.json.JSONObject;

/**
 * Created by vane on 16/6/9.
 */

public class HybridParamAjax {

    public ACTION tagname = ACTION.GET;
    public String url;
    public JSONObject param;// this param is json data
    public String callback;

    public enum ACTION {
        GET("get"), POST("post");

        public String mValue;

        ACTION(String value) {
            mValue = value;
        }

        public static ACTION findByAbbr(String value) {
            for (ACTION currEnum : ACTION.values()) {
                if (currEnum.mValue.equals(value)) {
                    return currEnum;
                }
            }
            return GET;
        }
    }

}
