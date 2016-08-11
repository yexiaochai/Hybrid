package com.medlinker.hybridsdk.param;

import java.util.List;

/**
 * Created by vane on 16/7/13.
 */

public class HybridVersionEntity {

    /**
     * errcode : 0
     * data : [{"channel":"blade","version":"1.0.0","src":"http://7xpdel.com1.z0.glb.clouddn.com/FteaxjTJteAL-U3Frd6CmGiQNRhR"}]
     */

    public int errcode;
    /**
     * channel : blade
     * version : 1.0.0
     * src : http://7xpdel.com1.z0.glb.clouddn.com/FteaxjTJteAL-U3Frd6CmGiQNRhR
     */

    public List<DataBean> data;

    public int getErrcode() {
        return errcode;
    }

    public void setErrcode(int errcode) {
        this.errcode = errcode;
    }

    public List<DataBean> getData() {
        return data;
    }

    public void setData(List<DataBean> data) {
        this.data = data;
    }

    public static class DataBean {
        public String channel;
        public String version;
        public String src;

        public String getChannel() {
            return channel;
        }

        public void setChannel(String channel) {
            this.channel = channel;
        }

        public String getVersion() {
            return version;
        }

        public void setVersion(String version) {
            this.version = version;
        }

        public String getSrc() {
            return src;
        }

        public void setSrc(String src) {
            this.src = src;
        }
    }
}
