package com.baidu.kuai.actionbar;

import android.widget.TextView;


public class TextAction extends Action<TextView> {

    /**
     * TextAction
     * @param action action
     */
    public TextAction(TextView action) {
        super(action);
    }

    /**
     * 设置文字
     *
     * @param textResourceId resource id
     */
    public void setText(int textResourceId) {
        getView().setText(textResourceId);
    }

    /**
     * 设置文字
     *
     * @param text text
     */
    public void setText(CharSequence text) {
        getView().setText(text);
    }
}
