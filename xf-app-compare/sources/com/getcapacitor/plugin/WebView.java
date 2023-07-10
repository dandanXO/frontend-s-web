package com.getcapacitor.plugin;

import android.content.SharedPreferences;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin
public class WebView extends Plugin {
    public static final String CAP_SERVER_PATH = "serverBasePath";
    public static final String WEBVIEW_PREFS_NAME = "CapWebViewSettings";

    @PluginMethod
    public void setServerBasePath(PluginCall pluginCall) {
        this.bridge.setServerBasePath(pluginCall.getString("path"));
        pluginCall.resolve();
    }

    @PluginMethod
    public void getServerBasePath(PluginCall pluginCall) {
        String serverBasePath = this.bridge.getServerBasePath();
        JSObject jSObject = new JSObject();
        jSObject.put("path", serverBasePath);
        pluginCall.resolve(jSObject);
    }

    @PluginMethod
    public void persistServerBasePath(PluginCall pluginCall) {
        String serverBasePath = this.bridge.getServerBasePath();
        SharedPreferences.Editor edit = getContext().getSharedPreferences(WEBVIEW_PREFS_NAME, 0).edit();
        edit.putString(CAP_SERVER_PATH, serverBasePath);
        edit.apply();
        pluginCall.resolve();
    }
}
