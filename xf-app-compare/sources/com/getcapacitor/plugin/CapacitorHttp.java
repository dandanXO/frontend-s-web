package com.getcapacitor.plugin;

import android.webkit.JavascriptInterface;
import androidx.browser.trusted.sharing.ShareTarget;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.plugin.util.HttpRequestHandler;

@CapacitorPlugin(permissions = {@Permission(alias = "HttpWrite", strings = {"android.permission.WRITE_EXTERNAL_STORAGE"}), @Permission(alias = "HttpRead", strings = {"android.permission.READ_EXTERNAL_STORAGE"})})
public class CapacitorHttp extends Plugin {
    public void load() {
        this.bridge.getWebView().addJavascriptInterface(this, "CapacitorHttpAndroidInterface");
        super.load();
    }

    private void http(final PluginCall pluginCall, final String str) {
        new Thread(new Runnable() {
            public void run() {
                try {
                    pluginCall.resolve(HttpRequestHandler.request(pluginCall, str, CapacitorHttp.this.getBridge()));
                } catch (Exception e) {
                    pluginCall.reject(e.getLocalizedMessage(), e.getClass().getSimpleName(), e);
                }
            }
        }).start();
    }

    @JavascriptInterface
    public boolean isEnabled() {
        return getBridge().getConfig().getPluginConfiguration("CapacitorHttp").getBoolean("enabled", false);
    }

    @PluginMethod
    public void request(PluginCall pluginCall) {
        http(pluginCall, (String) null);
    }

    @PluginMethod
    public void get(PluginCall pluginCall) {
        http(pluginCall, ShareTarget.METHOD_GET);
    }

    @PluginMethod
    public void post(PluginCall pluginCall) {
        http(pluginCall, ShareTarget.METHOD_POST);
    }

    @PluginMethod
    public void put(PluginCall pluginCall) {
        http(pluginCall, "PUT");
    }

    @PluginMethod
    public void patch(PluginCall pluginCall) {
        http(pluginCall, "PATCH");
    }

    @PluginMethod
    public void delete(PluginCall pluginCall) {
        http(pluginCall, "DELETE");
    }
}
