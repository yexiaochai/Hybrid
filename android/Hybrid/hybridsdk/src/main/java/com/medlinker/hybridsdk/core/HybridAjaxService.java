package com.medlinker.hybridsdk.core;

import android.content.Context;
import android.net.Uri;
import android.os.AsyncTask;
import android.text.TextUtils;

import com.google.gson.Gson;
import com.medlinker.hybridsdk.action.HybridAction;
import com.medlinker.hybridsdk.param.HybridVersionEntity;
import com.medlinker.hybridsdk.utils.FileUtil;

import java.io.File;
import java.util.HashMap;
import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.converter.scalars.ScalarsConverterFactory;
import retrofit2.http.FieldMap;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.QueryMap;
import retrofit2.http.Streaming;
import retrofit2.http.Url;

/**
 * Created by vane on 16/5/10.
 */
public class HybridAjaxService {

    private static Context mContext;

    private static HashMap<String, IApiService> mMap = new HashMap<>(1);

    public static IApiService getService(Uri uri) {
        String baseUrl = uri.getScheme() + "://" + uri.getHost();
        IApiService iApiService = mMap.get(baseUrl);
        if (null == iApiService) {
            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl(baseUrl)
                    .addConverterFactory(ScalarsConverterFactory.create())
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
            iApiService = retrofit.create(IApiService.class);
            mMap.put(baseUrl, iApiService);
        }
        return iApiService;
    }

    public static interface IApiService {

        @GET("{path}")
        Call<String> get(@Path("path") String path, @QueryMap HashMap<String, String> params);

        @POST("{path}")
        Call<String> post(@Path("path") String path, @FieldMap HashMap<String, String> params);

        @Streaming
        @GET
        Call<ResponseBody> download(@Url String url);

        /**
         * 获取更新版本号
         *
         * @return
         */
        @GET("/app/version/latestList")
        Call<HybridVersionEntity> requestVersion();
    }

    private static class CompareVersion {
        HybridVersionEntity localVersion;
        HybridVersionEntity remoteVersion;

        public CompareVersion(HybridVersionEntity localVersion, HybridVersionEntity remoteVersion) {
            this.localVersion = localVersion;
            this.remoteVersion = remoteVersion;
        }
    }

    public static void checkVersion(final Context context) {
        mContext = context;
        //1.服务器下载版本信息
        Uri uri = Uri.parse(HybridConfig.VERSION_HOST);
        IApiService service = HybridAjaxService.getService(uri);
        Call<HybridVersionEntity> call = service.requestVersion();
        call.enqueue(new Callback<HybridVersionEntity>() {
            @Override
            public void onResponse(Call<HybridVersionEntity> call, final Response<HybridVersionEntity> response) {
                new AsyncTask<Void, Void, CompareVersion>() {
                    @Override
                    protected CompareVersion doInBackground(Void... params) {
                        //2.对比本地保存是版本信息和服务器的版本信息是否一致
                        HybridVersionEntity localVersion;
                        HybridVersionEntity remoteVersion;

                        File version = new File(FileUtil.getRootDir(mContext), HybridConfig.FILE_HYBRID_DATA_VERSION);
                        if (!version.exists() || version.isDirectory() || TextUtils.isEmpty(FileUtil.readFile(version))) {
                            localVersion = null;
                            //3.本地保存版本信息
                            File target = FileUtil.rebuildFile(FileUtil.getRootDir(mContext), HybridConfig.FILE_HYBRID_DATA_VERSION);
                            FileUtil.writeFile(target, HybridAction.mGson.toJson(response.body()));
                            String versionStr = FileUtil.readFile(version);
                            remoteVersion = new Gson().fromJson(versionStr, HybridVersionEntity.class);
                        } else {
                            localVersion = new Gson().fromJson(FileUtil.readFile(version), HybridVersionEntity.class);
                            File target = FileUtil.rebuildFile(FileUtil.getRootDir(context), HybridConfig.FILE_HYBRID_DATA_VERSION);
                            FileUtil.writeFile(target, HybridAction.mGson.toJson(response.body()));
                            String remoteVersionStr = FileUtil.readFile(target);
                            remoteVersion = new Gson().fromJson(remoteVersionStr, HybridVersionEntity.class);
                        }
                        return new CompareVersion(localVersion, remoteVersion);
                    }

                    @Override
                    protected void onPostExecute(CompareVersion compareVersion) {
                        compareVersion(compareVersion.localVersion, compareVersion.remoteVersion);
                    }
                }.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
            }

            @Override
            public void onFailure(Call<HybridVersionEntity> call, Throwable t) {

            }
        });
    }

    /**
     * 下载web业务包
     */
    private static void compareVersion(HybridVersionEntity localVersion, final HybridVersionEntity remoteVersion) {
        if (null == remoteVersion || remoteVersion.getErrcode() != 0) return;
        List<HybridVersionEntity.DataBean> data = remoteVersion.getData();
        if (null == data || data.isEmpty()) return;
        int size = data.size();
        if (null == localVersion || null == localVersion.getData()) {
            for (int i = 0; i < size; i++) {
                HybridVersionEntity.DataBean dataBean = data.get(i);
                zipToSdcard(dataBean.getSrc(), dataBean.getChannel() + ".zip", dataBean.getChannel());
            }
            return;
        }
        List<HybridVersionEntity.DataBean> localVersionData = localVersion.getData();
        int localSize = localVersionData.size();
        for (int i = 0; i < size; i++) {
            HybridVersionEntity.DataBean dataBean = data.get(i);
            boolean localHas = false;
            for (int j = 0; j < localSize; j++) {
                HybridVersionEntity.DataBean localDateBean = localVersionData.get(j);
                if (dataBean.getChannel().equals(localDateBean.getChannel())) {
                    if (!dataBean.getVersion().equals(localDateBean.getVersion())) {
                        zipToSdcard(dataBean.getSrc(), dataBean.getChannel() + ".zip", dataBean.getChannel());
                        break;
                    }
                    localHas = true;
                }
            }
            if (!localHas)
                zipToSdcard(dataBean.getSrc(), dataBean.getChannel() + ".zip", dataBean.getChannel());
        }
    }

    private static void zipToSdcard(String url, final String zipFileName, final String zipFolderName) {
        final Uri uri = Uri.parse(url);
        IApiService service = HybridAjaxService.getService(uri);
        Call<ResponseBody> call = service.download(url);
        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, final Response<ResponseBody> response) {

                new AsyncTask<Void, Void, Void>() {
                    @Override
                    protected Void doInBackground(Void... params) {
                        unZipFile(response, zipFileName, zipFolderName);
                        return null;
                    }
                }.executeOnExecutor(AsyncTask.THREAD_POOL_EXECUTOR);
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
            }
        });
    }

    private static void unZipFile(Response<ResponseBody> response, String zipFileName, String zipFolderName) {
        File storageDirectory = new File(FileUtil.getRootDir(mContext), HybridConfig.FILE_HYBRID_DATA_PATH);
        if (!storageDirectory.exists()) {
            storageDirectory.mkdirs();
        }
        File zip = FileUtil.rebuildFile(storageDirectory, zipFileName);
        FileUtil.writeFile(zip, response.body());

        File unZip = new File(storageDirectory, zipFolderName);
        if (unZip.exists()) {
            FileUtil.clearFolder(unZip);
        } else {
            unZip.mkdirs();
        }
        FileUtil.unZip(zip.getAbsolutePath(), unZip.getAbsolutePath());
    }
}
