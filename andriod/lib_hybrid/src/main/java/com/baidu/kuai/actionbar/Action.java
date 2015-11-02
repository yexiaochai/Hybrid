package com.baidu.kuai.actionbar;


import android.content.Context;
import android.view.View;


public class Action<T extends View> {

    private T mActionView;
    private OnActionClickListener mOnClickListener;
    private Object mTag;
    private boolean mEnable = true;

    protected Action(T action) {
        mActionView = action;
        mActionView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (mOnClickListener != null) {
                    mOnClickListener.onClick(Action.this);
                }
            }
        });
    }

    /**
     * 获取Context
     *
     * @return context
     */
    public Context getContext() {
        return mActionView.getContext();
    }

    /**
     * 设置是否开启此动作按钮
     *
     * @param enable true if yes
     */
    public void setEnable(boolean enable) {
        mEnable = enable;
        if (isVisible()) {
            mActionView.setEnabled(enable);
        }
    }

    /**
     * 隐藏按钮
     *
     * @param withPlace 如果仍然占据空间，设置为true
     */
    public void hide(boolean withPlace) {
        mActionView.setVisibility(withPlace ? View.INVISIBLE : View.GONE);
        mActionView.setEnabled(false);
    }

    /**
     * 隐藏按钮，并让出所占用的空间
     */
    public void hide() {
        hide(false);
    }

    /**
     * 显示按钮
     */
    public void show() {
        setVisible(true);
    }

    /**
     * 设置是否显示此动作按钮
     *
     * @param visible true if yes
     */
    public void setVisible(boolean visible) {
        mActionView.setVisibility(visible ? View.VISIBLE : View.GONE);
        mActionView.setEnabled(visible & mEnable);
    }

    /**
     * 是否可见
     *
     * @return true if yes
     */
    public boolean isVisible() {
        return mActionView.getVisibility() == View.VISIBLE;
    }

    /**
     * 是否开启
     *
     * @return true if yes
     */
    public boolean isEnable() {
        return mEnable;
    }

    /**
     * 设置动作按钮回调
     *
     * @param onActionClickListener listener
     */
    public void setOnActionClickListener(OnActionClickListener onActionClickListener) {
        mOnClickListener = onActionClickListener;
    }

    /**
     * 设置附带信息
     *
     * @param tag tag
     */
    public void setTag(Object tag) {
        mTag = tag;
    }

    /**
     * 获取附带信息
     *
     * @return tag
     */
    public Object getTag() {
        return mTag;
    }

    /**
     * getView
     *
     * @return T
     */
    public T getView() {
        return mActionView;
    }
}
