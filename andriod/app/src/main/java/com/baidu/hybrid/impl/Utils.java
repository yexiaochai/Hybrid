package com.baidu.hybrid.impl;

import android.os.StrictMode;
import android.text.TextUtils;

import com.google.gson.Gson;

import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;

public class Utils {


    public static String notNullInstance(String obj) {
        return notNullInstance(obj, String.class);
    }

    public static Integer notNullInstance(Integer obj) {
        return notNullInstance(obj, Integer.class);
    }

    public static Long notNullInstance(Long obj) {
        return notNullInstance(obj, Long.class);
    }

    public static Float notNullInstance(Float obj) {
        return notNullInstance(obj, Float.class);
    }

    public static Double notNullInstance(Double obj) {
        return notNullInstance(obj, Double.class);
    }

    public static Boolean notNullInstance(Boolean obj) {
        return notNullInstance(obj, Boolean.class);
    }

    public static Byte notNullInstance(Byte obj) {
        return notNullInstance(obj, Byte.class);
    }

    /**
     * 如果对象为空根据对象类型new一个
     *
     * @param <T> T
     * @param cls cls
     * @param obj obj
     * @return obj
     */
    public static <T> T notNullInstance(T obj, Class<T> cls) {
        if (obj != null) {
            return obj;
        }
        try {
            if (cls == Integer.class) {
                Constructor c = cls.getDeclaredConstructor(int.class);
                c.setAccessible(true);
                return (T) c.newInstance(0);
            } else if (cls == Long.class) {
                Constructor c = cls.getDeclaredConstructor(long.class);
                c.setAccessible(true);
                return (T) c.newInstance(0l);
            } else if (cls == Float.class) {
                Constructor c = cls.getDeclaredConstructor(float.class);
                c.setAccessible(true);
                return (T) c.newInstance(0f);
            } else if (cls == Double.class) {
                Constructor c = cls.getDeclaredConstructor(double.class);
                c.setAccessible(true);
                return (T) c.newInstance(0d);
            } else if (cls == Boolean.class) {
                Constructor c = cls.getDeclaredConstructor(boolean.class);
                c.setAccessible(true);
                return (T) c.newInstance(false);
            } else if (cls == Byte.class) {
                Constructor c = cls.getDeclaredConstructor(byte.class);
                c.setAccessible(true);
                return (T) c.newInstance(0);
            } else {
                return cls.newInstance();
            }
        } catch (InstantiationException e) {
            e.printStackTrace();
            throw new IllegalArgumentException("assetNull InstantiationException: Class[" + cls + "]");
        } catch (IllegalAccessException e) {
            e.printStackTrace();
            throw new IllegalArgumentException("assetNull IllegalAccessException: Class[" + cls + "]");
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
            throw new IllegalArgumentException("assetNull NoSuchMethodException: Class[" + cls + "]");
        } catch (InvocationTargetException e) {
            e.printStackTrace();
            throw new IllegalArgumentException("assetNull InvocationTargetException: Class[" + cls + "]");
        }
    }

    public static void showStrictMode() {
        StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder().detectDiskReads().detectDiskWrites()
                .detectNetwork().penaltyLog().build());
        StrictMode.setVmPolicy(new StrictMode.VmPolicy.Builder().detectLeakedSqlLiteObjects()
                .detectLeakedClosableObjects().penaltyLog().penaltyDeath().build());
    }

    public static <T> T gsonNotNullInstance(String json, Class<T> cls) {
        T result = null;
        if (!TextUtils.isEmpty(json)) {
            try {
                result = new Gson().fromJson(json, cls);
                return result;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        if (result == null) {
            try {
                result = cls.newInstance();
            } catch (InstantiationException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return null;
    }


}
