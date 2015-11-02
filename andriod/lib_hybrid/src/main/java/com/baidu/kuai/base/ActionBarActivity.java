package com.baidu.kuai.base;

import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import com.baidu.kuai.actionbar.ActionBarController;
import com.baidu.kuai.hybrid.R;

public class ActionBarActivity extends BaseActivity {

    private LinearLayout mRootView;
    private ActionBarController mActionBarController;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mRootView = (LinearLayout) View.inflate(this, R.layout.hybrid_activity_actionbar, null);
        mActionBarController = ActionBarController.fromView(mRootView.findViewById(R.id.action_bar_controller));
        mActionBarController.setTitle(getTitle());
        mActionBarController.getBackImage().setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });
        mActionBarController.getBackText().setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });
    }

    /*@Override
    public void setContentView(int layoutResID) {
        View view = getLayoutInflater().inflate(layoutResID, null);
        super.setContentView(buildContentView(view));
    }

    @Override
    public void setContentView(View view) {
        super.setContentView(buildContentView(view));
    }

    @Override
    public void setContentView(View view, ViewGroup.LayoutParams params) {
        super.setContentView(buildContentView(view), params);
    }*/

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        View contentView = findViewById(android.R.id.content);
        buildContentView(contentView);
    }

    @Override
    public void setTitle(CharSequence title) {
        super.setTitle(title);
        mActionBarController.setTitle(title);
    }

    @Override
    public void setTitle(int titleId) {
        super.setTitle(titleId);
        mActionBarController.setTitle(titleId);
    }

    protected View buildContentView(View contentView) {
        if (contentView != null) {
            ViewGroup parent = (ViewGroup) contentView.getParent();
            if (parent != null) {
                int index = parent.indexOfChild(contentView);
                parent.removeView(contentView);
                ViewGroup.LayoutParams params = contentView.getLayoutParams();
                mRootView.addView(contentView, new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
                parent.addView(mRootView, index, params);
            }
        }
        return null;
    }

    /**
     * 隐藏ActionBar
     * 在setContentView之前调用
     */
    public void hideActionBar() {
        mActionBarController.setEnable(false);
    }

    /**
     * 显示ActionBar
     */
    public void showActionBar() {
        mActionBarController.setEnable(true);
    }

    /**
     * SDK接口getActionBar()是在API 11添加的，为兼容性考虑，请使用getTopActionBar()替换getActionBar()
     *
     * @return ActionBar
     */

    public ActionBarController getActionBarController() {
        return mActionBarController;
    }

    protected final View getRootView() {
        return mRootView;
    }
}
