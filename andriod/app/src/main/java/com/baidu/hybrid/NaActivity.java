package com.baidu.hybrid;

import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;

import com.baidu.hybrid.impl.Forward;
import com.baidu.kuai.base.ActionBarActivity;

public class NaActivity extends ActionBarActivity implements View.OnClickListener {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        showActionBar();
        Bundle bundle = getIntent().getExtras();
        if (bundle != null) {
            Forward.ForwardParam param = (Forward.ForwardParam) bundle.getSerializable("data");
            setTitle(param.getTopage());
            TextView tv = new TextView(this);
            tv.setText(param.getTopage());
            tv.setTextColor(Color.RED);
            setContentView(tv);
        }
    }


    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    @Override
    public void onClick(View v) {

    }


}
