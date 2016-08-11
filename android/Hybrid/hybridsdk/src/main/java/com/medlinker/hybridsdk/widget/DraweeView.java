package com.medlinker.hybridsdk.widget;

import android.content.Context;
import android.util.AttributeSet;

import com.facebook.drawee.drawable.ScalingUtils;
import com.facebook.drawee.generic.GenericDraweeHierarchy;

/**
 * Created by vane on 16/6/7.
 */

public class DraweeView extends com.facebook.drawee.view.SimpleDraweeView {
    public DraweeView(Context context, GenericDraweeHierarchy hierarchy) {
        super(context, hierarchy);
        init();
    }

    public DraweeView(Context context) {
        super(context);
        init();
    }

    public DraweeView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public DraweeView(Context context, AttributeSet attrs, int defStyle) {
        super(context, attrs, defStyle);
        init();
    }

    public DraweeView(Context context, AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
        init();
    }

    public void init() {
        getHierarchy().setActualImageScaleType(ScalingUtils.ScaleType.CENTER_INSIDE);
    }
}
