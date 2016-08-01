package com.medlinker.hybrid;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.widget.TextView;

public class TestNativeActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        TextView view = new TextView(this);
        view.setText("hello hybrid");
        setContentView(view);
        getData();
    }

    private void getData() {
        Intent intent = getIntent();
        if (null == intent) return;
        //intent.getExtras();
        //根据url中的参数key进行获取
    }
}
