package com.baidu.hybrid.impl;

import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import com.baidu.hybrid.demo.R;


public class HeaderView {
    public TextView mTvLeft;
    public TextView mTvRight;
    public TextView mTvTitle;
    public TextView mTvSubtitle;
    public ImageView mIvLeft;
    public ImageView mIvRight;

    public View mRoot;

    public void initView(View rootView) {
        mRoot = rootView;
        mTvLeft = (TextView) rootView.findViewById(R.id.tv_header_left);
        mTvRight = (TextView) rootView.findViewById(R.id.tv_header_right);
        mTvTitle = (TextView) rootView.findViewById(R.id.tv_header_title);
        mTvSubtitle = (TextView) rootView.findViewById(R.id.tv_header_subtitle);
        mIvLeft = (ImageView) rootView.findViewById(R.id.iv_header_left);
        mIvRight = (ImageView) rootView.findViewById(R.id.iv_header_right);
    }

}
