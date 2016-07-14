package com.medlinker.hybridsdk.param;

import java.util.ArrayList;

/**
 * Created by vane on 16/6/6.
 */

public class HybridParamUpdateHeader {
    public int id;

    public ArrayList<NavgationButtonParam> left;
    public ArrayList<NavgationButtonParam> right;
    public NavgationTitleParam title;

    public static class NavgationButtonParam extends HybridParamCallback {
        public String icon;
        public String value;
    }

    public static class NavgationTitleParam extends HybridParamCallback {
        public String title;
        public String subtitle;
        public String lefticon;
        public String righticon;
    }

}
