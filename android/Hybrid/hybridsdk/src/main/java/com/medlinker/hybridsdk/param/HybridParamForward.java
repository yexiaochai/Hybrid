package com.medlinker.hybridsdk.param;

/**
 * Created by vane on 16/6/2.
 * 跳转基本使用
 */

public class HybridParamForward {
    public String topage; // 如果type是H5,要求topage为一个完整的url;如果是native要求是native同事告诉h5的字符串,点击就能跳转到对应native页面
    public HybridParamType type;
    public HybridParamAnimation animate = HybridParamAnimation.PUSH;
    public boolean hasnavgation = true;
}
