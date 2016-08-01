package com.medlinker.hybridsdk.param;

import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;

import java.lang.reflect.Type;

/**
 * Created by vane on 16/6/2.
 */

public enum HybridParamType {
    H5("h5"),
    NATIVE("native"),;

    public String mValue;

    HybridParamType(String value) {
        mValue = value;
    }

    public static HybridParamType findByAbbr(String value) {
        for (HybridParamType currEnum : HybridParamType.values()) {
            if (currEnum.mValue.equals(value)) {
                return currEnum;
            }
        }
        return null;
    }

    public static class TypeDeserializer implements JsonDeserializer<HybridParamType> {

        @Override
        public HybridParamType deserialize(JsonElement arg0, Type arg1, JsonDeserializationContext arg2) throws JsonParseException {
            String type = arg0.getAsString();
            return HybridParamType.findByAbbr(type);
        }
    }
}
