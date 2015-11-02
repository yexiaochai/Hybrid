package com.baidu.kuai.actionbar;

import android.graphics.drawable.Drawable;
import android.widget.ImageView;


public class ImageAction extends Action<ImageView> {

    /**
     * ImageAction
     * @param action action
     */
    public ImageAction(ImageView action) {
        super(action);
    }

    /**
     * 设置图片
     *
     * @param imageResourceId resource id
     */
    public void setImage(int imageResourceId) {
        getView().setImageResource(imageResourceId);
    }

    /**
     * 设置图片
     *
     * @param imageDrawable drawable
     */
    public void setImage(Drawable imageDrawable) {
        getView().setImageDrawable(imageDrawable);
    }
}
