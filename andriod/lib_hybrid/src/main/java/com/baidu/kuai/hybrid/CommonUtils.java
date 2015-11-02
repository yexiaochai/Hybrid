package com.baidu.kuai.hybrid;

import android.os.Build;
import android.os.Environment;
import android.text.TextUtils;
import android.webkit.ValueCallback;
import android.webkit.WebView;

import com.google.gson.Gson;
import com.google.gson.JsonSyntaxException;

import java.io.BufferedOutputStream;
import java.io.Closeable;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * Created by huming03 on 2015/11/2.
 */
public class CommonUtils {
    private CommonUtils() {
    }

    public static <T> T jsonToObject(String json, Class<T> c) {
        T t = null;
        if (!TextUtils.isEmpty(json)) {
            try {
                t = new Gson().fromJson(json, c);
            } catch (JsonSyntaxException e) {
                e.printStackTrace();
            }
        }
        return t;
    }

    public static File getLocalRootFile() {
        File tmp = Environment.getExternalStorageDirectory();
        tmp = new File(tmp, "webapp");
        if (!tmp.exists()) {
            tmp.mkdirs();
        }
        return tmp;
    }

    public static void evaluateJavascript(WebView mWebview, String script, ValueCallback<String> resultCallback) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            mWebview.evaluateJavascript(script, resultCallback);
        } else {
            mWebview.loadUrl("javascript:" + script);
        }
    }

    public static void bytes2File(String path, byte[] data) {
        if (!TextUtils.isEmpty(path) && data != null) {
            File file = new File(path);
            BufferedOutputStream bos = null;
            try {
                bos = new BufferedOutputStream(new FileOutputStream(file));
                bos.write(data);
                bos.flush();
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                safeClose(bos);
            }
        }
    }

    public static boolean safeClose(Closeable c) {
        boolean ret = false;
        if (c != null) {
            try {
                c.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return ret;
    }

    /**
     * 无条件删除指定目录中的文件
     *
     * @param path 目录路径
     * @return 删除文件个数
     */
    synchronized public static int clearFolder(File path) {
        int deletedItems = 0;
        File[] fileList = path.listFiles();
        if (fileList != null) {
            for (File file : fileList) {
                if (file.isDirectory()) {
                    deletedItems += clearFolder(file);
                }
                if (file.delete()) {
                    deletedItems++;
                }
            }
        }
        return deletedItems;
    }

    private static final int BUFFER_SIZE = 4 * 1024;
    /**
     * 解压一个压缩文档 到指定位置
     *
     * @param zipFileString 压缩包的名字
     * @param outPathString 指定的路径
     * @throws Exception
     */
    public static void UnZipFolder(String zipFileString, String outPathString) throws Exception {
        android.util.Log.v("XZip", "UnZipFolder(String, String)");
        java.util.zip.ZipInputStream inZip = new java.util.zip.ZipInputStream(new java.io.FileInputStream(zipFileString));
        java.util.zip.ZipEntry zipEntry;
        String szName = "";

        while ((zipEntry = inZip.getNextEntry()) != null) {
            szName = zipEntry.getName();

            if (zipEntry.isDirectory()) {

                // get the folder name of the widget
                szName = szName.substring(0, szName.length() - 1);
                java.io.File folder = new java.io.File(outPathString + java.io.File.separator + szName);
                folder.mkdirs();

            } else {

                java.io.File file = new java.io.File(outPathString + java.io.File.separator + szName);
                file.createNewFile();
                // get the output stream of the file
                java.io.FileOutputStream out = new java.io.FileOutputStream(file);
                int len;
                byte[] buffer = new byte[1024];
                // read (len) bytes into buffer
                while ((len = inZip.read(buffer)) != -1) {
                    // write (len) byte from buffer at the position 0
                    out.write(buffer, 0, len);
                    out.flush();
                }
                out.close();
            }
        }//end of while

        inZip.close();

    }//end of func

    /**
     * 将输入流保存到文件，并关闭流.
     *
     * @param inputStream 字符串内容
     * @param path        文件路径
     * @return boolean
     */
    synchronized public static boolean store(InputStream inputStream, String path) {
        if (path == null) {
            throw new NullPointerException("path should not be null.");
        }
        int length;

        FileOutputStream fileOutputStream = null;

        try {
            File file = createFile(path);
            if (file == null) {
                //可能无存储卡或者其他原因导致
                return false;
            }
            byte[] buffer = new byte[BUFFER_SIZE];
            fileOutputStream = new FileOutputStream(file);
            while ((length = inputStream.read(buffer)) > 0) {
                fileOutputStream.write(buffer, 0, length);
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (fileOutputStream != null) {
                try {
                    fileOutputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            try {
                inputStream.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return false;
    }

    /**
     * 创建文件， 如果不存在则创建，否则返回原文件的File对象
     *
     * @param path 文件路径
     * @return 创建好的文件对象, 返回为空表示失败
     */
    synchronized public static File createFile(String path) {
        if (TextUtils.isEmpty(path)) {
            return null;
        }

        File file = new File(path);
        if (file.isFile()) {
            return file;
        }

        File parentFile = file.getParentFile();
        if (parentFile != null && (parentFile.isDirectory() || parentFile.mkdirs())) {
            try {
                if (file.createNewFile()) {
                    return file;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return null;
    }

}
