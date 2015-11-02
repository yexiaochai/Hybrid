package com.baidu.hybrid.impl;

import android.app.Activity;
import android.app.ProgressDialog;
import android.net.Uri;
import android.text.TextUtils;
import android.webkit.WebView;
import android.widget.Toast;

import com.baidu.kuai.hybrid.CommonUtils;
import com.baidu.kuai.hybrid.UrlHandler;
import com.baidu.kuai.utils.LogUtils;
import com.loopj.android.http.AsyncHttpClient;
import com.loopj.android.http.BinaryHttpResponseHandler;

import org.apache.http.Header;

import java.io.File;
import java.io.Serializable;

public class UpdateApp implements UrlHandler {
    private static final String TAG = "UpdateApp";

    public UpdateApp(Activity activity, WebView mWebView) {
        this.mActivity = activity;
        this.mWebView = mWebView;
    }

    protected WebView mWebView;
    private Activity mActivity;

    @Override
    public String getHandledUrlHost() {
        return "updateapp";
    }

    @Override
    public boolean handleUrl(Uri uri) {
        String param = uri.getQueryParameter("param");
        if (!TextUtils.isEmpty(param)) {
            final UpdateAppParam updateAppParam = CommonUtils.jsonToObject(param, UpdateAppParam.class);
            LogUtils.e(TAG, param);
            final ProgressDialog progressDialog = new ProgressDialog(mActivity);
            progressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
            progressDialog.setProgress(0);
            progressDialog.setMax(100);
            progressDialog.setMessage("正在下载...");
            progressDialog.setCancelable(false);

            AsyncHttpClient client = new AsyncHttpClient();
            String[] allowedContentTypes = new String[]{".*"};
            client.get(updateAppParam.getUrl(), new BinaryHttpResponseHandler(allowedContentTypes) {
                @Override
                public void onSuccess(int i, Header[] headers, byte[] bytes) {
                    //下载zip包，并覆盖指定栏目
                    File zip = new File(CommonUtils.getLocalRootFile(), "update.zip");
                    String zipPath = zip.getAbsolutePath();
                    CommonUtils.bytes2File(zipPath, bytes);
                    File updaeFolder = new File(CommonUtils.getLocalRootFile(), updateAppParam.getModule());
                    CommonUtils.clearFolder(updaeFolder);
                    LogUtils.e(TAG, updaeFolder.getAbsolutePath());
                    updaeFolder.mkdirs();
                    //解压文件
                    try {
                        CommonUtils.UnZipFolder(zipPath, CommonUtils.getLocalRootFile().getAbsolutePath());
                        Toast.makeText(mActivity, "更新频道" + updateAppParam.getModule() + "成功", Toast.LENGTH_SHORT).show();
                        mWebView.reload();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                @Override
                public void onFailure(int i, Header[] headers, byte[] bytes, Throwable throwable) {

                }

                @Override
                public void onProgress(long bytesWritten, long totalSize) {
                    super.onProgress(bytesWritten, totalSize);
                    long progress = bytesWritten * 100 / totalSize;
                    progressDialog.setProgress((int) progress);
                }

                @Override
                public void onStart() {
                    progressDialog.show();
                }

                @Override
                public void onFinish() {
                    try {
                        progressDialog.dismiss();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
            return true;
        }
        return false;
    }


    public static class UpdateAppParam implements Serializable {
        private String url;
        private String module;

        public String getUrl() {
            return Utils.notNullInstance(url);
        }

        public String getModule() {
            return Utils.notNullInstance(module);
        }
    }


}
