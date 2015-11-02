package com.baidu.kuai.utils;

import android.text.TextUtils;
import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

/***
 * 日志工具类
 */
public class LogUtils {

    /**
     * 记录verbose信息
     *
     * @param info
     */
    public static void v(String tag, String info) {
        if (isDebug()) {
            Log.v(tag, info);
        }
    }

    /**
     * 记录verbose信息
     */
    public static void v(String tag, String msg, Object... args) {
        if (args != null && args.length > 0) {
            msg = String.format(msg, args);
        }
        v(tag, msg);
    }

    /**
     * 记录一般调试信息
     *
     * @param info
     */
    public static void d(String tag, String info) {
        if (isDebug()) {
            Log.d(tag, info);
        }
    }

    /**
     * 记录一般调试信息
     *
     * @param msg
     */
    public static void d(String tag, String msg, Object... args) {
        if (args != null && args.length > 0) {
            msg = String.format(msg, args);
        }
        if (isDebug()) {
            Log.d(tag, msg);
        }
    }

    /**
     * 记录一般提示信息
     *
     * @param info
     */
    public static void i(String tag, String info) {
        if (isDebug()) {
            Log.i(tag, info);
        }
    }

    /**
     * 记录一般提示信息
     *
     * @param msg
     */
    public static void i(String tag, String msg, Object... args) {
        if (args != null && args.length > 0) {
            msg = String.format(msg, args);
        }
        if (isDebug()) {
            Log.i(tag, msg);
        }
    }

    /**
     * 记录一般警告信息
     *
     * @param info
     */
    public static void w(String tag, String info) {
        if (isDebug()) {
            Log.w(tag, info);
        }
    }

    /**
     * 记录一般警告信息
     *
     * @param msg
     */
    public static void w(String tag, String msg, Object... args) {
        if (args != null && args.length > 0) {
            msg = String.format(msg, args);
        }
        if (isDebug()) {
            Log.w(tag, msg);
        }
    }

    /**
     * 记录错误信息
     *
     * @param info
     */
    public static void e(String tag, String info) {
        if (isDebug()) {
            Log.e(tag, info);
        }
    }

    /**
     * 记录错误信息
     *
     * @param msg
     */
    public static void e(String tag, String msg, Object... args) {
        if (args != null && args.length > 0) {
            msg = String.format(msg, args);
        }
        if (isDebug()) {
            Log.e(tag, msg);
        }
    }

    public static void e(String tag, String info, Throwable throwable) {
        if (isDebug()) {
            Log.e(tag, info, throwable);
        }
    }

    public static boolean isDebug() {
        return true;
    }

    /**
     * Formats the json content
     *
     * @param json the json content
     */
    public static String formatJson(String json) {
        String message = json;
        if (!TextUtils.isEmpty(json)) {
            try {
                if (json.startsWith("{")) {
                    JSONObject jsonObject = new JSONObject(json);
                    message = jsonObject.toString(4);
                }
                if (json.startsWith("[")) {
                    JSONArray jsonArray = new JSONArray(json);
                    message = jsonArray.toString(4);
                }
            } catch (Exception e) {
                e("formatJson", e.getMessage(), e);
            }
        }
        return message;
    }

}
