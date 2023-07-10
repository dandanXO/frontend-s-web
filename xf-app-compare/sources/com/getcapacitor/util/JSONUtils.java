package com.getcapacitor.util;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class JSONUtils {
    public static String getString(JSONObject jSONObject, String str, String str2) {
        try {
            String string = getDeepestObject(jSONObject, str).getString(getDeepestKey(str));
            return string == null ? str2 : string;
        } catch (JSONException unused) {
            return str2;
        }
    }

    public static boolean getBoolean(JSONObject jSONObject, String str, boolean z) {
        try {
            return getDeepestObject(jSONObject, str).getBoolean(getDeepestKey(str));
        } catch (JSONException unused) {
            return z;
        }
    }

    public static int getInt(JSONObject jSONObject, String str, int i) {
        try {
            return getDeepestObject(jSONObject, str).getInt(getDeepestKey(str));
        } catch (JSONException unused) {
            return i;
        }
    }

    public static JSONObject getObject(JSONObject jSONObject, String str) {
        try {
            return getDeepestObject(jSONObject, str).getJSONObject(getDeepestKey(str));
        } catch (JSONException unused) {
            return null;
        }
    }

    public static String[] getArray(JSONObject jSONObject, String str, String[] strArr) {
        try {
            JSONArray jSONArray = getDeepestObject(jSONObject, str).getJSONArray(getDeepestKey(str));
            if (jSONArray == null) {
                return strArr;
            }
            int length = jSONArray.length();
            String[] strArr2 = new String[length];
            for (int i = 0; i < length; i++) {
                strArr2[i] = (String) jSONArray.get(i);
            }
            return strArr2;
        } catch (JSONException unused) {
            return strArr;
        }
    }

    private static String getDeepestKey(String str) {
        String[] split = str.split("\\.");
        if (split.length > 0) {
            return split[split.length - 1];
        }
        return null;
    }

    private static JSONObject getDeepestObject(JSONObject jSONObject, String str) throws JSONException {
        String[] split = str.split("\\.");
        for (int i = 0; i < split.length - 1; i++) {
            jSONObject = jSONObject.getJSONObject(split[i]);
        }
        return jSONObject;
    }
}
