package com.getcapacitor;

import java.util.ArrayList;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class PluginCall {
    public static final String CALLBACK_ID_DANGLING = "-1";
    private final String callbackId;
    private final JSObject data;
    @Deprecated
    private boolean isReleased = false;
    private boolean keepAlive = false;
    private final String methodName;
    private final MessageHandler msgHandler;
    private final String pluginId;

    public PluginCall(MessageHandler messageHandler, String str, String str2, String str3, JSObject jSObject) {
        this.msgHandler = messageHandler;
        this.pluginId = str;
        this.callbackId = str2;
        this.methodName = str3;
        this.data = jSObject;
    }

    public void successCallback(PluginResult pluginResult) {
        if (!CALLBACK_ID_DANGLING.equals(this.callbackId)) {
            this.msgHandler.sendResponseMessage(this, pluginResult, (PluginResult) null);
        }
    }

    @Deprecated
    public void success(JSObject jSObject) {
        this.msgHandler.sendResponseMessage(this, new PluginResult(jSObject), (PluginResult) null);
    }

    @Deprecated
    public void success() {
        resolve(new JSObject());
    }

    public void resolve(JSObject jSObject) {
        this.msgHandler.sendResponseMessage(this, new PluginResult(jSObject), (PluginResult) null);
    }

    public void resolve() {
        this.msgHandler.sendResponseMessage(this, (PluginResult) null, (PluginResult) null);
    }

    public void errorCallback(String str) {
        PluginResult pluginResult = new PluginResult();
        try {
            pluginResult.put("message", (Object) str);
        } catch (Exception e) {
            Logger.error(Logger.tags("Plugin"), e.toString(), (Throwable) null);
        }
        this.msgHandler.sendResponseMessage(this, (PluginResult) null, pluginResult);
    }

    @Deprecated
    public void error(String str, Exception exc) {
        reject(str, exc);
    }

    @Deprecated
    public void error(String str, String str2, Exception exc) {
        reject(str, str2, exc);
    }

    @Deprecated
    public void error(String str) {
        reject(str);
    }

    public void reject(String str, String str2, Exception exc, JSObject jSObject) {
        PluginResult pluginResult = new PluginResult();
        if (exc != null) {
            Logger.error(Logger.tags("Plugin"), str, exc);
        }
        try {
            pluginResult.put("message", (Object) str);
            pluginResult.put("code", (Object) str2);
            if (jSObject != null) {
                pluginResult.put("data", (Object) jSObject);
            }
        } catch (Exception e) {
            Logger.error(Logger.tags("Plugin"), e.getMessage(), e);
        }
        this.msgHandler.sendResponseMessage(this, (PluginResult) null, pluginResult);
    }

    public void reject(String str, Exception exc, JSObject jSObject) {
        reject(str, (String) null, exc, jSObject);
    }

    public void reject(String str, String str2, JSObject jSObject) {
        reject(str, str2, (Exception) null, jSObject);
    }

    public void reject(String str, String str2, Exception exc) {
        reject(str, str2, exc, (JSObject) null);
    }

    public void reject(String str, JSObject jSObject) {
        reject(str, (String) null, (Exception) null, jSObject);
    }

    public void reject(String str, Exception exc) {
        reject(str, (String) null, exc, (JSObject) null);
    }

    public void reject(String str, String str2) {
        reject(str, str2, (Exception) null, (JSObject) null);
    }

    public void reject(String str) {
        reject(str, (String) null, (Exception) null, (JSObject) null);
    }

    public void unimplemented() {
        unimplemented("not implemented");
    }

    public void unimplemented(String str) {
        reject(str, "UNIMPLEMENTED", (Exception) null, (JSObject) null);
    }

    public void unavailable() {
        unavailable("not available");
    }

    public void unavailable(String str) {
        reject(str, "UNAVAILABLE", (Exception) null, (JSObject) null);
    }

    public String getPluginId() {
        return this.pluginId;
    }

    public String getCallbackId() {
        return this.callbackId;
    }

    public String getMethodName() {
        return this.methodName;
    }

    public JSObject getData() {
        return this.data;
    }

    public String getString(String str) {
        return getString(str, (String) null);
    }

    public String getString(String str, String str2) {
        Object opt = this.data.opt(str);
        return (opt != null && (opt instanceof String)) ? (String) opt : str2;
    }

    public Integer getInt(String str) {
        return getInt(str, (Integer) null);
    }

    public Integer getInt(String str, Integer num) {
        Object opt = this.data.opt(str);
        return (opt != null && (opt instanceof Integer)) ? (Integer) opt : num;
    }

    public Long getLong(String str) {
        return getLong(str, (Long) null);
    }

    public Long getLong(String str, Long l) {
        Object opt = this.data.opt(str);
        return (opt != null && (opt instanceof Long)) ? (Long) opt : l;
    }

    public Float getFloat(String str) {
        return getFloat(str, (Float) null);
    }

    public Float getFloat(String str, Float f) {
        Object opt = this.data.opt(str);
        if (opt == null) {
            return f;
        }
        if (opt instanceof Float) {
            return (Float) opt;
        }
        if (opt instanceof Double) {
            return Float.valueOf(((Double) opt).floatValue());
        }
        return opt instanceof Integer ? Float.valueOf(((Integer) opt).floatValue()) : f;
    }

    public Double getDouble(String str) {
        return getDouble(str, (Double) null);
    }

    public Double getDouble(String str, Double d) {
        Object opt = this.data.opt(str);
        if (opt == null) {
            return d;
        }
        if (opt instanceof Double) {
            return (Double) opt;
        }
        if (opt instanceof Float) {
            return Double.valueOf(((Float) opt).doubleValue());
        }
        return opt instanceof Integer ? Double.valueOf(((Integer) opt).doubleValue()) : d;
    }

    public Boolean getBoolean(String str) {
        return getBoolean(str, (Boolean) null);
    }

    public Boolean getBoolean(String str, Boolean bool) {
        Object opt = this.data.opt(str);
        return (opt != null && (opt instanceof Boolean)) ? (Boolean) opt : bool;
    }

    public JSObject getObject(String str) {
        Logger.warn(Logger.tags("Plugin"), "getObject calls without a default value will return null in Capacitor 5 instead of an empty object to match iOS behavior");
        return getObject(str, new JSObject());
    }

    public JSObject getObject(String str, JSObject jSObject) {
        Object opt = this.data.opt(str);
        if (opt != null && (opt instanceof JSONObject)) {
            try {
                return JSObject.fromJSONObject((JSONObject) opt);
            } catch (JSONException unused) {
            }
        }
        return jSObject;
    }

    public JSArray getArray(String str) {
        Logger.warn(Logger.tags("Plugin"), "getArray calls without a default value will return null in Capacitor 5 instead of an empty array to match iOS behavior");
        return getArray(str, new JSArray());
    }

    public JSArray getArray(String str, JSArray jSArray) {
        Object opt = this.data.opt(str);
        if (opt != null && (opt instanceof JSONArray)) {
            try {
                JSONArray jSONArray = (JSONArray) opt;
                ArrayList arrayList = new ArrayList();
                for (int i = 0; i < jSONArray.length(); i++) {
                    arrayList.add(jSONArray.get(i));
                }
                return new JSArray((Object) arrayList.toArray());
            } catch (JSONException unused) {
            }
        }
        return jSArray;
    }

    public boolean hasOption(String str) {
        return this.data.has(str);
    }

    @Deprecated
    public void save() {
        setKeepAlive(true);
    }

    public void setKeepAlive(Boolean bool) {
        this.keepAlive = bool.booleanValue();
    }

    public void release(Bridge bridge) {
        this.keepAlive = false;
        bridge.releaseCall(this);
        this.isReleased = true;
    }

    @Deprecated
    public boolean isSaved() {
        return isKeptAlive();
    }

    public boolean isKeptAlive() {
        return this.keepAlive;
    }

    @Deprecated
    public boolean isReleased() {
        return this.isReleased;
    }

    class PluginCallDataTypeException extends Exception {
        PluginCallDataTypeException(String str) {
            super(str);
        }
    }
}
