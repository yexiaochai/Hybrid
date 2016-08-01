package com.medlinker.hybridsdk.widget;

import android.content.Context;
import android.net.Uri;
import android.text.TextUtils;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.TextView;

import com.facebook.drawee.drawable.ScalingUtils;
import com.medlinker.hybridsdk.R;

/**
 * Created by vane on 16/6/6.
 */

public class NavgationView extends FrameLayout {

    private ViewGroup mLeftView, mRightView, mTitleGroup;
    private TextView mTitleView, mSubTitleView;
    private LayoutInflater mInflater;
    private DraweeView mLeftIcon, mRightIcon;

    public NavgationView(Context context) {
        super(context);
        init();
    }

    public NavgationView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public NavgationView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
        mInflater = LayoutInflater.from(getContext());
        mInflater.inflate(R.layout.hybrid_widget_navgation, this);
        mLeftView = (ViewGroup) findViewById(R.id.hybrid_navgation_left);
        mRightView = (ViewGroup) findViewById(R.id.hybrid_navgation_right);
        mTitleGroup = (ViewGroup) findViewById(R.id.hybrid_navgation_title_group);
        mTitleView = (TextView) findViewById(R.id.hybrid_navgation_title);
        mSubTitleView = (TextView) findViewById(R.id.hybrid_navgation_subtitle);
        mLeftIcon = (DraweeView) findViewById(R.id.hybrid_icon_left);
        mRightIcon = (DraweeView) findViewById(R.id.hybrid_icon_right);

        mLeftIcon.getHierarchy().setActualImageScaleType(ScalingUtils.ScaleType.CENTER_INSIDE);
        mRightIcon.getHierarchy().setActualImageScaleType(ScalingUtils.ScaleType.CENTER_INSIDE);
    }

    public void setTitle(String title, String subTitle, String licon, String ricon, OnClickListener clickListener) {
        mTitleView.setText(title);
        mSubTitleView.setText(subTitle);
        if (TextUtils.isEmpty(subTitle)) {
            mSubTitleView.setVisibility(GONE);
            mTitleView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        } else {
            mSubTitleView.setVisibility(VISIBLE);
            mTitleView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
            mSubTitleView.setTextSize(TypedValue.COMPLEX_UNIT_SP, 12);
        }
        if (TextUtils.isEmpty(licon)) {
            mLeftIcon.setImageResource(android.R.color.transparent);
        } else {
            mLeftIcon.setImageURI(Uri.parse(licon));
        }
        if (TextUtils.isEmpty(ricon)) {
            mRightIcon.setImageResource(android.R.color.transparent);
        } else {
            mRightIcon.setImageURI(Uri.parse(ricon));
        }
        mTitleGroup.setOnClickListener(clickListener);
    }

    public NavgationView cleanNavgation(Direct direct) {
        switch (direct) {
            case LEFT:
                mLeftView.removeAllViews();
                break;
            case RIGHT:
                mRightView.removeAllViews();
                break;
        }
        return this;
    }

    public NavgationView cleanNavgation() {
        mRightView.removeAllViews();
        mLeftView.removeAllViews();
        return this;
    }

    public NavgationView appendNavgation(Direct direct, String label, String icon, OnClickListener clickListener) {
        appendInner(direct, label, icon, clickListener);
        return this;
    }

    public NavgationView appendNavgation(Direct direct, String label, int iconSource, OnClickListener clickListener) {
        appendInner(direct, label, iconSource, clickListener);
        return this;
    }

    private void appendInner(Direct direct, String label, Object icon, OnClickListener clickListener) {
        ViewGroup viewGroup = (ViewGroup) mInflater.inflate(R.layout.hybrid_navgation_item, direct.equals(Direct.LEFT) ? mLeftView : mRightView, false);
        DraweeView iconView = (DraweeView) viewGroup.findViewById(R.id.hybrid_icon);
        TextView textView = (TextView) viewGroup.findViewById(R.id.hybrid_textview);
        if (icon instanceof String) {
            iconView.setImageURI(Uri.parse((String) icon));
        } else if (icon instanceof Integer) {
            int iconSource = (int) icon;
            if (iconSource > 0) {
                iconView.setVisibility(VISIBLE);
                iconView.setImageResource(iconSource);
            } else {
                iconView.setVisibility(GONE);
            }
        }
//        iconView.setOnClickListener(clickListener);
        viewGroup.setOnClickListener(clickListener);
        textView.setText(label);
        switch (direct) {
            case LEFT:
                mLeftView.addView(viewGroup);
                break;
            case RIGHT:
                mRightView.addView(viewGroup);
                break;
        }
    }


    public enum Direct {
        RIGHT, LEFT;
    }
}
