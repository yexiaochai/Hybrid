package com.medlinker.hybridsdk.param;

import com.google.gson.annotations.SerializedName;

/**
 * Created by vane on 16/6/14.
 */

public class HybridParamVersion {
    @SerializedName("blade")
    public String blade_version;// "1.0.0",
    @SerializedName("static")
    public String static_version;//"1.0.0",
    @SerializedName("demo")
    public String demo_version;//1.0.0"

    public static final String blade_url = "http://yexiaochai.github.io/Hybrid/webapp/blade.zip";
    public static final String static_url = "http://yexiaochai.github.io/Hybrid/webapp/static.zip";
    public static final String demo_url = "http://yexiaochai.github.io/Hybrid/webapp/demo.zip";
}
