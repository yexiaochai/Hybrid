package com.baidu.kuai.actionbar;

import android.content.Context;
import android.graphics.drawable.ColorDrawable;
import android.graphics.drawable.Drawable;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.ViewSwitcher;

import com.baidu.kuai.hybrid.R;

import java.util.ArrayList;
import java.util.List;

public final class ActionBarController {

    private static final int VIEW_SWITCHER_ID_TITLE = 0;
    private static final int VIEW_SWITCHER_ID_CUSTOM = 1;

    private ViewSwitcher mViewSwitcherHeader;
    private TextView mTextTitle;
    private LinearLayout mLinearActionContainer;
    private RelativeLayout mRelativeCustom;
    private List<Action> mHeaderActionVariableList = new ArrayList<Action>(0);
    private ImageView mImageBack;
    private TextView mTvBack;

    private ActionBarController(ViewSwitcher header) {
        mViewSwitcherHeader = header;
        mTextTitle = (TextView) header.findViewById(R.id.tv_action_bar_title);
        mImageBack = (ImageView) header.findViewById(R.id.iv_action_bar_back);
        mTvBack = (TextView) header.findViewById(R.id.tv_action_bar_back);
        mLinearActionContainer = (LinearLayout) header.findViewById(R.id.layout_action);
        mRelativeCustom = (RelativeLayout) header.findViewById(R.id.layout_action_bar_custom);
    }

    /**
     * getActionBarView
     * @return ViewSwitcher
     */
    public ViewSwitcher getActionBarView() {
        return mViewSwitcherHeader;
    }

    /**
     * 设置ActionBar的高度
     * @param height height
     */
    public void setActionBarHeight(int height) {
        LinearLayout.LayoutParams params = (LinearLayout.LayoutParams) mViewSwitcherHeader.getLayoutParams();
        if (params == null) {
            params = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, height);
        } else {
            params.height = height;
        }
        mViewSwitcherHeader.setLayoutParams(params);
    }

    /**
     * hide all action.
     *
     * @param enable true if yes
     */
    public void hideAllAction(boolean enable) {
        mLinearActionContainer.setVisibility(enable ? View.INVISIBLE : View.VISIBLE);
    }

    /**
     * Set the background to a given Drawable, or remove the background.
     *
     * @param drawable The Drawable to use as the background, or null to remove the
     *                 background
     */
    @SuppressWarnings("deprecation")
    public void setBackground(Drawable drawable) {
        mViewSwitcherHeader.setBackgroundDrawable(drawable);
    }

    /**
     * Set the background to a given resource. The resource should refer to
     * a Drawable object or 0 to remove the background.
     *
     * @param resourceId The identifier of the resource.
     */
    public void setBackgroundResource(int resourceId) {
        mViewSwitcherHeader.setBackgroundResource(resourceId);
    }

    /**
     * Sets the background color for this view.
     *
     * @param color the color of the background
     */
    public void setBackgroundColor(int color) {
        mViewSwitcherHeader.setBackgroundDrawable(new ColorDrawable(color));
    }

    /**
     * 设置标题文本
     *
     * @param text text
     */
    public void setTitle(CharSequence text) {
        mTextTitle.setText(text);
    }

    /**
     * 设置标题文本
     *
     * @param textResourceId text resource id
     */
    public void setTitle(int textResourceId) {
        mTextTitle.setText(textResourceId);
    }

    /**
     * 标题左侧图像view
     *
     * @return view
     */
    public ImageView getBackImage() {
        return mImageBack;
    }

    /**
     * 是否启用标题左侧图像
     *
     * @param enable enable
     */
    public void enableBackImage(boolean enable) {
        if (enable) {
            mImageBack.setVisibility(View.VISIBLE);
        } else {
            mImageBack.setVisibility(View.GONE);
        }
    }

    /**
     * 标题左侧Textview
     *
     * @return view
     */
    public TextView getBackText() {
        return mTvBack;
    }

    /**
     * 是否启用标题左侧Textview
     *
     * @param enable enable
     */
    public void enableBackText(boolean enable) {
        if (enable) {
            mTvBack.setVisibility(View.VISIBLE);
        } else {
            mTvBack.setVisibility(View.GONE);
        }
    }

    /**
     * 设置标题颜色
     *
     * @param color color
     */
    public void setTitleTextColor(int color) {
        mTextTitle.setTextColor(color);
    }

    /**
     * 设置是否允许，当不允许的时候，留出空间以给其他界面显示
     *
     * @param enable true if yes
     */
    public void setEnable(boolean enable) {
        mViewSwitcherHeader.setVisibility(enable ? View.VISIBLE : View.GONE);
        mViewSwitcherHeader.requestLayout();
    }

    /**
     * 是否需要显示动作栏
     *
     * @return true：显示
     */
    public boolean isEnable() {
        return View.VISIBLE == mViewSwitcherHeader.getVisibility();
    }

    /**
     * 设置是否允许标题栏点击（默认后退）
     *
     * @param enable true if yes
     */
    public void setEnableTitleBack(boolean enable) {
        mTextTitle.setEnabled(enable);
    }

    /**
     * 获取自定义组件容器
     *
     * @return container
     */
    public RelativeLayout getCustomContainerView() {
        return mRelativeCustom;
    }

    /**
     * 设置自定义组件
     * @param customActionBarView customActionBarView
     */
    public void setCustomActionBarView(View customActionBarView) {
        mRelativeCustom.removeAllViews();
        mRelativeCustom.addView(customActionBarView
                , new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.MATCH_PARENT, RelativeLayout.LayoutParams.MATCH_PARENT));
    }

    /**
     * 显示自定义内容
     */
    public void showCustom() {
        mViewSwitcherHeader.setDisplayedChild(VIEW_SWITCHER_ID_CUSTOM);
    }

    /**
     * 是否正在显示自定义内容
     *
     * @return true if yes
     */
    public boolean isShowCustom() {
        return mViewSwitcherHeader.getDisplayedChild() == VIEW_SWITCHER_ID_CUSTOM;
    }

    /**
     * 是否正在显示默认内容
     *
     * @return true if yes
     */
    public boolean isShowNormal() {
        return mViewSwitcherHeader.getDisplayedChild() == VIEW_SWITCHER_ID_TITLE;
    }

    /**
     * 显示默认内容
     */
    public void showNormal() {
        mViewSwitcherHeader.setDisplayedChild(VIEW_SWITCHER_ID_TITLE);
    }

    private Context getContext() {
        return mViewSwitcherHeader.getContext();
    }

    /**
     * @param view view
     * @return controller
     */
    public static ActionBarController fromView(View view) {
        ViewSwitcher viewSwitcher;
        if (view instanceof ViewSwitcher) {
            viewSwitcher = (ViewSwitcher) view;
        } else {
            viewSwitcher = (ViewSwitcher) view.findViewById(R.id.view_switcher_action_bar);
        }
        if (viewSwitcher == null) {
            throw new IllegalArgumentException("there's no header layout in this view");
        }
        return new ActionBarController(viewSwitcher);
    }

    /**
     * 增加一个图片样式的动作按钮
     *
     * @param imageResourceId resource id
     * @return action
     */
    public ImageAction addImageAction(int imageResourceId) {
        ImageAction headerActionVariable = addImageAction();
        headerActionVariable.setImage(imageResourceId);
        return headerActionVariable;
    }

    /**
     * 增加一个图片样式的动作按钮
     *
     * @param imageResourceId resource id
     * @param tag             tag
     * @return action
     */
    public ImageAction addImageAction(int imageResourceId, Object tag) {
        ImageAction headerActionVariable = addImageAction();
        headerActionVariable.setImage(imageResourceId);
        headerActionVariable.setTag(tag);
        return headerActionVariable;
    }

    /**
     * 增加一个文字样式的动作按钮
     *
     * @param textResourceId resource id
     * @return action
     */
    public TextAction addTextAction(int textResourceId) {
        TextAction headerActionVariable = addTextAction();
        headerActionVariable.setText(textResourceId);
        return headerActionVariable;
    }

    /**
     * 增加一个文字样式的动作按钮
     *
     * @param text text
     * @return action
     */
    public TextAction addTextAction(String text) {
        TextAction headerActionVariable = addTextAction();
        headerActionVariable.setText(text);
        return headerActionVariable;
    }

    public Action findActionByTag(Object tag) {
        if (tag == null) {
            return null;
        }
        for (Action action : mHeaderActionVariableList) {
            if (tag.equals(action.getTag())) {
                return action;
            }
        }
        return null;
    }

    /**
     * 移除一个Action
     *
     * @param action action
     */
    public void removeAction(Action action) {
        mHeaderActionVariableList.remove(action);
        mLinearActionContainer.removeView(action.getView());
    }

    /**
     * 清空所有Action
     */
    public void clearAction() {
        mHeaderActionVariableList.clear();
        mLinearActionContainer.removeAllViews();
    }

    private ImageAction addImageAction() {
        ImageView view = (ImageView) LayoutInflater.from(getContext()).inflate(R.layout.hybrid_action_bar_image_action,
                mLinearActionContainer, false);
        ImageAction headerActionVariable = new ImageAction(view);
        mLinearActionContainer.addView(view);
        mHeaderActionVariableList.add(headerActionVariable);
        return headerActionVariable;
    }

    private TextAction addTextAction() {
        TextView view = (TextView) LayoutInflater.from(getContext()).inflate(R.layout.hybrid_action_bar_text_action, mLinearActionContainer, false);
        TextAction headerActionVariable = new TextAction(view);
        mLinearActionContainer.addView(view);
        mHeaderActionVariableList.add(headerActionVariable);
        return headerActionVariable;
    }

    /**
     * 获取TitleView
     *
     * @return mTextTitle
     */
    public TextView getTitleView() {
        return mTextTitle;
    }
}
