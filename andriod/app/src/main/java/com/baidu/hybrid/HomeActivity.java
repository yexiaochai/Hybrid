package com.baidu.hybrid;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import com.baidu.hybrid.demo.R;
import com.baidu.hybrid.impl.Forward;
import com.baidu.kuai.base.ActionBarActivity;
import com.baidu.kuai.hybrid.CommonUtils;

import java.io.File;

public class HomeActivity extends ActionBarActivity implements View.OnClickListener {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getActionBarController().getBackImage().setVisibility(View.GONE);
        setContentView(R.layout.ac_home);
        findViewById(R.id.btn_1).setOnClickListener(this);
        findViewById(R.id.btn_2).setOnClickListener(this);

        new Thread() {
            @Override
            public void run() {
                init();
            }
        }.start();
    }


    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    @Override
    public void onClick(View v) {
        int id = v.getId();
        if (id == R.id.btn_1) {
            go2Page("hotel/index.html");
        } else if (id == R.id.btn_2) {
            go2Page("flight/index.html");
        }
    }

    private void go2Page(String page) {
        Forward.ForwardParam forwardParam = new Forward.ForwardParam();
        forwardParam.setTopage(page);
        Intent intent = new Intent(this, HybridActivity.class);
        Bundle bundle = new Bundle();
        bundle.putSerializable("data", forwardParam);
        intent.putExtras(bundle);
        startActivity(intent);
    }

    private void init() {
        try {
            File zip = new File(CommonUtils.getLocalRootFile().getParentFile(), "webapp.zip");
            CommonUtils.store(getAssets().open("webapp.zip"), zip.getAbsolutePath());
            CommonUtils.clearFolder(CommonUtils.getLocalRootFile());
            CommonUtils.UnZipFolder(zip.getAbsolutePath(), CommonUtils.getLocalRootFile().getParent());
//            Toast.makeText(this, "初始化成功", Toast.LENGTH_SHORT).show();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


}
