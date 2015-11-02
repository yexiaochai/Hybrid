package com.baidu.hybrid.impl;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class Header implements Serializable {
    private List<Action> left;
    private Title title;

    public List<Action> getLeft() {
        if (left == null) {
            left = new ArrayList<>(0);
        }
        return left;
    }

    public Title getTitle() {
        return Utils.notNullInstance(title, Title.class);
    }

    public List<Action> getRight() {
        if (right == null) {
            right = new ArrayList<>(0);
        }
        return right;
    }

    private List<Action> right;

    public static class Action implements Serializable {
        public String getTagname() {
            return Utils.notNullInstance(tagname);
        }

        public String getCallback() {
            return Utils.notNullInstance(callback);
        }

        public String getValue() {
            return Utils.notNullInstance(value);
        }

        public String getIcon() {
            return Utils.notNullInstance(icon);
        }

        private String tagname;
        private String callback;
        private String value;
        private String icon;
    }

    public static class Title implements Serializable {
        public String getCallback() {
            return Utils.notNullInstance(callback);
        }

        public String getTitle() {
            return Utils.notNullInstance(title);
        }

        public String getSubtitle() {
            return subtitle;
        }

        public String getLefticon() {
            return Utils.notNullInstance(lefticon);
        }

        public String getRighticon() {
            return Utils.notNullInstance(righticon);
        }

        //        private String tagname;
        private String callback;
        private String title;
        private String subtitle;
        private String lefticon;
        private String righticon;
    }

//    private static Header getInstance(String json) {
//        Header header = null;
//        Gson gson = new Gson();
//        header = gson.fromJson(json, Header.class);
//        return header;
//    }
}
